import React from 'react';
import { 
  X, 
  Calendar, 
  User, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Flame, 
  Sparkles, 
  Droplet,
  Tag
} from 'lucide-react';
import { Task, Project, Assignee } from '../types';

interface TaskDetailModalProps {
  task: Task | null;
  isOpen: boolean;
  onClose: () => void;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onUpdateStatus: (taskId: string, status: Task['status']) => void;
  onAskAiAboutTask: (task: Task) => void;
  project?: Project;
}

export const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  task,
  isOpen,
  onClose,
  onEditTask,
  onDeleteTask,
  onToggleSubtask,
  onUpdateStatus,
  onAskAiAboutTask,
  project,
}) => {
  if (!isOpen || !task) return null;

  const completedSubtasks = task.subtasks.filter(s => s.completed).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div 
        id="task-detail-modal"
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 my-8 space-y-4"
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md ${
                task.priority === 'critical'
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : task.priority === 'high'
                  ? 'bg-amber-100 text-amber-800 border border-amber-300'
                  : 'bg-blue-100 text-blue-800 border border-blue-300'
              }`}>
                {task.priority}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                {task.category}
              </span>
              {task.batchCode && (
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-stone-200/80 text-stone-800">
                  Batch: {task.batchCode}
                </span>
              )}
            </div>
            <h2 className="font-heading font-bold text-lg text-stone-900 leading-snug">
              {task.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status bar */}
        <div className="flex items-center justify-between p-3 rounded-lg bg-stone-50 border border-stone-100 text-xs">
          <span className="font-semibold text-stone-600">Workflow Column:</span>
          <select
            value={task.status}
            onChange={(e) => onUpdateStatus(task.id, e.target.value as any)}
            className="bg-white border border-stone-200 rounded-md px-2.5 py-1 text-xs font-semibold text-stone-800 focus:outline-none focus:ring-1 focus:ring-emerald-500 capitalize"
          >
            <option value="backlog">Backlog</option>
            <option value="todo">To Do</option>
            <option value="in-progress">In Press / Progress</option>
            <option value="review">Quality / Review</option>
            <option value="done">Done & Logged</option>
          </select>
        </div>

        {/* Description */}
        {task.description && (
          <div className="space-y-1">
            <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
              Operational Details:
            </span>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed bg-stone-50/50 p-3 rounded-lg border border-stone-100">
              {task.description}
            </p>
          </div>
        )}

        {/* Metadata grid */}
        <div className="grid grid-cols-2 gap-3 text-xs bg-stone-50 p-3 rounded-lg border border-stone-100">
          <div>
            <span className="text-stone-400 block mb-0.5">Assignee</span>
            <div className="flex items-center gap-1.5 font-medium text-stone-800">
              <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">
                {task.assignee.initials}
              </div>
              <span>{task.assignee.name}</span>
            </div>
          </div>

          <div>
            <span className="text-stone-400 block mb-0.5">Due Date</span>
            <div className="flex items-center gap-1 font-medium text-stone-800">
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>{task.dueDate}</span>
            </div>
          </div>

          {project && (
            <div className="col-span-2 pt-2 border-t border-stone-200/60">
              <span className="text-stone-400 block mb-0.5">Initiative</span>
              <span className="font-semibold text-emerald-800">{project.name}</span>
            </div>
          )}
        </div>

        {/* Subtasks / Checklist */}
        {task.subtasks.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-stone-700">
              <span>HACCP & Task Checklist</span>
              <span className="text-emerald-700 font-bold">{completedSubtasks}/{task.subtasks.length} Completed</span>
            </div>

            <div className="space-y-1.5 max-h-44 overflow-y-auto">
              {task.subtasks.map((st) => (
                <label 
                  key={st.id}
                  className="flex items-start gap-2 p-2 rounded-lg bg-stone-50 border border-stone-100 hover:bg-stone-100/60 cursor-pointer select-none text-xs text-stone-800"
                >
                  <input
                    type="checkbox"
                    checked={st.completed}
                    onChange={() => onToggleSubtask(task.id, st.id)}
                    className="mt-0.5 rounded text-emerald-600 focus:ring-emerald-500 border-stone-300 w-3.5 h-3.5"
                  />
                  <span className={st.completed ? 'line-through text-stone-400' : ''}>
                    {st.title}
                  </span>
                </label>
              ))}
            </div>
          </div>
        )}

        {/* AI Action button */}
        <div className="p-3 bg-emerald-50/80 border border-emerald-200/80 rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span className="text-xs text-emerald-900 font-medium">Need cold-press SOP or priority guidance?</span>
          </div>
          <button
            onClick={() => {
              onClose();
              onAskAiAboutTask(task);
            }}
            className="text-xs font-semibold px-2.5 py-1 rounded bg-white text-emerald-800 hover:bg-emerald-100 border border-emerald-200 transition-colors shadow-2xs"
          >
            Ask ZestAI
          </button>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
          <button
            onClick={() => {
              onDeleteTask(task.id);
              onClose();
            }}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold p-1 rounded hover:bg-rose-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Delete Task</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onEditTask(task);
              }}
              className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Details</span>
            </button>
            <button
              onClick={onClose}
              className="text-xs font-semibold px-4 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white transition-colors"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
