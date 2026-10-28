# Architecture

This page shows how Rig is structured through three diagram views, from the highest-level overview down to the internal file layout. For per-host entrypoint and MCP configuration details, see [agent-portability.md](agent-portability.md).

---

## View 1 — What Rig connects

Rig projects a central library into repositories. The repository's agent proposes an adaptation, including services and grades; a human approves that exact proposal before it is applied.

```mermaid
flowchart LR
    A([Rig Corpus]) --> B(Installer)
    B --> C[Target Repository]
    C -->|inspect| D([Host Agent])
    D -->|proposed adaptation| E{Human Approver}
    E -->|approved adaptation| C
```

---

## View 2 — How installation works

Installation adds the corpus, runtime, and host entrypoints first. The agent then proposes services, grades, and repository changes; only the approved adaptation is applied.

```mermaid
flowchart TD
    A(Run install command) --> B[Corpus and runtime in .rig/, host entrypoints alongside]
    B --> C(Agent invokes rig-onboarding)
    C --> D(Agent inspects repository)
    D --> E(Agent proposes adaptation, services and grades)
    E --> F{Human reviews and approves}
    F --> G(Journaled changes applied)
    G --> H[Proposal and applied state in .rig/state.json]
    H --> I(Agent checks result)
```

---

## View 3 — What lives where

The target repository contains `.rig/` plus host entrypoints and managed sections outside it. Rig's source-release checks are separate: the signed acceptance oracle is Gate 1, Gate 2 is the working technical design checked for presence, and deployment checks govern Rig releases. These release scripts and workflows are not installed into the target.

The installed baseline records the repository owner's sign-off selection.
Cryptographic approvals use Rig's existing trust root. Acknowledgement is
unsigned and labeled as such. Platform mode has no verified adapter yet, so it
refuses approvals. Public release evidence checks current security and review
readiness for every sign-off mode.

```mermaid
flowchart TB
    subgraph Corpus ["Rig Corpus (rig/corpus/)"]
        R[rules/]
        SK[skills/]
        ST[standards/]
        CAT[catalogue — 115 services]
    end

    subgraph Target ["Target repository"]
        subgraph Installed [".rig/"]
            IC[corpus and runtime]
            IS[state.json]
            IM[install-manifest.jsonl]
        end
        HE[host entrypoints outside .rig/]
        ME[approved managed sections in repository instructions]
    end

    subgraph Gov ["Rig source repository — release governance"]
        G1{Gate 1 — signed oracle\ncheck-advanced-spec.js}
        G2[Gate 2 — working technical design\nchecked for presence, not frozen]
        DG{Deployment checks\ncheck-deployment-gate.js}
        G1 --> DG
        G2 --> DG
    end

    TP([Third-party skills]) -->|fetched + digest-verified\nduring onboarding| Target

    Corpus -->|installer| Target
```

Third-party skills are fetched from pinned upstream sources and digest-verified during approved onboarding. Service selection belongs to that proposal and its recorded state; `rig.json` remains a legacy configurator path.

---

## Reference

- [Installation guide](install.md) — step-by-step setup
- [Host portability details](agent-portability.md) — per-host entrypoints and MCP config
