const {GoogleGenerativeAI} = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function extractSkillsFromResume(resumeText){
    const model = genAI.getGenerativeModel({model: 'gemini-flash-lite-latest'});

    const prompt = 'Read the following resume text and extract information. ' +
        'Return ONLY a valid JSON object with this exac structure, nothing else, no markdowm formatting: ' +
        '{ "skills": ["skill1", "skill2"], "experienceYrs": number }. ' +
        'If experience is not mentioned clearly, estimate based on work history or put 0. ' +
        'Resume text: ' + resumeText;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedData = JSON.parse(cleanedText);

    return parsedData;
}


async function matchResumeToJob(resumeSkills, jobDescription, requiredSkills){
    const model = genAI.getGenerativeModel({model: 'gemini-flash-lite-latest' });

    const prompt = 'You are an ATS (Applicant Tracking System) matching engine. ' +
    'Compare the candidate skills with the required job skills. ' +
    'Candidate skills: ' + JSON.stringify(resumeSkills) + '. ' +
    'Required job skills: ' + JSON.stringify(requiredSkills) + '. ' +
    'Job description: ' + jobDescription + '. ' +
    'Return ONLY a valid JSON object with this exact structure, nothing else, no markdown: ' +
    '{ "matchScore": number (0 to 100), "matchedSkills": ["skill1"], "missingSkills": ["skill2"], "suggestion": "one line advice" }';

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsedData = JSON.parse(cleanedText);

    return parsedData;
}


async function classifyEmail(subject, sender, snippet) {
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-lite-latest' });

  const prompt = 'You are analyzing an email to determine if it is a DIRECT, PERSONAL communication ' +
    'from a company about a SPECIFIC job application the recipient has submitted. ' +
    'Subject: ' + subject + '. ' +
    'From: ' + sender + '. ' +
    'Snippet: ' + snippet + '. ' +
    '' +
    'IMPORTANT RULES: ' +
    '1. Only mark isJobRelated as true if this looks like a direct reply about an actual application the person submitted (interview invite, rejection, offer letter, assessment link sent specifically to them). ' +
    '2. Mark isJobRelated as false for: newsletters, career advice articles, "how to get hired" tips, job board digests, marketing emails, LinkedIn/Naukri notification digests, generic promotional content. ' +
    '3. A real application-related email usually mentions the specific role, comes from an HR/recruiter address or company domain, and refers to "your application" or "your interview" directly. ' +
    '4. If in doubt, mark isJobRelated as false. Be strict. ' +
    '' +
    'Return ONLY a valid JSON object with this exact structure, nothing else, no markdown: ' +
    '{ "isJobRelated": boolean, "type": "interview" or "rejected" or "assessment" or "offer" or "unknown", "companyName": "extracted company name or empty string" }';

  let attempts = 0;
  const maxAttempts = 3;

  while (attempts < maxAttempts) {
    try {
      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      const cleanedText = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanedText);
      return parsedData;
    } catch (error) {
      attempts = attempts + 1;
      if (attempts >= maxAttempts) {
        throw error;
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }
  }
}

module.exports = {extractSkillsFromResume, matchResumeToJob, classifyEmail};