---
date: 2026-10-24
source: intent owner
topics: distribution-and-release, the-two-gates
decisions:
status: current
supersedes:
tags: interdependency
summary: Owner authorises complete implementation, independent subagents, unchanged acceptance tests, verification and final cleanup before deployment.
---

Get the implementation done so you can spin up Terra and Luna agents to get the things done. Given what the intensity of the task is, you can have swarms of Terra and Luna subagents complete the stuff for you so that you do not burn through your context window and do not burn a lot of tokens.
Get all of this done. Make sure that you can verifiably get everything ready for deployment. Before deployment I just want you to delete it and do a general cleanup and chore. This directory that I've given you should actually have been in the wiki but forget it. That could be a Luna agent's task. Spin up subagents to get this entire thing implemented end to end.
What am I looking for at the end? I'm looking for:
- the acceptance tests are met verifiably
- the specifications are met
- the NPM tests are green
- the CI/CD is clean
- whatever reviewer agent is going to come and review the entire thing does not find an issue with whatever things we have right now
That's your entire job. Get that entire thing done. If there are errors that you see in the acceptance tests and all that you're finding, you run an NPM test. If the acceptance test is getting an error, review the code, fix the code, and run that loop until the tests are green. Do not edit the test. You shouldn't be able to.
That should be about it. If you have any questions there are a lot of discussions that I had with the agent and those must have all been stored in the wiki. Refer to that for my insights. There's an open source mandate also that you need to be following so get that.
I think at the end, when everything's been done, you can spin up a Luna agent or a Terra agent to conduct a sweeping cleanup of the entire thing (so that there are no random files here and there and everything is there for a purpose).
