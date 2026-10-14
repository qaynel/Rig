# infrastructure.cicd.pipeline-definition — behavior-oracle slice

Policy grade slice. This slice bounds pipeline definition to cicd.pipeline-definition. It uses `pipeline-definition-slice-behavior-oracle` and checks stages (nonempty): stages must name the concrete repository contract..

For pipeline definition, choose a repository example that satisfies stages at the behavior-oracle floor, plus a failure where stages must name the concrete repository contract. is false. For pipeline definition, wire `behavior-oracle` to `rig-services/infrastructure.cicd.pipeline-definition.json` and keep its verdict on stages; missing evidence is a named gap, with ceiling pipeline definition configuration validation only; declared policy does not prove running pipeline definition behavior. Choose a repository-owned check that observes pipeline definition from rig-services/infrastructure.cicd.pipeline-definition.json..

Service-specific evidence cues:
Offer: Make build, verification and deployment ordering explicit in the pipeline. Deployment must be blocked when a required check fails rather than merely recording a red stage.
minimal: stages — ["build","test","deploy"].
mid: required checks — ["test"].
maximal: deploy after failed checks — false.
