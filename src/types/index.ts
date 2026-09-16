export type Priority = 'critical' | 'high' | 'medium' | 'low';

export type TaskStatus = 'backlog' | 'todo' | 'in-progress' | 'review' | 'done';

export type TaskCategory = 
  | 'Cold-Pressing'
  | 'Quality & Safety'
  | 'Inventory & Sourcing'
  | 'Packaging & Retail'
  | 'Menu & R&D'
  | 'Kitchen Ops';

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Assignee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  initials: string;
  color: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  projectId: string;
  status: TaskStatus;
  priority: Priority;
  category: TaskCategory;
  assignee: Assignee;
  dueDate: string;
  subtasks: Subtask[];
  batchCode?: string;
  bottlesTarget?: number;
  createdAt: string;
  updatedAt: string;
}

export type ProjectStatus = 'active' | 'planning' | 'review' | 'completed';

export type ProjectCategory = 
  | 'Kitchen Ops'
  | 'Product R&D'
  | 'Sustainability'
  | 'Retail & Delivery'
  | 'Supply Chain';

export interface Project {
  id: string;
  name: string;
  code: string;
  tagline: string;
  category: ProjectCategory;
  status: ProjectStatus;
  progress: number; // 0 to 100
  targetDate: string;
  startDate: string;
  color: 'emerald' | 'amber' | 'orange' | 'lime' | 'rose' | 'teal';
  lead: Assignee;
  description: string;
  targetMetric: string;
  budgetAllocated: number;
  budgetSpent: number;
}

export interface JuiceProduct {
  id: string;
  name: string;
  tagline: string;
  category: 'Green Cleansers' | 'Citrus & Vitality' | 'Roots & Energy' | 'Wellness Elixirs' | 'Nut Milks';
  ingredients: string[];
  flavorProfile: string;
  bottlesToday: number;
  targetBottles: number;
  batchCode: string;
  batchStatus: 'Pressing' | 'Quality Check' | 'Bottled & Chilled' | 'Completed';
  shelfLife: string;
  price: number;
  accentColor: string;
}

export interface ChatSuggestedAction {
  id: string;
  label: string;
  actionType: 'create_tasks' | 'filter_priority' | 'view_project' | 'organize_work';
  tasksToCreate?: Partial<Task>[];
  filterValue?: string;
  projectId?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  suggestedActions?: ChatSuggestedAction[];
  isAiGenerating?: boolean;
}
