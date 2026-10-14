# development.documentation.docstrings — behavior-oracle slice

Policy grade slice. This slice bounds docstrings to documentation.docstrings. It uses `docstrings-slice-behavior-oracle` and checks documented_symbols (nonempty): documented symbols must name the concrete repository contract..

For docstrings, choose a repository example that satisfies documented_symbols at the behavior-oracle floor, plus a failure where documented symbols must name the concrete repository contract. is false. For docstrings, wire `behavior-oracle` to `rig-services/development.documentation.docstrings.json` and keep its verdict on documented_symbols; missing evidence is a named gap, with ceiling docstrings configuration validation only; declared policy does not prove running docstrings behavior. Choose a repository-owned check that observes docstrings from rig-services/development.documentation.docstrings.json..

Service-specific evidence cues:
Offer: Document the externally visible parameters and failure behavior of public symbols. A reader must be able to use the function without reconstructing its implementation.
minimal: documented symbols — ["parseRecord"].
mid: parameters — ["raw: serialized record"].
maximal: failure contract — "throws on malformed records".
