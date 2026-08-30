import { useEffect, useState } from 'react';
import { Briefcase, TrendingUp, Mail, RefreshCw } from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/Layout';
import MatchScoreRing from '../components/MatchScoreRing';
import StatusPipeline from '../components/StatusPipeline';

export default function Dashboard() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const response = await api.get('/applications/my-applications');
      setApplications(response.data.applications);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleSyncEmails() {
    setSyncing(true);
    try {
      await api.post('/emails/sync');
      await fetchApplications();
    } catch (err) {
      console.log(err);
    } finally {
      setSyncing(false);
    }
  }

  const avgMatchScore = applications.length > 0
    ? Math.round(applications.reduce((sum, app) => sum + (app.matchScore || 0), 0) / applications.length)
    : 0;

  const interviewCount = applications.filter((app) => app.status === 'interview').length;

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="font-display text-2xl font-medium text-text-primary">Dashboard</h1>
          <p className="text-text-muted text-sm mt-1">Track your job applications in one place</p>
        </div>
        <button
          onClick={handleSyncEmails}
          disabled={syncing}
          className="flex items-center gap-2 bg-surface border border-border rounded-lg px-4 py-2 text-sm text-text-primary hover:bg-surface-hover transition-colors disabled:opacity-50"
        >
          <RefreshCw className={'w-4 h-4 ' + (syncing ? 'animate-spin' : '')} />
          {syncing ? 'Syncing...' : 'Sync emails'}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-text-muted text-xs mb-3">
            <Briefcase className="w-3.5 h-3.5" />
            TOTAL APPLICATIONS
          </div>
          <p className="font-mono text-2xl text-text-primary">{applications.length}</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-text-muted text-xs mb-3">
            <TrendingUp className="w-3.5 h-3.5" />
            AVG MATCH SCORE
          </div>
          <p className="font-mono text-2xl text-text-primary">{avgMatchScore}%</p>
        </div>

        <div className="bg-surface border border-border rounded-xl p-5">
          <div className="flex items-center gap-2 text-text-muted text-xs mb-3">
            <Mail className="w-3.5 h-3.5" />
            INTERVIEWS
          </div>
          <p className="font-mono text-2xl text-text-primary">{interviewCount}</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-display text-sm font-medium text-text-primary">Applications</h2>
        </div>

        {loading ? (
          <div className="p-8 text-center text-text-muted text-sm">Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="p-8 text-center text-text-muted text-sm">
            No applications yet. Apply to a job to see it here.
          </div>
        ) : (
          <div className="divide-y divide-border">
            {applications.map((app) => (
              <div key={app.id} className="flex items-center justify-between px-5 py-4 hover:bg-surface-hover transition-colors">
                <div className="flex items-center gap-4">
                  <MatchScoreRing score={app.matchScore || 0} />
                  <div>
                    <p className="text-sm text-text-primary font-medium">{app.job.title}</p>
                    <p className="text-xs text-text-muted">{app.job.company}</p>
                  </div>
                </div>
                <StatusPipeline status={app.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}