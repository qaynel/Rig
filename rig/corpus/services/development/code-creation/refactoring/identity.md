# development.code-creation.refactoring — identity

refactoring owns code-creation.refactoring. A refactor changes structure while preserving behavior. Enumerate the observable contract and keep public API changes at zero; retain a direct way to revert the restructuring.

Keep sibling services in code-creation under their own verdicts. Tie acceptance to the configured input at `rig-services/development.code-creation.refactoring.json`; malformed input is still attributed to that path.

Disposition: convention. Read the limit: refactoring configuration validation only; declared policy does not prove running refactoring behavior. Select an approved repository-owned command to verify that behavior.

Acceptance target: fixture:development.code-creation.refactoring:policy-boundary. Given source-code is present and code-creation.refactoring is selected, pass only when the repository binding evaluates code-creation.refactoring and returns zero; fail when the binding is missing, unreadable, exits nonzero, or claims an adjacent code creation concern.
