import React, { useState } from 'react';
import { useProject } from '../../context/ProjectContext';
import { Settings as SettingsIcon, BrainCircuit, Database, Bell, Save, CheckCircle2, ShieldAlert, Cpu } from 'lucide-react';

const Settings: React.FC = () => {
  const { selectedProject } = useProject();
  const [activeTab, setActiveTab] = useState<'ai' | 'data' | 'notifications'>('ai');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Form State
  const [aiModel, setAiModel] = useState('proprietary-v4');
  const [confidenceThreshold, setConfidenceThreshold] = useState(85);
  const [autoRemediate, setAutoRemediate] = useState(false);

  const [retentionDays, setRetentionDays] = useState('30');
  const [aggressiveSampling, setAggressiveSampling] = useState(true);

  const [slackWebhook, setSlackWebhook] = useState('');
  const [emailRecipients, setEmailRecipients] = useState('');
  const [notifyCritical, setNotifyCritical] = useState(true);
  const [notifyWarning, setNotifyWarning] = useState(false);

  if (!selectedProject) {
    return <div className="flex h-full items-center justify-center text-text-secondary">Please select a project to view settings.</div>;
  }

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      setShowSaved(true);
      setTimeout(() => setShowSaved(false), 3000);
    }, 800);
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto w-full">
      <div className="flex items-center gap-3 mb-6">
        <SettingsIcon className="text-text-secondary" size={32} />
        <div>
          <h1 className="text-3xl font-semibold mb-0">Platform Settings</h1>
          <p className="text-text-secondary text-sm mt-1">Configure global AIOps parameters for <span className="font-semibold text-text-primary">{selectedProject.name}</span></p>
        </div>
      </div>

      <div className="flex gap-8 flex-1">
        {/* Settings Sidebar */}
        <div className="w-[240px] flex flex-col gap-2">
          <button
            onClick={() => setActiveTab('ai')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all font-medium ${activeTab === 'ai'
              ? 'bg-accent-purple/10 text-accent-purple border border-accent-purple/30'
              : 'text-text-secondary hover:bg-bg-card hover:text-text-primary border border-transparent'
              }`}
          >
            <BrainCircuit size={18} /> AI Configuration
          </button>
          <button
            onClick={() => setActiveTab('data')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all font-medium ${activeTab === 'data'
              ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/30'
              : 'text-text-secondary hover:bg-bg-card hover:text-text-primary border border-transparent'
              }`}
          >
            <Database size={18} /> Data Retention
          </button>
          <button
            onClick={() => setActiveTab('notifications')}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-all font-medium ${activeTab === 'notifications'
              ? 'bg-status-success/10 text-status-success border border-status-success/30'
              : 'text-text-secondary hover:bg-bg-card hover:text-text-primary border border-transparent'
              }`}
          >
            <Bell size={18} /> Notifications
          </button>
        </div>

        {/* Settings Content */}
        <div className="flex-1 card flex flex-col p-8">

          {activeTab === 'ai' && (
            <div className="flex flex-col gap-8 flex-1 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-text-primary border-b border-border-color pb-2 mb-6">AI Model Configuration</h2>

                <div className="flex flex-col gap-6 max-w-2xl">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-primary">Underlying AIOps Model</label>
                    <p className="text-xs text-text-secondary mb-1">Select the Machine Learning model used for anomaly detection and Root Cause Analysis (RCA).</p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <button onClick={() => setAiModel('proprietary-v4')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${aiModel === 'proprietary-v4' ? 'border-accent-purple bg-accent-purple/5' : 'border-border-color bg-bg-dark hover:border-text-secondary/50'}`}>
                        <BrainCircuit size={24} className={aiModel === 'proprietary-v4' ? 'text-accent-purple' : 'text-text-secondary'} />
                        <span className="font-semibold text-sm">AIOps Core v4</span>
                        <span className="text-[10px] text-text-secondary text-center">Fastest. Optimized for logs.</span>
                      </button>
                      <button onClick={() => setAiModel('gpt-4')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${aiModel === 'gpt-4' ? 'border-accent-purple bg-accent-purple/5' : 'border-border-color bg-bg-dark hover:border-text-secondary/50'}`}>
                        <Sparkles size={24} className={aiModel === 'gpt-4' ? 'text-accent-purple' : 'text-text-secondary'} />
                        <span className="font-semibold text-sm">GPT-4 Turbo</span>
                        <span className="text-[10px] text-text-secondary text-center">Best reasoning. Higher latency.</span>
                      </button>
                      <button onClick={() => setAiModel('custom-llama')} className={`p-4 rounded-xl border flex flex-col items-center gap-2 transition-all ${aiModel === 'custom-llama' ? 'border-accent-purple bg-accent-purple/5' : 'border-border-color bg-bg-dark hover:border-text-secondary/50'}`}>
                        <Cpu size={24} className={aiModel === 'custom-llama' ? 'text-accent-purple' : 'text-text-secondary'} />
                        <span className="font-semibold text-sm">Local Llama 3</span>
                        <span className="text-[10px] text-text-secondary text-center">Fully private. Self-hosted.</span>
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-4">
                    <label className="text-sm font-semibold text-text-primary">Anomaly Confidence Threshold</label>
                    <p className="text-xs text-text-secondary mb-2">Only trigger an alert if the AI model's confidence exceeds this percentage.</p>
                    <div className="flex items-center gap-4">
                      <input
                        type="range"
                        min="50" max="99"
                        value={confidenceThreshold}
                        onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                        className="flex-1 accent-accent-purple"
                      />
                      <span className="font-mono bg-bg-dark border border-border-color px-3 py-1 rounded-lg text-accent-purple font-bold w-16 text-center">
                        {confidenceThreshold}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border-color bg-bg-dark mt-2">
                    <input
                      type="checkbox"
                      id="auto-remediate"
                      checked={autoRemediate}
                      onChange={(e) => setAutoRemediate(e.target.checked)}
                      className="mt-1 accent-accent-purple cursor-pointer"
                    />
                    <div>
                      <label htmlFor="auto-remediate" className="text-sm font-semibold text-text-primary cursor-pointer block mb-1">Enable Auto-Remediation</label>
                      <p className="text-xs text-text-secondary">If the AI identifies a critical failure with <code>{'>95%'}</code> confidence, it will automatically execute suggested rollback or restart scripts without human intervention.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'data' && (
            <div className="flex flex-col gap-8 flex-1 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-text-primary border-b border-border-color pb-2 mb-6">Data Retention & Telemetry</h2>

                <div className="flex flex-col gap-6 max-w-2xl">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-primary">Log & Metrics Retention Period</label>
                    <p className="text-xs text-text-secondary mb-2">Configure how long high-resolution telemetry data is stored before being archived to cold storage.</p>
                    <select
                      value={retentionDays}
                      onChange={(e) => setRetentionDays(e.target.value)}
                      className="bg-bg-dark border border-border-color text-text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-accent-cyan"
                    >
                      <option value="7">7 Days (Cost Optimized)</option>
                      <option value="14">14 Days</option>
                      <option value="30">30 Days (Recommended)</option>
                      <option value="90">90 Days (Compliance)</option>
                      <option value="365">1 Year</option>
                    </select>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg border border-border-color bg-bg-dark mt-4">
                    <input
                      type="checkbox"
                      id="aggressive-sampling"
                      checked={aggressiveSampling}
                      onChange={(e) => setAggressiveSampling(e.target.checked)}
                      className="mt-1 accent-accent-cyan cursor-pointer"
                    />
                    <div>
                      <label htmlFor="aggressive-sampling" className="text-sm font-semibold text-text-primary cursor-pointer block mb-1">Enable Aggressive Sampling</label>
                      <p className="text-xs text-text-secondary">For non-production environments, drops 90% of INFO and DEBUG logs to drastically reduce storage costs while maintaining ERROR logs.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="flex flex-col gap-8 flex-1 animate-in fade-in duration-300">
              <div>
                <h2 className="text-xl font-bold text-text-primary border-b border-border-color pb-2 mb-6">Notifications & Webhooks</h2>

                <div className="flex flex-col gap-6 max-w-2xl">
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
                      Slack Webhook URL
                    </label>
                    <p className="text-xs text-text-secondary mb-1">Automated RCA reports and alerts will be pushed to this channel.</p>
                    <input 
                      type="url" 
                      placeholder="https://hooks.slack.com/services/..." 
                      value={slackWebhook}
                      onChange={(e) => setSlackWebhook(e.target.value)}
                      className="bg-bg-dark border border-border-color text-text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-status-success font-mono text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-text-primary flex items-center gap-2">
                      Email Notification Recipients
                    </label>
                    <p className="text-xs text-text-secondary mb-1">Comma-separated list of email addresses to receive critical incident reports.</p>
                    <input 
                      type="text" 
                      placeholder="oncall@company.com, devops-team@company.com" 
                      value={emailRecipients}
                      onChange={(e) => setEmailRecipients(e.target.value)}
                      className="bg-bg-dark border border-border-color text-text-primary rounded-lg px-4 py-2.5 focus:outline-none focus:border-status-success font-mono text-sm"
                    />
                  </div>

                  <div className="flex flex-col gap-3 mt-2 border-t border-border-color pt-6">
                    <h3 className="text-sm font-bold uppercase text-text-secondary mb-1">Trigger Conditions</h3>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${notifyCritical ? 'bg-status-error border-status-error' : 'bg-bg-dark border-border-color group-hover:border-text-secondary'}`}>
                        {notifyCritical && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={notifyCritical} onChange={(e) => setNotifyCritical(e.target.checked)} />
                      <span className="text-sm text-text-primary group-hover:text-white transition-colors">Notify on CRITICAL incidents</span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${notifyWarning ? 'bg-status-warning border-status-warning' : 'bg-bg-dark border-border-color group-hover:border-text-secondary'}`}>
                        {notifyWarning && <CheckCircle2 size={14} className="text-white" />}
                      </div>
                      <input type="checkbox" className="hidden" checked={notifyWarning} onChange={(e) => setNotifyWarning(e.target.checked)} />
                      <span className="text-sm text-text-primary group-hover:text-white transition-colors">Notify on WARNING anomalies</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="mt-auto pt-6 border-t border-border-color flex items-center justify-between">
            {showSaved ? (
              <div className="flex items-center gap-2 text-status-success font-medium text-sm animate-in fade-in">
                <CheckCircle2 size={18} /> Settings saved successfully
              </div>
            ) : (
              <div></div>
            )}

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 bg-text-primary text-bg-dark hover:opacity-90 px-6 py-2.5 rounded-lg font-bold transition-all"
            >
              {isSaving ? (
                <div className="w-5 h-5 border-2 border-bg-dark border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Save size={18} />
              )}
              {isSaving ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Quick helper icon import
const Sparkles: React.FC<{ size?: number, className?: string }> = ({ size = 24, className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
);

export default Settings;
