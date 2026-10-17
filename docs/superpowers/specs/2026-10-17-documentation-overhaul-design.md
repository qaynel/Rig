---
status: superseded
date: 2026-10-17
summary: Implemented with docs/vision.md reused as the product overview instead of adding docs/product.md; corrected onboarding, removal and source-release boundaries are documented in the linked resolution trace.
implementation: docs/vision.md, docs/architecture.md, docs/install.md
resolution: ../../../wiki/reasoning/2026-10-17-documentation-review-corrections.md
---

# Documentation Overhaul — Design

**Date:** 2026-10-17<br>
**Author:** Vaibhav Kodiyan

---

## Intent and why

The existing docs are either engineer-facing or incomplete. A new PM landing on Rig has no dedicated product description. A first-time installer has to piece together steps from a thin `install.md`. There's no architecture picture to orient an engineer. Translations exist but haven't been synced to recent changes. Docs updates are not gated by change management.

Goal: a coherent, audience-targeted doc set where every reader lands in the right place within 15 seconds.

---

## Goals

- PM can understand the product offering without reading code or wiki
- Engineer can understand the architecture at their chosen depth
- First-time installer can follow steps they've never seen before ("explain it to a 5-year-old")
- README is the front door — indexes everything, nothing else
- Translations stay in sync with the English README
- Future releases are blocked if docs haven't been updated

## Non-goals

- Internal wiki content (`wiki/`) — that stays as-is
- Advanced operator guide (`docs/advanced/operator.md`) — not in scope
- Troubleshooting doc — not in scope
- Writing content per-host (North Star 1: one central corpus)

## Anti-goals

- Architecture diagram so deep it leaks into a product review (use multi-level views)
- Product description so technical a PM has to google terms
- Install guide that assumes the reader knows what an agent is

---

## Constraints

- Mermaid diagrams only (no external image hosting)
- No tier/Tier 1/Tier 2 language anywhere (North Star 8)
- Docs must stay in the `docs/` directory pattern already established
- Change management amendment must be additive (one new step, not a restructure)

---

## The doc set

### 1. `README.md` — Front door (update)

**Audience:** anyone, first encounter<br>
**Philosophy:** gets you oriented in 15 seconds, then routes you to the right place<br>
**Content:**
- One-line headline: what Rig is
- One-line value proposition: what problem it solves
- 3 audience cards: "I'm installing Rig", "I want to understand the product", "I'm an engineer"
- Each card has one sentence and one link
- Quick install command (the one-liner git clone + install)
- Links to: product.md, architecture.md, install.md

**What changes:** restructure the "Learn more" section into audience cards; keep the install command.

---

### 2. `docs/product.md` — Product description (new)

**Audience:** product manager, executive, evaluator<br>
**Philosophy:** business outcomes, no jargon, "what does this do for my team?"<br>
**Content:**
- What Rig is (one paragraph, plain English: "Rig makes coding agents follow a consistent engineering process in your team's codebase")
- The problem it solves (agents without Rig are inconsistent, unsafe, and hard to govern)
- How it works at a glance (3 steps: install → onboard → select services)
- What you get (workflow consistency, safety baseline, à la carte services)
- What Rig is not (not a model, not a fixed bundle, not a second infrastructure)
- Link to architecture.md for technical depth

---

### 3. `docs/architecture.md` — Architecture description (new)

**Audience:** engineer, technical PM<br>
**Philosophy:** multi-level views, visual consistency, Mermaid diagrams<br>
**Content — three views:**

**View 1: System context (highest level)**
- Mermaid C4-style context diagram
- Shows: Rig corpus, installer, target repository, host agent, human approver
- ~5 nodes, no internals

**View 2: Installation flow**
- Mermaid flowchart (LR or TD)
- Shows: git clone → install script → corpus lands in `.rig/` → agent invokes `rig-onboarding` → human approves proposal → services selected → journaled changes applied
- ~8 steps

**View 3: Runtime structure (deepest level)**
- Mermaid block or subgraph diagram
- Shows the internal anatomy: corpus (`rules/`, `skills/`, `catalogue/`, `standards/`), `.rig/` managed sections, gates (Gate 1: signed oracle, Gate 2: deployment), third-party skill fetch + digest verify
- ~15 nodes across 3 subgraphs

Each view has a 2-sentence prose summary above it. Visual style: consistent node shapes per entity type (rectangles for files/dirs, rounded for processes, diamonds for decisions).

---

### 4. `docs/install.md` — Installation guide (overhaul)

**Audience:** first-time installer, 5-year-old philosophy<br>
**Philosophy:** explain every step, assume nothing, visible commands, short headings, scannable<br>
**Content:**

```
## What you need (30 seconds)
## Step 1: Get the installer
## Step 2: Run the install command
## Step 3: Start onboarding
## Step 4: Review and approve
## Step 5: Select services
## Upgrading from v5
## Uninstalling
```

Each step has:
- A one-sentence "what this does" before the command
- The exact command in a code block
- A one-sentence "what you should see" after the command
- Any callout boxes for common mistakes

---

### 5. Translations: `README.es.md`, `README.ko.md` (update)

**Approach:** update to mirror the new README.md structure. The existing content was synced to an older README; the audience cards and links need to match. Translations are maintained as 1:1 mirrors of the English README (not the deeper docs).

---

### 6. `rig/corpus/standards/change-management.md` — Add docs gate (amendment)

**What changes:** Add a new step **between current steps 5 and 6** (after "Docs, trackers and version agree"):

> **5a. Documentation is current**<br>
> Any feature, behavior change, or architectural change visible to users updates `docs/` in the same change set. A release that adds, changes, or removes user-facing behavior without a corresponding docs update does not pass this step. The changelog entry names the docs files updated.

The deployment gate script (`check-deployment-gate.js`) will need an amendment to check for this — that's a separate implementation ticket; the policy text ships first.

---

## Calls the builder makes

- Mermaid diagram style: C4-inspired but not strict C4 (strict C4 is verbose; simplified node/arrow approach is cleaner for Mermaid)
- View 3 depth level: stops at the corpus directory structure, does not enumerate all 115 catalogue leaves
- `docs/product.md` filename: chosen over `docs/vision.md` rename to avoid breaking existing links (vision.md stays as a technical supplement; product.md is the new PM-facing doc)
- Translations: only README.md mirrored; deeper docs stay English-only for this release

---

## What's left to the builder

- Write all files listed above
- Run `npm test` after changes to confirm no breakage
- Update `wiki/topics/what-rig-is.md` to link to `docs/product.md` and `docs/architecture.md`
- Update `rig/corpus/rules/communication.md` if it references vision.md (check first)
- File a wiki reasoning trace for the docs-gate addition to change-management
