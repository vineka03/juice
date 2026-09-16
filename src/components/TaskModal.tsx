import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, Calendar, User, Tag, Sparkles } from 'lucide-react';
import { Task, Priority, TaskCategory, TaskStatus, Project, Assignee } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveTask: (taskData: Partial<Task>) => void;
  projects: Project[];
  assignees: Assignee[];
  existingTask?: Task | null;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSaveTask,
  projects,
  assignees,
  existingTask,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [category, setCategory] = useState<TaskCategory>('Cold-Pressing');
  const [status, setStatus] = useState<TaskStatus>('todo');
  const [assigneeId, setAssigneeId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [batchCode, setBatchCode] = useState('');
  const [bottlesTarget, setBottlesTarget] = useState<string>('');
  const [subtasks, setSubtasks] = useState<{ id: string; title: string; completed: boolean }[]>([]);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

  useEffect(() => {
    if (existingTask) {
      setTitle(existingTask.title);
      setDescription(existingTask.description);
      setProjectId(existingTask.projectId);
      setPriority(existingTask.priority);
      setCategory(existingTask.category);
      setStatus(existingTask.status);
      setAssigneeId(existingTask.assignee.id);
      setDueDate(existingTask.dueDate);
      setBatchCode(existingTask.batchCode || '');
      setBottlesTarget(existingTask.bottlesTarget ? String(existingTask.bottlesTarget) : '');
      setSubtasks(existingTask.subtasks || []);
    } else {
      setTitle('');
      setDescription('');
      setProjectId(projects[0]?.id || '');
      setPriority('medium');
      setCategory('Cold-Pressing');
      setStatus('todo');
      setAssigneeId(assignees[0]?.id || '');
      const today = new Date().toISOString().split('T')[0];
      setDueDate(today);
      setBatchCode('');
      setBottlesTarget('');
      setSubtasks([]);
    }
  }, [existingTask, isOpen, projects, assignees]);

  if (!isOpen) return null;

  const handleAddSubtask = () => {
    if (!newSubtaskTitle.trim()) return;
    setSubtasks([
      ...subtasks,
      { id: `st-${Date.now()}`, title: newSubtaskTitle.trim(), completed: false },
    ]);
    setNewSubtaskTitle('');
  };

  const handleRemoveSubtask = (id: string) => {
    setSubtasks(subtasks.filter(s => s.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const chosenAssignee = assignees.find(a => a.id === assigneeId) || assignees[0];

    onSaveTask({
      id: existingTask ? existingTask.id : `task-${Date.now()}`,
      title: title.trim(),
      description: description.trim(),
      projectId,
      priority,
      category,
      status,
      assignee: chosenAssignee,
      dueDate,
      batchCode: batchCode.trim() || undefined,
      bottlesTarget: bottlesTarget ? parseInt(bottlesTarget, 10) : undefined,
      subtasks,
      createdAt: existingTask ? existingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div 
        id="task-form-modal"
        className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 my-8"
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 className="font-heading font-bold text-lg text-stone-900">
              {existingTask ? 'Edit Kitchen Task' : 'Log New Juice Shop Task'}
            </h2>
            <p className="text-xs text-stone-500">
              Specify priority, assigned presser/manager, and production checklist.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Task Title *
            </label>
            <input
              id="task-title-input"
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Sanitize masticating press #2 or Batch test pH for Turmeric blend"
              className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2.5 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Operational Instructions
            </label>
            <textarea
              id="task-desc-input"
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Safety checks, temperature guidelines, produce wash protocols..."
              className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
            />
          </div>

          {/* Priority & Category & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Priority Tier
              </label>
              <select
                id="task-priority-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value as Priority)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="critical">Critical (Immediate)</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Department
              </label>
              <select
                id="task-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as TaskCategory)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Cold-Pressing">Cold-Pressing</option>
                <option value="Quality & Safety">Quality & Safety (HACCP)</option>
                <option value="Inventory & Sourcing">Inventory & Sourcing</option>
                <option value="Packaging & Retail">Packaging & Retail</option>
                <option value="Menu & R&D">Menu & R&D</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Workflow Column
              </label>
              <select
                id="task-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 capitalize"
              >
                <option value="backlog">Backlog</option>
                <option value="todo">To Do</option>
                <option value="in-progress">In Press / Progress</option>
                <option value="review">Quality / Review</option>
                <option value="done">Done</option>
              </select>
            </div>
          </div>

          {/* Project & Assignee */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Linked Initiative
              </label>
              <select
                id="task-project-select"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500 truncate"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Assignee
              </label>
              <select
                id="task-assignee-select"
                value={assigneeId}
                onChange={(e) => setAssigneeId(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {assignees.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date & Batch Code */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Due Date
              </label>
              <input
                id="task-due-date-input"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Batch Code (Optional)
              </label>
              <input
                id="task-batch-input"
                type="text"
                placeholder="e.g. PG-882"
                value={batchCode}
                onChange={(e) => setBatchCode(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Bottles Target (Opt.)
              </label>
              <input
                id="task-bottles-input"
                type="number"
                placeholder="e.g. 450"
                value={bottlesTarget}
                onChange={(e) => setBottlesTarget(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Subtasks / Checklist */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider">
              Quality Checklist & Steps
            </label>

            {subtasks.length > 0 && (
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {subtasks.map((st) => (
                  <div key={st.id} className="flex items-center justify-between gap-2 p-2 rounded bg-stone-50 border border-stone-200/80 text-xs">
                    <span className="text-stone-800">{st.title}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSubtask(st.id)}
                      className="text-stone-400 hover:text-rose-600 p-0.5"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Add a checklist item (e.g. Verify pH < 4.2)..."
                value={newSubtaskTitle}
                onChange={(e) => setNewSubtaskTitle(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddSubtask(); } }}
                className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-800 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={handleAddSubtask}
                className="px-3 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold shrink-0"
              >
                Add Step
              </button>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              id="save-task-submit-btn"
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              {existingTask ? 'Save Changes' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
