// Copies the CMS page defaults (frontend source of truth) into the backend seed resources.
// Run after editing any file in src/lib/cms/defaults: `npm run cms:sync`
import { cpSync, mkdirSync, readdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const src = join(root, "src", "lib", "cms", "defaults");
const dest = resolve(root, "..", "journal-management-backend", "src", "main", "resources", "cms", "defaults");

mkdirSync(dest, { recursive: true });
for (const file of readdirSync(src).filter((f) => f.endsWith(".json"))) {
  JSON.parse((await import("node:fs")).readFileSync(join(src, file), "utf8")); // validate
  cpSync(join(src, file), join(dest, file));
  console.log(`synced ${file}`);
}
