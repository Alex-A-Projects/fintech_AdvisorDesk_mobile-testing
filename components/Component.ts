/**
 * Component — base class for every reusable UI widget in the suite.
 *
 * The mobile demo is the same DOM as the desktop demo, just
 * viewport-scaled; selectors are therefore CSS / XPath / link text
 * keyed off stable IDs and `data-*` attributes from the source HTML.
 */
export abstract class Component {
    /** Hook for subclasses to assert their root is on the page. */
    abstract assertLoaded(): Promise<void>;
}