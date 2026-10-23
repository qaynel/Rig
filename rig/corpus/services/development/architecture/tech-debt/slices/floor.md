# development.architecture.tech-debt — floor and mutation-floor slice

Define debt as an observable cost with an owner and an exit condition. A vague cleanup label without a completion condition cannot guide a useful maintenance change.

Policy grade slice `tech-debt-slice-floor`: List each debt item as an observable cost, not a cleanup label. An empty list gives maintenance work nothing to target, so name the concrete cost and where it lives.
