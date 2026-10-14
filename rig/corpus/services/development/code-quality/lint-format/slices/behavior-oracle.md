# development.code-quality.lint-format — behavior-oracle slice

Policy grade slice. This slice bounds lint format to code-quality.lint-format. It uses `lint-format-slice-behavior-oracle` and checks format_command (nonempty): format command must name the concrete repository contract..

For lint format, choose a repository example that satisfies format_command at the behavior-oracle floor, plus a failure where format command must name the concrete repository contract. is false. For lint format, wire `behavior-oracle` to `rig-services/development.code-quality.lint-format.json` and keep its verdict on format_command; missing evidence is a named gap, with ceiling lint format configuration validation only; declared policy does not prove running lint format behavior. Choose a repository-owned check that observes lint format from rig-services/development.code-quality.lint-format.json..

Service-specific evidence cues:
Offer: Reuse the component-owned formatter and lint tasks. Read-only verification must preserve source bytes; invoke autofix only under a separately approved action.
minimal: format command — ["npm","run","format:check"].
mid: lint command — ["npm","run","lint"].
maximal: autofix during check — false.
