import { describe, it, expect, beforeEach, vi } from "vitest";
import { fetchArticles, triggerArticleSearch, ingestStoryUrl, submitStory } from "@/lib/articleService";

beforeEach(() => {
  vi.restoreAllMocks();
});

describe("fetchArticles", () => {
  it("returns empty array on network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));

    const result = await fetchArticles();
    expect(result).toEqual([]);
  });

  it("returns empty array on non-ok response", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(new Response(null, { status: 500, statusText: "Server Error" }));

    const result = await fetchArticles();
    expect(result).toEqual([]);
  });

  it("passes query params correctly", async () => {
    const mockData: any[] = [
      {
        id: "1",
        title: "Test",
        summary: "Summary",
        text: "Full text",
        source_url: "https://example.com",
        source_name: "Example",
        location: "Nairobi",
        abuse_type: "physical",
        tags: ["gbv"],
        language: "en",
        created_at: "2024-01-01T00:00:00Z",
        source: "sourced_story",
        source_type: "sourced_story",
        resonance_count: 5,
      },
    ];

    const fetchSpy = vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify(mockData), { status: 200, headers: { "Content-Type": "application/json" } })
    );

    await fetchArticles({ abuse_type: "physical", location: "Nairobi", limit: 10 });

    const calledUrl = fetchSpy.mock.calls[0][0] as string;
    expect(calledUrl).toContain("abuse_type=physical");
    expect(calledUrl).toContain("location=Nairobi");
    expect(calledUrl).toContain("limit=10");
  });
});

describe("triggerArticleSearch", () => {
  it("returns success response on ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ success: true, articles_count: 3 }), { status: 200 })
    );

    const result = await triggerArticleSearch({ query: "GBV Kenya" });
    expect(result.success).toBe(true);
    expect(result.articles_count).toBe(3);
  });

  it("returns error detail on non-ok", async () => {
    vi.spyOn(globalThis, "fetch").mockResolvedValue(
      new Response(JSON.stringify({ detail: "API quota exceeded" }), { status: 429 })
    );

    const result = await triggerArticleSearch({ query: "test" });
    expect(result.success).toBe(false);
    expect(result.error).toBe("API quota exceeded");
  });

  it("returns error message on network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));

    const result = await triggerArticleSearch({ query: "test" });
    expect(result.success).toBe(false);
    expect(result.error).toBe("Network error");
  });
});

describe("ingestStoryUrl", () => {
  it("returns error message on network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));

    const result = await ingestStoryUrl({ url: "https://example.com" });
    expect(result.success).toBe(false);
    expect(result.error).toBe("Network error");
  });
});

describe("submitStory", () => {
  it("returns error message on network failure", async () => {
    vi.spyOn(globalThis, "fetch").mockRejectedValue(new Error("Network error"));

    const result = await submitStory({ text: "Story content" });
    expect(result.success).toBe(false);
    expect(result.error).toBe("Network error");
  });
});
