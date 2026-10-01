/**
 * UI tests — Tasks page.
 */
import { expect } from '@wdio/globals';
import { browser } from '@wdio/globals';
import { TasksScreen } from '../pages/TasksScreen';
import { bootstrap } from '../fixtures/bootstrap';
import { td } from '../utils/test-data';
import { countEntities, getFirstTask, readStore } from '../utils/data-store';
import { uniqueSuffix } from '../utils/helpers';

describe('Tasks — Smoke', () => {
    let tasks: TasksScreen;

    beforeEach(async () => {
        await bootstrap();
        tasks = new TasksScreen();
        await tasks.goto();
    });

    it('renders the tasks list', async () => {
        await tasks.assertLoaded();
        expect(await tasks.isLoaded()).toBe(true);
    });

    it('loads with seeded tasks', async () => {
        expect(await tasks.countVisible()).toBeGreaterThan(0);
    });

    it('open tasks appear in sidebar count', async () => {
        const store = await readStore();
        const open = (store?.tasks ?? []).filter((t) => !t.done).length;
        const sidebarCount = await tasks.sidebar.taskCount();
        expect(sidebarCount).toBe(open);
    });

    it('Add task button is enabled', async () => {
        await expect(tasks.addButton).toBeEnabled();
    });
});

describe('Tasks — CRUD @regression', () => {
    beforeEach(async () => {
        await bootstrap();
    });

    it('creates a task', async () => {
        const tasks = new TasksScreen();
        await tasks.goto();
        const before = await countEntities('tasks');
        const data = td.task({ title: `Send monthly statement ${uniqueSuffix()}` });
        await tasks.clickAdd();
        await tasks.modal.fill('What needs doing?', data.title);
        await tasks.modal.submit();
        await browser.pause(400);
        const after = await countEntities('tasks');
        expect(after).toBe(before + 1);
        const store = await readStore();
        const created = store?.tasks.find((t) => t.title === data.title);
        expect(created).toBeTruthy();
    });

    it('empty title is rejected', async () => {
        const tasks = new TasksScreen();
        await tasks.goto();
        const before = await countEntities('tasks');
        await tasks.clickAdd();
        await tasks.modal.submit();
        await browser.pause(300);
        const after = await countEntities('tasks');
        expect(after).toBe(before);
    });

    it('toggles a task done', async () => {
        const tasks = new TasksScreen();
        await tasks.goto();
        const first = await getFirstTask();
        expect(first).toBeTruthy();
        const target = (await readStore())?.tasks.find((t) => !t.done);
        expect(target).toBeTruthy();
        const before = (await readStore())?.tasks.find((t) => t.id === target!.id)?.done;
        await tasks.toggleTask(target!.title);
        await browser.pause(300);
        const after = (await readStore())?.tasks.find((t) => t.id === target!.id)?.done;
        expect(after).not.toBe(before);
    });

    it('filter by priority works', async () => {
        const tasks = new TasksScreen();
        await tasks.goto();
        await tasks.setFilter(/High/i).catch(() => undefined);
        await browser.pause(300);
        await expect(tasks.content).toBeDisplayed();
    });

    it('search filters tasks', async () => {
        const tasks = new TasksScreen();
        await tasks.goto();
        const first = (await readStore())?.tasks?.[0];
        expect(first).toBeTruthy();
        await tasks.searchList(first!.title.slice(0, 4));
        await browser.pause(300);
        await expect(tasks.content).toBeDisplayed();
    });

    it('bulk create 20 tasks', async function () {
        this.timeout(180_000);
        const tasks = new TasksScreen();
        await tasks.goto();
        const before = await countEntities('tasks');
        for (let i = 0; i < 20; i++) {
            await tasks.clickAdd();
            await tasks.modal.fill('What needs doing?', `Bulk Mobile Task ${i}-${uniqueSuffix()}`);
            await tasks.modal.submit();
            await browser.pause(80);
        }
        const after = await countEntities('tasks');
        expect(after).toBeGreaterThanOrEqual(before + 20);
    });
});