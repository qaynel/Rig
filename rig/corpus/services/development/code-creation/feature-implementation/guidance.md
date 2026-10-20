# feature-implementation

Name observable outcomes before touching source. Keep the change inside the agreed files, and make compatibility expectations explicit.

Owned scope: `code-creation.feature-implementation`. Input: `rig-services/development.code-creation.feature-implementation.json`.

Coverage ceiling: Configuration validation only, so it confirms acceptance cases, change scope and compatibility notes are declared; it does not show the implemented feature meets them.

minimal: acceptance cases — ["creates an item","rejects invalid input"]. Write the observable acceptance cases before touching source. An empty list means no outcome defines done, so name what a user or caller will see.

mid: change scope — ["src/items.js"]. List the files or modules the change may touch. An empty scope lets edits spread unreviewed, so declare the agreed boundary.

maximal: compatibility — "preserve-existing-behavior". State the compatibility expectations for existing callers or data. Leaving them implicit hides breaking changes, so record what must keep working.
