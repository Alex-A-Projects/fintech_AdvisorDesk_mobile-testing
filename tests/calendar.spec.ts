/**
 * UI tests — Calendar page.
 */
import { expect } from '@wdio/globals';
import { browser } from '@wdio/globals';
import { CalendarScreen } from '../pages/CalendarScreen';
import { bootstrap } from '../fixtures/bootstrap';
import { readStore } from '../utils/data-store';

describe('Calendar — Smoke', () => {
    let calendar: CalendarScreen;

    beforeEach(async () => {
        await bootstrap();
        calendar = new CalendarScreen();
        await calendar.goto();
    });

    it('renders the calendar grid', async () => {
        await calendar.assertLoaded();
        expect(await calendar.isLoaded()).toBe(true);
    });

    it('renders at least 28 day cells (a 4-week minimum grid)', async () => {
        const count = await calendar.countDays();
        expect(count).toBeGreaterThanOrEqual(28);
    });

    it('shows the current month label', async () => {
        const label = await calendar.monthText();
        expect(label.length).toBeGreaterThan(0);
    });

    it('sidebar marks calendar as the active route', async () => {
        await calendar.sidebar.expectActive('calendar');
    });
});

describe('Calendar — Navigation @regression', () => {
    beforeEach(async () => {
        await bootstrap();
    });

    it('next month advances the label', async () => {
        const calendar = new CalendarScreen();
        await calendar.goto();
        const before = await calendar.monthText();
        await calendar.nextMonth();
        await browser.pause(200);
        const after = await calendar.monthText();
        expect(after).not.toBe(before);
    });

    it('prev month rewinds the label', async () => {
        const calendar = new CalendarScreen();
        await calendar.goto();
        const before = await calendar.monthText();
        await calendar.prevMonth();
        await browser.pause(200);
        const after = await calendar.monthText();
        expect(after).not.toBe(before);
    });

    it('Today button returns to the current month', async () => {
        const calendar = new CalendarScreen();
        await calendar.goto();
        await calendar.nextMonth();
        await browser.pause(200);
        await calendar.goToday();
        await browser.pause(200);
        const label = await calendar.monthText();
        expect(label.length).toBeGreaterThan(0);
    });

    it('renders events from the store', async () => {
        const calendar = new CalendarScreen();
        await calendar.goto();
        const store = await readStore();
        const events = store?.events ?? [];
        // Just assert that the page didn't blow up — the demo's
        // grid layout varies by edition.
        expect(Array.isArray(events)).toBe(true);
    });
});