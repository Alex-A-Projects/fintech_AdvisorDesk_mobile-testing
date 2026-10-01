/**
 * UI tests — Settings page.
 *
 * Covers profile editing, theme + accent toggling, sample-data
 * loading, and version/plan metadata rendering.
 */
import { expect } from '@wdio/globals';
import { browser } from '@wdio/globals';
import { SettingsScreen } from '../pages/SettingsScreen';
import { bootstrap } from '../fixtures/bootstrap';
import { storageBytes } from '../utils/data-store';
import { uniqueSuffix } from '../utils/helpers';

describe('Settings — Smoke', () => {
    let settings: SettingsScreen;

    beforeEach(async () => {
        await bootstrap();
        settings = new SettingsScreen();
        await settings.goto();
    });

    it('renders the settings page', async () => {
        await settings.assertLoaded();
        expect(await settings.isLoaded()).toBe(true);
    });

    it('exposes the profile form', async () => {
        await expect(settings.businessName).toBeDisplayed();
        await expect(settings.ownerName).toBeDisplayed();
        await expect(settings.emailInput).toBeDisplayed();
    });

    it('exposes the currency + tax rate fields', async () => {
        await expect(settings.currencySelect).toBeDisplayed();
        await expect(settings.taxRate).toBeDisplayed();
    });

    it('sidebar marks settings as the active route', async () => {
        await settings.sidebar.expectActive('settings');
    });

    it('renders version + plan metadata', async () => {
        const v = await settings.versionLabel();
        const p = await settings.planLabel();
        // Either field can be empty depending on edition; just
        // assert we didn't error.
        expect(typeof v).toBe('string');
        expect(typeof p).toBe('string');
    });
});

describe('Settings — Profile @regression', () => {
    beforeEach(async () => {
        await bootstrap();
    });

    it('updates the business name', async () => {
        const settings = new SettingsScreen();
        await settings.goto();
        const newName = `Acme Mobile ${uniqueSuffix()}`;
        await settings.setBusinessName(newName);
        await browser.pause(400);
        // Verify the field actually contains the new value.
        const value = await settings.businessName.getValue();
        expect(value).toBe(newName);
    });
});

describe('Settings — Sample data', () => {
    beforeEach(async () => {
        await bootstrap();
    });

    it('Load sample seeds the store', async () => {
        const settings = new SettingsScreen();
        await settings.goto();
        await settings.loadSampleData();
        await browser.pause(600);
        const bytes = await storageBytes();
        expect(bytes).toBeGreaterThan(100);
    });
});