/**
 * ProjectsScreen — the Projects list (board + list views) and the
 * project detail page.
 *
 * The board view exposes stage columns; on mobile the columns scroll
 * horizontally inside `#content`.
 */
import { $, $$ } from '@wdio/globals';
import { browser } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { SidebarComponent } from '../components/SidebarComponent';
import { ModalComponent } from '../components/ModalComponent';
import type { Project } from '../types';

export class ProjectsScreen extends BaseScreen {
    readonly sidebar = new SidebarComponent();
    readonly modal = new ModalComponent();

    get content() {
        return $('#content');
    }

    get addButton() {
        return $('#content #projNew');
    }

    get board() {
        return $('#content .board, #content [data-view="board"]');
    }

    get listView() {
        return $('#content .list-view, #content [data-view="list"]');
    }

    get viewToggle() {
        return $('#content .view-toggle button, #content .seg');
    }

    get filterChips() {
        return $$('#content .filter-chip, #content .chip');
    }

    get stageColumns() {
        return $$('#content .stage-col, #content [data-stage]');
    }

    get cards() {
        return $$('#content .board-card, #content tr.clickable, #content .project-card, #content [data-entity="project"]');
    }

    async goto(): Promise<void> {
        await this.openPage('projects');
    }

    async assertLoaded(): Promise<void> {
        await this.content.waitForDisplayed({ timeout: 15_000 });
    }

    async switchToList(): Promise<void> {
        const toggle = await this.viewToggle;
        const btns = await toggle.$$('button');
        for (const b of btns) {
            const text = (await b.getText()) ?? '';
            if (/List/i.test(text)) {
                await b.click();
                return;
            }
        }
    }

    async switchToBoard(): Promise<void> {
        const toggle = await this.viewToggle;
        const btns = await toggle.$$('button');
        for (const b of btns) {
            const text = (await b.getText()) ?? '';
            if (/Board/i.test(text)) {
                await b.click();
                return;
            }
        }
    }

    async clickAdd(): Promise<void> {
        await this.addButton.click();
    }

    async cardByName(name: string) {
        const cards = await this.cards;
        for (const card of cards) {
            const text = (await card.getText()) ?? '';
            if (text.includes(name)) return card;
        }
        return null;
    }

    async firstProject(): Promise<Project | null> {
        const store = await this.readStore();
        return store?.projects?.[0] ?? null;
    }
}

export class ProjectDetailScreen extends BaseScreen {
    readonly sidebar = new SidebarComponent();

    get content() {
        return $('#content');
    }

    get title() {
        return $('#content h1');
    }

    get clientLink() {
        return $('#content a[href^="#/clients/"]');
    }

    get stagePill() {
        return $('#content .pill');
    }

    get valueText() {
        return $('#content .prop-v, #content .value');
    }

    get timerButton() {
        return $('#content button*=Start timer,#content button*=Stop timer');
    }

    get completeButton() {
        return $('#content button*=Complete,#content button*=Done');
    }

    get tasks() {
        return $('#content [data-section="tasks"]');
    }

    get timelogs() {
        return $('#content [data-section="timelogs"]');
    }

    async goto(projectId: string): Promise<void> {
        await browser.execute(
            (id) => {
                window.location.hash = `#/projects/${id}`;
            },
            projectId,
        );
        await this.waitForContent();
    }

    async assertLoaded(): Promise<void> {
        await this.title.waitForDisplayed({ timeout: 15_000 });
    }

    async startTimer(): Promise<void> {
        await this.timerButton.click();
    }
}