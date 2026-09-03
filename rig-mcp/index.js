#!/usr/bin/env node
// Rig MCP server: serves the lazy-senior-dev ruleset over stdio as a
// prompt (user-invoked) and a tool (for hosts that pull context via tools).
// It does NOT replace the always-on adapters; it's the clean option for hosts
// whose only injection point is the prompt menu (see #70).
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import { createRequire } from "node:module";

import { MODES, buildInstructions, resolveMode } from "./instructions.js";

const require = createRequire(import.meta.url);
const { handleOnboarding } = require("../rig/lib/onboarding.js");

const server = new McpServer({ name: "rig", version: "0.1.0" });

const modeArg = z
  .enum(MODES)
  .optional()
  .describe("Rig intensity: lite, full, or ultra. Omit for the configured default.");

server.registerPrompt(
  "rig",
  {
    title: "Rig mode",
    description: "Lazy senior dev instructions: YAGNI, stdlib first, the smallest correct change.",
    argsSchema: { mode: modeArg },
  },
  ({ mode }) => ({
    messages: [{ role: "user", content: { type: "text", text: buildInstructions(mode) } }],
  }),
);

server.registerTool(
  "rig_instructions",
  {
    title: "Rig instructions",
    description: "Return the Rig ruleset for the given intensity (lite, full, or ultra).",
    inputSchema: { mode: modeArg },
    outputSchema: { mode: z.string(), instructions: z.string() },
    annotations: { readOnlyHint: true, openWorldHint: false },
  },
  ({ mode }) => {
    const resolvedMode = resolveMode(mode);
    const instructions = buildInstructions(resolvedMode);
    const structuredContent = { mode: resolvedMode, instructions };
    return { content: [{ type: "text", text: instructions }], structuredContent };
  },
);

const onboardingRequest = {
  schema_version: z.number().int(),
  action: z.enum(["prepare", "propose", "apply", "check"]),
  target: z.string(),
  expected_revision: z.number().int().optional(),
  proposal: z.record(z.any()).optional(),
  summary_markdown: z.string().optional(),
  approval: z.record(z.any()).optional(),
};
const onboardingOutput = {
  schema_version: z.number(), action: z.string(), phase: z.string(), revision: z.number(),
  proposal_digest: z.string().nullable(), artifacts: z.record(z.any()),
  critical_decisions: z.array(z.any()), hard_failures: z.array(z.any()), warnings: z.array(z.any()),
  next_action: z.string(), context: z.record(z.any()).optional(),
};

server.registerTool(
  "rig_onboarding",
  {
    title: "Rig onboarding",
    description: "Prepare, propose, apply, or check adaptive Rig onboarding.",
    inputSchema: onboardingRequest,
    outputSchema: onboardingOutput,
    annotations: { readOnlyHint: false, destructiveHint: true, idempotentHint: true, openWorldHint: false },
  },
  (request) => {
    const result = handleOnboarding(request);
    const failures = result.hard_failures?.length || 0;
    const text = failures
      ? `${result.phase} → ${result.next_action} (${failures} hard ${failures === 1 ? 'failure' : 'failures'})`
      : `${result.phase} → ${result.next_action}`;
    return { content: [{ type: "text", text }], structuredContent: result };
  },
);

await server.connect(new StdioServerTransport());
