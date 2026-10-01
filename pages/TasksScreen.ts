/**
 * TasksScreen — the Tasks list page.
 *
 * The task list renders rows with a `.task-check` toggle and a
 * `.task-row` container; both are addressed in selectors below.
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { SidebarComponent } from '../components/SidebarComponent';
import { ModalComponent } from '../components/ModalComponent';
import { ToastComponent } from '../components/ToastComponent';
import type { Task } from '../types';

export class TasksScreen extends BaseScreen {
    readonly sidebar = new SidebarComponent();
    readonly modal = new ModalComponent();
    readonly toast = new ToastComponent();

    get content() {
        return $('#content');
    }

    get addButton() {
        return $('#content button*=New task,#content button*=Add task');
    }

    get searchInput() {
        return $('#content input[type="search"], #content input[placeholder*="Search"]');
    }

    get filter() {
        return $('#content .seg button, #content .filter-status button');
    }

    get tasks() {
        return $$('#content .task-row, #content [data-entity="task"]');
    }

    get counter() {
        return $('#content .count, #content [data-count="tasks-page"]');
    }

    async goto(): Promise<void> {
        await this.openPage('tasks');
    }

    async assertLoaded(): Promise<void> {
        await this.content.waitForDisplayed({ timeout: 15_000 });
    }

    async clickAdd(): Promise<void> {
        await this.addButton.click();
    }

    async searchList(q: string): Promise<void> {
        await this.searchInput.setValue(q);
    }

    async setFilter(label: string | RegExp): Promise<void> {
        const buttons = await $('#content').$$('.seg button');
        const re = typeof label === 'string' ? new RegExp(label, 'i') : label;
        for (const b of buttons) {
            const text = (await b.getText()) ?? '';
            if (re.test(text)) {
                await b.click();
                return;
            }
        }
    }

    async toggleTask(title: string): Promise<void> {
        const tasks = await this.tasks;
        for (const row of tasks) {
            const text = (await row.getText()) ?? '';
            if (text.includes(title)) {
                const toggle = await row.$('.task-check, [data-check]');
                await toggle.click();
                return;
            }
        }
        throw new Error(`No task matching "${title}"`);
    }

    async countVisible(): Promise<number> {
        return (await this.tasks).length;
    }

    async counterText(): Promise<string> {
        return ((await this.counter.getText().catch(() => '')) ?? '').trim();
    }

    async firstTask(): Promise<Task | null> {
        const store = await this.readStore();
        return store?.tasks?.[0] ?? null;
    }
}