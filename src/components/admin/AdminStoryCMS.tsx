import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ingestStoryUrl } from "@/lib/articleService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PenLine } from "lucide-react";
import { toast } from "sonner";

const ABUSE_TYPES = [
  "Physical",
  "Emotional",
  "Sexual",
  "Financial",
  "Digital",
  "Neglect",
  "Coercive Control",
];

const LANGUAGES = ["English", "Swahili"];

export default function AdminStoryCMS() {
  const [saving, setSaving] = useState(false);
  const [urlInput, setUrlInput] = useState("");
  const [ingestingUrl, setIngestingUrl] = useState(false);
  const [form, setForm] = useState({
    title: "",
    text: "",
    swahili_text: "",
    abuse_type: "",
    language: "English",
    message: "",
    tags: "",
    status: "approved",
  });

  const update = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleIngestUrl = async () => {
    const url = urlInput.trim();
    if (!url) {
      toast.error("Please enter a verified story URL to ingest");
      return;
    }
    setIngestingUrl(true);
    toast.info("Fetching and ingesting verified story...");
    try {
      const result = await ingestStoryUrl({ url });
      if (result.success) {
        toast.success("Story ingested successfully");
        setUrlInput("");
      } else {
        toast.error(result.error || "Failed to ingest story URL");
      }
    } catch (err: any) {
      toast.error(err?.message || "Failed to ingest story URL");
    } finally {
      setIngestingUrl(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.text.trim()) {
      toast.error("Title and story text are required");
      return;
    }
    setSaving(true);
    const tags = form.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    const { error } = await supabase.from("stories").insert({
      title: form.title.trim(),
      text: form.text.trim(),
      swahili_text: form.swahili_text.trim() || null,
      abuse_type: form.abuse_type || null,
      language: form.language,
      message: form.message.trim() || null,
      tags: tags.length > 0 ? tags : null,
      status: form.status,
      source: "cms",
    });

    setSaving(false);
    if (error) {
      toast.error("Failed to create story", { description: error.message });
    } else {
      toast.success("Story created successfully");
      setForm({
        title: "",
        text: "",
        swahili_text: "",
        abuse_type: "",
        language: "English",
        message: "",
        tags: "",
        status: "approved",
      });
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-display text-2xl font-semibold text-foreground">Create Story</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Add new stories to the library. Stories marked "approved" will be visible immediately.
            </p>
          </div>
        </div>

        <Card className="bg-surface border border-border p-4">
          <div className="mb-3">
            <h3 className="text-base font-semibold text-foreground">Manual URL ingestion</h3>
            <p className="text-sm text-muted-foreground">
              Paste a verified story URL to ingest a single story using AI extraction.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder="https://example.org/survivor-story"
            />
            <Button onClick={handleIngestUrl} disabled={ingestingUrl} className="min-w-[12rem]">
              {ingestingUrl ? "Ingesting…" : "Ingest URL"}
            </Button>
          </div>
        </Card>
      </div>

      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 font-display text-lg">
            <PenLine className="h-5 w-5 text-primary" />
            New Story
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={form.title}
                onChange={(e) => update("title", e.target.value)}
                placeholder="e.g. 'When love means silence'"
                maxLength={200}
              />
            </div>

            <div>
              <Label htmlFor="text">Story Text (English) *</Label>
              <Textarea
                id="text"
                value={form.text}
                onChange={(e) => update("text", e.target.value)}
                rows={6}
                placeholder="The survivor's story in English…"
                className="font-serif"
              />
            </div>

            <div>
              <Label htmlFor="swahili">Swahili Translation</Label>
              <Textarea
                id="swahili"
                value={form.swahili_text}
                onChange={(e) => update("swahili_text", e.target.value)}
                rows={6}
                placeholder="Tafsiri ya Kiswahili…"
                className="font-serif"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Abuse Type</Label>
                <Select value={form.abuse_type} onValueChange={(v) => update("abuse_type", v)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type…" />
                  </SelectTrigger>
                  <SelectContent>
                    {ABUSE_TYPES.map((t) => (
                      <SelectItem key={t} value={t}>
                        {t}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Language</Label>
                <Select value={form.language} onValueChange={(v) => update("language", v)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {LANGUAGES.map((l) => (
                      <SelectItem key={l} value={l}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="message">Educational Message</Label>
              <Textarea
                id="message"
                value={form.message}
                onChange={(e) => update("message", e.target.value)}
                rows={2}
                placeholder="What should readers take away from this story?"
              />
            </div>

            <div>
              <Label htmlFor="tags">Tags (comma-separated)</Label>
              <Input
                id="tags"
                value={form.tags}
                onChange={(e) => update("tags", e.target.value)}
                placeholder="e.g. isolation, financial control, gaslighting"
              />
            </div>

            <div>
              <Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => update("status", v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="approved">Approved (publish now)</SelectItem>
                  <SelectItem value="pending">Pending (needs review)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" disabled={saving} className="w-full">
              {saving ? "Creating…" : "Create Story"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
