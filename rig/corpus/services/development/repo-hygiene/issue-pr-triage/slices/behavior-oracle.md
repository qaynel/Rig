# development.repo-hygiene.issue-pr-triage — behavior-oracle slice

Policy grade slice. This slice bounds issue pr triage to repo-hygiene.issue-pr-triage. It uses `issue-pr-triage-slice-behavior-oracle` and checks triage_labels (nonempty): triage labels must name the concrete repository contract..

For issue pr triage, choose a repository example that satisfies triage_labels at the behavior-oracle floor, plus a failure where triage labels must name the concrete repository contract. is false. For issue pr triage, wire `behavior-oracle` to `rig-services/development.repo-hygiene.issue-pr-triage.json` and keep its verdict on triage_labels; missing evidence is a named gap, with ceiling issue pr triage configuration validation only; declared policy does not prove running issue pr triage behavior. Choose a repository-owned check that observes issue pr triage from rig-services/development.repo-hygiene.issue-pr-triage.json..

Service-specific evidence cues:
Offer: Route issues using meaningful labels and an accountable owner. Closing a report needs a written disposition or proving fix; inactivity alone does not resolve the problem.
minimal: triage labels — ["bug","needs-reproduction"].
mid: responsible owners — ["maintainers"].
maximal: close without disposition — false.
