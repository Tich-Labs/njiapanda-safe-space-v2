import { describe, it, expect, beforeEach, vi } from "vitest";
import { addStory, getStories, incrementResonance } from "@/lib/localStories";
import type { LocalStory } from "@/lib/localStories";

const STORAGE_KEY = "hadithi_stories";

beforeEach(() => {
  localStorage.clear();
});

describe("addStory", () => {
  it("creates a story with id, created_at, and resonance_count", async () => {
    const id = await addStory({
      title: "Test Story",
      text: "Test content",
      language: "en",
      status: "pending",
      source: "user_submission",
      abuse_type: "physical",
      tags: ["test"],
    });

    expect(id).toBeTruthy();
    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY)!) as LocalStory[];
    expect(stored).toHaveLength(1);
    expect(stored[0].id).toBe(id);
    expect(stored[0].title).toBe("Test Story");
    expect(stored[0].resonance_count).toBe(0);
    expect(stored[0].created_at).toBeTruthy();
  });

  it("prepends new stories to the beginning", async () => {
    await addStory({ title: "First", text: "a", language: "en", status: "approved", source: "user_submission" });
    await addStory({ title: "Second", text: "b", language: "en", status: "approved", source: "user_submission" });

    const stories = JSON.parse(localStorage.getItem(STORAGE_KEY)!) as LocalStory[];
    expect(stories[0].title).toBe("Second");
    expect(stories[1].title).toBe("First");
  });
});

describe("getStories", () => {
  it("returns only stories matching the given status", async () => {
    await addStory({ title: "Approved", text: "a", language: "en", status: "approved", source: "user_submission" });
    await addStory({ title: "Pending", text: "b", language: "en", status: "pending", source: "user_submission" });
    await addStory({ title: "Rejected", text: "c", language: "en", status: "rejected", source: "user_submission" });

    const approved = getStories("approved");
    expect(approved).toHaveLength(1);
    expect(approved[0].title).toBe("Approved");

    const pending = getStories("pending");
    expect(pending).toHaveLength(1);
    expect(pending[0].title).toBe("Pending");
  });

  it("returns empty array when no stories stored", () => {
    expect(getStories()).toEqual([]);
  });

  it("sorts stories by created_at descending", async () => {
    vi.useFakeTimers();
    const date1 = new Date("2024-01-01");
    const date2 = new Date("2024-06-01");

    vi.setSystemTime(date1);
    await addStory({ title: "Old", text: "a", language: "en", status: "approved", source: "user_submission" });

    vi.setSystemTime(date2);
    await addStory({ title: "New", text: "b", language: "en", status: "approved", source: "user_submission" });

    vi.useRealTimers();

    const stories = getStories("approved");
    expect(stories[0].title).toBe("New");
    expect(stories[1].title).toBe("Old");
  });
});

describe("incrementResonance", () => {
  it("increments resonance_count by 1", async () => {
    const id = await addStory({
      title: "Resonate",
      text: "test",
      language: "en",
      status: "approved",
      source: "user_submission",
    });

    incrementResonance(id);
    const stories = getStories("approved");
    expect(stories[0].resonance_count).toBe(1);

    incrementResonance(id);
    const updated = getStories("approved");
    expect(updated[0].resonance_count).toBe(2);
  });

  it("does nothing for non-existent id", () => {
    expect(() => incrementResonance("nonexistent")).not.toThrow();
  });
});
