/**
 * CalendarScreen — the month-grid calendar page.
 *
 * On mobile the month grid renders inside `#content`; prev/next/today
 * controls are addressed by ID.
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { SidebarComponent } from '../components/SidebarComponent';
import type { CalendarEvent } from '../types';

export class CalendarScreen extends BaseScreen {
    readonly sidebar = new SidebarComponent();

    get content() {
        return $('#content');
    }

    get monthLabel() {
        return $('#content .cal-month, #content #calLabel, #content .month-label');
    }

    get prevBtn() {
        return $('#calPrev');
    }

    get nextBtn() {
        return $('#calNext');
    }

    get todayBtn() {
        return $('#calToday');
    }

    get days() {
        return $$('#content .cal-cell, #content [data-day]');
    }

    get events() {
        return $$('#content .cal-event, #content [data-ev], #content [data-entity="event"]');
    }

    get addBtn() {
        return $('#content button*=New event,#content button*=Add event');
    }

    get exportIcs() {
        return $('#content button*=ICS,#content button*=Export,#content button*=Apple,#content button*=Calendar');
    }

    async goto(): Promise<void> {
        await this.openPage('calendar');
    }

    async assertLoaded(): Promise<void> {
        await this.content.waitForDisplayed({ timeout: 15_000 });
    }

    async prevMonth(): Promise<void> {
        await this.prevBtn.click();
    }

    async nextMonth(): Promise<void> {
        await this.nextBtn.click();
    }

    async goToday(): Promise<void> {
        await this.todayBtn.click();
    }

    async monthText(): Promise<string> {
        return ((await this.monthLabel.getText()) ?? '').trim();
    }

    async countDays(): Promise<number> {
        return (await this.days).length;
    }

    async countEvents(): Promise<number> {
        return (await this.events).length;
    }

    async clickAdd(): Promise<void> {
        await this.addBtn.click();
    }

    async firstEvent(): Promise<CalendarEvent | null> {
        const store = await this.readStore();
        return store?.events?.[0] ?? null;
    }
}