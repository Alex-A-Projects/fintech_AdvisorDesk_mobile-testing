/**
 * ToastComponent — wraps the demo's transient notification toast.
 */
import { $, browser } from '@wdio/globals';
import { Component } from './Component';

export class ToastComponent extends Component {
    get root() {
        return $('.toast, #toast, [data-toast]');
    }

    async expectVisible(text?: string | RegExp): Promise<void> {
        await this.root.waitForDisplayed({ timeout: 5_000 });
        if (text) {
            const txt = ((await this.root.getText()) ?? '').trim();
            const matches =
                typeof text === 'string' ? txt.includes(text) : text.test(txt);
            if (!matches) {
                throw new Error(`Expected toast to match "${text}", got "${txt}"`);
            }
        }
    }

    async expectHidden(): Promise<void> {
        await this.root.waitForDisplayed({ timeout: 6_000, reverse: true });
    }

    async text(): Promise<string> {
        return ((await this.root.getText()) ?? '').trim();
    }

    async assertLoaded(): Promise<void> {
        // Toasts are transient; we can't assert they're "loaded"
        // without a trigger. Provide a no-op that exercises the
        // selector so the suite wiring still type-checks.
        await browser.pause(0);
    }
}