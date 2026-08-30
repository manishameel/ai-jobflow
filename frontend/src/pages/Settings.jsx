import { useState } from 'react';
import { Mail, CheckCircle2 } from 'lucide-react';
import api from '../api/axios';
import Layout from '../components/Layout';
import useAuthStore from '../store/authStore';

export default function Settings() {
  const [connecting, setConnecting] = useState(false);
  const user = useAuthStore((state) => state.user);

  async function handleConnectGmail() {
    setConnecting(true);
    try {
      const response = await api.get('/gmail/connect');
      window.open(response.data.authUrl + '&state=' + user.id, '_blank');
    } catch (err) {
      console.log(err);
    } finally {
      setConnecting(false);
    }
  }

  return (
    <Layout>
      <div className="mb-8">
        <h1 className="font-display text-2xl font-medium text-text-primary">Settings</h1>
        <p className="text-text-muted text-sm mt-1">Manage your account and integrations</p>
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 max-w-lg">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-bg border border-border flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-text-muted" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-text-primary">Gmail</h3>
            <p className="text-xs text-text-muted mt-1">
              Connect your inbox so AI JobFlow can automatically detect interview invites,
              rejections, and offers, and update your applications.
            </p>

            <button
              onClick={handleConnectGmail}
              disabled={connecting}
              className="mt-4 flex items-center gap-2 bg-accent text-bg text-sm font-medium rounded-lg px-4 py-2 hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {connecting ? 'Opening...' : 'Connect Gmail'}
            </button>

            <p className="text-[11px] text-text-muted mt-3">
              A new tab will open for Google sign-in. Return here once you see the success message.
            </p>
          </div>
        </div>
      </div>
    </Layout>
  );
}