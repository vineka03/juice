import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  Droplets, 
  Recycle, 
  Flame, 
  Layers
} from 'lucide-react';
import { Task, Project, JuiceProduct } from '../types';

interface AnalyticsViewProps {
  tasks: Task[];
  projects: Project[];
  juices: JuiceProduct[];
  onOpenAiDrawer: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks,
  projects,
  juices,
  onOpenAiDrawer,
}) => {
  // Compute analytics
  const totalTasks = tasks.length;
  const doneTasks = tasks.filter(t => t.status === 'done').length;
  const reviewTasks = tasks.filter(t => t.status === 'review').length;
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress').length;
  const todoTasks = tasks.filter(t => t.status === 'todo').length;
  const backlogTasks = tasks.filter(t => t.status === 'backlog').length;

  const criticalTasks = tasks.filter(t => t.priority === 'critical').length;
  const highTasks = tasks.filter(t => t.priority === 'high').length;
  const mediumTasks = tasks.filter(t => t.priority === 'medium').length;
  const lowTasks = tasks.filter(t => t.priority === 'low').length;

  const totalBottled = juices.reduce((acc, j) => acc + j.bottlesToday, 0);
  const targetBottles = juices.reduce((acc, j) => acc + j.targetBottles, 0);
  const bottleRate = targetBottles > 0 ? Math.round((totalBottled / targetBottles) * 100) : 0;

  const resolutionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-stone-900">
              Operations & Production Progress Analytics
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              Live Metrics
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Throughput analysis across kitchen tasks, active strategic projects, and daily bottling quota.
          </p>
        </div>

        <button
          id="analytics-ai-summary-btn"
          onClick={onOpenAiDrawer}
          className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Ask AI to Summarize Analytics</span>
        </button>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Task Resolution Rate</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-heading text-stone-900">{resolutionRate}%</span>
            <span className="text-xs text-stone-500">({doneTasks}/{totalTasks} logged)</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${resolutionRate}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Daily Bottling Target</span>
            <Droplets className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-heading text-stone-900">{bottleRate}%</span>
            <span className="text-xs text-stone-500">({totalBottled}/{targetBottles} btls)</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(bottleRate, 100)}%` }} />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Critical Priority Load</span>
            <Flame className="w-4 h-4 text-rose-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-heading text-stone-900">{criticalTasks}</span>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full">
              {tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length} open
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-2">HACCP & Press maintenance</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs font-semibold uppercase tracking-wider mb-2">
            <span>Compost Diversion</span>
            <Recycle className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold font-heading text-stone-900">280 kg</span>
            <span className="text-xs text-emerald-600 font-semibold">+18% vs last wk</span>
          </div>
          <p className="text-xs text-stone-400 mt-2">Zero-waste citrus pulp upcycling</p>
        </div>
      </div>

      {/* Task Distribution & Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Status Distribution */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-stone-900">
              Task Status Pipeline
            </h2>
            <span className="text-xs text-stone-500">{totalTasks} Total Operations</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Done & Logged', count: doneTasks, color: 'bg-emerald-500', text: 'text-emerald-700' },
              { label: 'Quality / Review', count: reviewTasks, color: 'bg-purple-500', text: 'text-purple-700' },
              { label: 'In Press / Progress', count: inProgressTasks, color: 'bg-blue-500', text: 'text-blue-700' },
              { label: 'To Do', count: todoTasks, color: 'bg-amber-500', text: 'text-amber-700' },
              { label: 'Backlog', count: backlogTasks, color: 'bg-stone-400', text: 'text-stone-600' },
            ].map((item) => {
              const p = totalTasks > 0 ? Math.round((item.count / totalTasks) * 100) : 0;
              return (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-700">{item.label}</span>
                    <span className="font-bold text-stone-900">{item.count} ({p}%)</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${item.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${p}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Priority Breakdown */}
        <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-heading font-bold text-base text-stone-900">
              Workload by Priority Tier
            </h2>
            <span className="text-xs text-stone-500">Urgency allocation</span>
          </div>

          <div className="space-y-3">
            {[
              { label: 'Critical (Immediate Action Required)', count: criticalTasks, color: 'bg-rose-500', badge: 'bg-rose-100 text-rose-800' },
              { label: 'High Priority (Same Day Delivery)', count: highTasks, color: 'bg-amber-500', badge: 'bg-amber-100 text-amber-800' },
              { label: 'Medium Priority (Operational Queue)', count: mediumTasks, color: 'bg-blue-500', badge: 'bg-blue-100 text-blue-800' },
              { label: 'Low Priority (Backlog & Future R&D)', count: lowTasks, color: 'bg-stone-400', badge: 'bg-stone-100 text-stone-700' },
            ].map((tier) => {
              const pct = totalTasks > 0 ? Math.round((tier.count / totalTasks) * 100) : 0;
              return (
                <div key={tier.label} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-stone-700">{tier.label}</span>
                    <span className="font-bold text-stone-900">{tier.count} tasks</span>
                  </div>
                  <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`${tier.color} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

      {/* Projects Completion Matrix */}
      <div className="bg-white p-5 rounded-xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-emerald-600" />
            <h2 className="font-heading font-bold text-base text-stone-900">
              Strategic Initiative Progress Matrix
            </h2>
          </div>
          <span className="text-xs text-stone-500">Goal milestones</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {projects.map((proj) => (
            <div key={proj.id} className="p-3.5 rounded-lg border border-stone-100 bg-stone-50/60 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-stone-900 truncate max-w-[70%]">{proj.name}</span>
                <span className="font-bold text-emerald-700">{proj.progress}%</span>
              </div>
              <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-emerald-600 h-full rounded-full transition-all"
                  style={{ width: `${proj.progress}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[11px] text-stone-500">
                <span>Lead: {proj.lead.name}</span>
                <span>Target: {proj.targetDate}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
