/**
 * UI tests — Sidebar navigation sweep.
 *
 * Drives the demo from one route to the next via the sidebar and
 * asserts the active state follows.
 */
import { expect } from '@wdio/globals';
import { browser } from '@wdio/globals';
import { DashboardScreen } from '../pages/DashboardScreen';
import { bootstrap } from '../fixtures/bootstrap';
import type { PageName } from '../types';

const ALL_ROUTES: PageName[] = [
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

describe('Sidebar navigation sweep', () => {
    beforeEach(async () => {
        await bootstrap();
    });

    for (const target of ALL_ROUTES) {
        it(`sidebar click navigates to ${target}`, async () => {
            const dashboard = new DashboardScreen();
            await dashboard.goto();
            await dashboard.sidebar.click(target);
            await browser.waitUntil(
                async () => {
                    const url = await browser.getUrl();
                    return url.includes(`#/${target}`);
                },
                { timeout: 10_000, interval: 200 },
            );
            await dashboard.sidebar.expectActive(target);
        });
    }

    it('the brand returns to the dashboard', async () => {
        const dashboard = new DashboardScreen();
        await dashboard.goto();
        await dashboard.sidebar.click('clients');
        await browser.waitUntil(async () => (await browser.getUrl()).includes('#/clients'), {
            timeout: 10_000,
            interval: 200,
        });
        await dashboard.sidebar.clickBrand();
        await browser.waitUntil(async () => (await browser.getUrl()).includes('#/dashboard'), {
            timeout: 10_000,
            interval: 200,
        });
    });
});