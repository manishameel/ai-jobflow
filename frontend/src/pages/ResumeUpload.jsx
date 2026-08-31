import { useEffect, useState, useRef } from 'react';
import { Upload, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function ResumeUpload() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [parsingId, setParsingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchResumes();
  }, []);

  async function fetchResumes() {
    try {
      const response = await api.get('/resume/my-resumes');
      setResumes(response.data.resumes);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setErrorMsg('Only PDF files are supported');
      setTimeout(() => setErrorMsg(''), 3000);
      return;
    }

    const formData = new FormData();
    formData.append('resume', file);

    setUploading(true);
    setErrorMsg('');
    try {
      await api.post('/resume/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      await fetchResumes();
    } catch (err) {
      setErrorMsg(err.response?.data?.message || 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  }

  async function handleParse(resumeId) {
    setParsingId(resumeId);
    try {
      await api.post('/resume/parse/' + resumeId);
      await fetchResumes();
    } catch (err) {
      console.log(err);
    } finally {
      setParsingId(null);
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-medium text-text-primary">Resume</h1>
        <p className="text-text-muted text-sm mt-1">Upload your resume and let AI extract your skills</p>
      </div>

      <div
        onClick={() => fileInputRef.current.click()}
        className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-accent/50 hover:bg-surface/50 transition-colors mb-8"
      >
        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
          <Upload className="w-5 h-5 text-accent" />
        </div>
        <div className="text-center">
          <p className="text-sm text-text-primary font-medium">
            {uploading ? 'Uploading...' : 'Click to upload a PDF resume'}
          </p>
          <p className="text-xs text-text-muted mt-1">PDF only</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {errorMsg && (
        <p className="text-status-rejected text-xs text-center -mt-4 mb-8">{errorMsg}</p>
      )}

      {loading ? (
        <div className="text-text-muted text-sm">Loading resumes...</div>
      ) : resumes.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-muted text-sm">
          No resumes uploaded yet.
        </div>
      ) : (
        <div className="space-y-3">
          {resumes.map((resume) => {
            const isParsed = resume.skills && resume.skills.length > 0;

            return (
              <div key={resume.id} className="bg-surface border border-border rounded-xl p-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-bg border border-border flex items-center justify-center">
                      <FileText className="w-4 h-4 text-text-muted" />
                    </div>
                    <div>
                      <p className="text-sm text-text-primary font-medium">Resume #{resume.id}</p>
                      <p className="text-xs text-text-muted">
                        Uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  {isParsed ? (
                    <span className="flex items-center gap-1.5 text-xs text-status-offer">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Parsed
                    </span>
                  ) : (
                    <button
                      onClick={() => handleParse(resume.id)}
                      disabled={parsingId === resume.id}
                      className="flex items-center gap-1.5 bg-accent/10 text-accent text-xs font-medium rounded-lg px-3 py-1.5 hover:bg-accent/20 transition-colors disabled:opacity-50"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      {parsingId === resume.id ? 'Analyzing...' : 'Analyze with AI'}
                    </button>
                  )}
                </div>

                {isParsed && (
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs text-text-muted uppercase tracking-wide">Extracted skills</p>
                      {resume.experienceYrs != null && (
                        <p className="text-xs text-text-muted font-mono">{resume.experienceYrs} yrs exp</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {resume.skills.map((skill) => (
                        <span key={skill} className="text-[11px] bg-accent/10 text-accent rounded-full px-2.5 py-1">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </Layout>
  );
}