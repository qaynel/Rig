# Rig

Rig is a toolbox for coding agents. It provides shared workflow instructions,
a mandatory agent-technology safety baseline, and an à-la-carte catalogue of
engineering services. Your repository's agent inspects the project and proposes
relevant services and grades; you review and approve the exact adaptation. Rig
does not install fixed capability tiers.

## Install

On a machine with Git, run this command to fetch the 6.0.1 installer and install
Rig into a repository:

```sh
git clone --depth 1 --branch v6.0.1 https://github.com/qaynel/Rig.git /tmp/rig-v6.0.1 && /tmp/rig-v6.0.1/install rig --version v6.0.1 --target /path/to/repository
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

## After install

In your agent, invoke `rig-onboarding`. It inspects the repository and prepares
a proposed adaptation, including any relevant catalogue services and grades.
Review and approve that proposal before it changes the repository; there is no
separate service-picker step.

## Where to go next

**Installing Rig** — Step-by-step setup with commands and explanations. → [Installation guide](docs/install.md)

**Understanding the product** — What Rig does for your team and why. → [Product overview](docs/vision.md)

**Understanding the architecture** — How Rig works under the hood, with diagrams. → [Architecture](docs/architecture.md)

**Going deeper** — Per-host entrypoints, MCP config, advanced operator guide.
→ [Host portability](docs/agent-portability.md) · [Operator guide](docs/advanced/operator.md) · [Project wiki](https://github.com/qaynel/Rig/wiki)

## Community

Project policies and how to take part.
→ [Code of Conduct](CODE_OF_CONDUCT.md) · [Contributing](CONTRIBUTING.md) · [Open-source standards](docs/open-source-standards.md) · [Security](SECURITY.md) · [Accessibility](ACCESSIBILITY.md) · [Support](SUPPORT.md) · [License](LICENSE)
