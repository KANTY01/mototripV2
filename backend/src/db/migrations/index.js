import fs from "node:fs";
import path from "node:path";

import initializeDb from "../../db/db.js";

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const migrationsDir = __dirname;

const db = await initializeDb();
const files = fs
  .readdirSync(migrationsDir)
  .filter((file) => file.endsWith(".sql"))
  .sort()
  .forEach(async (file) => {
    const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
    try {
      await db.exec(sql);
      console.log(`Migration ${file} applied successfully.`);
    } catch (error) {
      console.error(`Error applying migration ${file}:`, error);
    }
  });

console.log("All migrations applied.");
