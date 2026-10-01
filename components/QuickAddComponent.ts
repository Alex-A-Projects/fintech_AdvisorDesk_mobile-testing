/**
 * QuickAddComponent — wraps the global "+" button that opens the
 * entity picker modal.
 */
import { $, $$ } from '@wdio/globals';
import { Component } from './Component';

export type QuickAddEntity = 'client' | 'project' | 'task' | 'invoice' | 'event' | 'note';

export class QuickAddComponent extends Component {
    get root() {
        return $('#quickAdd');
    }

    async open(): Promise<void> {
        await this.root.click();
        await $('.modal').waitForDisplayed({ timeout: 5_000 });
    }

    async pick(entity: QuickAddEntity): Promise<void> {
        await this.open();
        // The demo renders Quick Add buttons in a fixed 6-up grid
        // (clients, projects, tasks, invoices, events, notes). The
        // first button is the modal close (empty text), so entity
        // buttons start at index 1.
        const order: QuickAddEntity[] = ['client', 'project', 'task', 'invoice', 'event', 'note'];
        const entityIndex = order.indexOf(entity);
        if (entityIndex < 0) throw new Error(`Unknown Quick Add entity: ${entity}`);
        const buttons = await $$('.modal button');
        await buttons[entityIndex + 1].click();
    }

    async expectOpen(): Promise<void> {
        await $('.modal').waitForDisplayed({ timeout: 5_000 });
    }

    async expectClosed(): Promise<void> {
        await $('.modal').waitForDisplayed({ timeout: 5_000, reverse: true });
    }

    async assertLoaded(): Promise<void> {
        await this.root.waitForDisplayed({ timeout: 5_000 });
    }
}