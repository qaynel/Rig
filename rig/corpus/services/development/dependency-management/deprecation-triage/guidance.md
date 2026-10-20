# deprecation-triage

Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Owned scope: `dependency-management.deprecation-triage`. Input: `rig-services/development.dependency-management.deprecation-triage.json`.

Coverage ceiling: Configuration validation only, so it confirms deprecated APIs, replacement owners and the deadline-handling flag are declared; it does not show the migration is done.

minimal: deprecated apis — ["legacyClient"]. List each deprecated API in use by name and version. A missing list means a disappearing dependency goes unnoticed, so enumerate them.

mid: replacement owners — ["platform"]. Name an owner for each replacement. Unowned migrations stall until removal breaks the build, so assign a person or team.

maximal: ignore removal deadline — false. Set ignoring the removal deadline to false. Suppressing a warning does not stop the dependency disappearing, so track the removal date explicitly.
