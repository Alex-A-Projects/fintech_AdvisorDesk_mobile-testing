/**
 * ReportsScreen — the Reports page (KPIs + revenue widgets).
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { SidebarComponent } from '../components/SidebarComponent';

export class ReportsScreen extends BaseScreen {
    readonly sidebar = new SidebarComponent();

    get content() {
        return $('#content');
    }

    get charts() {
        return $$('#content .chart, #content svg, #content canvas, #content [data-chart]');
    }

    get kpis() {
        return $$('#content .kpi, #content .stat, #content [data-kpi]');
    }

    async kpiCount(): Promise<number> {
        return (await this.kpis).length;
    }

    get periodSelector() {
        return $('#content .seg, #content select[name="period"]');
    }

    async goto(): Promise<void> {
        await this.openPage('reports');
    }

    async assertLoaded(): Promise<void> {
        await this.content.waitForDisplayed({ timeout: 15_000 });
    }

    async chartCount(): Promise<number> {
        return (await this.charts).length;
    }
}