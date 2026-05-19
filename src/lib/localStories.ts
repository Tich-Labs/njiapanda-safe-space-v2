// Simple local storage for stories - no backend needed
// Uses localStorage for demo, replace with Firebase in production
// Sourced articles are stored in MongoDB via MCP (see lib/mcpClient.ts)

export interface LocalStory {
  id: string;
  text: string;
  title: string;
  language: string;
  status: string;
  source: string; // "hadithi_ai" | "user_submission" | "sourced_article"
  abuse_type?: string;
  tags?: string[];
  resonance_count: number;
  created_at: string;
  // Sourced article fields
  source_type?: string;       // "sourced_article" for differentiation
  source_url?: string;        // Original article URL
  source_name?: string;       // Publication name e.g. "The Standard"
  location?: string;          // e.g. "Nairobi, Kenya"
  summary?: string;           // Short summary for card preview
}

const STORAGE_KEY = "hadithi_stories";

export const addStory = async (story: Omit<LocalStory, "id" | "created_at" | "resonance_count">): Promise<string> => {
  const stories = getStories();
  const newStory: LocalStory = {
    ...story,
    id: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    resonance_count: 0,
  };
  stories.unshift(newStory);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  return newStory.id;
};

export const getStories = (status = "approved"): LocalStory[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  const stories: LocalStory[] = JSON.parse(data);
  return stories.filter(s => s.status === status).sort((a, b) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );
};

export const incrementResonance = (storyId: string): void => {
  const stories = getStories();
  const idx = stories.findIndex(s => s.id === storyId);
  if (idx >= 0) {
    stories[idx].resonance_count = (stories[idx].resonance_count || 0) + 1;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(stories));
  }
};

// Add some demo stories
const initDemoStories = () => {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    const demoStories: LocalStory[] = [
      {
        id: "demo-1",
        text: "Wanjiku sat by the window of her small apartment in Nairobi's Eastlands, watching the morning light filter through the curtains. She had learned to find peace in these quiet moments before the world woke up. Her phone buzzed — another message from him, asking where she was. She silenced it and poured herself a cup of tea, a small act of defiance that had taken her months to achieve.\n\nIn the market, she encountered her friend Amara who noticed the change in her. 'You seem lighter,' Amara said. Wanjiku smiled, a real smile that reached her eyes. 'I'm learning that my voice matters,' she replied. This was her journey — not of escape, but of finding her own strength one small moment at a time.\n\n⚠️ This story is fictional and created for awareness purposes only.",
        title: "Wanjiku's Morning",
        language: "English",
        status: "approved",
        source: "hadithi_ai",
        abuse_type: "Emotional",
        tags: ["ai-story", "emotional"],
        resonance_count: 12,
        created_at: "2026-03-01T10:00:00Z"
      },
      {
        id: "demo-2",
        text: "Fatuma had worked at the market for fifteen years, her small stall a beacon of independence. When her husband lost his job, the dynamic shifted. He began controlling her earnings, demanding she hand over every shilling. 'A good wife supports her husband,' he would say.\n\nOne day, Fatuma made a decision. She opened a second savings account at a different bank, keeping a small amount from each day's sales. When her husband discovered it, she was ready. 'This is my legacy for my children,' she said. The road ahead was uncertain, but she had taken the first step toward financial freedom.\n\n⚠️ This story is fictional and created for awareness purposes only.",
        title: "Fatuma's Stand",
        language: "English",
        status: "approved",
        source: "hadithi_ai",
        abuse_type: "Economic",
        tags: ["ai-story", "economic"],
        resonance_count: 8,
        created_at: "2026-03-05T14:30:00Z"
      }
    ];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(demoStories));
  }
};

initDemoStories();