# lint format

Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.

Owned scope: `code-quality.lint-format`.

Offer: Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.

Input: `rig-services/development.code-quality.lint-format.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: lint format configuration validation only; declared policy does not prove running lint format behavior. Select an approved repository-owned command to verify that behavior.

minimal: format command — ["npm","run","format:check"].

mid: lint command — ["npm","run","lint"].

maximal: autofix during check — false.
