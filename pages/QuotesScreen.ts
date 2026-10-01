/**
 * QuotesScreen — the Quotes list page.
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { SidebarComponent } from '../components/SidebarComponent';
import { ModalComponent } from '../components/ModalComponent';
import type { Quote } from '../types';

export class QuotesScreen extends BaseScreen {
    readonly sidebar = new SidebarComponent();
    readonly modal = new ModalComponent();

    get content() {
        return $('#content');
    }

    get addButton() {
        return $('#content button*=New quote,#content button*=Add quote,#content button*=Create quote');
    }

    get quotes() {
        return $$('#content .quote, #content [data-entity="quote"], #content table tbody tr');
    }

    get statusFilter() {
        return $('#content .seg button');
    }

    async goto(): Promise<void> {
        await this.openPage('quotes');
    }

    async assertLoaded(): Promise<void> {
        await this.content.waitForDisplayed({ timeout: 15_000 });
    }

    async clickAdd(): Promise<void> {
        await this.addButton.click();
    }

    async countQuotes(): Promise<number> {
        return (await this.quotes).length;
    }

    async firstQuote(): Promise<Quote | null> {
        const store = await this.readStore();
        return store?.quotes?.[0] ?? null;
    }
}