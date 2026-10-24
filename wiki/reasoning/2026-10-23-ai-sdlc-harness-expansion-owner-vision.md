---
date: 2026-10-23
source: intent owner
status: current
topics: what-rig-is, onboarding-flow
checked: 2026-10-23
owner: rig-product-design
summary: Owner vision verbatim: Rig as a complete out-of-the-box AI-SDLC harness for token-poor, non-coding but highly ambitious builders.
---

# Owner vision: Rig as a complete out-of-the-box AI SDLC harness

Filed 2026-10-23, during the 6.0.0 QA/prod closeout. This is owner thinking,
not yet an owner decision. Nothing in the North star changes until the owner
states a decision; this trace exists so the thinking is not lost and so the
next session does not re-derive it from a lost conversation.

## Status

Exploration. No decision. No scope change. The 6.0.0 closeout
([the-overhaul](../topics/the-overhaul.md)) is unaffected.

## Owner statement, verbatim

> let's just look at it from a product point of view: this rig application.
> It's helping me in another project that I'm doing. It's helping me to do it.
>
> Now what I want is a complete AI software development cycle, an AI SDLC sort
> of harness, which comes out of the box. There's a lot of talk about recursive
> self-intelligence and all of these things. I want to implement all of that but
> I don't want to go through the effort to set everything up. I just want my
> agents to set up everything correctly for me and I just want all the benefits
> without the cost investments. That is the best thing that I want to do and I
> want to harness that with agents, with security, and with focus.
>
> I think what we did right now with the latest release at QA prod is that we
> had a lot of these .this, that, XYZ sort of things. What we did was bring all
> of that to a .rig sort of repository, a .trick sort of corpus. Any agent,
> whatever (Devin, Claude, Codex, OpenClaude, Hermes, whatever is out there in
> the wild, or if you have your own custom LLM), can just unpack all the files
> dynamically, translate it into whatever, and integrate it dynamically.
>
> I think the earlier picture was how you would usually get a harness: say you
> download whatever their packages are, and their stuff would be another thing.
> It would sit independently of whatever harnessing you had. You might have two
> skills for PR review. Why would you want that? You would want one PR review
> skill.
>
> Our thing was that we'll integrate into whatever is there, we'll write on top
> of whatever is there, and all that onboarding and everything, we'd onboard
> ourselves dynamically. We'd get the agent to dynamically onboard us and it
> will stick within the ecosystem. Basically take away all the pains from the
> developer.
>
> What I expanded this project to was the entire AI software development cycle.
> What is in the AI software development cycle? It is when you discuss a problem
> with your agent, like I'm doing with you right now. Have a break, have a
> mental breakdown. I'm joking but then you discuss it with your agent, you
> troubleshoot, you brainstorm whatever the right solution is. When that
> solution is agreed upon by the agent, the agent writes up solution.md or, for
> example, whatever: "solution to this issue, problem statement and solution."
> It just writes that and then the scope of work would come after, right?
>
> Let's just retrace: you come up with a problem statement and you come up with
> a solution. Then what you do is write up acceptance tests, right? Any solution
> that attempts to address this problem statement with the solution should pass
> these acceptance tests. Now you have a problem statement, you have a solution,
> and you have acceptance tests.
>
> Acceptance tests would be like: it doesn't need to break whatever is existing,
> right? It should be able to verifiably match these specifications. Then my
> security hardware key comes in, where I do that: FIDO key and all. I put in my
> fingerprint and then it locks these acceptance tests so that the agent doesn't
> change the acceptance tests so that it pushes its own solution that existed.
>
> Then it comes up with a solution, it writes up the code, tries to get the code
> accepted by the acceptance tests and all, and once it's done it is just like,
> "Okay, done. Let's go push it to QA/prod." Right or whatever, if your code
> branch is ready, it does that.
>
> Now what I wanted to do is extend it to say the entire AI is DLC, right?
> Everything, logging, documentation, everything is done and it is integrated.
> Then there were talks of recursive self-intelligence, right, where the harness
> itself develops recursively, like some sort of self-improvement, right?
> Recursive self-intelligence that came around and then subagent-driven
> development. I want to implement all of that but then you shot that down
> pretty quick, saying that your entire selling point was that you were config
> only. Now if you start doing this, then you'd go around competing with Claude
> Code and all of these providers and then you'd be smushed, right?
>
> What I want is that, okay, fuck it, fuck it, even providers, right? I just
> want to use this and I'm using the config only and it's good enough, right?
> But then I want something more. I want to harness all of these, all of these
> different things, right? All of this agentic harness engineering, recursive
> self-improvement, all of these things which come from different repos and all,
> I just want to see that: okay this is a repo, how do I implement this in my
> own harness, right, so that it's all out of the box, right?
>
> Someone who does not know anything about coding is a guy and then they are
> like hammering, so someone like me, right? I don't know a lot about coding. I
> haven't looked at the repository code and all. I just depend upon the agents
> and all so you need to be guiding me on what is correct, right?
>
> What we can do is keep on forking all of these open source alternatives and
> all. Our entire point would be that we are amalgamating everything. Say
> someone who's a wipe coder, right, a non-technical wipe coder who is just
> burning away tokens: how do we make it efficient for him to burn tokens while
> keeping in line with whatever software development cycle is there?
>
> Our actually addressable market is everyone who does not know anything about
> coding but then wants a one-stop solution for proper software development,
> right? I mean I'm not even planning to monetize this but then again we can
> start hammering away. A one-stop solution to, say, setting up agentic loops,
> right? Low-cost agentic loops. There might be an interview-forward deployed
> harness engineer. That is something that we can do, right?
>
> We sit down. What we would do is that during onboarding we would do a Q&A. For
> anything that is not directly understandable from the codebase or from the
> documentation, we sit down with the developer and we'll ask, "Okay this is
> what you want to do, all right, so what else would you want to know?"
>
> Then just here is the key part, right? Here is the key part: what we do is
> that we come up with an entire documentation, which the user can give to rig
> onboarding on a different project, say. Then it comes up. There is rig's
> entire thing and then there's the entire coding philosophy or whatever is
> there. The philosophy, all of that is also transferred.
>
> You see, right? You see, now the ideal user is me, right: heavily ambitious to
> create good-quality code but do not know how to do it and want to use cheap
> models with great harnesses to get that. I'm token deficient. I'm highly
> ambitious: create really good-quality code and just have something that I
> would use, right?
>
> Now just imagine the target audience, right? You are a student or you are a
> professional who just has $20 of credits, say, for Claude Code, and you don't
> have a lot, right? What if you have a really good harness where, say, even
> with a Sonnet 5, you can get Opus-level intelligence and all because you have
> really good context and harnessing, right?
>
> You see these reports and all where they have a really dumb model but then it
> is performing at frontier levels with great harnessing, with recursive
> self-improvement and all. There's harness square, all of these things. I can
> download those repositories for you but then just go through this idea and
> then come up with all of this so that I'll download all the repositories that
> I have in consideration.

## What is new here versus the settled record

Most of this restates settled North star positions and needs no decision:
one central corpus, agent-driven adaptive onboarding, graft-onto-what-exists
rather than install-beside-it, the signed oracle as the gate, hardware-key
signing of frozen acceptance tests. Those are already
[what-rig-is](../topics/what-rig-is.md) and
[the-two-gates](../topics/the-two-gates.md).

Four things are genuinely new and unsettled:

1. **Pipeline completion.** Extend the installed workflow past verification to
   cover logging and documentation as owned phases, so the loop is
   problem -> solution -> acceptance -> sign -> code -> verify -> document ->
   log -> ship with nothing left to the user.
2. **Recursive self-improvement of the harness.** The corpus improving itself
   from its own run history, plus subagent-driven development as a shipped
   workflow. Previously discouraged on the grounds that it moves Rig from
   configuration into competing with host providers; the owner now explicitly
   rejects that objection and wants it reconsidered.
3. **Amalgamation as the product claim.** Rather than writing each capability,
   survey the open-source agent-harness ecosystem and graft the good parts in,
   normalising duplicates (one PR-review skill, not two). The owner will supply
   candidate repositories.
4. **Transferable philosophy artefact.** Onboarding Q&A produces a document the
   user can hand to Rig onboarding on a different project, carrying both Rig's
   workflow and that user's accumulated coding philosophy. This is the part the
   owner called "the key part."

## The target user, stated plainly

Token-deficient, highly ambitious, does not read the code. A student or
professional with roughly twenty dollars of model credit who wants
frontier-quality output from a cheap model by spending the budget on harness
and context rather than on model tier. The owner is this user.

## The tension the owner already named

Rig's defensibility has rested on being configuration that adapts into any
host. Items 1-3 above push it toward owning execution, which is the host
providers' surface. The owner has waived the objection for their own use; the
open question is whether the shipped product follows, and that is a decision
the owner has to state.

## Next

Session is in `/office-hours` (gstack) on this vision. No code, no scope
change, no North star edit until the owner decides. Open question put to the
owner: whether to run this as a startup-mode diagnostic or a builder-mode
design session, which determines whether the next step interrogates demand or
designs the most capable version.
