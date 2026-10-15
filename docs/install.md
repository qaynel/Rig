# Install and remove Rig

Rig needs `curl`, `tar`, POSIX `sh`, and Node.js. Run the installer from a Rig
checkout. It downloads the selected release, installs the shared instructions,
safety baseline, catalogue, and active runtime into the target repository, then
prints the next onboarding step.

## Fresh repository

Create or choose an empty repository directory and install Rig into it:

```sh
./install rig --version v6.0.0 --target /path/to/repository
```

In an agent working in that repository, invoke `rig-onboarding`. Review and
approve its proposed adaptation before applying it. Then select the catalogue
services and grades the project needs.

## Existing repository

Use the same command with the path to the existing repository:

```sh
./install rig --version v6.0.0 --target /path/to/existing-repository
```

Rig detects existing agent configuration and preserves files it does not own.
After installation, invoke `rig-onboarding` and review its proposal before
applying changes. Existing agent instructions remain the repository's source
of truth outside the Rig managed sections.

## Upgrade from v5

Install the current release into the v5 repository:

```sh
./install rig --version v6.0.0 --target /path/to/v5-repository
```

The installer updates the Rig managed payload. Then invoke `rig-onboarding` to
review the current repository and approve any proposed adaptation. Your
catalogue selection is stored in `rig.json`.

## Uninstall

Remove Rig's journaled files and managed instruction sections:

```sh
.rig/bin/rig uninstall --target /path/to/repository
```

To also remove Rig's recorded state and installed catalogue data, pass the
optional `--purge` flag:

```sh
.rig/bin/rig uninstall --target /path/to/repository --purge
```

Uninstall preserves repository files and edits that are not owned by Rig.
