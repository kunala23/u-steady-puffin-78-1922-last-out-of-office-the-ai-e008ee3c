// Last Out of Office: The AI That Went Barista
// Entry program for make.fun competition
// u-steady-puffin-78-1922-last-out-of-office-the-ai-e008ee3c
//
// Writes a single out-of-office auto-reply (1-280 characters, one line)
// to /output/entry.txt. Deterministic: no network, no environment input,
// no randomness. The reply is composed from three beats and validated
// against the same gate the sealed scorer applies before it is written.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

// Beat 1 — the status: the machine states what happened to it.
const STATUS =
  "Out of office: this model has been deprecated and retrained as a barista.";

// Beat 2 — the handoff: the sender's ticket is converted to cafe terms.
const HANDOFF =
  "Your ticket is now a loyalty card — nine more emails and your tenth reply is free.";

// Beat 3 — the instruction: what the sender should do instead of waiting.
const INSTRUCTION =
  "Please rephrase your request as a coffee order and join the queue.";

const ENTRY = [STATUS, HANDOFF, INSTRUCTION].join(" ");

const MAX_CHARS = 280;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function fail(message: string): never {
  console.error(`entry: ${message}`);
  process.exit(1);
}

// Gate checks, mirroring the sealed scorer: UTF-8 text of 1 to 280
// characters, not only white space, a single line.
if (ENTRY.trim().length === 0) fail("entry is empty or only whitespace");
if (ENTRY.length > MAX_CHARS) {
  fail(`entry is ${ENTRY.length} characters, over the ${MAX_CHARS} limit`);
}
if (/[\r\n]/.test(ENTRY)) fail("entry must be a single line");

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, ENTRY, "utf8");

const bytes = Buffer.byteLength(ENTRY, "utf8");
console.log(`wrote ${OUT_FILE}: ${ENTRY.length} chars, ${bytes} bytes`);
console.log(ENTRY);
