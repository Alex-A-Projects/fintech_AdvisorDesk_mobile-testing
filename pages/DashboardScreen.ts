/**
 * DashboardScreen — the landing page of the mobile-web AdvisorDesk
 * demo.
 *
 * On mobile the KPI cards stack vertically; the sidebar collapses into
 * a hamburger button at narrow widths. The page also exposes the
 * global search, theme toggle, quick-add, and a brand mark.
 */
import { $$, $ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { SidebarComponent } from '../components/SidebarComponent';
import { ThemeToggleComponent } from '../components/ThemeToggleComponent';
import { QuickAddComponent } from '../components/QuickAddComponent';
import { GlobalSearchComponent } from '../components/GlobalSearchComponent';
import { ModalComponent } from '../components/ModalComponent';
import { ToastComponent } from '../components/ToastComponent';

export class DashboardScreen extends BaseScreen {
    readonly sidebar = new SidebarComponent();
    readonly theme = new ThemeToggleComponent();
    readonly quickAdd = new QuickAddComponent();
    readonly search = new GlobalSearchComponent();
    readonly modal = new ModalComponent();
    readonly toast = new ToastComponent();

    get content() {
        return $('#content');
    }

    get brand() {
        return $('.brand-mark, #brandMark, #brand');
    }

    get pageTitle() {
        return $('#content h1, #content h2.page-title, .page-title');
    }

    get kpiCards() {
        return $$('#content .kpi, #content .stat, #content [data-kpi]');
    }

    get recentClients() {
        return $('#content [data-section="recent-clients"], #content .recent-clients');
    }

    get recentProjects() {
        return $('#content [data-section="recent-projects"], #content .recent-projects');
    }

    get upcomingEvents() {
        return $('#content [data-section="upcoming"], #content .upcoming');
    }

    get openTasks() {
        return $('#content [data-section="open-tasks"], #content .open-tasks');
    }

    async goto(): Promise<void> {
        await this.openPage('dashboard');
    }

    async assertLoaded(): Promise<void> {
        await this.content.waitForDisplayed({ timeout: 15_000 });
    }

    async kpiCount(): Promise<number> {
        return (await this.kpiCards).length;
    }

    async expectKpiCountAtLeast(n: number): Promise<void> {
        const cnt = await this.kpiCount();
        if (cnt < n) {
            throw new Error(`Expected at least ${n} KPI cards, found ${cnt}`);
        }
    }

    async kpiValue(name: string): Promise<string> {
        const cards = await this.kpiCards;
        for (const card of cards) {
            const text = (await card.getText()) ?? '';
            if (text.includes(name)) {
                const value = await card.$('.kpi-value, .stat-value, .value');
                return ((await value.getText()) ?? '').trim();
            }
        }
        return '';
    }

    async contentText(): Promise<string> {
        return ((await this.content.getText()) ?? '').trim();
    }
}