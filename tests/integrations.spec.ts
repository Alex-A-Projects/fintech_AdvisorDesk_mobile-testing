/**
 * UI tests — Integrations page.
 */
import { expect } from '@wdio/globals';
import { IntegrationsScreen } from '../pages/IntegrationsScreen';
import { bootstrap } from '../fixtures/bootstrap';

describe('Integrations — Smoke', () => {
    let integrations: IntegrationsScreen;

    beforeEach(async () => {
        await bootstrap();
        integrations = new IntegrationsScreen();
        await integrations.goto();
    });

    it('renders the integrations directory', async () => {
        await integrations.assertLoaded();
        expect(await integrations.isLoaded()).toBe(true);
    });

    it('exposes at least one integration card', async () => {
        const count = await integrations.cardCount();
        expect(count).toBeGreaterThan(0);
    });

    it('sidebar marks integrations as the active route', async () => {
        await integrations.sidebar.expectActive('integrations');
    });

    it('has connect buttons', async () => {
        const buttons = await integrations.connectButtons;
        expect(buttons.length).toBeGreaterThan(0);
    });
});