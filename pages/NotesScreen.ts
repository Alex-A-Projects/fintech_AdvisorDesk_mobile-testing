/**
 * NotesScreen — the Notes list and the note detail page.
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { SidebarComponent } from '../components/SidebarComponent';
import { ModalComponent } from '../components/ModalComponent';
import type { Note } from '../types';

export class NotesScreen extends BaseScreen {
    readonly sidebar = new SidebarComponent();
    readonly modal = new ModalComponent();

    get content() {
        return $('#content');
    }

    get addButton() {
        return $('#content button*=New note,#content button*=Add note');
    }

    get notes() {
        return $$('#content .note-row, #content [data-entity="note"], #content table tbody tr');
    }

    get searchInput() {
        return $('#content input[type="search"], #content input[placeholder*="Search"]');
    }

    async goto(): Promise<void> {
        await this.openPage('notes');
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

    async countNotes(): Promise<number> {
        return (await this.notes).length;
    }

    async firstNote(): Promise<Note | null> {
        const store = await this.readStore();
        return store?.notes?.[0] ?? null;
    }
}