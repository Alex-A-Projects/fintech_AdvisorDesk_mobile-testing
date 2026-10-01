/**
 * Bootstrap fixture — runs once before each `it()` block.
 *
 * Responsibilities:
 *   1. Navigate to the local AdvisorDesk URL.
 *   2. Wait for the demo's `App` global to be available (max 15s).
 *   3. Dismiss the onboarding modal if it's open ("Start fresh" button).
 *   4. Seed the demo with sample data via `App.loadSampleData()` so
 *      every spec starts from a populated, known state.
 *
 * Specs import `bootstrap` and call it from `beforeEach`:
 *
 *     beforeEach(async () => { await bootstrap(); });
 *
 * Re-seeding each test is deliberate: the demo persists state in
 * localStorage, so without a reset we'd accumulate stale rows and
 * break assertions like "store now contains one more client than
 * before".
 */
import { browser } from '@wdio/globals';
import { environment } from '../config/environments';

export async function bootstrap(): Promise<void> {
    // 1. Land on the demo. Using `url()` rather than a hash change so
    //    a fresh `window.App` is wired up on first paint.
    await browser.url(environment.baseUrl);

    // 2. Wait for the demo's `App` global to be available. The
    //    production demo exposes `App.loadSampleData()`; we treat its
    //    presence as "ready for testing".
    await browser.waitUntil(
        async () => {
            const ready = await browser.execute(() => {
                const w = window as unknown as { App?: { loadSampleData?: () => void } };
                return Boolean(w.App?.loadSampleData);
            });
            return ready === true;
        },
        { timeout: 15_000, interval: 250 },
    );

    // 3. Dismiss the welcome hero if it's still up. The demo's
    //    onboarding dialogs expose a "Start fresh" button by exact
    //    text; we click it programmatically (mobile Safari's
    //    pointer-events on hidden modals are flaky through Appium).
    await browser.execute(() => {
        const buttons = Array.from(document.querySelectorAll<HTMLButtonElement>('.modal button'));
        const startFresh = buttons.find((b) => b.textContent?.trim() === 'Start fresh');
        startFresh?.click();
    });

    // 4. Seed sample data and persist it. The demo's
    //    `App.loadSampleData` writes into the in-memory store; we
    //    trigger `store.save()` immediately so a subsequent
    //    `readStore()` can verify the seed.
    await browser.execute(() => {
        const w = window as unknown as {
            App?: {
                loadSampleData?: () => void;
                store?: { save?: () => void };
            };
        };
        w.App?.loadSampleData?.();
        w.App?.store?.save?.();
    });

    // Give the demo a beat to settle any post-load re-renders.
    await browser.pause(400);
}

/**
 * One-shot bootstrap for `before()` blocks that just need a loaded
 * demo (no per-test reset).
 */
export async function bootstrapOnce(): Promise<void> {
    await bootstrap();
}