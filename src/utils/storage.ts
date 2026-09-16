import { Task, Project, JuiceProduct, ChatMessage } from '../types';
import { INITIAL_TASKS, INITIAL_PROJECTS, INITIAL_JUICE_PRODUCTS } from '../data/initialData';

const TASKS_KEY = 'zest_press_tasks_v1';
const PROJECTS_KEY = 'zest_press_projects_v1';
const JUICES_KEY = 'zest_press_juices_v1';
const CHAT_KEY = 'zest_press_chat_v1';

export function loadTasks(): Task[] {
  try {
    const saved = localStorage.getItem(TASKS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load tasks from localStorage', e);
  }
  return INITIAL_TASKS;
}

export function saveTasks(tasks: Task[]) {
  try {
    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
  } catch (e) {
    console.error('Failed to save tasks', e);
  }
}

export function loadProjects(): Project[] {
  try {
    const saved = localStorage.getItem(PROJECTS_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load projects from localStorage', e);
  }
  return INITIAL_PROJECTS;
}

export function saveProjects(projects: Project[]) {
  try {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(projects));
  } catch (e) {
    console.error('Failed to save projects', e);
  }
}

export function loadJuiceProducts(): JuiceProduct[] {
  try {
    const saved = localStorage.getItem(JUICES_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load juices from localStorage', e);
  }
  return INITIAL_JUICE_PRODUCTS;
}

export function saveJuiceProducts(juices: JuiceProduct[]) {
  try {
    localStorage.setItem(JUICES_KEY, JSON.stringify(juices));
  } catch (e) {
    console.error('Failed to save juices', e);
  }
}

export function loadChatHistory(): ChatMessage[] {
  try {
    const saved = localStorage.getItem(CHAT_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Failed to load chat history', e);
  }
  return [
    {
      id: 'welcome-msg',
      sender: 'assistant',
      text: `Hello! I'm **ZestAI**, your Juice Shop operations assistant. 🌿

I can help you:
- **Organize tasks** for new seasonal juice launches, kitchen audits, or cleanse packages.
- **Prioritize work** by analyzing today's critical cold-chain tasks and produce intake.
- **Summarize progress** across all kitchen projects, bottling quotas, and waste reduction goals.

Try asking: *"What should the team prioritize this morning?"* or *"Plan tasks for a new dragonfruit cold-press recipe"*!`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    }
  ];
}

export function saveChatHistory(messages: ChatMessage[]) {
  try {
    localStorage.setItem(CHAT_KEY, JSON.stringify(messages.slice(-50)));
  } catch (e) {
    console.error('Failed to save chat history', e);
  }
}
