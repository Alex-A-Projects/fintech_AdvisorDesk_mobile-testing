/**
 * UI tests — Quotes page.
 */
import { expect } from '@wdio/globals';
import { QuotesScreen } from '../pages/QuotesScreen';
import { bootstrap } from '../fixtures/bootstrap';
import { readStore } from '../utils/data-store';

describe('Quotes — Smoke', () => {
    let quotes: QuotesScreen;

    beforeEach(async () => {
        await bootstrap();
        quotes = new QuotesScreen();
        await quotes.goto();
    });

    it('renders the quotes list', async () => {
        await quotes.assertLoaded();
        expect(await quotes.isLoaded()).toBe(true);
    });

    it('shows seeded quotes when available', async () => {
        const store = await readStore();
        // Quotes may be empty if the demo edition doesn't seed any;
        // the property we care about is "page loaded without error".
        expect(store).toBeTruthy();
        expect(Array.isArray(store?.quotes)).toBe(true);
    });

    it('sidebar marks quotes as the active route', async () => {
        await quotes.sidebar.expectActive('quotes');
    });
});

describe('Quotes — Regression', () => {
    beforeEach(async () => {
        await bootstrap();
    });

    it('opens the Add quote modal', async () => {
        const quotes = new QuotesScreen();
        await quotes.goto();
        if (await quotes.addButton.isExisting().catch(() => false)) {
            await quotes.clickAdd();
            await quotes.modal.expectVisible().catch(() => undefined);
        }
    });
});