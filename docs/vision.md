# What is Rig?

Rig is a shared engineering toolbox that gives your coding agents a consistent, safe, and governable workflow. It installs from a central library of instructions into your existing repository and lets you choose exactly the services your project needs — nothing more.

## The problem

Coding agents left to their own defaults are inconsistent: every developer gets a slightly different process, safety checks vary, and there is no audit trail. As teams scale agent use, governance becomes a manual burden. Rig solves this by giving every agent the same baseline and letting a human stay in control of what gets added.

## How it works

1. **Install.** Run the installer once. Rig's central library lands under `.rig/`, with host entrypoints alongside it. User content is preserved; Rig adds managed `.gitignore` lines and, after onboarding approval, marked instruction sections.
2. **Review the proposal.** Your coding agent (Claude, Copilot, Cursor, and others) runs `rig-onboarding`, inspects your project, and proposes the smallest useful set of changes, including relevant services and grades from the 115-service catalogue. You review and approve that exact adaptation.
3. **Apply and check.** The agent applies the approved adaptation and records its state under `.rig/state.json`. Each selected service reports what it can verify and names missing tools or coverage gaps. Later changes to the selection go through an updated proposal.

## What you get

- **Workflow consistency.** Every agent follows the same engineering process, regardless of who runs it or which AI model powers it.
- **A mandatory safety baseline.** Rig includes default-on controls for sanitation, drift prevention, secret handling, network/tool policy, and git/CI floors. You can disable individual controls; Rig reports what did not run. Onboarding approval covers the proposed adaptation.
- **À la carte services.** 115 catalogue entries across development, testing, security, and infrastructure — select only what applies to your project.
- **Works with your setup.** Rig starts from your existing instructions and tools. It does not replace them or require you to restructure your repository.

Rig's own source releases also use an owner-signed acceptance oracle and deployment checks. Those release scripts and workflows are not installed into your repository and do not guarantee human approval of every later project change.

## What Rig is not

- **Not a model or AI system.** Rig does not provide an AI. It works with the agent your team already uses.
- **Not a fixed bundle.** Rig does not install capability packages. Every service is selected deliberately; nothing runs unrequested.
- **Not a second infrastructure.** Rig reuses the tools already in your repository. Missing tools are reported as named gaps, not silently skipped.

## Learn more

- [Architecture](architecture.md) — how the pieces connect, with diagrams
- [Installation guide](install.md) — step-by-step setup
