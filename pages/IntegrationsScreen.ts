/**
 * IntegrationsScreen — the third-party integrations directory.
 *
 * Each integration renders as a card with a connect/disconnect
 * button; selectors below address those cards generically.
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { SidebarComponent } from '../components/SidebarComponent';

export class IntegrationsScreen extends BaseScreen {
    readonly sidebar = new SidebarComponent();

    get content() {
        return $('#content');
    }

    get cards() {
        return $$('#content .integration-card, #content [data-entity="integration"]');
    }

    get connectButtons() {
        return $$('#content button*=Connect, #content button*=Connected, #content button*=Disconnect');
    }

    async goto(): Promise<void> {
        await this.openPage('integrations');
    }

    async assertLoaded(): Promise<void> {
        await this.content.waitForDisplayed({ timeout: 15_000 });
    }

    async cardCount(): Promise<number> {
        return (await this.cards).length;
    }

    async cardByName(name: string) {
        const cards = await this.cards;
        for (const c of cards) {
            const text = (await c.getText()) ?? '';
            if (text.toLowerCase().includes(name.toLowerCase())) return c;
        }
        return null;
    }
}