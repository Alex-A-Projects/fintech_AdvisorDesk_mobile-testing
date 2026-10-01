/**
 * GlobalSearchComponent — wraps the top-bar search input and its
 * results dropdown.
 */
import { $ } from '@wdio/globals';
import { Component } from './Component';

export class GlobalSearchComponent extends Component {
    get root() {
        return $('#globalSearch');
    }

    get results() {
        return $('#searchResults');
    }

    async type(q: string): Promise<void> {
        await this.root.setValue(q);
    }

    async clear(): Promise<void> {
        await this.root.setValue('');
    }

    async expectResultsCount(n: number): Promise<void> {
        await this.results.waitForDisplayed({ timeout: 5_000 });
        const hits = this.results.$$('.search-hit, [data-hit]');
        const count = await (await hits).length;
        if (count !== n) {
            throw new Error(`Expected ${n} search results, found ${count}`);
        }
    }

    async expectResultsVisible(): Promise<void> {
        await this.results.waitForDisplayed({ timeout: 5_000 });
    }

    async expectResultsHidden(): Promise<void> {
        await this.results.waitForDisplayed({ timeout: 5_000, reverse: true });
    }

    async firstResultText(): Promise<string> {
        await this.results.waitForDisplayed({ timeout: 5_000 });
        const first = await this.results.$('.search-hit, [data-hit]');
        return ((await first.getText()) ?? '').trim();
    }

    async clickFirst(): Promise<void> {
        await this.results.waitForDisplayed({ timeout: 5_000 });
        const first = await this.results.$('.search-hit, [data-hit]');
        await first.click();
    }

    async assertLoaded(): Promise<void> {
        await this.root.waitForDisplayed({ timeout: 5_000 });
    }
}