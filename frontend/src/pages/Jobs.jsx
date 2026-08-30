import { useEffect, useState } from 'react';
import { MapPin, Building2, X, Check, Plus } from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/Layout';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [applying, setApplying] = useState(false);
  const [appliedJobIds, setAppliedJobIds] = useState([]);
  const [toast, setToast] = useState(null);

  const [showPostModal, setShowPostModal] = useState(false);
  const [posting, setPosting] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: '',
    company: '',
    description: '',
    requiredSkills: '',
    location: ''
  });

  useEffect(() => {
    fetchJobs();
    fetchResumes();
    fetchMyApplications();
  }, []);

  async function fetchJobs() {
    try {
      const response = await api.get('/jobs');
      setJobs(response.data.jobs);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchResumes() {
    try {
      const response = await api.get('/resume/my-resumes');
      setResumes(response.data.resumes);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchMyApplications() {
    try {
      const response = await api.get('/applications/my-applications');
      const ids = response.data.applications.map((app) => app.jobId);
      setAppliedJobIds(ids);
    } catch (err) {
      console.log(err);
    }
  }

  function openApplyModal(job) {
    setSelectedJob(job);
    setSelectedResumeId(resumes[0]?.id || '');
  }

  function closeModal() {
    setSelectedJob(null);
    setSelectedResumeId('');
  }

  async function handleApply() {
    if (!selectedResumeId) return;

    setApplying(true);
    try {
      const response = await api.post('/applications', {
        jobId: selectedJob.id,
        resumeId: parseInt(selectedResumeId)
      });

      setAppliedJobIds([...appliedJobIds, selectedJob.id]);
      setToast({
        type: 'success',
        matchScore: response.data.application.matchScore,
        message: response.data.aiInsights.suggestion
      });
      closeModal();

      setTimeout(() => setToast(null), 6000);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to apply' });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setApplying(false);
    }
  }

  async function handlePostJob(e) {
    e.preventDefault();
    setPosting(true);

    try {
      const skillsArray = jobForm.requiredSkills
        .split(',')
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      await api.post('/jobs', {
        title: jobForm.title,
        company: jobForm.company,
        description: jobForm.description,
        requiredSkills: skillsArray,
        location: jobForm.location
      });

      setJobForm({ title: '', company: '', description: '', requiredSkills: '', location: '' });
      setShowPostModal(false);
      await fetchJobs();

      setToast({ type: 'success', matchScore: null, message: 'Job posted successfully' });
      setTimeout(() => setToast(null), 3000);
    } catch (err) {
      setToast({ type: 'error', message: err.response?.data?.message || 'Failed to post job' });
      setTimeout(() => setToast(null), 4000);
    } finally {
      setPosting(false);
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-medium text-text-primary">Jobs</h1>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-2xl font-medium text-text-primary">Jobs</h1>
            <p className="text-text-muted text-sm mt-1">Browse open roles and let AI check your fit</p>
          </div>
          <button
            onClick={() => setShowPostModal(true)}
            className="flex items-center gap-2 bg-accent text-bg text-sm font-medium rounded-lg px-4 py-2 hover:opacity-90 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Post a job
          </button>
        </div>
        <p className="text-text-muted text-sm mt-1">Browse open roles and let AI check your fit</p>
      </div>

      {loading ? (
        <div className="text-text-muted text-sm">Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div className="bg-surface border border-border rounded-xl p-8 text-center text-text-muted text-sm">
          No jobs posted yet.
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {jobs.map((job) => {
            const hasApplied = appliedJobIds.includes(job.id);

            return (
              <div key={job.id} className="bg-surface border border-border rounded-xl p-5 flex flex-col">
                <div className="flex-1">
                  <h3 className="font-medium text-text-primary text-sm">{job.title}</h3>
                  <div className="flex items-center gap-1.5 text-text-muted text-xs mt-1.5">
                    <Building2 className="w-3.5 h-3.5" />
                    {job.company}
                  </div>
                  {job.location && (
                    <div className="flex items-center gap-1.5 text-text-muted text-xs mt-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {job.location}
                    </div>
                  )}
                  <p className="text-text-muted text-xs mt-3 line-clamp-2">{job.description}</p>

                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {job.requiredSkills.slice(0, 4).map((skill) => (
                      <span key={skill} className="text-[10px] bg-bg border border-border rounded-full px-2 py-1 text-text-muted">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => openApplyModal(job)}
                  disabled={hasApplied}
                  className={
                    'mt-4 w-full rounded-lg py-2 text-sm font-medium transition-colors ' +
                    (hasApplied
                      ? 'bg-status-offer/10 text-status-offer cursor-default flex items-center justify-center gap-1.5'
                      : 'bg-accent text-bg hover:opacity-90')
                  }
                >
                  {hasApplied ? (
                    <>
                      <Check className="w-3.5 h-3.5" /> Applied
                    </>
                  ) : (
                    'Apply with AI match'
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg text-text-primary">Apply to {selectedJob.title}</h3>
              <button onClick={closeModal} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            {resumes.length === 0 ? (
              <p className="text-text-muted text-sm">
                You need to upload a resume first before applying.
              </p>
            ) : (
              <>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Choose resume</label>
                <select
                  value={selectedResumeId}
                  onChange={(e) => setSelectedResumeId(e.target.value)}
                  className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary mt-2 outline-none focus:border-accent"
                >
                  {resumes.map((resume) => (
                    <option key={resume.id} value={resume.id}>
                      Resume #{resume.id} — uploaded {new Date(resume.uploadedAt).toLocaleDateString()}
                    </option>
                  ))}
                </select>

                <button
                  onClick={handleApply}
                  disabled={applying}
                  className="w-full bg-accent text-bg font-medium text-sm rounded-lg py-2.5 mt-5 hover:opacity-90 transition-opacity disabled:opacity-50"
                >
                  {applying ? 'Analyzing with AI...' : 'Submit application'}
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-surface border border-border rounded-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg text-text-primary">Post a job</h3>
              <button onClick={() => setShowPostModal(false)} className="text-text-muted hover:text-text-primary">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="space-y-4">
              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Job title</label>
                <input
                  type="text"
                  value={jobForm.title}
                  onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                  required
                  placeholder="Full Stack Developer"
                  className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary mt-2 outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Company</label>
                <input
                  type="text"
                  value={jobForm.company}
                  onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                  required
                  placeholder="TechCorp"
                  className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary mt-2 outline-none focus:border-accent"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Description</label>
                <textarea
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  required
                  rows={3}
                  placeholder="Describe the role and responsibilities"
                  className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary mt-2 outline-none focus:border-accent resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Required skills</label>
                <input
                  type="text"
                  value={jobForm.requiredSkills}
                  onChange={(e) => setJobForm({ ...jobForm, requiredSkills: e.target.value })}
                  required
                  placeholder="React, Node.js, PostgreSQL"
                  className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary mt-2 outline-none focus:border-accent"
                />
                <p className="text-[11px] text-text-muted mt-1.5">Separate skills with commas</p>
              </div>

              <div>
                <label className="text-xs font-medium text-text-muted uppercase tracking-wide">Location</label>
                <input
                  type="text"
                  value={jobForm.location}
                  onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                  placeholder="Remote"
                  className="w-full bg-bg border border-border rounded-lg px-4 py-2.5 text-sm text-text-primary mt-2 outline-none focus:border-accent"
                />
              </div>

              <button
                type="submit"
                disabled={posting}
                className="w-full bg-accent text-bg font-medium text-sm rounded-lg py-2.5 mt-2 hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {posting ? 'Posting...' : 'Post job'}
              </button>
            </form>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-surface border border-border rounded-xl p-4 max-w-sm shadow-2xl">
          {toast.type === 'success' ? (
            <>
              <p className="text-sm font-medium text-status-offer">
                {toast.matchScore != null ? 'Applied — ' + toast.matchScore + '% match' : toast.message}
              </p>
              {toast.matchScore != null && <p className="text-xs text-text-muted mt-1">{toast.message}</p>}
            </>
          ) : (
            <p className="text-sm text-status-rejected">{toast.message}</p>
          )}
        </div>
      )}
    </Layout>
  );
}