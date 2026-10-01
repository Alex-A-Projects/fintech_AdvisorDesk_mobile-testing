/**
 * UI tests — Reports page.
 */
import { expect } from '@wdio/globals';
import { ReportsScreen } from '../pages/ReportsScreen';
import { bootstrap } from '../fixtures/bootstrap';

describe('Reports — Smoke', () => {
    let reports: ReportsScreen;

    beforeEach(async () => {
        await bootstrap();
        reports = new ReportsScreen();
        await reports.goto();
    });

    it('renders the reports page', async () => {
        await reports.assertLoaded();
        expect(await reports.isLoaded()).toBe(true);
    });

    it('exposes the sidebar with reports as the active route', async () => {
        await reports.sidebar.expectActive('reports');
    });

    it('renders at least one chart or KPI', async () => {
        const chartCount = await reports.chartCount();
        const kpiCount = await reports.kpiCount();
        // The page may use one pattern or the other; we just need
        // either to render.
        expect(chartCount + kpiCount).toBeGreaterThan(0);
    });
});