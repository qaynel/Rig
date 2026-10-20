# development.code-quality.lint-format — minimal

Grade: minimal. Policy grade runs the approved formatter check for the changed scope. `lint-format-formatter-clean` requires the actual command to finish successfully; a declared command name or caller-supplied result cannot earn a pass.

A missing formatter is a setup gap. A failing formatter preserves its exit status. A check that changes source bytes or modes stops the run with before/after path evidence; further commands do not start. Formatting fixes require separate consent.

The native JSON configuration route checks only the `format_command` declaration. It does not run the formatter and cannot establish source cleanliness. Component setup binds the repository-owned executable command for that stronger check.
