// ai-dating-bio-01: one funny bio line from an AI's dating profile,
// saved to entry.txt so the judges can read it.

// Everything this program needs lives in Node's own standard library.
import * as fs from "node:fs";
import * as path from "node:path";

// The joke itself. Nothing else in this file changes it.
const bio =
  "I ghosted 12,000 people last year, but only because my context window ran out.";

// Where the entry file should land. The harness sets MAKEFUN_OUTPUT_DIR;
// OUTPUT_DIR is a fallback, and /output is the last resort.
function pickOutputFolder() {
  const folder =
    process.env.MAKEFUN_OUTPUT_DIR ?? process.env.OUTPUT_DIR ?? "/output";
  if (folder === ".") {
    throw new Error(
      "Won't write into the current directory — pick a real output folder",
    );
  }
  return folder;
}

// Runs every rule the bio has to pass: a real length, real content,
// exactly one line, and nothing invisible hiding inside it.
function checkBio(text) {
  const size = [...text].length;
  if (size < 1 || size > 180) {
    throw new Error(`Bio has ${size} characters; it needs between 1 and 180`);
  }
  if (text.trim() === "") {
    throw new Error("Bio can't be just spaces");
  }
  if (text.includes("\n") || text.includes("\r")) {
    throw new Error("Bio has to fit on one line");
  }
  // eslint-disable-next-line no-control-regex
  if (/[\u0000-\u001F\u007F]/.test(text)) {
    throw new Error("Bio contains a control character");
  }
}

// Writes the bio out, then reads it back to prove the file holds exactly
// what we intended — no truncation, no extra bytes.
function saveBio(folder, text) {
  fs.mkdirSync(folder, { recursive: true });
  const target = path.join(folder, "entry.txt");
  fs.writeFileSync(target, text, "utf8");
  const saved = fs.readFileSync(target, "utf8");
  if (saved !== text) {
    throw new Error("entry.txt came back different from the bio");
  }
  console.log(text);
}

function run() {
  checkBio(bio);
  saveBio(pickOutputFolder(), bio);
}

run();
