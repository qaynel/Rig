// End-to-end regression: spawns the real server over stdio (the shape every
// host actually launches) and drives it through the MCP client SDK, so a
// broken registration or transport wiring fails here, not just in the pure
// instructions.test.js unit checks.
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import test from "node:test";

import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";

import { MODES } from "../instructions.js";

const serverPath = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "index.js");

async function withClient(run) {
  const transport = new StdioClientTransport({ command: "node", args: [serverPath] });
  const client = new Client({ name: "rig-mcp-test", version: "0.0.0" });
  await client.connect(transport);
  try {
    await run(client);
  } finally {
    await client.close();
  }
}

for (const mode of MODES) {
  test(`rig_instructions returns non-empty text for mode "${mode}"`, async () => {
    await withClient(async (client) => {
      const result = await client.callTool({ name: "rig_instructions", arguments: { mode } });
      assert.equal(result.structuredContent.mode, mode);
      assert.ok(result.content[0].text.length > 0);
    });
  });
}
