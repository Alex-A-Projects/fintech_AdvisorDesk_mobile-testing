/**
 * ModalComponent — wraps the demo's form modal.
 *
 * Mirrors the Playwright `modal.component.ts` API but uses the WDIO
 * v9 selector API (`$`, `$$`, `click`, `setValue`).
 */
import { $, $$ } from '@wdio/globals';
import { Component } from './Component';
import { pressEscape } from '../utils/helpers';

export class ModalComponent extends Component {
    get root() {
        return $('.modal-overlay, .overlay');
    }

    get dialog() {
        return $('.modal');
    }

    get title() {
        return $('.modal .modal-header h2, .modal h2');
    }

    get body() {
        return $('.modal .modal-body');
    }

    get cancel() {
        return $('[data-act="cancel"]');
    }

    get save() {
        return $('[data-act="save"]');
    }

    async expectVisible(): Promise<void> {
        await this.dialog.waitForDisplayed({ timeout: 5_000 });
    }

    async expectHidden(): Promise<void> {
        await this.dialog.waitForDisplayed({ timeout: 5_000, reverse: true });
    }

    async titleText(): Promise<string> {
        return ((await this.title.getText()) ?? '').trim();
    }

    /** Locate a labeled field group inside the modal body. */
    async field(label: string) {
        const fields = await this.body.$$('.field');
        for (const f of fields) {
            const text = (await f.getText()) ?? '';
            if (text.includes(label)) return f;
        }
        return null;
    }

    async input(label: string) {
        const f = await this.field(label);
        if (!f) throw new Error(`No modal field labeled "${label}"`);
        return f.$('input, textarea, select');
    }

    async fill(label: string, value: string): Promise<void> {
        const i = await this.input(label);
        await i.setValue(value);
    }

    async select(label: string, value: string): Promise<void> {
        const s = await this.input(label);
        await s.selectByAttribute('value', value);
    }

    async submit(): Promise<void> {
        // The demo's forms created via `App.formModal()` have a
        // `[data-act="save"]` button. Direct `App.modal()` calls don't;
        // fall back to the primary footer button.
        if (await this.save.isExisting().catch(() => false)) {
            await this.save.click();
            return;
        }
        const primary = await $('.modal .modal-footer .btn-primary, .modal .btn-primary');
        await primary.click();
    }

    async cancelForm(): Promise<void> {
        if (await this.cancel.isExisting().catch(() => false)) {
            await this.cancel.click();
            return;
        }
        const plainBtn = await $('.modal .modal-footer .btn:not(.btn-primary), .modal .btn:not(.btn-primary)');
        await plainBtn.click();
    }

    async pressEscape(): Promise<void> {
        await pressEscape();
    }

    async expectError(label: string, msg: RegExp): Promise<void> {
        const f = await this.field(label);
        if (!f) throw new Error(`No modal field labeled "${label}"`);
        const err = await f.$('.err, .error, .field-err');
        const txt = ((await err.getText()) ?? '').trim();
        if (!msg.test(txt)) {
            throw new Error(`Expected field "${label}" error to match ${msg}, got "${txt}"`);
        }
    }

    async close(): Promise<void> {
        await this.cancelForm().catch(async () => {
            const closeBtn = await $('.modal-close, [data-close]');
            await closeBtn.click().catch(() => undefined);
        });
    }

    async assertLoaded(): Promise<void> {
        await this.expectVisible();
    }
}