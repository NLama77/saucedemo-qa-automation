# SauceDemo checkout automation

Playwright and TypeScript end-to-end tests for checkout information validation on
[SauceDemo](https://www.saucedemo.com/).

## Requirements

- Node.js 20 or newer
- npm
- Chromium (installed with the command below)

## Run locally

```sh
npm ci
npx playwright install chromium
npm run typecheck
npm test
```

The suite uses SauceDemo's public `standard_user` demo account by default. To
override the target site or credentials, set `BASE_URL`, `SAUCEDEMO_USERNAME`,
and `SAUCEDEMO_PASSWORD` in the environment. Do not commit credentials.

## Scenarios

`tests/checkout.spec.ts` covers:

- Successful submission of customer information for a cart with a product
- Visibility and enabled-state checks for checkout fields and buttons
- Required validation for First Name, Last Name, and Postal Code
- Navigation from products through checkout and cancellation back to products
- Expected-failure regression check that an empty-cart order cannot be completed

Assertions check the page reached, validation message, order summary, and order
completion result. Checkout screens and locators are encapsulated in reusable
page objects under `tests/pages/`. Shared page objects and authenticated-user
setup are provided by `tests/fixtures/test.fixture.ts`.

The empty-cart regression is annotated with Playwright's `test.fail()` while the
known Jira issue remains open. Its expected failure does not fail CI; if the
test starts passing, Playwright reports an unexpected pass so the annotation can
be removed when the issue is resolved.

## Reports

The test run prints a list reporter and writes an HTML report to
`playwright-report/`. Open the latest report with:

```sh
npm run test:report
```

Failure screenshots, traces, and other test artifacts are stored in
`test-results/`. Both report directories are ignored by Git.

## Continuous integration

The GitHub Actions workflow at `.github/workflows/playwright.yml` runs type
checking and the Chromium suite on pushes, pull requests, and manual dispatch.
It uploads the HTML report and test artifacts for 14 days, including on failure.
