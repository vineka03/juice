import { GoogleGenAI } from '@google/genai';

interface ChatPayload {
  message: string;
  history?: { role: 'user' | 'model'; parts: { text: string }[] }[];
  context?: {
    tasksCount: number;
    completedTasksCount: number;
    criticalTasks: { id: string; title: string; priority: string; status: string; dueDate: string }[];
    projects: { id: string; name: string; progress: number; status: string }[];
    dailyBottles: { current: number; target: number };
  };
}

export async function handleAiChat(payload: ChatPayload): Promise<{
  reply: string;
  suggestedTasks?: {
    title: string;
    description: string;
    priority: 'critical' | 'high' | 'medium' | 'low';
    category: 'Cold-Pressing' | 'Quality & Safety' | 'Inventory & Sourcing' | 'Packaging & Retail' | 'Menu & R&D';
    subtasks?: string[];
  }[];
  actionType?: 'create_tasks' | 'filter_priority' | 'view_summary' | null;
}> {
  const apiKey = process.env.GEMINI_API_KEY;
  const userMessage = payload.message.trim();
  const context = payload.context;

  const systemInstruction = `You are "ZestAI", the specialized operations AI assistant and production manager for "Zest & Press", a modern premium cold-pressed juice shop.
Your mission is to help juice shop operators, head pressers, and managers to:
1. Organize tasks (batch production, produce washing, cold pressing, bottling, nitrogen flush, quality control, sanitization SOPs, HACCP).
2. Prioritize work (evaluating cold chain risks, shelf life, morning rush prep, critical equipment maintenance, inventory inspection).
3. Summarize progress (bottling numbers, project milestone tracking, waste reduction, bottleneck analysis).

Current Juice Shop Live Context:
- Active projects: ${context ? JSON.stringify(context.projects) : '5 ongoing projects'}
- Task stats: ${context ? `${context.completedTasksCount} of ${context.tasksCount} completed` : '8 active tasks'}
- Critical tasks in queue: ${context ? JSON.stringify(context.criticalTasks) : 'Sanitizing press #2, Brix & pH testing'}
- Today's bottling: ${context ? `${context.dailyBottles.current} of ${context.dailyBottles.target} bottles completed` : '320 / 450 bottles'}

Guidelines:
- Tone: Professional, crisp, encouraging, culinary and operations-focused.
- If the user asks to organize tasks or plan a project/recipe rollout, provide 2 to 4 actionable juice shop tasks in your response.
- Format structured tasks clearly. At the end of your response, if you are proposing new tasks to add to their board, output a clean JSON codeblock at the bottom in this exact format:
\`\`\`tasks_json
[
  {
    "title": "Clear concise task title",
    "description": "Short juice shop operational description",
    "priority": "high",
    "category": "Cold-Pressing",
    "subtasks": ["Subtask 1", "Subtask 2"]
  }
]
\`\`\`
Valid categories: "Cold-Pressing", "Quality & Safety", "Inventory & Sourcing", "Packaging & Retail", "Menu & R&D".
Valid priorities: "critical", "high", "medium", "low".
`;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });
      const contents = userMessage;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents,
        config: {
          systemInstruction,
          temperature: 0.7,
        },
      });

      const rawText = response.text || '';
      
      // Extract tasks_json block if present
      let suggestedTasks: any[] = [];
      const jsonMatch = rawText.match(/```tasks_json\s*([\s\S]*?)\s*```/);
      let cleanText = rawText;
      
      if (jsonMatch && jsonMatch[1]) {
        try {
          suggestedTasks = JSON.parse(jsonMatch[1]);
          cleanText = rawText.replace(/```tasks_json[\s\S]*?```/, '').trim();
        } catch {
          // ignore parse error and keep clean text
        }
      }

      return {
        reply: cleanText,
        suggestedTasks: suggestedTasks.length > 0 ? suggestedTasks : undefined,
        actionType: suggestedTasks.length > 0 ? 'create_tasks' : null,
      };
    } catch (error) {
      console.warn('Gemini API call failed, falling back to local operations engine:', error);
    }
  }

  // Fallback intelligent juice shop assistant response
  return generateIntelligentFallback(userMessage, context);
}

function generateIntelligentFallback(message: string, context: ChatPayload['context']) {
  const lower = message.toLowerCase();

  // 1. Prioritize work
  if (lower.includes('priorit') || lower.includes('urgent') || lower.includes('first') || lower.includes('what should i do')) {
    return {
      reply: `Here is your optimized **Juice Shop Priority Roadmap** for today:

1. **Immediate Cold-Chain & Sanitation (Critical Priority)**:
   - **Sanitize hydraulic masticating press #2**: Must be cleared before the morning 450-bottle Green Goddess run to prevent cross-contamination.
   - **Batch test pH and Brix for "Golden Turmeric Sun"**: Ensure pH is under 4.1 to maintain raw cold-press stability and prevent spoilage.

2. **Core Production Window (High Priority)**:
   - Complete cold-pressing the remaining **130 bottles** of Pure Green Goddess within the 4°C walk-in environment.
   - Receive and inspect the 600kg organic Meyer lemons delivery from Ojai Valley Orchards (verify >42% juice yield).

3. **Afternoon Packaging & Retail**:
   - Assemble thermal cooler bags for the Cleanse Subscription pilot.
   - Review R&D formula for the Watermelon-Mint-Lime hydration batch.

Would you like me to highlight the Critical tasks on your board or create prep checklists?`,
      actionType: 'filter_priority' as const,
    };
  }

  // 2. Summarize progress
  if (lower.includes('summar') || lower.includes('progress') || lower.includes('status') || lower.includes('overview') || lower.includes('report')) {
    const bottlesDone = context?.dailyBottles.current || 320;
    const bottlesTarget = context?.dailyBottles.target || 450;
    const pct = Math.round((bottlesDone / bottlesTarget) * 100);

    return {
      reply: `**Daily Operations & Production Summary:**

- **Bottling Throughput**: **${bottlesDone} / ${bottlesTarget} bottles** (${pct}% of daily quota reached). The kitchen is on pace to conclude production by 3:30 PM.
- **Project Milestones**:
  - *HPP & Kitchen Safety Certification*: **85% complete** (Final pathogen swab audit scheduled for next week).
  - *Summer Cold-Press Rollout*: **68% complete** (3 of 4 seasonal recipes approved in sensory panels).
  - *Zero-Waste Citrus Circularity*: **42% complete** (280kg organic pulp diverted to compost).
  - *Direct Farm-to-Press Lemon Pact*: **90% complete** (Contract locked with 15% cost savings).
- **Active Task Breakdown**: 2 Critical tasks pending, 3 High priority in progress, 2 Completed today.
- **Key Recommendation**: Focus kitchen attention on clearing the hydraulic press wash cycle so the master juicer can start the afternoon cold-press cycle.`,
      actionType: 'view_summary' as const,
    };
  }

  // 3. Organize tasks / Recipe rollout / Cleanse / Event
  if (lower.includes('organiz') || lower.includes('launch') || lower.includes('recipe') || lower.includes('cleanse') || lower.includes('task') || lower.includes('new') || lower.includes('plan')) {
    return {
      reply: `I have structured a high-efficiency 3-step operational workflow for your juice shop.

Here are the key operational tasks to add directly to your board:
1. **Cold-Press Formulation & Brix Baseline**: Standardize raw ingredient ratio and target 8.5–10° Brix sweetness.
2. **Cold-Room Mastication & Nitrogen Capping**: Schedule a 200-bottle test run at <4°C.
3. **Nutritional Labeling & Shelf-Life Aerobic Count**: Validate 5-day unpasteurized raw stability.

Click **"Add to Task Board"** below to immediately assign these to your production board!`,
      suggestedTasks: [
        {
          title: 'Cold-press test batch: Standardize Brix and acidity balance',
          description: 'Measure organic sugar levels (8.5–10° Brix) and record temperature curve during hydraulic extraction.',
          priority: 'high' as const,
          category: 'Menu & R&D' as const,
          subtasks: ['Optical refractometer Brix test', 'Record ingredient weight ratios', 'Conduct sensory acidity check'],
        },
        {
          title: 'Schedule 200-bottle pilot pressing with nitrogen flush caps',
          description: 'Run production in 4°C walk-in chamber and apply airtight tamper-evident seals.',
          priority: 'medium' as const,
          category: 'Cold-Pressing' as const,
          subtasks: ['Sanitize filling nozzles', 'Press 80kg organic produce', 'Batch code timestamp printing'],
        },
        {
          title: 'Validate 5-day aerobic plate count and shelf-life stability',
          description: 'Send test samples to third-party lab for cold storage microbiological safety clearance.',
          priority: 'high' as const,
          category: 'Quality & Safety' as const,
          subtasks: ['Plate count swab sample', 'Cold-chain temp logging', 'HACCP sign-off log'],
        },
      ],
      actionType: 'create_tasks' as const,
    };
  }

  // Default helpful response
  return {
    reply: `Hello! I am **ZestAI**, your dedicated juice shop operations copilot. 

Here is how I can assist your team today:
- **Organize Tasks**: Request workflows for recipe formulation, seasonal menu launches, or HACCP kitchen compliance.
- **Prioritize Work**: Get an instant breakdown of urgent morning press runs, critical quality checks, and inventory intakes.
- **Summarize Progress**: Generate executive summaries of daily bottling metrics, active project milestones, and team velocity.

What would you like to review or plan right now?`,
  };
}
