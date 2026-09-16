import React, { useState, useRef, useEffect } from 'react';
import { 
  X, 
  Sparkles, 
  Send, 
  Bot, 
  User, 
  Plus, 
  Check, 
  Flame, 
  ListOrdered, 
  Layers, 
  TrendingUp,
  RotateCcw
} from 'lucide-react';
import { ChatMessage, Task, Project, JuiceProduct } from '../types';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  messages: ChatMessage[];
  onSendMessage: (text: string) => Promise<void>;
  onAddSuggestedTasks: (suggestedTasks: any[]) => void;
  onFilterPriority: (priority: 'critical' | 'high') => void;
  onClearHistory: () => void;
  isLoading: boolean;
  tasks: Task[];
  projects: Project[];
  juices: JuiceProduct[];
}

const QUICK_PROMPTS = [
  { label: 'Prioritize today\'s pressing', prompt: 'What should the kitchen team prioritize this morning based on our tasks?' },
  { label: 'Summarize overall progress', prompt: 'Summarize our progress across all projects and today\'s production targets.' },
  { label: 'Organize tasks for new juice', prompt: 'Organize tasks for formulating and launching a new Cold-Pressed Watermelon Mint juice SKU.' },
  { label: 'Audit kitchen safety & HACCP', prompt: 'Review our critical hygiene and temperature control tasks for today.' },
];

export const AiAssistantDrawer: React.FC<AiAssistantDrawerProps> = ({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  onAddSuggestedTasks,
  onFilterPriority,
  onClearHistory,
  isLoading,
}) => {
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isLoading) return;
    const text = inputText;
    setInputText('');
    onSendMessage(text);
  };

  const handlePromptClick = (prompt: string) => {
    if (isLoading) return;
    onSendMessage(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/40 backdrop-blur-xs flex justify-end">
      <div 
        id="ai-assistant-drawer"
        className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col border-l border-stone-200 animate-in slide-in-from-right duration-200"
      >
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-stone-200 bg-gradient-to-r from-emerald-800 to-teal-800 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-amber-300 border border-white/20">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-heading font-bold text-sm tracking-tight text-white">
                  ZestAI Operations Copilot
                </h2>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded bg-emerald-700/80 text-emerald-200 border border-emerald-500/40">
                  Gemini
                </span>
              </div>
              <p className="text-[11px] text-emerald-100/80">Organize tasks • Prioritize work • Progress summaries</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              id="clear-chat-btn"
              onClick={onClearHistory}
              title="Reset conversation"
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            <button
              id="close-ai-drawer-btn"
              onClick={onClose}
              className="p-1.5 rounded-lg text-emerald-200 hover:text-white hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Suggested Quick Prompts */}
        <div className="p-3 bg-stone-50 border-b border-stone-200 shrink-0">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 mb-2">
            Suggested Actions
          </p>
          <div className="flex flex-wrap gap-1.5">
            {QUICK_PROMPTS.map((qp, idx) => (
              <button
                key={idx}
                id={`ai-quick-prompt-${idx}`}
                onClick={() => handlePromptClick(qp.prompt)}
                disabled={isLoading}
                className="text-xs px-2.5 py-1 rounded-md bg-white hover:bg-emerald-50 text-stone-700 hover:text-emerald-800 border border-stone-200/90 shadow-2xs font-medium transition-colors text-left truncate max-w-full disabled:opacity-50"
              >
                {qp.label}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Messages Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              {msg.sender === 'assistant' && (
                <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div className={`max-w-[85%] space-y-2 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                <div
                  className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-emerald-600 text-white rounded-br-xs shadow-xs'
                      : 'bg-white text-stone-800 rounded-bl-xs border border-stone-200/90 shadow-xs'
                  }`}
                >
                  <div className="whitespace-pre-wrap space-y-1">
                    {msg.text}
                  </div>

                  <span className={`block text-[10px] mt-1.5 ${msg.sender === 'user' ? 'text-emerald-200' : 'text-stone-400'} text-right`}>
                    {msg.timestamp}
                  </span>
                </div>

                {/* Suggested Actions attached to message */}
                {msg.suggestedActions && msg.suggestedActions.length > 0 && (
                  <div className="space-y-2 pt-1">
                    {msg.suggestedActions.map((action) => (
                      <div key={action.id} className="p-3 bg-white rounded-xl border border-emerald-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="font-semibold text-xs text-emerald-900 flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                            {action.label}
                          </span>
                        </div>

                        {action.tasksToCreate && action.tasksToCreate.length > 0 && (
                          <div className="space-y-1.5">
                            {action.tasksToCreate.map((t, idx) => (
                              <div key={idx} className="p-2 rounded bg-stone-50 border border-stone-100 text-xs">
                                <div className="font-semibold text-stone-800">{t.title}</div>
                                <div className="text-[11px] text-stone-500 line-clamp-1">{t.description}</div>
                              </div>
                            ))}

                            <button
                              id={`add-tasks-from-ai-${action.id}`}
                              onClick={() => onAddSuggestedTasks(action.tasksToCreate || [])}
                              className="w-full mt-1.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-xs active:scale-95"
                            >
                              <Plus className="w-3.5 h-3.5" />
                              <span>Add {action.tasksToCreate.length} Tasks to Board</span>
                            </button>
                          </div>
                        )}

                        {action.actionType === 'filter_priority' && (
                          <button
                            id="filter-critical-from-ai-btn"
                            onClick={() => {
                              onFilterPriority('critical');
                              onClose();
                            }}
                            className="w-full py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <Flame className="w-3.5 h-3.5 text-rose-600" />
                            <span>View Critical Tasks on Board</span>
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {msg.sender === 'user' && (
                <div className="w-7 h-7 rounded-lg bg-stone-800 text-white flex items-center justify-center shrink-0 shadow-2xs">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          ))}

          {/* Loading indicator */}
          {isLoading && (
            <div className="flex gap-3 justify-start">
              <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0 animate-pulse">
                <Bot className="w-4 h-4" />
              </div>
              <div className="p-3 bg-white rounded-2xl rounded-bl-xs border border-stone-200 text-xs text-stone-500 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600 animate-spin" />
                <span>ZestAI is analyzing shop operations & tasks...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-stone-200 bg-white shrink-0">
          <div className="flex items-center gap-2">
            <input
              id="ai-assistant-input"
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask ZestAI to organize tasks, prioritize, or summarize..."
              disabled={isLoading}
              className="flex-1 bg-stone-100 focus:bg-white text-stone-900 text-xs sm:text-sm rounded-xl px-3.5 py-2.5 border border-stone-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 focus:outline-none transition-all disabled:opacity-50"
            />
            <button
              id="send-ai-message-btn"
              type="submit"
              disabled={!inputText.trim() || isLoading}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:bg-stone-200 text-white disabled:text-stone-400 transition-all shrink-0 active:scale-95 shadow-sm"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
          <p className="text-[10px] text-stone-400 text-center mt-1.5">
            ZestAI is grounded in your live juice shop data, kitchen priorities, and production quotas.
          </p>
        </form>

      </div>
    </div>
  );
};
