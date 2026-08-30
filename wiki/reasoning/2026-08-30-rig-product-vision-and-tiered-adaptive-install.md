---
date: 2026-08-30
source: intent owner
topics: what-rig-is, onboarding-flow, distribution-and-release
decisions:
status: current
supersedes:
tags: interdependency
summary: Intent owner's full end-product expectation — RIG as a portable "ultimate toolbox" that installs (not onboards) into any repo, rides the host to graft itself onto whatever is already there, and serves a spectrum from no-host beginners to superusers via a tiered, interactive, adaptive install.
---

# RIG product vision and the tiered, adaptive, interactive install (intent owner)

*Filed verbatim. This is the intent owner's own statement of what RIG is for and
what the finished product is expected to do, captured across two turns of the
2026-08-30 office-hours session. It is recorded as durable intent so a cold
session stops re-deriving "what is the point of RIG." It is NOT a decision and
it does not override any frozen gate; parts of it are in tension with current
frozen decisions (see "Tension with what is frozen" at the end), and that
tension is the honest state, not an oversight.*

---

## Part 1 — the original intent, the spectrum, and the corpus idea (verbatim)

See, Rig was originally intended to be, like, this thing that you could drop into your whatever agentic solutions, agentic loop and all, what you had, or, like, whatever, even just .MDs and all, whatever harness you had, just drops into it and supercharges it, right? So we have various, on a spectrum we are trying to address people, right? People who do not have anything on their repository, they can use Rig and have, like, agentic loops and all running from whatever this thing they have. So, like, they might have Claude code or Cursor, and then we onboard those agents onto Rig, and then they operate on the Rig workflow. Then there might be people with, like, entire loops, harnesses and all. Then we land into their repository and then we supercharge it, like with our pipeline and stuff like that. So that is a... And we are trying to... So this is, like, one-stop solution for anyone to supercharge their development experience. That is what all Rig is, right? So that is why I was very interested in the DeepSeek harness sort of thing, because it was like a harness. It had agentic loops and all, and I saw myself using it, right? So whenever I start a new project, I have to onboard you. I have to remember to, like, have, like, a harness, have, like, a knowledge base, have, like, ticketing systems, X, Y, Z, huge project. When I'm starting, I have to start everything on top. Everything I have to start from scratch, right? That should not be the case. I mean, I install Rig on my this thing, and then everything is there, right? A knowledge base is there, all the skills are there, all the harnesses are there, all the pipeline is there, everything is there. I don't have to rebuild everything from scratch. That is the point of the Rig. You take your Rig with you. It's like a toolbox that is there, the ultimate toolbox for landing into any repository. Something like a forward-deployed harness, right? Comes in, checks what is there, and then builds on artifacts based on whatever context we are pushing it with, whatever knowledge we are pushing it with, plus whatever is there in the repository, in it. And the cheap thing to do, cheap thing we figured out was that we'll let the owner, whoever is installing it, run it on their host, take it on their... So the model is static, right? Regardless of whatever model is there, we are trying to supercharge it, supercharge it on their machine, right? So their agent must not... It must be, like, just like an LLM, right? Not even, like, an agent. It must be just an LLM, something like here. But we'll power thrust it with so much... We thrust it. We give it the context on, like, how do we build this entire thing, so that the intelligence cost is there, but then we are supercharging that intelligence with our sort of expertise, right? So that was the entire point of Rig. So that was the original intent. So now, yeah. So then I'd ideally want the DeepSeek harness also to be there, so that there is an interactive UI and stuff like that for people who do not have anything at all going. Then there are people like me who have, like, certain skills downloaded from some random GitHub repository, or, like, downloaded from Claude Marketplace and all, downloaded from all of these random places and are, like, trying their level best to, like, manage context amongst, like, two, three different provider agents running for various needs and all. So... But then, like, as soon as you start a new project, then kaput, everything's gone. We have to start from scratch. So I want all of that to be onboarded dynamically on the user's thing. So now I think what, like, from a previous office hours session, I think from what we came back with was, like, okay, so you're supporting 19 hosts, which kind of have, like very different languages in terms of how you're gonna interact with them. So what should be a better strategy is to release it in phases. So first you ensure that Claude Code is working, then you ensure that Cursor is working, so on and so forth. You do, like, a controlled release for every host. So that's, like, 19 releases, or, like, in a more ideal world we'd, like, combine a bunch of hosts together, which are, like, kind of similar, so that we are not doing double the work. Another thing, another possibility, that kind of makes sense, but then another possibility which I kind of surfaced and I don't really remember why it was shot down, was that why can't we have, like, one corpus of, like, Rig artifacts, which are then translated into how natively other hosts are picking up. So, like, we'll have a .rig where we'll have, like, the... we'll have instructions.md, wiki.md, or, like, so on, status, or, like, whatever we have the entire corpus, and then we have scripts, which are converting this... scripts, or, like, agent runtimes, which are converting this into the native way, how it is, how it will extract it. So we'll... something like that. I don't know why that was shot down. But then, I mean, that is a very clean way. So, say, for example, there's a philosophy shift in Rig, right? So this is an opinionated system, right? So if there's a philosophy change at Rig, you just change it at, like, the .rig, and then the agent, and then, like, the customer's agent, it dynamically updates it from there. So that is the overall goal with Rig. So it is a... It is like... It is my... okay, so the goal with Rig now is that it's gonna be the start of a startup, right? So the startup would be how best you can use, like, your agents to achieve your goals, right? That is the thing. For now, it is open source because I have literally no... I have, like, very little idea how I'm doing it, and I'm learning along the way. But then, I mean, that is my personal goal. That is nothing to do with Rig itself. But I want to learn eventually, but then I want to treat this as, like, a proper product that I am delivering to customers, which will be really using it on their day-to-day. That is my goal with Rig right now.

## Part 2 — the pitch, restated the same day (verbatim)

So you know these are competing systems right or have a delta between them which is a pain in the ass for anyone who wants to onboard their frameworks. We're solving that, you install us (not even onboard, we'll handle that by riding your host and giving it context to how best graft rig) and because rig has everything. User does not have to keep on porting things from one repo to another.

Basically bring the entire Agentic SDLC onto your repo / Super charge the existing ASDLC with rig's context (which is the grafted equivalent of whatever is there on the opensource + my personal observations and frustrations and solutions).

We're attempting to cater to everyone from:

- Vanilla beginner with nothing but claude code and cursor (get the loops and pipeline setup for them)
- to people who have these things and have a certain workflow made from skills.md to hooks and basic harnesses (and supercharge it with rig and certain component like say wiki or ticketing systems)
- to openclaw super users which have their own loop and pipelines and add components to their frameworks which may be missing earlier

We want to entirely overhaul that tier system with an interactive install process which:
1. takes in which hosts the user has running,
2. then letting that host onboard rig according to the best practices we provided it and ask the user for feedback and suggestions while that is happening so that semantic coherence during onboarding is maintained.

---

## Tension with what is frozen (synthesis pointer — not part of the owner statement)

Two parts of this vision point against decisions that are currently frozen or
just measured, and that is the honest open state:

- **"Rig has everything" / one-stop amalgamation vs. the à-la-carte model and
  the +12 eval.** The [[the-catalogue]] design and the 2026-08-30 adaptation
  eval ([[2026-08-30-adaptation-eval-claude-task-master]]) both found that
  installing everything is the *liability*, not the selling point (~85% dead
  weight on a Node/TS repo). The vision's "user doesn't have to keep porting"
  is exactly the reconciliation the eval measured RIG *not* doing.
- **"Host onboards Rig, inferring best practices and adapting per repo" vs. D24
  mechanical-only detection.** [[onboarding-flow]] §D24 deliberately freezes
  detection as *mechanical only* and family selection as *explicit and
  trimmable*, precisely to avoid inferring what a repo "wants." The tiered
  adaptive install described here is a direction change from that, not a
  backfill of it, and would need its own grilling and gate, not a silent edit.
- **The "one corpus, translated natively per host" idea** the owner could not
  remember the objection to: per GA-36 it was *not* shot down as an
  architecture — corpus-first with one analysis emitted per host is the decided
  direction; what was flagged was forking a runtime and maintaining its
  packages. See [[what-rig-is]] and GA-36 in the [decision index](../index/decisions.md).

Recording this vision does not resolve those tensions. It captures the target so
the next session works toward a known end state instead of re-deriving it.
