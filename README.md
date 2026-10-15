# Rig

Rig is a toolbox for coding agents. It provides a shared set of workflow
instructions, a mandatory agent safety baseline, and an à-la-carte catalogue
of engineering services. You choose the services and assurance grades that
fit your repository; Rig does not install fixed capability tiers.

## Install

On a machine with Git, run this command to fetch the 6.0.0 installer and install
Rig into a repository:

```sh
git clone --depth 1 --branch v6.0.0 https://github.com/qaynel/Rig.git /tmp/rig-v6.0.0 && /tmp/rig-v6.0.0/install rig --version v6.0.0 --target /path/to/repository
```

The installer detects existing agent configuration and adds the shared Rig
instructions, safety baseline, catalogue, and active runtime. It records the
installed files in `.rig/install-manifest.jsonl`.

## Install Full Plugin Distribution

Rig also ships native adapters for hosts that support plugins, extensions,
commands, hooks, or statusline integrations. The corpus install above is the
base layer; use these host integrations when you want their native install
surface.

| Host | Install / load path |
|---|---|
| GitHub Copilot CLI | `copilot plugin marketplace add qaynel/Rig`, then `copilot plugin install rig@rig` |
| Hermes Agent | Native plugin in `plugin.yaml`; see below |
| Swival | `swival skills add https://github.com/qaynel/Rig` |
| OpenClaw | `clawhub install rig` |
| Devin | `devin plugins install qaynel/Rig` |

### Hermes Agent

Install Rig as a native Hermes plugin (`plugin.yaml`). It injects the active
mode through `pre_llm_call`, registers `/rig` mode switching, and exposes the
skills as `rig:<skill>`.

## What happens next

In your agent, invoke `rig-onboarding`. It inspects the repository and prepares
a proposed adaptation. Review and approve that proposal before it changes the
repository. You can then select catalogue services and grades for the project.

Rig grafts the selected guidance onto the repository's existing agent setup.
The result is a focused workflow toolkit, a safety baseline, and only the
engineering services you selected. Installation does not run onboarding or
apply an adaptation automatically.

## Learn more

- [Install and upgrade guide](docs/install.md)
- [Operator guide](docs/advanced/operator.md)
- [Product vision](docs/vision.md)
- [Rig project knowledge](wiki/agent-primer.md)
