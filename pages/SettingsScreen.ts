/**
 * SettingsScreen — the application settings page.
 *
 * Hosts profile (business name, owner name, email), currency / tax
 * rate, theme + accent, and the destructive "Erase all" / sample-data
 * loaders.
 */
import { $, $$ } from '@wdio/globals';
import { BaseScreen } from './BaseScreen';
import { SidebarComponent } from '../components/SidebarComponent';

export class SettingsScreen extends BaseScreen {
    readonly sidebar = new SidebarComponent();

    get content() {
        return $('#content');
    }

    get businessName() {
        return $('#sBiz, #bizName, input[name="businessName"]');
    }

    get ownerName() {
        return $('#sName, #ownerName, input[name="ownerName"]');
    }

    get emailInput() {
        return $('input[name="email"]');
    }

    get currencySelect() {
        return $('select[name="currency"]');
    }

    get taxRate() {
        return $('input[name="taxRate"]');
    }

    get themeToggleInline() {
        return $('#sTheme, [data-toggle="theme"]');
    }

    get accentPicker() {
        return $('#sAccent, [data-pick="accent"]');
    }

    get loadSample() {
        return $('#sSample');
    }

    get exportBtn() {
        return $('#content button*=Export everything');
    }

    get backupBtn() {
        return $('#content button*=Backup,#content button*=Download JSON');
    }

    get eraseBtn() {
        return $('#content button*=Erase all');
    }

    get versionText() {
        return $('text=/Version/i');
    }

    get planText() {
        return $('text=/Plan/i');
    }

    get saveProfile() {
        return $('#sSaveProfile');
    }

    async goto(): Promise<void> {
        await this.openPage('settings');
    }

    async assertLoaded(): Promise<void> {
        await this.content.waitForDisplayed({ timeout: 15_000 });
    }

    async setBusinessName(name: string): Promise<void> {
        await this.businessName.setValue(name);
        if (await this.saveProfile.isExisting().catch(() => false)) {
            await this.saveProfile.click().catch(() => undefined);
        }
    }

    async loadSampleData(): Promise<void> {
        await this.loadSample.click();
    }

    async eraseAll(): Promise<void> {
        await this.eraseBtn.click();
        const yes = await $('[data-act="yes"]');
        await yes.click();
    }

    async versionLabel(): Promise<string> {
        // Target the Version property specifically — the demo also has
        // "Get the full version →" in the top bar which would
        // otherwise match first.
        const labels = await $$('.prop-k');
        for (const label of labels) {
            const text = ((await label.getText()) ?? '').trim();
            if (/^Version$/i.test(text)) {
                const value = await label.$('xpath=following-sibling::*[1]');
                return ((await value.getText()) ?? '').trim();
            }
        }
        return '';
    }

    async planLabel(): Promise<string> {
        const labels = await $$('.prop-k');
        for (const label of labels) {
            const text = ((await label.getText()) ?? '').trim();
            if (/^Plan$/i.test(text)) {
                const value = await label.$('xpath=following-sibling::*[1]');
                return ((await value.getText()) ?? '').trim();
            }
        }
        return '';
    }
}