import React, { useState } from 'react';
import { X, Target, Calendar, DollarSign, Layers } from 'lucide-react';
import { Project, ProjectCategory, ProjectStatus, Assignee } from '../types';

interface ProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProject: (project: Project) => void;
  assignees: Assignee[];
}

export const ProjectModal: React.FC<ProjectModalProps> = ({
  isOpen,
  onClose,
  onSaveProject,
  assignees,
}) => {
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [tagline, setTagline] = useState('');
  const [category, setCategory] = useState<ProjectCategory>('Product R&D');
  const [targetDate, setTargetDate] = useState('');
  const [leadId, setLeadId] = useState(assignees[0]?.id || '');
  const [description, setDescription] = useState('');
  const [targetMetric, setTargetMetric] = useState('');
  const [budgetAllocated, setBudgetAllocated] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const lead = assignees.find(a => a.id === leadId) || assignees[0];

    const newProject: Project = {
      id: `proj-${Date.now()}`,
      name: name.trim(),
      code: code.trim() || `INIT-${Math.floor(Math.random() * 90 + 10)}`,
      tagline: tagline.trim() || 'Strategic juice shop initiative',
      category,
      status: 'active',
      progress: 0,
      targetDate: targetDate || new Date().toISOString().split('T')[0],
      startDate: new Date().toISOString().split('T')[0],
      color: 'emerald',
      lead,
      description: description.trim(),
      targetMetric: targetMetric.trim() || '100% Target Execution',
      budgetAllocated: budgetAllocated ? parseFloat(budgetAllocated) : 10000,
      budgetSpent: 0,
    };

    onSaveProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div 
        id="project-form-modal"
        className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150 my-8"
      >
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <h2 className="font-heading font-bold text-lg text-stone-900">
              New Juice Shop Initiative
            </h2>
            <p className="text-xs text-stone-500">
              Define operational goals, team lead, and milestone metrics.
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
          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Program Name *
            </label>
            <input
              id="proj-name-input"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Winter Cleanse Pack & Botanical Infusions"
              className="w-full text-xs sm:text-sm bg-stone-50 border border-stone-200 rounded-lg px-3.5 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Project Code
              </label>
              <input
                id="proj-code-input"
                type="text"
                placeholder="e.g. WIN-CLN"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Department Category
              </label>
              <select
                id="proj-category-select"
                value={category}
                onChange={(e) => setCategory(e.target.value as ProjectCategory)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                <option value="Product R&D">Product R&D</option>
                <option value="Kitchen Ops">Kitchen Ops</option>
                <option value="Sustainability">Sustainability</option>
                <option value="Retail & Delivery">Retail & Delivery</option>
                <option value="Supply Chain">Supply Chain</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
              Short Tagline
            </label>
            <input
              id="proj-tagline-input"
              type="text"
              placeholder="e.g. Formulating 3 seasonal recipes with organic ginger and winter citrus"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Target Launch Date
              </label>
              <input
                id="proj-target-date-input"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Initiative Lead
              </label>
              <select
                id="proj-lead-select"
                value={leadId}
                onChange={(e) => setLeadId(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              >
                {assignees.map(a => (
                  <option key={a.id} value={a.id}>{a.name} ({a.role})</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Key Target Metric
              </label>
              <input
                id="proj-metric-input"
                type="text"
                placeholder="e.g. 500 subscriptions / 99% Brix approval"
                value={targetMetric}
                onChange={(e) => setTargetMetric(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1">
                Allocated Budget ($)
              </label>
              <input
                id="proj-budget-input"
                type="number"
                placeholder="e.g. 15000"
                value={budgetAllocated}
                onChange={(e) => setBudgetAllocated(e.target.value)}
                className="w-full text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              id="save-project-submit-btn"
              type="submit"
              className="px-5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-sm transition-all active:scale-95"
            >
              Launch Initiative
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
