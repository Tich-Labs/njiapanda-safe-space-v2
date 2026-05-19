const PrivacyBanner = () => {
  return (
    <div className="fixed bottom-24 left-0 right-0 z-40 px-4 sm:px-6" role="status" aria-live="polite">
      <div className="mx-auto max-w-xl rounded-full border border-border bg-background/95 px-3 py-2 text-center text-sm text-foreground shadow-sm backdrop-blur-sm">
        Anonymous by default. You can leave anytime.
      </div>
    </div>
  );
};

export default PrivacyBanner;
