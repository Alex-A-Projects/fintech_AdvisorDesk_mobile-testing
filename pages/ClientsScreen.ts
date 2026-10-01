/**
 * ClientsScreen — the Clients list and the client detail page.
 *
 * On mobile the clients render as cards or rows inside the scrollable
 * `#content` region; the modal-based create/edit pattern is shared
 * with the desktop demo.
 */
import { $, $$, browser } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { SidebarComponent } from '../components/SidebarComponent';
import { ModalComponent } from '../components/ModalComponent';
import { ToastComponent } from '../components/ToastComponent';
import type { Client } from '../types';

export class ClientsScreen extends BaseScreen {
    readonly sidebar = new SidebarComponent();
    readonly modal = new ModalComponent();
    readonly toast = new ToastComponent();

    get content() {
        return $('#content');
    }

    get searchInput() {
        return $('#content input[type="search"], #content input[placeholder*="Search"], #content .search-input');
    }

    get statusFilter() {
        return $('#content .seg button, #content .filter-status button');
    }

    get addButton() {
        return $('#content button*=Add');
    }

    get importButton() {
        return $('#content button*=Import');
    }

    get exportButton() {
        return $('#content button*=Export');
    }

    get clientCards() {
        return $$('#content tr.clickable[data-id], #content [data-entity="client"], #content .client-card');
    }

    get emptyState() {
        return $('#content .empty, #content .empty-state');
    }

    get table() {
        return $('#content table');
    }

    async goto(): Promise<void> {
        await this.openPage('clients');
    }

    async assertLoaded(): Promise<void> {
        await this.content.waitForDisplayed({ timeout: 15_000 });
    }

    async searchList(q: string): Promise<void> {
        await this.searchInput.setValue(q);
    }

    async clickAdd(): Promise<void> {
        await this.addButton.click();
    }

    async clickImport(): Promise<void> {
        await this.importButton.click();
    }

    async clickExport(): Promise<void> {
        await this.exportButton.click();
    }

    async selectStatusFilter(label: string | RegExp): Promise<void> {
        // Demo uses `<select id="crmStatus">` for status filtering.
        const sel = await $('#content #crmStatus, #content select[name="status"]');
        const re = typeof label === 'string' ? new RegExp(label, 'i') : label;
        const opts = await sel.$$('option');
        for (const o of opts) {
            const text = (await o.getText()) ?? '';
            if (re.test(text)) {
                const value = await o.getAttribute('value');
                await sel.selectByAttribute('value', value ?? '');
                return;
            }
        }
    }

    async countCards(): Promise<number> {
        return (await this.clientCards).length;
    }

    async cardByName(name: string) {
        const cards = await this.clientCards;
        for (const card of cards) {
            const text = (await card.getText()) ?? '';
            if (text.includes(name)) return card;
        }
        return null;
    }

    async openClientByName(name: string): Promise<void> {
        const card = await this.cardByName(name);
        if (!card) throw new Error(`No client card matching "${name}"`);
        await card.click();
    }

    /** First client in the localStorage snapshot, or null. */
    async firstClient(): Promise<Client | null> {
        const store = await this.readStore();
        return store?.clients?.[0] ?? null;
    }
}

export class ClientDetailScreen extends BaseScreen {
    readonly sidebar = new SidebarComponent();

    get content() {
        return $('#content');
    }

    get name() {
        return $('#content h1, .detail-title');
    }

    get company() {
        return $('#content .detail-company, #content .subtitle');
    }

    get statusPill() {
        return $('#content .pill');
    }

    get editButton() {
        return $('#content button*=Edit');
    }

    get deleteButton() {
        return $('#content button*=Delete');
    }

    get linkedProjects() {
        return $('#content [data-related="projects"], #content .related-projects');
    }

    get linkedInvoices() {
        return $('#content [data-related="invoices"], #content .related-invoices');
    }

    get linkedTasks() {
        return $('#content [data-related="tasks"], #content .related-tasks');
    }

    async goto(clientId: string): Promise<void> {
        await this.openPage('clients');
        await browser.execute(
            (id: string) => {
                    window.location.hash = `#/clients/${id}`;
                },
            clientId,
        );
    }

    async assertLoaded(): Promise<void> {
        await this.name.waitForDisplayed({ timeout: 15_000 });
    }

    async clickEdit(): Promise<void> {
        await this.editButton.click();
    }

    async clickDelete(): Promise<void> {
        await this.deleteButton.click();
    }

    async nameText(): Promise<string> {
        return ((await this.name.getText()) ?? '').trim();
    }
}