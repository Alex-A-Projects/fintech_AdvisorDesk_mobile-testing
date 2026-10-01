/**
 * Read-only helpers for interacting with the demo's localStorage store.
 * The demo persists state under key `bizdash_financial-advisors-demo`;
 * we expose typed accessors so we can verify CRUD operations from
 * tests without screen-scraping.
 *
 * Wraps `browser.execute()` so the same calls work on both iOS Safari
 * (XCUITest) and Android Chrome (UiAutomator2).
 */
import { browser } from '@wdio/globals';
import type {
    AppStore,
    Client,
    Project,
    Task,
    Invoice,
    Quote,
    CalendarEvent,
    Note,
} from '../types';

const STORAGE_KEY = 'bizdash_financial-advisors-demo';

export async function readStore(): Promise<AppStore | null> {
    return browser.execute((key) => {
        const raw = localStorage.getItem(key);
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return null;
        }
    }, STORAGE_KEY) as Promise<AppStore | null>;
}

export async function writeStore(store: AppStore): Promise<void> {
    await browser.execute(
        ({ key, value }) => {
            localStorage.setItem(key, value);
        },
        { key: STORAGE_KEY, value: JSON.stringify(store) },
    );
}

export async function clearStore(): Promise<void> {
    await browser.execute((key) => localStorage.removeItem(key), STORAGE_KEY);
}

export async function countEntities(
    entity: keyof Pick<AppStore, 'clients' | 'projects' | 'tasks' | 'invoices' | 'quotes' | 'events' | 'notes'>,
): Promise<number> {
    const store = await readStore();
    if (!store) return 0;
    return (store[entity] as unknown[]).length;
}

export async function getFirstClient(): Promise<Client | null> {
    const store = await readStore();
    return store?.clients?.[0] ?? null;
}

export async function getFirstProject(): Promise<Project | null> {
    const store = await readStore();
    return store?.projects?.[0] ?? null;
}

export async function getFirstInvoice(): Promise<Invoice | null> {
    const store = await readStore();
    return store?.invoices?.[0] ?? null;
}

export async function getFirstQuote(): Promise<Quote | null> {
    const store = await readStore();
    return store?.quotes?.[0] ?? null;
}

export async function getFirstEvent(): Promise<CalendarEvent | null> {
    const store = await readStore();
    return store?.events?.[0] ?? null;
}

export async function getFirstNote(): Promise<Note | null> {
    const store = await readStore();
    return store?.notes?.[0] ?? null;
}

export async function getFirstTask(): Promise<Task | null> {
    const store = await readStore();
    return store?.tasks?.[0] ?? null;
}

/**
 * Capture the size (in bytes) of the localStorage entry — used by
 * Settings tests when asserting backup/export behavior.
 */
export async function storageBytes(): Promise<number> {
    return browser.execute((key) => {
        const raw = localStorage.getItem(key) || '';
        return new Blob([raw]).size;
    }, STORAGE_KEY);
}