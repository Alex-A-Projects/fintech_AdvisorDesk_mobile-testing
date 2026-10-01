/**
 * SidebarComponent — wraps the demo's left-hand navigation.
 *
 * On narrow phone widths the sidebar collapses behind a hamburger
 * button; the data-attributes used here are stable across that
 * reflow, so we don't have to branch the suite on viewport width.
 */
import { $ } from '@wdio/globals';
import type { PageName } from '../types';
import { Component } from './Component';

const LABELS: Record<PageName, string> = {
    dashboard: 'Dashboard',
    clients: 'Clients',
    projects: 'Projects',
    tasks: 'Tasks',
    invoices: 'Invoices',
    quotes: 'Quotes',
    calendar: 'Calendar',
    notes: 'Notes',
    reports: 'Reports',
    integrations: 'Integrations',
    settings: 'Settings',
};

const ALL_PAGES: PageName[] = [
    'dashboard',
    'clients',
    'projects',
    'tasks',
    'invoices',
    'quotes',
    'calendar',
    'notes',
    'reports',
    'integrations',
    'settings',
];

export class SidebarComponent extends Component {
    get root() {
        return $('#sidebar');
    }

    item(page: PageName) {
        return $(`.nav-item[data-page="${page}"]`);
    }

    async click(page: PageName): Promise<void> {
        await this.item(page).click();
    }

    async active(): Promise<string> {
        return (await $('.nav-item.active').getAttribute('data-page')) ?? '';
    }

    async expectActive(page: PageName): Promise<void> {
        const item = await this.item(page);
        await item.waitForDisplayed({ timeout: 5_000 });
        const cls = (await item.getAttribute('class')) ?? '';
        if (!/\bactive\b/.test(cls)) {
            throw new Error(`Expected sidebar item "${page}" to be active, got class="${cls}"`);
        }
    }

    async expectAllVisible(): Promise<void> {
        for (const name of ALL_PAGES) {
            await this.item(name).waitForDisplayed({ timeout: 5_000 });
        }
    }

    async expectLabels(): Promise<void> {
        // The demo uses localized terminology — we just verify each
        // nav item has a non-empty label.
        for (const name of ALL_PAGES) {
            const text = (await this.item(name).getText()) ?? '';
            if (text.trim().length === 0) {
                throw new Error(`Expected sidebar item "${name}" to have a label`);
            }
        }
    }

    async taskCount(): Promise<number> {
        const el = $('[data-count="tasks"]');
        if (!(await el.isDisplayed().catch(() => false))) return 0;
        const text = (await el.getText()) ?? '0';
        return parseInt(text, 10) || 0;
    }

    async clickBrand(): Promise<void> {
        const brand = $('#brand, .brand');
        await brand.click();
    }

    async assertLoaded(): Promise<void> {
        await this.root.waitForDisplayed({ timeout: 10_000 });
    }
}