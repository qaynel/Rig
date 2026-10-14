# development.code-quality.lint-format — floor and mutation-floor slice

Policy grade slice. This slice bounds lint format to code-quality.lint-format. It uses `lint-format-slice-floor` and checks format_command (nonempty): format command must name the concrete repository contract..

Read a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.code-quality.lint-format.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than lint format configuration validation only; declared policy does not prove running lint format behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.

Owned scope: `code-quality.lint-format`.

Offer: Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.

Input: `rig-services/development.code-quality.lint-format.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: lint format configuration validation only; declared policy does not prove running lint format behavior. Select an approved repository-owned command to verify that behavior.

minimal: format command — ["npm","run","format:check"].

mid: lint command — ["npm","run","lint"].

maximal: autofix during check — false.
