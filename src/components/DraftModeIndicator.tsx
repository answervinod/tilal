import { draftMode } from 'next/headers';

/**
 * Tiny banner shown only when Next.js Draft Mode is on. Lets the editor
 * disable preview from anywhere on the site (the same path is hit by the
 * Presentation tool when toggling preview off).
 */
export async function DraftModeIndicator() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <div className="fixed bottom-4 inset-x-0 z-50 flex justify-center pointer-events-none">
      <div className="pointer-events-auto inline-flex items-center gap-3 bg-fg text-bg text-label px-4 py-2 shadow-lg">
        <span className="h-2 w-2 rounded-full bg-gold animate-pulse" />
        Preview mode
        <a href="/api/draft-mode/disable" className="underline underline-offset-4 hover:text-gold">
          Exit
        </a>
      </div>
    </div>
  );
}
