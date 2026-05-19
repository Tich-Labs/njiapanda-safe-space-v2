import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const questions = [
  "Do you sometimes feel afraid in your own home?",
  "Do you feel like you have to hide parts of your life?",
  "Has anyone made you feel small, scared, or controlled?",
  "Do you feel safe talking about your feelings?",
  "Would you like to quietly explore what you're experiencing?"
];

const SelfCheck = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-border bg-card/95 px-4 py-3 backdrop-blur-md">
        <button onClick={() => navigate(-1)} className="min-h-[48px] min-w-[48px] flex items-center justify-center text-muted-foreground" aria-label="Go back">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="font-display text-lg font-semibold text-foreground">Gentle Self-Check</h1>
      </header>

      <main id="main-content" role="main" className="mx-auto max-w-lg px-4 py-6">
        <p className="mb-6 text-center text-sm text-muted-foreground">This is private. No answers are saved. Take your time and reflect quietly.</p>
        <ul className="space-y-4 mb-6">
          {questions.map((q, i) => (
            <li key={i} className="rounded-2xl border border-border bg-secondary px-4 py-4 text-base leading-7 text-foreground">{q}</li>
          ))}
        </ul>
        <p className="mb-6 text-center text-sm text-muted-foreground">If any of these feel true for you, know that you are not alone.</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => navigate('/')}
            className="rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90"
          >
            Explore your options
          </button>
          <button
            onClick={() => navigate('/hadithi')}
            className="rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-muted"
          >
            Read stories from others
          </button>
        </div>
      </main>
    </div>
  );
};

export default SelfCheck;
