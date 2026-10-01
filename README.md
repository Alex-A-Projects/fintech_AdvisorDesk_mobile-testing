# AdvisorDesk Mobile-Web Test Framework

Mobile end-to-end tests for the [AdvisorDesk financial-advisor demo](https://cdn.shopify.com/s/files/1/0604/1550/8613/t/1/assets/demo-financial-advisors.html),
driving **Safari on an iPhone 17 Pro Simulator** and **Chrome on a Samsung Galaxy S25 Emulator** via **WebdriverIO + Appium 2**.

This is the mobile-web counterpart to the sibling Playwright project
(`fintech_AdvisorDesk_playwright-typescript`). It exercises the same DOM
on real mobile browsers — not Playwright's emulation, not native shells —
and is structured so the same suite can run on either platform with a
single npm script swap.

## What's covered

| Area | Spec | Highlights |
|---|---|---|
| Dashboard | `tests/dashboard.spec.ts` | KPI cards, theme, store snapshot, responsive assertions |
| Clients | `tests/clients.spec.ts` | List, search, status filter, add / edit / delete |
| Projects | `tests/projects.spec.ts` | List + board view toggle, CRUD, detail page |
| Tasks | `tests/tasks.spec.ts` | List, CRUD, toggle done, filter, bulk create (20) |
| Invoices | `tests/invoices.spec.ts` | List, status filter, create, detail page |
| Quotes | `tests/quotes.spec.ts` | List, Add modal |
| Calendar | `tests/calendar.spec.ts` | Month grid, prev / next / today navigation |
| Notes | `tests/notes.spec.ts` | List, search, Quick Add create |
| Reports | `tests/reports.spec.ts` | Renders charts / KPIs |
| Integrations | `tests/integrations.spec.ts` | Integration cards + connect buttons |
| Settings | `tests/settings.spec.ts` | Profile, theme, accent, sample data, version |
| Global UI | `tests/global.spec.ts` | Quick Add, global search, modal lifecycle, toast |
| Navigation | `tests/navigation.spec.ts` | Sidebar sweep across all 11 routes |

## Prerequisites

You provide these — this repo does **not** install them:

| Need | Where it runs |
|---|---|
| Node.js 20+ | Your machine |
| Xcode 16+ (with iOS 26 simulator runtime) | macOS host (iOS runs only here) |
| Android Studio + an Android 15 system image | Any host (iOS or Linux / Windows with hardware acceleration) |
| Appium 2 (`npm i -g appium`) | Same host that runs the simulator/emulator |
| Appium drivers | `appium driver install xcuitest` and `appium driver install uiautomator2` |
| A booted simulator / emulator | `xcrun simctl boot "iPhone 17 Pro"` or `emulator -avd GalaxyS25` |

Verify your simulator is bootable:

```bash
xcrun simctl list devices booted      # iOS
adb devices                          # Android
```

## Setup

```bash
# 1. Install Node dependencies
npm install

# 2. (Optional) tweak .env to match your local environment
cp .env.example .env

# 3. Install Appium drivers (one-time)
appium driver install xcuitest
appium driver install uiautomator2
```

## Running the suite

The framework expects three things running concurrently:

1. **The demo server** — `npm run server` (serves `./public` on `:8765`)
2. **Appium** — `appium` (default `http://localhost:4723`)
3. **The platform under test**:
   - iOS Simulator booted with iPhone 17 Pro on iOS 26
   - OR Android Emulator booted with Galaxy S25 on Android 15

Open three terminals:

```bash
# Terminal 1
npm run server

# Terminal 2
appium

# Terminal 3 (one of the following)
npm run test:ios
npm run test:android
npm run test:both          # runs android first, then ios
```

You can override device / version / udid via env vars (see `.env.example`):

```bash
IOS_UDID=00000000-0000000000000000 npm run test:ios
ANDROID_DEVICE="Pixel 9" ANDROID_UDID=emulator-5554 npm run test:android
```

## Reports

Two reporters run by default:

| Reporter | Where | Open with |
|---|---|---|
| `spec` (stdout) | live console | tail of `npm run test:ios` / `npm run test:android` |
| `allure` (HTML) | `./allure-results/` (raw) and `./allure-report/` (rendered) | `npm run allure:generate && npm run allure:open` |

### Screenshots on failure

The shared config's `afterTest` hook saves a per-failure screenshot to
`./allure-results/{safe-test-title}.png` whenever a test errors. They're
picked up by the Allure report automatically.

## Framework layout

```
.
├── pages/             # 15 Screen Objects (one per demo page + detail pages)
├── components/        # 6 reusable UI widgets (Sidebar, Modal, Toast, …)
├── utils/             # helpers, data-store (localStorage), test-data (faker)
├── fixtures/          # bootstrap — seeds sample data before each test
├── tests/             # 13 spec files (~80+ test cases)
├── public/            # demo.html (locally-served copy of the AdvisorDesk demo)
├── config/            # environments.ts — BASE_URL, Appium, device defaults
├── types/             # TypeScript domain types (mirrors sibling Playwright project)
├── wdio.shared.conf.ts
├── wdio.ios.conf.ts
├── wdio.android.conf.ts
└── package.json
```

## Why a local `demo.html`?

The AdvisorDesk demo is hosted on the Shopify CDN, but the CDN serves
it inside a **sandboxed iframe** that blocks `localStorage` access.
Every CRUD test in this framework relies on localStorage (the demo
persists state under `bizdash_financial-advisors-demo`), so we serve
the demo from `./public/demo.html` instead.

The `public/demo.html` checked into this repo is a verbatim copy of
the CDN-hosted demo; if Shopify publishes a newer demo, refresh it
with:

```bash
curl -o public/demo.html https://cdn.shopify.com/s/files/1/0604/1550/8613/t/1/assets/demo-financial-advisors.html
```

## Mobile-web vs native-app caveats

This framework is **mobile-web**, not native. Notable differences:

| Concern | Mobile-web (this) | Native-app |
|---|---|---|
| Selector strategy | CSS / XPath / link text | `accessibility id` / `predicate string` / `-ios class chain` |
| Auth | Same as desktop | App-specific unlock / biometric prompts |
| Gestures | `browser.touchPerform` | `mobile:swipe`, `mobile:scroll` |
| Push notifications | Not testable | `mobile:pushNotification` |
| Hardware (camera, GPS) | Not testable | `mobile:setLocation` |

If you need any of the right-column capabilities, swap `browserName` from
`Safari` / `Chrome` to an `Application` capability and supply an `app`
path — the rest of the suite stays the same.

## Lint

```bash
npm run lint
```

Runs `tsc --noEmit` over every TS file. Should pass cleanly on a clean
checkout.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `ECONNREFUSED 127.0.0.1:4723` | Appium isn't running | Start `appium` in another terminal |
| `Could not find device "iPhone 17 Pro"` | Simulator runtime not installed | `xcrun simctl runtime add "iOS-26-0"` (or whatever SDK you have) |
| `no such element: #content` | Demo server not running | Start `npm run server` in another terminal |
| All tests fail at "waiting for App.loadSampleData" | Demo JS hasn't initialized | Reload the demo in the simulator; check the browser console |
| iOS Safari stuck on "Safari cannot connect" | Simulator can't reach `http-server` on the host | Use `localhost` (already configured); Appium ports the simulator's loopback to the host |
| Screenshot on failure is blank | Browser session closed before screenshot fired | Check `afterTest` ordering in `wdio.shared.conf.ts` |

## License

MIT — feel free to fork and adapt.