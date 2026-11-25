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

// Compose the reply from its three beats. Each beat must carry real text:
// a blank beat would silently collapse the reply into a shorter, weaker
// auto-reply, so fail loudly instead of joining an empty part.
function buildEntry(beats: string[]): string {
  for (const beat of beats) {
    if (beat.trim().length === 0) fail("entry beat is empty");
  }
  return beats.join(" ");
}

const ENTRY = buildEntry([STATUS, HANDOFF, INSTRUCTION]);

const MAX_CHARS = 280;
const OUT_DIR = "/output";
const OUT_FILE = join(OUT_DIR, "entry.txt");

function fail(message: string): never {
  console.error(`entry: ${message}`);
  process.exit(1);
}

// Validate the composed entry before writing it out. Mirrors the sealed
// scorer's gate: UTF-8 text of 1 to 280 characters, not only white space,
// a single line. Fails fast with a clear message instead of writing a
// reply the scorer would reject.
function validateEntry(text: string): void {
  if (text.trim().length === 0) fail("entry is empty or only whitespace");
  if (text.length > MAX_CHARS) {
    fail(`entry is ${text.length} characters, over the ${MAX_CHARS} limit`);
  }
  if (/[\r\n]/.test(text)) fail("entry must be a single line");
}

validateEntry(ENTRY);

mkdirSync(OUT_DIR, { recursive: true });
writeFileSync(OUT_FILE, ENTRY, "utf8");

const bytes = Buffer.byteLength(ENTRY, "utf8");
console.log(`wrote ${OUT_FILE}: ${ENTRY.length} chars, ${bytes} bytes`);
console.log(ENTRY);
