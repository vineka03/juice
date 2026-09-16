import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  FolderKanban, 
  Droplet, 
  BarChart3, 
  Sparkles, 
  Plus, 
  Search, 
  Thermometer, 
  X
} from 'lucide-react';

interface NavbarProps {
  currentView: 'dashboard' | 'tasks' | 'projects' | 'juices' | 'analytics';
  onSelectView: (view: 'dashboard' | 'tasks' | 'projects' | 'juices' | 'analytics') => void;
  onOpenAiDrawer: () => void;
  onOpenNewTaskModal: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  tasksCount: number;
  criticalCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onSelectView,
  onOpenAiDrawer,
  onOpenNewTaskModal,
  searchQuery,
  onSearchChange,
  tasksCount,
  criticalCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo & Shop Status */}
          <div className="flex items-center gap-3 shrink-0">
            <button 
              id="brand-home-btn"
              onClick={() => onSelectView('dashboard')}
              className="flex items-center gap-2.5 text-left group focus:outline-none"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-amber-500 flex items-center justify-center shadow-md shadow-emerald-500/10 text-white transition-transform group-hover:scale-105">
                <Droplet className="w-5 h-5 fill-white/20 stroke-[2.2]" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-heading font-bold text-lg tracking-tight text-stone-900 group-hover:text-emerald-700 transition-colors">
                    Zest & Press
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                    Juice Lab
                  </span>
                </div>
                <p className="text-xs text-stone-500 hidden sm:block">Cold-Press Operations & Management</p>
              </div>
            </button>

            {/* Micro Live Cold-Room Temperature Pill */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-100 border border-stone-200 text-stone-600 text-xs font-medium">
              <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
              <span>Walk-in: <strong className="text-stone-800 font-semibold">3.4°C</strong></span>
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse ml-0.5" title="Cold-chain normal" />
            </div>
          </div>

          {/* Search bar */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="global-search-input"
                type="text"
                placeholder="Search tasks, projects, juice batches..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                className="w-full bg-stone-100/80 hover:bg-stone-100 focus:bg-white text-stone-800 placeholder-stone-400 text-sm rounded-lg pl-9 pr-8 py-2 border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all"
              />
              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={() => onSearchChange('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 p-0.5 rounded"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Nav Actions */}
          <div className="flex items-center gap-2">
            {/* AI Assistant Trigger Button */}
            <button
              id="open-ai-assistant-btn"
              onClick={onOpenAiDrawer}
              className="flex items-center gap-2 px-3 py-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs sm:text-sm font-semibold shadow-sm shadow-emerald-700/20 hover:shadow transition-all active:scale-95"
            >
              <Sparkles className="w-4 h-4 animate-spin-slow text-amber-300" />
              <span className="hidden xs:inline">ZestAI Copilot</span>
              <span className="xs:hidden inline">AI</span>
            </button>

            {/* New Task Button */}
            <button
              id="navbar-new-task-btn"
              onClick={onOpenNewTaskModal}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-white text-xs sm:text-sm font-medium transition-all active:scale-95 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">New Task</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Bar */}
        <nav className="flex items-center space-x-1 sm:space-x-2 overflow-x-auto py-2 -mb-px border-t border-stone-100 scrollbar-none">
          <button
            id="tab-dashboard"
            onClick={() => onSelectView('dashboard')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              currentView === 'dashboard'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4 text-emerald-600" />
            Dashboard
          </button>

          <button
            id="tab-tasks"
            onClick={() => onSelectView('tasks')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              currentView === 'tasks'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <CheckSquare className="w-4 h-4 text-emerald-600" />
            Task Management
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[11px] font-bold bg-stone-200/80 text-stone-700">
              {tasksCount}
            </span>
            {criticalCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-rose-100 text-rose-700 border border-rose-200 animate-pulse">
                {criticalCount} critical
              </span>
            )}
          </button>

          <button
            id="tab-projects"
            onClick={() => onSelectView('projects')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              currentView === 'projects'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <FolderKanban className="w-4 h-4 text-emerald-600" />
            Projects
          </button>

          <button
            id="tab-juices"
            onClick={() => onSelectView('juices')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              currentView === 'juices'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <Droplet className="w-4 h-4 text-amber-500" />
            Juice Menu & Batches
          </button>

          <button
            id="tab-analytics"
            onClick={() => onSelectView('analytics')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-colors ${
              currentView === 'analytics'
                ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
            }`}
          >
            <BarChart3 className="w-4 h-4 text-emerald-600" />
            Progress Analytics
          </button>
        </nav>

        {/* Mobile search bar if small screen */}
        <div className="pb-2 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              id="mobile-search-input"
              type="text"
              placeholder="Search tasks, projects, juices..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full bg-stone-100 text-stone-800 text-xs rounded-lg pl-9 pr-8 py-1.5 border border-stone-200 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
