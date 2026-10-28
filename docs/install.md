# Install Rig

## What you need

- **Git** — to fetch the installer
- **Node.js** — runs the Rig tooling
- **Python 3** — required only to migrate an existing v5 installation; fresh installs do not use it
- **A repository** — the project you want Rig installed into (existing or new)
- `curl`, `tar`, and a POSIX shell

---

## Quick install

Copy and run this. Replace `/path/to/repository` with your actual repo path.

```sh
git clone --depth 1 --branch v6.0.1 https://github.com/qaynel/Rig.git /tmp/rig-v6.0.1 && /tmp/rig-v6.0.1/install rig --version v6.0.1 --target /path/to/repository
```

Then open your agent and type: `rig-onboarding`

---

## Step by step

### Step 1 — Get the installer

This downloads the Rig installer at a pinned version so your install is reproducible.

```sh
git clone --depth 1 --branch v6.0.1 https://github.com/qaynel/Rig.git /tmp/rig-v6.0.1
```

You should see a standard `git clone` output finishing with "done."

### Step 2 — Run the install

This copies Rig's workflow, safety baseline, and catalogue into your repository. It preserves user content while adding Rig-owned files, host entrypoints, and managed `.gitignore` lines.

```sh
/tmp/rig-v6.0.1/install rig --version v6.0.1 --target /path/to/repository
```

When it finishes, your repository will have a `.rig/` directory. The full list of installed files is recorded in `.rig/install-manifest.jsonl`.

The default install does not install the optional MCP runtime or use npm, even
when it detects a host with MCP output. Add `--openclaw-mcp` only when you want
Rig to install its MCP runtime and register the server in OpenClaw. For a v5
upgrade whose selected host emits MCP configuration, set `SETUP_MCP=1` before
running the installer to install the runtime without registering it in
OpenClaw. This migration-only request is ignored on fresh installs; ordinary
upgrades without it do not run npm or create the MCP runtime descriptor.

### Step 3 — Start onboarding

This is where Rig learns about your project. In your agent (Claude, Copilot, etc.), type:

```
rig-onboarding
```

The agent reads your repository and proposes the smallest useful adaptation — which services to enable, which workflow steps apply to your stack.
Before a sensitive action, it also asks you to select a sign-off mode. The choice
is explicit and recorded; a missing signing key never switches to a weaker mode.
Cryptographic mode verifies the enrolled owner key. Acknowledgement is only a
self-declaration that an agent with file access could forge. Platform mode is
currently selectable but refuses approvals until a verified platform adapter
is available.

### Step 4 — Review and approve

Review the proposed adaptation, including its services and grades. The agent applies these repository changes only after you approve the exact proposal. Onboarding records the proposal and applied state in `.rig/state.json`; there is no separate service picker. To change the selection later, ask the agent to prepare an updated proposal for approval.

---

## Native host integrations (optional)

If you want deeper plugin support beyond the base install, pick your host:

| Host | Command |
|---|---|
| GitHub Copilot CLI | `copilot plugin marketplace add qaynel/Rig`, then `copilot plugin install rig@rig` |
| Hermes Agent | Native plugin — no extra step; `plugin.yaml` ships with Rig |
| Swival | `swival skills add https://github.com/qaynel/Rig` |
| OpenClaw | `clawhub install rig` |
| Devin | `devin plugins install qaynel/Rig` |

---

## Upgrade from v5

Run the same install command pointing at your existing v5 repository:

```sh
/tmp/rig-v6.0.1/install rig --version v6.0.1 --target /path/to/v5-repository
```

First fetch the installer using Step 1 above if you have not already done so. Your existing configuration and legacy catalogue selection (`rig.json`) are preserved. Current adaptive onboarding selects services in its approved proposal and records state in `.rig/state.json`. After the install, run `rig-onboarding` once to review and approve the updated proposal.

Any requested MCP dependency setup and explicit `--openclaw-mcp` registration
finish as part of the upgrade command. The descriptor and dependencies are
recorded for uninstall; if setup or registration fails, the command exits with
an error and can be rerun after fixing the cause.

Migration may report `migration-temp-retained` and leave
`.rig-migration.json.tmp` in the repository root. This is a recovery copy:
Rig preserves it because another process could replace the pathname during
cleanup. Uninstall preserves it too; inspect it before any manual removal.

## Uninstall

Remove unchanged Rig-owned files and managed instruction sections. Reports and user-owned policy files remain; later user edits are preserved and reported as best-effort cases:

```sh
.rig/bin/rig uninstall --target /path/to/repository
```

Also clean up ledger-owned generated evidence, including generated reports: restore recorded originals where present, otherwise remove unchanged owned output. Unowned reports and user edits are preserved:

```sh
.rig/bin/rig uninstall --target /path/to/repository --purge-generated
```

**Broad purge:** also delete the entire `reports/rig/` directory, including pre-existing reports and user-created report history. Edited user policy files are still preserved:

```sh
.rig/bin/rig uninstall --target /path/to/repository --purge
```

---

## Troubleshooting

- Common errors and fixes: [docs/troubleshooting.md](troubleshooting.md)
- Per-host entrypoint details: [docs/agent-portability.md](agent-portability.md)
