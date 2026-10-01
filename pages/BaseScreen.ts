/**
 * BaseScreen — every Screen Object in this project shares these
 * helpers.
 *
 * AdvisorDesk's mobile web renders the same HTML as the desktop site,
 * just viewport-scaled. The hash router uses `#/{pageName}` URLs and
 * the global store lives in `localStorage` under key
 * `bizdash_financial-advisors-demo`.
 *
 * Subclasses expose a typed `goto()` (e.g. `DashboardScreen.goto()`)
 * that:
 *   - calls `openPage(name)` to drive the hash route
 *   - waits for the route fragment to match
 *   - waits for the page's primary `#content` element to render
 */
import { browser, $ } from '@wdio/globals';
import { environment } from '../config/environments';
import type { PageName, AppStore } from '../types';
import { waitForHashMatches, waitForUrlMatches } from '../utils/helpers';

export abstract class BaseScreen {
    /** Canonical local AdvisorDesk URL — same source as the desktop demo. */
    static readonly BASE_URL = environment.baseUrl;

    /** Maximum retries when navigating to a route. */
    static readonly MAX_NAV_RETRIES = 3;

    constructor() {
        // No-op; subclasses may override goto().
    }

    /**
     * Navigate to the supplied route name. The demo's hash router
     * updates `window.location.hash`; we set it explicitly so the
     * `hashchange` listener runs even on a fresh load.
     */
    async openPage(name: PageName): Promise<void> {
        for (let attempt = 0; attempt < BaseScreen.MAX_NAV_RETRIES; attempt++) {
            try {
                await browser.execute(
                    (route) => {
                        const target = `#/${route}`;
                        if (window.location.hash !== target) {
                            window.location.hash = target;
                        }
                    },
                    name,
                );
                break;
            } catch {
                await browser.pause(500);
            }
        }
        await waitForHashMatches(new RegExp(`#/${name}(?:$|[/?])`));
        await this.waitForContent();
    }

    /**
     * Wait until the current browser URL matches a regular expression.
     * Used by tests that check that a flow landed on the expected
     * page (e.g. after creating an entity).
     */
    async waitForUrlMatches(regex: RegExp, timeoutMs = 15_000): Promise<void> {
        await waitForUrlMatches(regex, timeoutMs);
    }

    /** Wait for the dynamic `#content` element where the page renders. */
    async waitForContent(): Promise<void> {
        await $('#content').waitForDisplayed({ timeout: 15_000 });
    }

    /** Open the demo at its base URL. */
    async openHome(): Promise<void> {
        await browser.url(BaseScreen.BASE_URL);
        await waitForUrlMatches(/demo\.html/);
        await this.waitForContent();
    }

    /** Read the demo's `localStorage` snapshot via the typed store API. */
    async readStore(): Promise<AppStore | null> {
        return browser.execute(() => {
            const raw = localStorage.getItem('bizdash_financial-advisors-demo');
            if (!raw) return null;
            try {
                return JSON.parse(raw);
            } catch {
                return null;
            }
        }) as Promise<AppStore | null>;
    }

    /** True when the demo's content area is currently displayed. */
    async isLoaded(): Promise<boolean> {
        return $('#content').isDisplayed().catch(() => false);
    }

    /** Page-specific invariants. Subclasses override to assert loaded. */
    abstract assertLoaded(): Promise<void>;
}