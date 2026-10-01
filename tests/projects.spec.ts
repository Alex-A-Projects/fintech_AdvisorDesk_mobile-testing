/**
 * UI tests — Projects page.
 */
import { expect } from '@wdio/globals';
import { browser } from '@wdio/globals';
import { ProjectsScreen, ProjectDetailScreen } from '../pages/ProjectsScreen';
import { bootstrap } from '../fixtures/bootstrap';
import { td } from '../utils/test-data';
import { countEntities, readStore } from '../utils/data-store';
import { uniqueSuffix } from '../utils/helpers';

describe('Projects — Smoke', () => {
    let projects: ProjectsScreen;

    beforeEach(async () => {
        await bootstrap();
        projects = new ProjectsScreen();
        await projects.goto();
    });

    it('renders the projects list', async () => {
        await projects.assertLoaded();
        expect(await projects.isLoaded()).toBe(true);
    });

    it('shows seeded projects', async () => {
        const store = await readStore();
        expect(store?.projects.length ?? 0).toBeGreaterThan(0);
    });

    it('sidebar marks projects as the active route', async () => {
        await projects.sidebar.expectActive('projects');
    });

    it('switches to list view', async () => {
        await projects.switchToList();
        await browser.pause(200);
        await expect(projects.content).toBeDisplayed();
    });

    it('switches to board view', async () => {
        await projects.switchToBoard();
        await browser.pause(200);
        await expect(projects.content).toBeDisplayed();
    });
});

describe('Projects — CRUD @regression', () => {
    beforeEach(async () => {
        await bootstrap();
    });

    it('creates a project', async () => {
        const projects = new ProjectsScreen();
        await projects.goto();
        const before = await countEntities('projects');
        const data = td.project({ name: `Mobile Engagement ${uniqueSuffix()}` });
        await projects.clickAdd();
        await projects.modal.fill('Name', data.name);
        await projects.modal.submit();
        await browser.pause(400);
        const after = await countEntities('projects');
        expect(after).toBe(before + 1);
        const store = await readStore();
        const created = store?.projects.find((p) => p.name === data.name);
        expect(created).toBeTruthy();
    });

    it('opens a project detail page', async () => {
        const projects = new ProjectsScreen();
        await projects.goto();
        const store = await readStore();
        const first = store?.projects?.[0];
        expect(first).toBeTruthy();
        await browser.execute(
            (id) => {
                window.location.hash = `#/projects/${id}`;
            },
            first!.id,
        );
        const detail = new ProjectDetailScreen();
        await detail.assertLoaded();
    });
});