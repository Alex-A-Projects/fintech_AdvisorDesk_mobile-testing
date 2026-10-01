/**
 * ThemeToggleComponent — wraps the light/dark theme switch in the
 * header.
 */
import { $, browser } from '@wdio/globals';
import { Component } from './Component';
import type { Theme } from '../types';

export class ThemeToggleComponent extends Component {
    get root() {
        return $('[data-toggle="theme"], #themeToggle, .theme-toggle');
    }

    async set(theme: Theme): Promise<void> {
        await this.root.waitForDisplayed({ timeout: 5_000 });
        const current = await this.current();
        if (current !== theme) {
            await this.root.click();
            await browser.pause(150);
        }
    }

    async current(): Promise<Theme> {
        const isDark = await browser.execute(() =>
            document.documentElement.classList.contains('dark') ||
            document.body.classList.contains('dark'),
        );
        return isDark ? 'dark' : 'light';
    }

    async expectTheme(theme: Theme): Promise<void> {
        const actual = await this.current();
        if (actual !== theme) {
            throw new Error(`Expected theme "${theme}", got "${actual}"`);
        }
    }

    async assertLoaded(): Promise<void> {
        await this.root.waitForDisplayed({ timeout: 5_000 });
    }
}