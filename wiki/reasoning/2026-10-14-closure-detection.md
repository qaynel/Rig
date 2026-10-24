---
date: 2026-10-14
source: agent
topics: the-overhaul, the-catalogue, onboarding-flow
decisions:
status: historical
summary: Present malformed JSON and empty text service inputs remain discovered and carry an explicit repairable signal.
---
Done: T-4.7 red first: `node --test --test-name-pattern='present malformed JSON|present empty text' tests/catalogue-installed.test.js` — 2 fail because `repairable` was absent and empty text had no invalid reason. After updating `detectService`, `node --test tests/catalogue-installed.test.js` — 4 pass, 0 fail across JSON and text detector families. In flight: T-4.8. Next: add its missing-tool, unsupported-input, and runner-error cases.
