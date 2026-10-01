/**
 * InvoicesScreen — the Invoices list and the invoice detail page.
 */
import { $, $$, browser } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { SidebarComponent } from '../components/SidebarComponent';
import { ModalComponent } from '../components/ModalComponent';
import type { Invoice } from '../types';

export class InvoicesScreen extends BaseScreen {
    readonly sidebar = new SidebarComponent();
    readonly modal = new ModalComponent();

    get content() {
        return $('#content');
    }

    get addButton() {
        return $('#content button*=New invoice,#content button*=Add invoice,#content button*=Create invoice');
    }

    get invoices() {
        return $$('#content .invoice, #content [data-entity="invoice"], #content table tbody tr');
    }

    get statusFilter() {
        return $('#content .seg button');
    }

    get revenueWidget() {
        return $('#content div*=Revenue');
    }

    get outstandingWidget() {
        return $('#content div*=Outstanding');
    }

    async goto(): Promise<void> {
        await this.openPage('invoices');
    }

    async assertLoaded(): Promise<void> {
        await this.content.waitForDisplayed({ timeout: 15_000 });
    }

    async clickAdd(): Promise<void> {
        await this.addButton.click();
    }

    async filterStatus(label: string | RegExp): Promise<void> {
        const buttons = await this.statusFilter.$$('button');
        const re = typeof label === 'string' ? new RegExp(label, 'i') : label;
        for (const b of buttons) {
            const text = (await b.getText()) ?? '';
            if (re.test(text)) {
                await b.click();
                return;
            }
        }
    }

    async rowByNumber(num: string) {
        const rows = await this.invoices;
        for (const row of rows) {
            const text = (await row.getText()) ?? '';
            if (text.includes(num)) return row;
        }
        return null;
    }

    async firstInvoice(): Promise<Invoice | null> {
        const store = await this.readStore();
        return store?.invoices?.[0] ?? null;
    }
}

export class InvoiceDetailScreen extends BaseScreen {
    readonly sidebar = new SidebarComponent();

    get content() {
        return $('#content');
    }

    get number() {
        return $('#content h1');
    }

    get statusPill() {
        return $('#content .pill');
    }

    get total() {
        return $('#content .total, #content [data-field="total"]');
    }

    get lines() {
        return $$('#content .line, #content table tbody tr');
    }

    get markPaid() {
        return $('#content button*=Mark paid,#content button*=Paid');
    }

    get printBtn() {
        return $('#content button*=Print');
    }

    get sendBtn() {
        return $('#content button*=Send');
    }

    async goto(invoiceId: string): Promise<void> {
        await browser.execute(
            (id: string) => {
                window.location.hash = `#/invoices/${id}`;
            },
            invoiceId,
        );
        await this.waitForContent();
    }

    async assertLoaded(): Promise<void> {
        await this.number.waitForDisplayed({ timeout: 15_000 });
    }
}