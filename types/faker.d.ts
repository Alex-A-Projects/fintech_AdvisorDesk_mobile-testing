/**
 * Minimal type shim for `faker` (no official @types/faker on this
 * major version). The runtime API is rich; we only annotate the
 * surface that `utils/test-data.ts` actually uses.
 */
declare module 'faker' {
    const faker: {
        seed(value: number): void;
        company: {
            companyName(): string;
            bs(): string;
        };
        internet: {
            email(): string;
            userName(): string;
        };
        phone: {
            phoneNumber(format: string): string;
        };
        address: {
            streetAddress(): string;
            city(): string;
        };
        random: {
            arrayElement<T>(arr: readonly T[]): T;
            number(opts: { min: number; max: number }): number;
        };
        lorem: {
            sentence(words?: number): string;
            words(count: number): string[];
            paragraph(): string;
        };
        date: {
            recent(days: number): Date;
            soon(days: number): Date;
        };
        name: {
            firstName(): string;
            lastName(): string;
        };
    };
    export default faker;
}