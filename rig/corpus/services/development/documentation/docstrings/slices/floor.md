# development.documentation.docstrings — floor and mutation-floor slice

Policy grade slice. This slice bounds docstrings to documentation.docstrings. It uses `docstrings-slice-floor` and checks documented_symbols (nonempty): documented symbols must name the concrete repository contract..

Start from a concrete repository example that would pass this floor and mutation-floor floor and a nearby failure that must remain visible. Wire the slice to the repository-owned source named by `rig-services/development.documentation.docstrings.json`; if that source or its binding is absent, report a named coverage gap. This slice does not establish more than docstrings configuration validation only; declared policy does not prove running docstrings behavior. Select an approved repository-owned command to verify that behavior..

Service-specific evidence cues:
Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Owned scope: `documentation.docstrings`.

Offer: Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.

Input: `rig-services/development.documentation.docstrings.json`. Detection records the path even when its contents are malformed.

Coverage ceiling: docstrings configuration validation only; declared policy does not prove running docstrings behavior. Select an approved repository-owned command to verify that behavior.

minimal: documented symbols — ["parseRecord"].

mid: parameters — ["raw: serialized record"].

maximal: failure contract — "throws on malformed records".
