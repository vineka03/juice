import React, { useState } from 'react';
import { 
  Plus, 
  Filter, 
  Columns3, 
  List, 
  Calendar, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  MoreVertical, 
  Check, 
  Search,
  Tag,
  Trash2
} from 'lucide-react';
import { Task, TaskStatus, Priority, TaskCategory, Project, Assignee } from '../types';

interface TaskBoardViewProps {
  tasks: Task[];
  projects: Project[];
  assignees: Assignee[];
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onOpenNewTaskModal: () => void;
  onOpenTaskDetails: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAiDrawer: () => void;
  initialPriorityFilter?: Priority | 'all';
}

const COLUMNS: { id: TaskStatus; label: string; bg: string; border: string }[] = [
  { id: 'backlog', label: 'Backlog', bg: 'bg-stone-50', border: 'border-stone-200' },
  { id: 'todo', label: 'To Do', bg: 'bg-amber-50/50', border: 'border-amber-200/60' },
  { id: 'in-progress', label: 'In Press / Progress', bg: 'bg-blue-50/50', border: 'border-blue-200/60' },
  { id: 'review', label: 'Quality / Review', bg: 'bg-purple-50/50', border: 'border-purple-200/60' },
  { id: 'done', label: 'Done & Logged', bg: 'bg-emerald-50/50', border: 'border-emerald-200/60' },
];

export const TaskBoardView: React.FC<TaskBoardViewProps> = ({
  tasks,
  projects,
  assignees,
  onUpdateTaskStatus,
  onToggleSubtask,
  onOpenNewTaskModal,
  onOpenTaskDetails,
  onDeleteTask,
  onOpenAiDrawer,
  initialPriorityFilter = 'all',
}) => {
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>(initialPriorityFilter);
  const [categoryFilter, setCategoryFilter] = useState<TaskCategory | 'all'>('all');
  const [projectFilter, setProjectFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    if (categoryFilter !== 'all' && task.category !== categoryFilter) return false;
    if (projectFilter !== 'all' && task.projectId !== projectFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = task.title.toLowerCase().includes(q);
      const matchDesc = task.description.toLowerCase().includes(q);
      const matchAssignee = task.assignee.name.toLowerCase().includes(q);
      const matchBatch = task.batchCode?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc && !matchAssignee && !matchBatch) return false;
    }
    return true;
  });

  const getPriorityBadge = (p: Priority) => {
    switch (p) {
      case 'critical':
        return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'high':
        return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'medium':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'low':
        return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  const getNextStatus = (current: TaskStatus): TaskStatus | null => {
    const order: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'review', 'done'];
    const idx = order.indexOf(current);
    if (idx < order.length - 1) return order[idx + 1];
    return null;
  };

  const getPrevStatus = (current: TaskStatus): TaskStatus | null => {
    const order: TaskStatus[] = ['backlog', 'todo', 'in-progress', 'review', 'done'];
    const idx = order.indexOf(current);
    if (idx > 0) return order[idx - 1];
    return null;
  };

  return (
    <div className="space-y-5 pb-12">
      
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white p-4 sm:p-5 rounded-xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-heading text-xl sm:text-2xl font-bold text-stone-900">
              Task Management & Kitchen Workflows
            </h1>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
              {filteredTasks.length} tasks
            </span>
          </div>
          <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
            Track daily cold pressing, produce intake, hygiene SOPs, and R&D formulations.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Helper Button */}
          <button
            id="task-board-ai-organize-btn"
            onClick={onOpenAiDrawer}
            className="px-3 py-2 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs sm:text-sm font-semibold border border-emerald-200 transition-all flex items-center gap-1.5 active:scale-95"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>AI Task Assistant</span>
          </button>

          {/* View Toggle */}
          <div className="flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200">
            <button
              id="view-mode-board-btn"
              onClick={() => setViewMode('board')}
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'board' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Kanban Board View"
            >
              <Columns3 className="w-4 h-4" />
              <span className="hidden sm:inline">Board</span>
            </button>
            <button
              id="view-mode-list-btn"
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded text-xs font-medium flex items-center gap-1.5 transition-all ${
                viewMode === 'list' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>

          {/* New Task Button */}
          <button
            id="create-task-main-btn"
            onClick={onOpenNewTaskModal}
            className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold transition-all flex items-center gap-1.5 shadow-sm active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-2.5 bg-white p-3 rounded-xl border border-stone-200 text-xs text-stone-700">
        
        {/* Priority Chips */}
        <span className="font-semibold text-stone-500 text-[11px] uppercase tracking-wider flex items-center gap-1">
          <Filter className="w-3.5 h-3.5 text-stone-400" />
          Priority:
        </span>
        <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
          {(['all', 'critical', 'high', 'medium', 'low'] as const).map((p) => (
            <button
              key={p}
              id={`filter-priority-${p}`}
              onClick={() => setPriorityFilter(p)}
              className={`px-2.5 py-1 rounded-md capitalize font-medium transition-all ${
                priorityFilter === p
                  ? p === 'critical'
                    ? 'bg-rose-600 text-white shadow-xs'
                    : p === 'high'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-stone-900 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {p === 'all' ? 'All' : p}
              {p === 'critical' && (
                <span className="ml-1 px-1 bg-white/30 rounded text-[10px]">
                  {tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="h-4 w-px bg-stone-200 mx-1 hidden sm:block" />

        {/* Category Dropdown */}
        <select
          id="filter-category-select"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value as any)}
          className="bg-stone-100 border border-stone-200 rounded-md px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          <option value="all">All Departments</option>
          <option value="Cold-Pressing">Cold-Pressing</option>
          <option value="Quality & Safety">Quality & Safety (HACCP)</option>
          <option value="Inventory & Sourcing">Inventory & Sourcing</option>
          <option value="Packaging & Retail">Packaging & Retail</option>
          <option value="Menu & R&D">Menu & R&D</option>
        </select>

        {/* Project Dropdown */}
        <select
          id="filter-project-select"
          value={projectFilter}
          onChange={(e) => setProjectFilter(e.target.value)}
          className="bg-stone-100 border border-stone-200 rounded-md px-2.5 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 max-w-[180px] truncate"
        >
          <option value="all">All Projects</option>
          {projects.map(p => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>

        {/* Clear Filter Button */}
        {(priorityFilter !== 'all' || categoryFilter !== 'all' || projectFilter !== 'all' || searchQuery) && (
          <button
            id="reset-filters-btn"
            onClick={() => {
              setPriorityFilter('all');
              setCategoryFilter('all');
              setProjectFilter('all');
              setSearchQuery('');
            }}
            className="text-xs text-rose-600 hover:text-rose-700 underline font-medium ml-auto"
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* Board View */}
      {viewMode === 'board' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 items-start">
          {COLUMNS.map((column) => {
            const columnTasks = filteredTasks.filter(t => t.status === column.id);
            return (
              <div 
                key={column.id} 
                id={`kanban-col-${column.id}`}
                className={`rounded-xl border ${column.border} ${column.bg} p-3 flex flex-col min-h-[480px]`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200/80">
                  <div className="flex items-center gap-2">
                    <span className="font-heading font-bold text-xs uppercase tracking-wider text-stone-800">
                      {column.label}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.2 rounded-full bg-white text-stone-600 border border-stone-200 shadow-2xs">
                      {columnTasks.length}
                    </span>
                  </div>
                  <button
                    onClick={onOpenNewTaskModal}
                    className="text-stone-400 hover:text-stone-700 p-0.5 rounded"
                    title="Add task to column"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Column Task Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto max-h-[750px] pr-0.5">
                  {columnTasks.length === 0 ? (
                    <div className="h-32 flex items-center justify-center border-2 border-dashed border-stone-200/80 rounded-lg text-xs text-stone-400">
                      No tasks in {column.label}
                    </div>
                  ) : (
                    columnTasks.map((task) => {
                      const completedCount = task.subtasks.filter(s => s.completed).length;
                      const next = getNextStatus(task.status);
                      const prev = getPrevStatus(task.status);

                      return (
                        <div
                          key={task.id}
                          id={`task-card-${task.id}`}
                          className="bg-white rounded-lg p-3.5 border border-stone-200/90 hover:border-emerald-400 shadow-2xs hover:shadow-xs transition-all space-y-2.5 group cursor-pointer"
                          onClick={() => onOpenTaskDetails(task)}
                        >
                          {/* Priority & Category tags */}
                          <div className="flex items-center justify-between gap-1.5 flex-wrap">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getPriorityBadge(task.priority)}`}>
                              {task.priority}
                            </span>
                            <span className="text-[10px] font-medium text-stone-500 bg-stone-50 px-1.5 py-0.5 rounded border border-stone-200 truncate max-w-[120px]">
                              {task.category}
                            </span>
                          </div>

                          {/* Title */}
                          <h3 className="font-semibold text-xs sm:text-sm text-stone-900 group-hover:text-emerald-700 transition-colors leading-snug">
                            {task.title}
                          </h3>

                          {/* Batch code tag if present */}
                          {task.batchCode && (
                            <div className="inline-block text-[11px] font-mono text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded">
                              Batch: {task.batchCode}
                              {task.bottlesTarget && ` (${task.bottlesTarget} btls)`}
                            </div>
                          )}

                          {/* Subtasks / Checklist progress */}
                          {task.subtasks.length > 0 && (
                            <div 
                              className="bg-stone-50 p-2 rounded border border-stone-100 space-y-1.5"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
                                <span>Checklist</span>
                                <span>{completedCount}/{task.subtasks.length}</span>
                              </div>
                              <div className="w-full bg-stone-200 rounded-full h-1 overflow-hidden">
                                <div 
                                  className="bg-emerald-600 h-full rounded-full transition-all"
                                  style={{ width: `${(completedCount / task.subtasks.length) * 100}%` }}
                                />
                              </div>
                              {/* Show top 2 subtasks with quick checkbox */}
                              <div className="space-y-1 pt-1">
                                {task.subtasks.slice(0, 2).map((st) => (
                                  <label 
                                    key={st.id} 
                                    className="flex items-start gap-1.5 text-[11px] text-stone-700 cursor-pointer select-none hover:text-stone-900"
                                  >
                                    <input
                                      type="checkbox"
                                      checked={st.completed}
                                      onChange={() => onToggleSubtask(task.id, st.id)}
                                      className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 w-3 h-3"
                                    />
                                    <span className={st.completed ? 'line-through text-stone-400' : ''}>
                                      {st.title}
                                    </span>
                                  </label>
                                ))}
                                {task.subtasks.length > 2 && (
                                  <p className="text-[10px] text-stone-400 pl-4">
                                    +{task.subtasks.length - 2} more items
                                  </p>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Footer: Assignee & Due date & Column Mover */}
                          <div 
                            className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="flex items-center gap-1.5" title={task.assignee.name}>
                              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                                {task.assignee.initials}
                              </div>
                              <span className="text-[11px] text-stone-700 truncate max-w-[70px]">
                                {task.assignee.name.split(' ')[0]}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-stone-400 flex items-center gap-0.5">
                                <Calendar className="w-3 h-3" />
                                {task.dueDate.slice(5)}
                              </span>

                              {/* Move Left Button */}
                              {prev && (
                                <button
                                  id={`move-prev-${task.id}`}
                                  onClick={() => onUpdateTaskStatus(task.id, prev)}
                                  className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-stone-700"
                                  title={`Move to ${prev}`}
                                >
                                  <ChevronLeft className="w-3 h-3" />
                                </button>
                              )}

                              {/* Move Right Button */}
                              {next && (
                                <button
                                  id={`move-next-${task.id}`}
                                  onClick={() => onUpdateTaskStatus(task.id, next)}
                                  className="p-1 rounded hover:bg-stone-100 text-stone-400 hover:text-emerald-700"
                                  title={`Move to ${next}`}
                                >
                                  <ChevronRight className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* List View */
        <div className="bg-white rounded-xl border border-stone-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-500 uppercase tracking-wider font-semibold border-b border-stone-200">
                <tr>
                  <th className="py-3 px-4">Task</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Priority</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Assignee</th>
                  <th className="py-3 px-4">Due Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200/80">
                {filteredTasks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-stone-400">
                      No matching tasks found.
                    </td>
                  </tr>
                ) : (
                  filteredTasks.map((task) => (
                    <tr 
                      key={task.id} 
                      className="hover:bg-stone-50/80 transition-colors cursor-pointer"
                      onClick={() => onOpenTaskDetails(task)}
                    >
                      <td className="py-3 px-4 max-w-sm">
                        <div className="font-semibold text-stone-900 hover:text-emerald-700">
                          {task.title}
                        </div>
                        {task.batchCode && (
                          <span className="text-[11px] font-mono text-stone-500">
                            Batch: {task.batchCode}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-stone-600">
                        {task.category}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${getPriorityBadge(task.priority)}`}>
                          {task.priority}
                        </span>
                      </td>
                      <td className="py-3 px-4" onClick={(e) => e.stopPropagation()}>
                        <select
                          value={task.status}
                          onChange={(e) => onUpdateTaskStatus(task.id, e.target.value as TaskStatus)}
                          className="text-xs bg-stone-100 border border-stone-200 rounded px-2 py-1 text-stone-700 focus:outline-none focus:ring-1 focus:ring-emerald-500 capitalize"
                        >
                          <option value="backlog">Backlog</option>
                          <option value="todo">To Do</option>
                          <option value="in-progress">In Progress</option>
                          <option value="review">Review</option>
                          <option value="done">Done</option>
                        </select>
                      </td>
                      <td className="py-3 px-4 text-stone-700">
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                            {task.assignee.initials}
                          </div>
                          <span>{task.assignee.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-500">
                        {task.dueDate}
                      </td>
                      <td className="py-3 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
