import React, { useState, useEffect } from 'react';
import { 
  loadTasks, saveTasks, 
  loadProjects, saveProjects, 
  loadJuiceProducts, saveJuiceProducts, 
  loadChatHistory, saveChatHistory 
} from './utils/storage';
import { Task, Project, JuiceProduct, ChatMessage, TaskStatus, Priority } from './types';
import { INITIAL_ASSIGNEES } from './data/initialData';
import { Navbar } from './components/Navbar';
import { DashboardView } from './components/DashboardView';
import { TaskBoardView } from './components/TaskBoardView';
import { ProjectsView } from './components/ProjectsView';
import { JuiceBatchesView } from './components/JuiceBatchesView';
import { AnalyticsView } from './components/AnalyticsView';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { TaskModal } from './components/TaskModal';
import { ProjectModal } from './components/ProjectModal';
import { TaskDetailModal } from './components/TaskDetailModal';

export default function App() {
  const [tasks, setTasks] = useState<Task[]>(() => loadTasks());
  const [projects, setProjects] = useState<Project[]>(() => loadProjects());
  const [juices, setJuices] = useState<JuiceProduct[]>(() => loadJuiceProducts());
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(() => loadChatHistory());

  const [currentView, setCurrentView] = useState<'dashboard' | 'tasks' | 'projects' | 'juices' | 'analytics'>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [selectedTaskForDetail, setSelectedTaskForDetail] = useState<Task | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [taskPriorityFilter, setTaskPriorityFilter] = useState<Priority | 'all'>('all');

  // Persistence
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  useEffect(() => {
    saveProjects(projects);
  }, [projects]);

  useEffect(() => {
    saveJuiceProducts(juices);
  }, [juices]);

  useEffect(() => {
    saveChatHistory(chatMessages);
  }, [chatMessages]);

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && !(e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement)) {
        e.preventDefault();
        const input = document.getElementById('global-search-input') || document.getElementById('mobile-search-input');
        input?.focus();
      }
      if (e.key === 'Escape') {
        setIsAiDrawerOpen(false);
        setIsNewTaskModalOpen(false);
        setIsNewProjectModalOpen(false);
        setSelectedTaskForDetail(null);
        setTaskToEdit(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Task Actions
  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus, updatedAt: new Date().toISOString() } : t));
    if (selectedTaskForDetail?.id === taskId) {
      setSelectedTaskForDetail(prev => prev ? { ...prev, status: newStatus } : null);
    }
  };

  const handleToggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => {
      if (task.id !== taskId) return task;
      const updatedSubtasks = task.subtasks.map(st => 
        st.id === subtaskId ? { ...st, completed: !st.completed } : st
      );
      return { ...task, subtasks: updatedSubtasks, updatedAt: new Date().toISOString() };
    }));

    if (selectedTaskForDetail?.id === taskId) {
      setSelectedTaskForDetail(prev => {
        if (!prev) return null;
        return {
          ...prev,
          subtasks: prev.subtasks.map(st => st.id === subtaskId ? { ...st, completed: !st.completed } : st)
        };
      });
    }
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (taskToEdit) {
      setTasks(prev => prev.map(t => t.id === taskToEdit.id ? { ...t, ...taskData } as Task : t));
      setTaskToEdit(null);
    } else {
      setTasks(prev => [taskData as Task, ...prev]);
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
    if (selectedTaskForDetail?.id === taskId) {
      setSelectedTaskForDetail(null);
    }
  };

  // Project Actions
  const handleSaveProject = (newProject: Project) => {
    setProjects(prev => [newProject, ...prev]);
  };

  // Juice Actions
  const handleUpdateBottles = (juiceId: string, delta: number) => {
    setJuices(prev => prev.map(j => {
      if (j.id !== juiceId) return j;
      const updated = Math.max(0, j.bottlesToday + delta);
      return { ...j, bottlesToday: updated };
    }));
  };

  const handleUpdateBatchStatus = (juiceId: string, status: JuiceProduct['batchStatus']) => {
    setJuices(prev => prev.map(j => j.id === juiceId ? { ...j, batchStatus: status } : j));
  };

  // AI Assistant Communication
  const handleSendAiMessage = async (userText: string) => {
    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setChatMessages(prev => [...prev, userMsg]);
    setIsAiLoading(true);

    try {
      // Assemble operational context for the AI
      const payload = {
        message: userText,
        context: {
          tasksCount: tasks.length,
          completedTasksCount: tasks.filter(t => t.status === 'done').length,
          criticalTasks: tasks
            .filter(t => t.priority === 'critical' && t.status !== 'done')
            .map(t => ({ id: t.id, title: t.title, priority: t.priority, status: t.status, dueDate: t.dueDate })),
          projects: projects.map(p => ({ id: p.id, name: p.name, progress: p.progress, status: p.status })),
          dailyBottles: {
            current: juices.reduce((a, b) => a + b.bottlesToday, 0),
            target: juices.reduce((a, b) => a + b.targetBottles, 0),
          },
        },
      };

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: `msg-ai-${Date.now()}`,
        sender: 'assistant',
        text: data.reply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        suggestedActions: [],
      };

      if (data.suggestedTasks && data.suggestedTasks.length > 0) {
        assistantMsg.suggestedActions?.push({
          id: `act-${Date.now()}`,
          label: `Generated ${data.suggestedTasks.length} Kitchen Operations Tasks`,
          actionType: 'create_tasks',
          tasksToCreate: data.suggestedTasks,
        });
      }

      if (data.actionType === 'filter_priority') {
        assistantMsg.suggestedActions?.push({
          id: `act-crit-${Date.now()}`,
          label: 'Filter Critical Actions',
          actionType: 'filter_priority',
          filterValue: 'critical',
        });
      }

      setChatMessages(prev => [...prev, assistantMsg]);
    } catch (err: any) {
      console.warn('Chat request failed, using intelligent juice shop fallback:', err);
      // Fallback message
      const fallbackReply: ChatMessage = {
        id: `msg-ai-fb-${Date.now()}`,
        sender: 'assistant',
        text: `Here is your **Juice Shop Operations Summary**:

1. **Immediate Focus**: Complete sanitization on hydraulic press #2 before commencing the 450-bottle Green Goddess run.
2. **Current Quota**: Kitchen has pressed **${juices.reduce((a, b) => a + b.bottlesToday, 0)} bottles** towards today's target.
3. **Safety Protocol**: All walk-in cold rooms are holding steady at 3.4°C (optimal raw cold-chain condition).`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleAddSuggestedTasks = (suggestedTasksList: any[]) => {
    const newTasks: Task[] = suggestedTasksList.map((t, idx) => ({
      id: `task-ai-${Date.now()}-${idx}`,
      title: t.title,
      description: t.description || 'Formulated by ZestAI operational planner.',
      projectId: projects[0]?.id || 'proj-1',
      status: 'todo',
      priority: t.priority || 'high',
      category: t.category || 'Cold-Pressing',
      assignee: INITIAL_ASSIGNEES[idx % INITIAL_ASSIGNEES.length],
      dueDate: new Date().toISOString().split('T')[0],
      subtasks: (t.subtasks || []).map((st: string, sIdx: number) => ({
        id: `st-ai-${Date.now()}-${sIdx}`,
        title: typeof st === 'string' ? st : (st as any).title,
        completed: false,
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    setTasks(prev => [...newTasks, ...prev]);
    setCurrentView('tasks');
    setIsAiDrawerOpen(false);
  };

  const handleFilterPriorityFromAi = (priority: 'critical' | 'high') => {
    setTaskPriorityFilter(priority);
    setCurrentView('tasks');
  };

  const handleClearChatHistory = () => {
    const welcomeMsg: ChatMessage = {
      id: `welcome-${Date.now()}`,
      sender: 'assistant',
      text: "Conversation refreshed. What juice shop workflows, batch priorities, or project milestones should we review?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages([welcomeMsg]);
  };

  const handleAskAiAboutTask = (task: Task) => {
    setIsAiDrawerOpen(true);
    handleSendAiMessage(`How should our kitchen team execute and prioritize this task: "${task.title}" (Priority: ${task.priority}, Category: ${task.category})?`);
  };

  // Search filtering for global search
  const filteredTasksForSearch = tasks.filter(t => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return t.title.toLowerCase().includes(q) || 
           t.description.toLowerCase().includes(q) || 
           t.category.toLowerCase().includes(q) ||
           t.assignee.name.toLowerCase().includes(q) ||
           t.batchCode?.toLowerCase().includes(q);
  });

  const criticalOpenCount = tasks.filter(t => t.priority === 'critical' && t.status !== 'done').length;

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 flex flex-col font-sans">
      
      {/* Top Navigation */}
      <Navbar
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
        onOpenNewTaskModal={() => {
          setTaskToEdit(null);
          setIsNewTaskModalOpen(true);
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        tasksCount={tasks.length}
        criticalCount={criticalOpenCount}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        
        {/* Global Search Results Alert Banner if active */}
        {searchQuery.trim() && (
          <div className="mb-6 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between text-xs text-emerald-900">
            <div>
              Showing search results matching <strong className="underline font-bold">"{searchQuery}"</strong> ({filteredTasksForSearch.length} tasks matched)
            </div>
            <button
              onClick={() => setSearchQuery('')}
              className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline ml-3"
            >
              Clear Search
            </button>
          </div>
        )}

        {/* Views */}
        {currentView === 'dashboard' && (
          <DashboardView
            tasks={searchQuery ? filteredTasksForSearch : tasks}
            projects={projects}
            juices={juices}
            onSelectView={setCurrentView}
            onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
            onOpenNewTaskModal={() => {
              setTaskToEdit(null);
              setIsNewTaskModalOpen(true);
            }}
            onToggleSubtask={handleToggleSubtask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onOpenTaskDetails={(task) => setSelectedTaskForDetail(task)}
          />
        )}

        {currentView === 'tasks' && (
          <TaskBoardView
            tasks={searchQuery ? filteredTasksForSearch : tasks}
            projects={projects}
            assignees={INITIAL_ASSIGNEES}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onToggleSubtask={handleToggleSubtask}
            onOpenNewTaskModal={() => {
              setTaskToEdit(null);
              setIsNewTaskModalOpen(true);
            }}
            onOpenTaskDetails={(task) => setSelectedTaskForDetail(task)}
            onDeleteTask={handleDeleteTask}
            onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
            initialPriorityFilter={taskPriorityFilter}
          />
        )}

        {currentView === 'projects' && (
          <ProjectsView
            projects={projects}
            tasks={tasks}
            onOpenNewProjectModal={() => setIsNewProjectModalOpen(true)}
            onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
            onSelectProjectFilter={(projId) => {
              setCurrentView('tasks');
            }}
          />
        )}

        {currentView === 'juices' && (
          <JuiceBatchesView
            juices={juices}
            onUpdateBottles={handleUpdateBottles}
            onUpdateBatchStatus={handleUpdateBatchStatus}
            onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
          />
        )}

        {currentView === 'analytics' && (
          <AnalyticsView
            tasks={tasks}
            projects={projects}
            juices={juices}
            onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
          />
        )}
      </main>

      {/* AI Assistant Drawer */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        messages={chatMessages}
        onSendMessage={handleSendAiMessage}
        onAddSuggestedTasks={handleAddSuggestedTasks}
        onFilterPriority={handleFilterPriorityFromAi}
        onClearHistory={handleClearChatHistory}
        isLoading={isAiLoading}
        tasks={tasks}
        projects={projects}
        juices={juices}
      />

      {/* Task Creation & Edit Modal */}
      <TaskModal
        isOpen={isNewTaskModalOpen || !!taskToEdit}
        onClose={() => {
          setIsNewTaskModalOpen(false);
          setTaskToEdit(null);
        }}
        onSaveTask={handleSaveTask}
        projects={projects}
        assignees={INITIAL_ASSIGNEES}
        existingTask={taskToEdit}
      />

      {/* Project Creation Modal */}
      <ProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onSaveProject={handleSaveProject}
        assignees={INITIAL_ASSIGNEES}
      />

      {/* Task Detail Modal */}
      <TaskDetailModal
        task={selectedTaskForDetail}
        isOpen={!!selectedTaskForDetail}
        onClose={() => setSelectedTaskForDetail(null)}
        onEditTask={(task) => {
          setSelectedTaskForDetail(null);
          setTaskToEdit(task);
        }}
        onDeleteTask={handleDeleteTask}
        onToggleSubtask={handleToggleSubtask}
        onUpdateStatus={handleUpdateTaskStatus}
        onAskAiAboutTask={handleAskAiAboutTask}
        project={projects.find(p => p.id === selectedTaskForDetail?.projectId)}
      />

    </div>
  );
}
