/**
 * Tiny helpers shared across specs.
 *
 * Right now this is the WDIO v9 replacement for the removed
 * `browser.waitForUrl(regex, options)` helper, plus scroll helpers
 * that smooth over the differences between touch-driven mobile Safari
 * and the Chrome-on-emulator path.
 */
import { browser, $ } from '@wdio/globals';

/**
 * Wait until the current browser URL matches the given regular
 * expression. Defaults to a 15-second timeout which matches the rest
 * of the suite's `waitForUrl` calls.
 *
 * WDIO v9 dropped the legacy `browser.waitForUrl` helper, so we wrap
 * `waitUntil` here.
 */
export async function waitForUrlMatches(
    regex: RegExp,
    timeoutMs = 15_000,
): Promise<void> {
    await browser.waitUntil(
        async () => regex.test(await browser.getUrl()),
        { timeout: timeoutMs, interval: 200 },
    );
}

/**
 * Wait until the document hash (route fragment) matches the given
 * pattern. Used by every page screen after navigation so we know the
 * hash router has actually swapped content.
 */
export async function waitForHashMatches(
    regex: RegExp,
    timeoutMs = 15_000,
): Promise<void> {
    await browser.waitUntil(
        async () => {
            const url = await browser.getUrl();
            const hash = url.includes('#') ? url.slice(url.indexOf('#')) : '';
            return regex.test(hash);
        },
        { timeout: timeoutMs, interval: 200 },
    );
}

/**
 * Scroll the given element into view inside the app's `#content`
 * scroll container. Falls back to a `scrollIntoView` call on the
 * element itself when the container is missing.
 */
export async function scrollIntoView(
    selector: string,
    containerSelector = '#content',
): Promise<void> {
    const elem = await $(selector);
    await elem.scrollIntoView({ block: 'center', behavior: 'smooth' as ScrollBehavior }).catch(async () => {
        // Some Appium 2 + Chrome combos ignore `behavior`; retry without it.
        await browser.execute(
            (s, c) => {
                const el = document.querySelector(s);
                const container = (c ? document.querySelector(c) : null) as HTMLElement | null;
                if (el && container) {
                    container.scrollTop = (el as HTMLElement).offsetTop - 80;
                } else if (el) {
                    (el as HTMLElement).scrollIntoView();
                }
            },
            selector,
            containerSelector,
        );
    });
}

/**
 * Press the keyboard Escape key. iOS Safari sometimes consumes it at
 * the WebKit layer; we wrap in a try/catch so tests can call
 * `await pressEscape()` blindly.
 */
export async function pressEscape(): Promise<void> {
    try {
        await browser.keys(['Escape']);
    } catch {
        // Best-effort: if the platform doesn't surface Escape, the
        // surrounding test should also assert the modal state directly.
    }
}

/**
 * Generate a fresh identifier suffix. Useful for keeping CR-created
 * entities unique between runs (the demo persists everything in
 * localStorage, so duplicates pile up otherwise).
 */
export function uniqueSuffix(): string {
    return `${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`;
}