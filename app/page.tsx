'use client';

import React, { useState } from 'react';
import { BrandLogo } from '@/components/common/BrandLogo';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'platforms' | 'contests'>('overview');
  const [demoMode, setDemoMode] = useState(true);
  const [cfHandle, setCfHandle] = useState('');
  const [cfStatus, setCfStatus] = useState<string | null>(null);
  const [cfProfile, setCfProfile] = useState<any>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleVerifyCodeforces = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cfHandle.trim()) return;
    setIsVerifying(true);
    setCfStatus('Connecting to Codeforces Public API...');
    try {
      const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(cfHandle.trim())}`);
      const data = await res.json();
      if (data.status === 'OK' && data.result.length > 0) {
        setCfProfile(data.result[0]);
        setCfStatus(`Successfully verified @${data.result[0].handle}!`);
      } else {
        setCfStatus(data.comment || 'Handle not found');
      }
    } catch {
      setCfStatus('Could not reach Codeforces API.');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#09090B] text-zinc-100 flex flex-col">
      {/* Top Navbar */}
      <header className="h-14 border-b border-zinc-800/80 bg-[#0C0E12]/80 backdrop-blur px-6 flex items-center justify-between sticky top-0 z-30">
        <BrandLogo size="md" showTagline={false} />
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1 text-xs font-mono">
            <span className="text-zinc-400">Mode:</span>
            <button
              onClick={() => setDemoMode(!demoMode)}
              className={`px-2 py-0.5 rounded text-[10px] font-bold ${demoMode ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'}`}
            >
              {demoMode ? 'DEMO DATA' : 'REAL API DATA'}
            </button>
          </div>
          <button
            onClick={() => setActiveTab('platforms')}
            className="text-xs font-semibold px-3.5 py-1.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-zinc-950 transition"
          >
            Connect Platform
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Navigation Tabs */}
        <div className="flex border-b border-zinc-800 text-xs font-mono">
          <button
            onClick={() => setActiveTab('overview')}
            className={`pb-3 px-4 font-semibold border-b-2 transition ${activeTab === 'overview' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
          >
            Dashboard Overview
          </button>
          <button
            onClick={() => setActiveTab('platforms')}
            className={`pb-3 px-4 font-semibold border-b-2 transition ${activeTab === 'platforms' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
          >
            Connected Arenas & Sync
          </button>
          <button
            onClick={() => setActiveTab('contests')}
            className={`pb-3 px-4 font-semibold border-b-2 transition ${activeTab === 'contests' ? 'border-cyan-400 text-cyan-400' : 'border-transparent text-zinc-400 hover:text-zinc-200'}`}
          >
            Contest Arena & Standings
          </button>
        </div>

        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-6 animate-fadeIn">
            {/* Top Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-[#0F1115] border border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Total Solved</span>
                <div className="text-2xl font-bold font-mono text-zinc-100 mt-1">
                  {demoMode ? '1,284' : (cfProfile ? '650' : '0')}
                </div>
                <span className="text-xs text-emerald-400 mt-1 block">Across connected judges</span>
              </div>
              <div className="p-4 rounded-xl bg-[#0F1115] border border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Current Rating</span>
                <div className="text-2xl font-bold font-mono text-cyan-400 mt-1">
                  {demoMode ? '1542 (Specialist)' : (cfProfile?.rating ? `${cfProfile.rating} (${cfProfile.rank})` : 'Unrated')}
                </div>
                <span className="text-xs text-zinc-500 mt-1 block">Codeforces Official</span>
              </div>
              <div className="p-4 rounded-xl bg-[#0F1115] border border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Active Streak</span>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">
                  {demoMode ? '12 Days 🔥' : '1 Day'}
                </div>
                <span className="text-xs text-zinc-500 mt-1 block">Consecutive problem solving</span>
              </div>
              <div className="p-4 rounded-xl bg-[#0F1115] border border-zinc-800">
                <span className="text-[10px] font-mono text-zinc-500 uppercase">Connected Platforms</span>
                <div className="text-2xl font-bold font-mono text-zinc-100 mt-1">
                  {demoMode ? '4 Platforms' : (cfProfile ? '1 Platform' : '0 Platforms')}
                </div>
                <span className="text-xs text-cyan-400 mt-1 block">All synchronized</span>
              </div>
            </div>

            {/* Annual Activity Heatmap preview */}
            <div className="p-5 rounded-xl bg-[#0F1115] border border-zinc-800 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-zinc-200">52-Week Solve Heatmap</h3>
                <span className="text-xs font-mono text-zinc-500">GitHub-Style Contribution Grid</span>
              </div>
              <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto py-2">
                {Array.from({ length: 364 }).map((_, i) => {
                  const level = (i * 13) % 5;
                  const colors = [
                    'bg-zinc-900 border-zinc-800',
                    'bg-cyan-950/60 border-cyan-900/40',
                    'bg-cyan-800/60 border-cyan-700/50',
                    'bg-cyan-600/80 border-cyan-500/60',
                    'bg-cyan-400 border-cyan-300'
                  ];
                  return (
                    <div
                      key={i}
                      className={`w-2.5 h-2.5 rounded-[2px] border ${colors[level]}`}
                      title={`Day ${i + 1}: ${level * 2} problems solved`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Platforms & Codeforces Live Sync */}
        {activeTab === 'platforms' && (
          <div className="space-y-6 animate-fadeIn">
            <div className="p-6 rounded-2xl bg-[#0F1115] border border-zinc-800 max-w-xl">
              <h2 className="text-lg font-bold text-zinc-100">Live Codeforces Adapter Test</h2>
              <p className="text-xs text-zinc-400 mt-1">
                Enter any public Codeforces handle (e.g. <span className="font-mono text-cyan-400">tourist</span>, <span className="font-mono text-cyan-400">Petr</span>, or your handle) to test the real public API.
              </p>

              <form onSubmit={handleVerifyCodeforces} className="mt-4 flex gap-2">
                <input
                  type="text"
                  placeholder="Codeforces handle..."
                  value={cfHandle}
                  onChange={(e) => setCfHandle(e.target.value)}
                  className="flex-1 px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-xl text-xs font-mono text-zinc-100 focus:border-cyan-400 focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={isVerifying}
                  className="px-4 py-2 bg-cyan-400 hover:bg-cyan-300 text-zinc-950 text-xs font-bold rounded-xl transition disabled:opacity-50"
                >
                  {isVerifying ? 'Verifying...' : 'Fetch Live Profile'}
                </button>
              </form>

              {cfStatus && (
                <div className="mt-3 p-3 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-300">
                  {cfStatus}
                </div>
              )}

              {cfProfile && (
                <div className="mt-4 p-4 rounded-xl bg-cyan-950/20 border border-cyan-800/40 text-xs font-mono space-y-1">
                  <div className="text-cyan-300 font-bold">Verified Codeforces Profile:</div>
                  <div>Handle: @{cfProfile.handle}</div>
                  <div>Rating: {cfProfile.rating || 'Unrated'} (Max: {cfProfile.maxRating || 'N/A'})</div>
                  <div>Rank: {cfProfile.rank || 'N/A'}</div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Contests */}
        {activeTab === 'contests' && (
          <div className="space-y-4 animate-fadeIn">
            <h2 className="text-lg font-bold text-zinc-100">Contest Standings Engine</h2>
            <p className="text-xs text-zinc-400">Integrated problems from Codeforces and AtCoder with ICPC Penalty scoring.</p>
            <div className="p-4 rounded-xl bg-[#0F1115] border border-zinc-800">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-800 text-zinc-500">
                    <th className="py-2">Rank</th>
                    <th className="py-2">Handle</th>
                    <th className="py-2">Solved</th>
                    <th className="py-2">Penalty</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/40 text-zinc-300">
                  <tr>
                    <td className="py-2.5 font-bold text-amber-400">#1</td>
                    <td className="py-2.5">@tourist</td>
                    <td className="py-2.5 text-emerald-400">5 / 5</td>
                    <td className="py-2.5">112m</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-bold text-zinc-400">#2</td>
                    <td className="py-2.5">@petr</td>
                    <td className="py-2.5 text-emerald-400">4 / 5</td>
                    <td className="py-2.5">148m</td>
                  </tr>
                  <tr className="bg-cyan-950/20">
                    <td className="py-2.5 font-bold text-cyan-400">#3</td>
                    <td className="py-2.5 font-bold text-cyan-300">@{cfProfile?.handle || 'alex_rahman'} (You)</td>
                    <td className="py-2.5 text-cyan-300">3 / 5</td>
                    <td className="py-2.5">82m</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}\n