/**
 * UI tests — Dashboard page.
 * Smoke + regression coverage for the landing page on mobile Safari
 * (iOS) and mobile Chrome (Android).
 */
import { expect, browser } from '@wdio/globals';
import { DashboardScreen } from '../pages/DashboardScreen';
import { bootstrap } from '../fixtures/bootstrap';
import { readStore } from '../utils/data-store';

describe('Dashboard — Smoke', () => {
    let page: DashboardScreen;

    beforeEach(async () => {
        await bootstrap();
        page = new DashboardScreen();
        await page.goto();
    });

    it('renders the content area', async () => {
        await page.assertLoaded();
        expect(await page.isLoaded()).toBe(true);
    });

    it('exposes at least 3 KPI cards', async () => {
        await page.expectKpiCountAtLeast(3);
    });

    it('shows the sidebar with all 11 nav items', async () => {
        await page.sidebar.expectAllVisible();
        await page.sidebar.expectLabels();
    });

    it('defaults to dashboard as the active nav item', async () => {
        await page.sidebar.expectActive('dashboard');
    });

    it('exposes the brand mark', async () => {
        await expect(page.brand).toBeDisplayed();
    });

    it('renders the quick-add button in the header', async () => {
        await page.quickAdd.expectClosed();
    });

    it('renders the global search input', async () => {
        await page.search.assertLoaded();
    });

    it('renders the theme toggle', async () => {
        await page.theme.assertLoaded();
    });

    it('lands on #/dashboard', async () => {
        const url = await browser.getUrl();
        expect(url).toMatch(/#\/dashboard/);
    });

    it('content area has rendered', async () => {
        const text = await page.contentText();
        expect(text.length).toBeGreaterThan(20);
    });
});

describe('Dashboard — KPIs @regression', () => {
    beforeEach(async () => {
        await bootstrap();
    });

    it('all KPIs render non-empty labels', async () => {
        const page = new DashboardScreen();
        await page.goto();
        await page.expectKpiCountAtLeast(3);
        const cards = await page.kpiCards;
        for (const card of cards) {
            const text = ((await card.getText()) ?? '').trim();
            expect(text.length).toBeGreaterThan(0);
        }
    });

    it('KPI count is consistent across page reloads', async () => {
        const page = new DashboardScreen();
        await page.goto();
        const before = await page.kpiCount();
        await browser.refresh();
        await page.waitForContent();
        const after = await page.kpiCount();
        expect(after).toBe(before);
    });

    it('localStorage store is populated after bootstrap', async () => {
        const store = await readStore();
        expect(store).toBeTruthy();
        expect(store?.clients.length ?? 0).toBeGreaterThan(0);
    });

    it('store contains all expected collections', async () => {
        const store = await readStore();
        expect(store).toBeTruthy();
        for (const key of [
            'clients',
            'projects',
            'tasks',
            'invoices',
            'quotes',
            'events',
            'notes',
            'timelogs',
            'integrations',
            'settings',
        ] as const) {
            expect(key in (store ?? {})).toBeTruthy();
        }
    });
});

describe('Dashboard — Theme', () => {
    let page: DashboardScreen;

    beforeEach(async () => {
        await bootstrap();
        page = new DashboardScreen();
        await page.goto();
    });

    it('theme is light by default', async () => {
        await page.theme.expectTheme('light');
    });

    it('theme toggle switches to dark', async () => {
        await page.theme.set('dark');
        await page.theme.expectTheme('dark');
    });

    it('theme toggle switches back to light', async () => {
        await page.theme.set('dark');
        await page.theme.set('light');
        await page.theme.expectTheme('light');
    });

    it('theme persists across reload', async () => {
        await page.theme.set('dark');
        await browser.refresh();
        await page.waitForContent();
        await page.theme.expectTheme('dark');
    });
});