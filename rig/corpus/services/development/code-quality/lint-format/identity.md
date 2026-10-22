# development.code-quality.lint-format — identity

Policy grade: lint-format owns `code-quality.lint-format` on the `source-code` surface. Reuse component-owned formatter and lint tasks; read-only checks preserve source bytes and modes, and fixes need separate approval.

Disposition: executable. Native declarations in `rig-services/development.code-quality.lint-format.json` validate configuration only. Approved component setup binds actual formatter/linter commands. Policy observes those commands; Context additionally requires a current review with an explicit verdict; Evidence additionally replays commands and records a bound receipt. A requested grade never creates assurance on its own.

Typecheck, correctness-static-analysis, complexity-static and code-quality.code-review are adjacent exclusions. Lint-format does not replace their contracts or infer their outcomes from a formatter pass.

The onboarding prepare response includes `repository_inventory` with arbitrary
nested files and directories, including unfamiliar ecosystems. The host agent
assigns component meaning and task roles. Before proposing this service, record
its exact selection in repository-owned `rig-lint-format.json`:

```json
{
  "schema_version": 1,
  "scope": "diff",
  "components": [{
    "id": "component-name",
    "root": "packages/component",
    "ecosystem": "agent-described",
    "evidence_paths": ["packages/component/project.config"],
    "include": ["**"],
    "ignores": [],
    "format_check": {
      "argv": ["existing-checker", "{files}"],
      "source": "packages/component/project.config",
      "network": "none"
    }
  }],
  "excluded": [{ "root": "other-component", "reason": "User-approved exclusion" }]
}
```

For Context/Evidence, add the component's `lint` role using the same command
shape. Non-standard task names are valid; unresolved `options` or
`status: needs_user_choice` require a choice before proposal. Each `source`
is a repository path whose bytes define the rule/task; both that source and
the selection are frozen in the approved binding. `{files}` expands to
individual argv entries relative to the component cwd, preserving spaces.
Changed scope never widens a command without that placeholder; approve
`scope: repo` explicitly for a whole-component task. Eligible CI uses its
explicit whole scope. Excluded/uncovered paths remain visible and unprotected.
