import React, { useState } from 'react';
import { 
  FolderKanban, 
  Plus, 
  Calendar, 
  User, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  DollarSign, 
  Target,
  ArrowUpRight
} from 'lucide-react';
import { Project, ProjectCategory, ProjectStatus, Task } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  tasks: Task[];
  onOpenNewProjectModal: () => void;
  onOpenAiDrawer: () => void;
  onSelectProjectFilter: (projectId: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  tasks,
  onOpenNewProjectModal,
  onOpenAiDrawer,
  onSelectProjectFilter,
}) => {
  const [categoryFilter, setCategoryFilter] = useState<ProjectCategory | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<ProjectStatus | 'all'>('all');

  const filteredProjects = projects.filter(p => {
    if (categoryFilter !== 'all' && p.category !== categoryFilter) return false;
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  const totalBudget = projects.reduce((acc, p) => acc + p.budgetAllocated, 0);
  const totalSpent = projects.reduce((acc, p) => acc + p.budgetSpent, 0);
  const avgProgress = Math.round(projects.reduce((acc, p) => acc + p.progress, 0) / projects.length);

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-5 rounded-xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-stone-900">
              Juice Shop Growth & Operational Initiatives
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {projects.length} Initiatives
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Strategic programs covering cold-press recipe R&D, safety certification, and zero-waste loops.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            id="proj-ai-summary-btn"
            onClick={onOpenAiDrawer}
            className="px-3.5 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold border border-emerald-200 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Progress Summary</span>
          </button>

          <button
            id="create-project-btn"
            onClick={onOpenNewProjectModal}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>New Initiative</span>
          </button>
        </div>
      </div>

      {/* Quick Summary Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Average Progress</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-heading text-stone-900">{avgProgress}%</span>
            <span className="text-xs text-emerald-600 font-semibold">On Track</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${avgProgress}%` }} />
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Programs</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-heading text-stone-900">
              {projects.filter(p => p.status === 'active').length}
            </span>
            <span className="text-xs text-stone-500">of {projects.length} total</span>
          </div>
          <p className="text-xs text-stone-400 mt-2">
            {projects.filter(p => p.status === 'planning').length} in planning phase
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
          <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Capital & Operational Budget</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold font-heading text-stone-900">
              ${(totalSpent / 1000).toFixed(1)}k
            </span>
            <span className="text-xs text-stone-500">/ ${(totalBudget / 1000).toFixed(1)}k total</span>
          </div>
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-2 overflow-hidden">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: `${(totalSpent / totalBudget) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* Filter Chips */}
      <div className="flex flex-wrap items-center gap-2 bg-white p-3 rounded-xl border border-stone-200 text-xs">
        <span className="font-semibold text-stone-500 uppercase tracking-wider text-[11px]">Category:</span>
        {(['all', 'Product R&D', 'Kitchen Ops', 'Sustainability', 'Retail & Delivery', 'Supply Chain'] as const).map((cat) => (
          <button
            key={cat}
            id={`filter-proj-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
            onClick={() => setCategoryFilter(cat as any)}
            className={`px-2.5 py-1 rounded-md font-medium transition-all ${
              categoryFilter === cat
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            {cat === 'all' ? 'All Areas' : cat}
          </button>
        ))}

        <div className="h-4 w-px bg-stone-200 mx-1 hidden sm:block" />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          className="bg-stone-100 border border-stone-200 rounded-md px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active</option>
          <option value="planning">Planning</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredProjects.map((project) => {
          const projectTasks = tasks.filter(t => t.projectId === project.id);
          const doneCount = projectTasks.filter(t => t.status === 'done').length;

          return (
            <div
              key={project.id}
              id={`project-card-${project.id}`}
              className="bg-white rounded-xl border border-stone-200 hover:border-emerald-300 p-5 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {project.code}
                    </span>
                    <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                      {project.category}
                    </span>
                  </div>
                  <span className={`text-[11px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                    project.status === 'active' 
                      ? 'bg-emerald-100 text-emerald-800' 
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {project.status}
                  </span>
                </div>

                {/* Title & Tagline */}
                <div>
                  <h3 className="font-heading font-bold text-lg text-stone-900 leading-snug">
                    {project.name}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                    {project.tagline}
                  </p>
                </div>

                {/* Target Metric */}
                <div className="bg-stone-50 p-2.5 rounded-lg border border-stone-100 flex items-center gap-2 text-xs">
                  <Target className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="text-stone-500 font-medium">Target Metric:</span>
                  <span className="font-bold text-stone-800">{project.targetMetric}</span>
                </div>

                {/* Progress bar */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-medium">
                    <span className="text-stone-500">Initiative Progress</span>
                    <span className="font-bold text-stone-900 font-heading">{project.progress}%</span>
                  </div>
                  <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className="bg-emerald-600 h-full rounded-full transition-all"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="pt-3 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-stone-500">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px]">
                    {project.lead.initials}
                  </div>
                  <div>
                    <span className="font-medium text-stone-800">{project.lead.name}</span>
                    <p className="text-[10px] text-stone-400">{project.lead.role}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-3">
                  <span className="flex items-center gap-1 text-[11px]">
                    <Calendar className="w-3.5 h-3.5 text-stone-400" />
                    Target: {project.targetDate}
                  </span>

                  <button
                    id={`view-tasks-proj-${project.id}`}
                    onClick={() => onSelectProjectFilter(project.id)}
                    className="px-2.5 py-1 rounded bg-stone-100 hover:bg-emerald-50 hover:text-emerald-700 text-stone-700 font-semibold transition-colors flex items-center gap-1"
                  >
                    <span>{projectTasks.length} Tasks</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
