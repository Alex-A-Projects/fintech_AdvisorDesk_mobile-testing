/**
 * AdvisorDesk — Domain Types
 * Mirrors the public type definitions from the sibling
 * `fintech_AdvisorDesk_playwright-typescript` project. Kept here so
 * the mobile suite doesn't reach across to a non-mobile project for
 * shared types.
 */

export type PageName =
    | 'dashboard'
    | 'clients'
    | 'projects'
    | 'tasks'
    | 'invoices'
    | 'quotes'
    | 'calendar'
    | 'notes'
    | 'reports'
    | 'integrations'
    | 'settings';

export type Theme = 'light' | 'dark';

export type ClientStatus = 'lead' | 'active' | 'past' | 'archived';

export type ProjectStage = 'lead' | 'in_progress' | 'review' | 'done';

export type InvoiceStatus = 'draft' | 'sent' | 'paid';

export type IntegrationProvider =
    | 'stripe'
    | 'shopify'
    | 'square'
    | 'paypal'
    | 'notion'
    | 'quickbooks'
    | 'xero'
    | 'google';

export interface Address {
    street?: string;
    city?: string;
    state?: string;
    zip?: string;
    country?: string;
}

export interface Client {
    id: string;
    name: string;
    company?: string;
    email?: string;
    phone?: string;
    status: ClientStatus;
    source?: string;
    address?: string;
    notes?: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface Project {
    id: string;
    name: string;
    clientId: string;
    stage: ProjectStage;
    value?: number;
    startDate?: string;
    endDate?: string;
    notes?: string;
    createdAt?: number;
    updatedAt?: number;
}

export interface Task {
    id: string;
    title: string;
    done: boolean;
    clientId?: string;
    projectId?: string;
    dueDate?: string;
    priority?: 'low' | 'med' | 'high';
    createdAt?: number;
    updatedAt?: number;
}

export interface InvoiceLine {
    description: string;
    qty: number;
    rate: number;
}

export interface Invoice {
    id: string;
    number: string;
    clientId: string;
    projectId?: string;
    status: InvoiceStatus;
    issueDate: string;
    dueDate: string;
    lines: InvoiceLine[];
    notes?: string;
    subtotal?: number;
    tax?: number;
    total?: number;
    createdAt?: number;
    updatedAt?: number;
}

export interface Quote {
    id: string;
    number: string;
    clientId: string;
    projectId?: string;
    status: 'draft' | 'sent' | 'accepted' | 'declined';
    issueDate: string;
    validUntil: string;
    lines: InvoiceLine[];
    total?: number;
    createdAt?: number;
    updatedAt?: number;
}

export interface CalendarEvent {
    id: string;
    title: string;
    date: string; // ISO date YYYY-MM-DD
    time?: string;
    clientId?: string;
    projectId?: string;
    notes?: string;
}

export interface Note {
    id: string;
    title: string;
    body: string;
    clientId?: string;
    projectId?: string;
    updatedAt?: number;
    createdAt?: number;
}

export interface IntegrationConfig {
    id: IntegrationProvider;
    name: string;
    connected: boolean;
    config?: Record<string, unknown>;
}

export interface TimeLog {
    id: string;
    projectId: string;
    startTs: number;
    endTs?: number;
    notes?: string;
    billed?: boolean;
}

export interface Settings {
    businessName?: string;
    ownerName?: string;
    logo?: string;
    theme: Theme;
    onboarded: boolean;
    lastBackupNudge?: number;
    currency?: string;
    taxRate?: number;
    accent?: string;
}

export interface AppStore {
    clients: Client[];
    projects: Project[];
    tasks: Task[];
    invoices: Invoice[];
    quotes: Quote[];
    events: CalendarEvent[];
    notes: Note[];
    timelogs: Array<{ id: string; projectId: string; startTs: number; endTs?: number; notes?: string }>;
    integrations: Record<string, IntegrationConfig>;
    settings: Settings;
    activity: Array<{ id: string; type: string; entity: string; message: string; ts: number }>;
}

/** Platform identifier surfaced by WebdriverIO's `browser.isMobile` + cap. */
export type MobilePlatform = 'ios' | 'android';