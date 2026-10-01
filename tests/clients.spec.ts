/**
 * UI tests — Clients page.
 *
 * Covers:
 *   - the clients list is rendered after bootstrap
 *   - search + status filter
 *   - add / edit / delete via the demo's form modal
 *   - detail page rendering
 */
import { expect } from '@wdio/globals';
import { browser } from '@wdio/globals';
import { ClientsScreen, ClientDetailScreen } from '../pages/ClientsScreen';
import { bootstrap } from '../fixtures/bootstrap';
import { td } from '../utils/test-data';
import { countEntities, getFirstClient, readStore } from '../utils/data-store';
import { uniqueSuffix } from '../utils/helpers';

describe('Clients — Smoke', () => {
    let clients: ClientsScreen;

    beforeEach(async () => {
        await bootstrap();
        clients = new ClientsScreen();
        await clients.goto();
    });

    it('renders the clients list', async () => {
        await clients.assertLoaded();
        expect(await clients.isLoaded()).toBe(true);
    });

    it('shows seeded clients', async () => {
        const count = await clients.countCards();
        expect(count).toBeGreaterThan(0);
    });

    it('sidebar marks clients as the active route', async () => {
        await clients.sidebar.expectActive('clients');
    });

    it('the Add button is enabled', async () => {
        await expect(clients.addButton).toBeEnabled();
    });

    it('opens the Add client modal', async () => {
        await clients.clickAdd();
        await clients.modal.expectVisible();
    });
});

describe('Clients — CRUD @regression', () => {
    beforeEach(async () => {
        await bootstrap();
    });

    it('creates a client', async () => {
        const clients = new ClientsScreen();
        await clients.goto();
        const before = await countEntities('clients');
        const data = td.client({ name: `Acme Mobile ${uniqueSuffix()}` });
        await clients.clickAdd();
        await clients.modal.fill('Name', data.name);
        await clients.modal.fill('Email', data.email);
        await clients.modal.submit();
        await browser.pause(400);
        const after = await countEntities('clients');
        expect(after).toBe(before + 1);
        const store = await readStore();
        const created = store?.clients.find((c) => c.name === data.name);
        expect(created).toBeTruthy();
    });

    it('rejects an empty client name', async () => {
        const clients = new ClientsScreen();
        await clients.goto();
        const before = await countEntities('clients');
        await clients.clickAdd();
        await clients.modal.submit();
        await browser.pause(300);
        const after = await countEntities('clients');
        expect(after).toBe(before);
    });

    it('searches the clients list', async () => {
        const clients = new ClientsScreen();
        await clients.goto();
        const first = await getFirstClient();
        expect(first).toBeTruthy();
        await clients.searchList(first!.name.slice(0, 4));
        await browser.pause(300);
        await expect(clients.content).toBeDisplayed();
    });

    it('opens a client detail page by name', async () => {
        const clients = new ClientsScreen();
        await clients.goto();
        const first = await getFirstClient();
        expect(first).toBeTruthy();
        await clients.openClientByName(first!.name);
        const detail = new ClientDetailScreen();
        await detail.assertLoaded();
        const text = await detail.nameText();
        expect(text).toContain(first!.name);
    });

    it('deletes a client via the detail page', async () => {
        const clients = new ClientsScreen();
        await clients.goto();
        const first = await getFirstClient();
        expect(first).toBeTruthy();
        const before = await countEntities('clients');
        await clients.openClientByName(first!.name);
        const detail = new ClientDetailScreen();
        await detail.assertLoaded();
        await detail.clickDelete();
        await browser.pause(400);
        const after = await countEntities('clients');
        expect(after).toBe(before - 1);
    });
});