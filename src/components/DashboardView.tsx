import React from 'react';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Sparkles, 
  ArrowRight, 
  Plus, 
  Droplets, 
  TrendingUp, 
  ShieldCheck, 
  Flame, 
  Calendar,
  Layers,
  ChevronRight
} from 'lucide-react';
import { Task, Project, JuiceProduct } from '../types';

interface DashboardViewProps {
  tasks: Task[];
  projects: Project[];
  juices: JuiceProduct[];
  onSelectView: (view: 'dashboard' | 'tasks' | 'projects' | 'juices' | 'analytics') => void;
  onOpenAiDrawer: () => void;
  onOpenNewTaskModal: () => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: Task['status']) => void;
  onOpenTaskDetails: (task: Task) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  projects,
  juices,
  onSelectView,
  onOpenAiDrawer,
  onOpenNewTaskModal,
  onToggleSubtask,
  onUpdateTaskStatus,
  onOpenTaskDetails,
}) => {
  // Calculations
  const completedTasks = tasks.filter(t => t.status === 'done');
  const inProgressTasks = tasks.filter(t => t.status === 'in-progress');
  const criticalTasks = tasks.filter(t => t.priority === 'critical' && t.status !== 'done');
  const highTasks = tasks.filter(t => t.priority === 'high' && t.status !== 'done');
  
  const totalBottlesToday = juices.reduce((acc, j) => acc + j.bottlesToday, 0);
  const targetBottlesToday = juices.reduce((acc, j) => acc + j.targetBottles, 0);
  const bottlingProgress = targetBottlesToday > 0 ? Math.round((totalBottlesToday / targetBottlesToday) * 100) : 0;

  return (
    <div className="space-y-6 pb-12">
      
      {/* Top Banner / Welcome with Quick AI Action */}
      <div className="bg-gradient-to-r from-emerald-800 via-teal-800 to-stone-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-amber-400/20 via-emerald-400/10 to-transparent pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1.5 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-700/60 border border-emerald-500/30 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Shift Operations: Morning Cold-Press Peak</span>
            </div>
            <h1 className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Zest & Press Operations Hub
            </h1>
            <p className="text-emerald-100/90 text-sm leading-relaxed">
              Monitoring 5 operational projects, <strong>{tasks.length} total tasks</strong>, and active cold-chain pressing for today's {targetBottlesToday} bottle distribution target.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              id="dash-ai-prioritize-btn"
              onClick={onOpenAiDrawer}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 text-sm font-semibold shadow-md transition-all flex items-center gap-2 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Ask AI to Prioritize</span>
            </button>
            <button
              id="dash-new-task-btn"
              onClick={onOpenNewTaskModal}
              className="px-4 py-2.5 rounded-xl bg-emerald-600/80 hover:bg-emerald-600 text-white text-sm font-medium border border-emerald-400/30 transition-all flex items-center gap-2 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Metric 1: Daily Bottling Progress */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Today's Bottling</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Droplets className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-stone-900 font-heading">{totalBottlesToday}</span>
            <span className="text-sm font-medium text-stone-500">/ {targetBottlesToday} bottles</span>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden mb-2">
            <div 
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(bottlingProgress, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span className="font-semibold text-emerald-700">{bottlingProgress}% of daily quota</span>
            <button 
              onClick={() => onSelectView('juices')} 
              className="text-stone-400 hover:text-stone-700 underline"
            >
              Batch log
            </button>
          </div>
        </div>

        {/* Metric 2: Critical & Urgent Tasks */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Critical Tasks</span>
            <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${criticalTasks.length > 0 ? 'bg-rose-50 text-rose-600 animate-pulse' : 'bg-stone-50 text-stone-400'}`}>
              <Flame className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-stone-900 font-heading">{criticalTasks.length}</span>
            <span className="text-xs font-medium text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200">
              Needs Action
            </span>
          </div>
          <p className="text-xs text-stone-500 mb-2">
            {criticalTasks.length > 0 
              ? `${criticalTasks[0].title.slice(0, 36)}...` 
              : 'All urgent cold-chain actions cleared'}
          </p>
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>+{highTasks.length} high priority</span>
            <button 
              onClick={() => onSelectView('tasks')} 
              className="text-emerald-700 hover:text-emerald-800 font-medium"
            >
              View board &rarr;
            </button>
          </div>
        </div>

        {/* Metric 3: Active Projects Progress */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Projects</span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-stone-900 font-heading">{projects.filter(p => p.status === 'active').length}</span>
            <span className="text-xs text-stone-500">of {projects.length} initiatives</span>
          </div>
          <p className="text-xs text-stone-500 mb-2">
            Avg completion across shop: <strong className="text-stone-800 font-semibold">{Math.round(projects.reduce((a, b) => a + b.progress, 0) / projects.length)}%</strong>
          </p>
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>HPP Certification leading (85%)</span>
            <button 
              onClick={() => onSelectView('projects')} 
              className="text-emerald-700 hover:text-emerald-800 font-medium"
            >
              All projects &rarr;
            </button>
          </div>
        </div>

        {/* Metric 4: Task Completion Velocity */}
        <div className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs hover:shadow-sm transition-shadow">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold uppercase tracking-wider">Task Completion</span>
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-2xl font-bold text-stone-900 font-heading">{completedTasks.length}</span>
            <span className="text-xs font-medium text-stone-500">/ {tasks.length} total tasks</span>
          </div>
          <p className="text-xs text-stone-500 mb-2">
            <span className="text-teal-700 font-semibold">{inProgressTasks.length}</span> tasks in prep / progress
          </p>
          <div className="flex items-center justify-between text-xs text-stone-500">
            <span>{Math.round((completedTasks.length / tasks.length) * 100)}% resolution rate</span>
            <button 
              onClick={() => onSelectView('analytics')} 
              className="text-emerald-700 hover:text-emerald-800 font-medium"
            >
              Analytics &rarr;
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Priorities & Live Production Batches */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Columns: Priority Action Queue */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <h2 className="font-heading font-bold text-lg text-stone-900">
                  Priority Action Queue
                </h2>
                <span className="text-xs px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 font-medium">
                  {criticalTasks.length + highTasks.length} urgent
                </span>
              </div>
              <button
                id="view-all-tasks-link"
                onClick={() => onSelectView('tasks')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                <span>Full Board</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Task list */}
            <div className="space-y-3">
              {[...criticalTasks, ...highTasks].slice(0, 4).map((task) => (
                <div
                  key={task.id}
                  id={`dash-task-${task.id}`}
                  className="p-3.5 rounded-lg border border-stone-200 hover:border-emerald-300 bg-stone-50/50 hover:bg-stone-50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        task.priority === 'critical'
                          ? 'bg-rose-100 text-rose-800 border border-rose-200'
                          : 'bg-amber-100 text-amber-800 border border-amber-200'
                      }`}>
                        {task.priority}
                      </span>
                      <span className="text-xs font-medium text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                        {task.category}
                      </span>
                      {task.batchCode && (
                        <span className="text-[11px] font-mono text-stone-600 bg-stone-200/60 px-1.5 py-0.5 rounded">
                          Batch: {task.batchCode}
                        </span>
                      )}
                    </div>

                    <h3 
                      onClick={() => onOpenTaskDetails(task)}
                      className="font-semibold text-sm text-stone-900 hover:text-emerald-700 cursor-pointer transition-colors"
                    >
                      {task.title}
                    </h3>

                    {/* Subtasks summary */}
                    {task.subtasks.length > 0 && (
                      <div className="flex items-center gap-3 text-xs text-stone-500">
                        <span>
                          Checklist: {task.subtasks.filter(s => s.completed).length}/{task.subtasks.length}
                        </span>
                        <div className="w-20 bg-stone-200 rounded-full h-1.5 overflow-hidden">
                          <div 
                            className="bg-emerald-600 h-full rounded-full"
                            style={{ width: `${(task.subtasks.filter(s => s.completed).length / task.subtasks.length) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                    <div className="text-right text-xs">
                      <p className="font-medium text-stone-800">{task.assignee.name.split(' ')[0]}</p>
                      <p className="text-stone-400 text-[11px] flex items-center gap-1 justify-end">
                        <Calendar className="w-3 h-3" />
                        {task.dueDate}
                      </p>
                    </div>

                    {/* Status quick mover */}
                    <select
                      id={`dash-select-status-${task.id}`}
                      value={task.status}
                      onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as Task['status'])}
                      className="text-xs bg-white border border-stone-300 rounded-md px-2 py-1 text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="done">Mark Done</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Callout inside Priority Queue */}
            <div className="mt-4 p-3 rounded-lg bg-emerald-50/80 border border-emerald-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <p className="text-xs text-emerald-900 leading-snug">
                  <strong>AI Recommendation:</strong> Prioritize <em>Hydraulic Press #2 sanitation</em> to avoid delaying the 450-bottle Green Goddess run.
                </p>
              </div>
              <button
                id="dash-ask-ai-advice-btn"
                onClick={onOpenAiDrawer}
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 whitespace-nowrap ml-3"
              >
                Discuss with AI &rarr;
              </button>
            </div>
          </div>

          {/* Active Projects Snapshot */}
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-bold text-lg text-stone-900">
                Key Juice Shop Initiatives
              </h2>
              <button
                id="dash-view-all-projects-btn"
                onClick={() => onSelectView('projects')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
              >
                <span>View All ({projects.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {projects.slice(0, 4).map((project) => (
                <div 
                  key={project.id}
                  id={`dash-project-${project.id}`}
                  onClick={() => onSelectView('projects')}
                  className="p-3.5 rounded-lg border border-stone-200 hover:border-emerald-400 bg-stone-50/40 hover:bg-stone-50 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-100/80 text-emerald-800">
                      {project.category}
                    </span>
                    <span className="text-xs font-bold text-stone-700 font-heading">
                      {project.progress}%
                    </span>
                  </div>
                  <h4 className="font-bold text-sm text-stone-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                    {project.name}
                  </h4>
                  <p className="text-xs text-stone-500 line-clamp-1 mb-2.5 mt-0.5">
                    {project.tagline}
                  </p>
                  
                  {/* Progress bar */}
                  <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Live Cold-Press Batches & Recipe Highlights */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-stone-200 p-5 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Droplets className="w-5 h-5 text-emerald-600" />
                <h2 className="font-heading font-bold text-lg text-stone-900">
                  Live Press Batches
                </h2>
              </div>
              <button
                id="dash-view-juices-btn"
                onClick={() => onSelectView('juices')}
                className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
              >
                Menu &rarr;
              </button>
            </div>

            <div className="space-y-3">
              {juices.map((juice) => {
                const percent = Math.round((juice.bottlesToday / juice.targetBottles) * 100);
                return (
                  <div 
                    key={juice.id} 
                    id={`dash-juice-item-${juice.id}`}
                    className="p-3 rounded-lg border border-stone-200 bg-stone-50/40 hover:bg-stone-50 transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: juice.accentColor }} 
                        />
                        <h4 className="font-semibold text-xs text-stone-900 font-heading">
                          {juice.name}
                        </h4>
                      </div>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        juice.batchStatus === 'Pressing'
                          ? 'bg-amber-100 text-amber-800'
                          : juice.batchStatus === 'Quality Check'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}>
                        {juice.batchStatus}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-stone-600">
                      <span className="font-mono text-[11px] text-stone-500">#{juice.batchCode}</span>
                      <span>
                        <strong className="text-stone-900">{juice.bottlesToday}</strong> / {juice.targetBottles} bottles ({percent}%)
                      </span>
                    </div>

                    <div className="w-full bg-stone-200 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${Math.min(percent, 100)}%`,
                          backgroundColor: juice.accentColor
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Quick Operations stats */}
            <div className="mt-4 pt-4 border-t border-stone-100 space-y-2 text-xs text-stone-600">
              <div className="flex items-center justify-between">
                <span>HACCP Brix Calibration:</span>
                <span className="font-semibold text-emerald-700 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> 100% Passed
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Organic Pulp Diverted:</span>
                <span className="font-semibold text-stone-800">280 kg to compost</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Walk-in Refrigerator Temp:</span>
                <span className="font-semibold text-stone-800">3.4°C (Target: &lt;4°C)</span>
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
