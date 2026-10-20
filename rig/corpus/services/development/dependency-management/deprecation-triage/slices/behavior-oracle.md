# development.dependency-management.deprecation-triage — behavior-oracle slice

Identify each deprecated API and assign a migration owner. Removal deadlines remain explicit; warning suppression is not a substitute for replacing a disappearing dependency.

Policy grade slice `deprecation-triage-slice-behavior-oracle`: List each deprecated API in use by name and version. A missing list means a disappearing dependency goes unnoticed, so enumerate them. Despite its name this slice is not a behavior oracle: it confirms deprecated APIs, replacement owners and the deadline-handling flag are declared; it does not show the migration is done.
