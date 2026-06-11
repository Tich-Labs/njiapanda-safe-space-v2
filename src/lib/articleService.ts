import type { LocalStory } from "./localStories";

const API_BASE = import.meta.env.VITE_ARTICLE_SOURCING_URL || "/api/sourced-stories";

export interface SourcedStory {
  id: string;
  title: string;
  summary: string;
  text: string;
  source_url: string;
  source_name: string;
  location: string;
  abuse_type: string;
  tags: string[];
  language: string;
  created_at: string;
  source: "sourced_story";
  source_type: "sourced_story";
  resonance_count: number;
}

function toLocalStory(story: SourcedStory): LocalStory {
  return {
    id: story.id,
    title: story.title,
    text: story.text,
    summary: story.summary,
    language: story.language || "en",
    status: "approved",
    source: "sourced_story",
    source_type: "sourced_story",
    source_url: story.source_url,
    source_name: story.source_name,
    location: story.location,
    abuse_type: story.abuse_type,
    tags: story.tags || [],
    resonance_count: story.resonance_count || 0,
    created_at: story.created_at,
  };
}

export async function fetchArticles(options?: {
  abuse_type?: string;
  location?: string;
  search?: string;
  limit?: number;
}): Promise<LocalStory[]> {
  const params = new URLSearchParams();
  if (options?.abuse_type) params.set("abuse_type", options.abuse_type);
  if (options?.location) params.set("location", options.location);
  if (options?.search) params.set("search", options.search);
  if (options?.limit) params.set("limit", String(options.limit));

  const url = `${API_BASE}/articles${params.toString() ? `?${params.toString()}` : ""}`;

  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch: ${res.statusText}`);
    const data: SourcedStory[] = await res.json();
    return data.map(toLocalStory);
  } catch (err) {
    console.error("storyService.fetchArticles error:", err);
    return [];
  }
}

export async function getArticleById(id: string): Promise<LocalStory | null> {
  try {
    const res = await fetch(`${API_BASE}/articles/${id}`);
    if (!res.ok) return null;
    const data: SourcedStory = await res.json();
    return toLocalStory(data);
  } catch (err) {
    console.error("storyService.getArticleById error:", err);
    return null;
  }
}

export async function triggerArticleSearch(params: {
  query?: string;
  abuse_type?: string;
  location?: string;
}): Promise<{ success: boolean; articles_count?: number; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/search-and-ingest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.detail || "Search failed" };
    }
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function ingestStoryUrl(params: {
  url: string;
  abuse_type?: string;
  location?: string;
}): Promise<{ success: boolean; story?: any; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/ingest-url`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.detail || "Ingest failed" };
    }
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}

export async function submitStory(params: {
  text: string;
  title?: string;
  abuse_type?: string;
  language?: string;
  tags?: string[];
}): Promise<{ success: boolean; story?: any; error?: string }> {
  try {
    const res = await fetch(`${API_BASE}/submit-story`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });
    if (!res.ok) {
      const err = await res.json();
      return { success: false, error: err.detail || "Story submission failed" };
    }
    return await res.json();
  } catch (err: any) {
    return { success: false, error: err.message };
  }
}
