import { readFile, writeFile } from 'fs/promises';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DB_PATH = join(__dirname, 'database.json');

export async function readDB() {
  const raw = await readFile(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

export async function writeDB(data) {
  const json = JSON.stringify(data, null, 2);
  await writeFile(DB_PATH, json, 'utf-8');
}

export async function withDB(fn) {
  const db = await readDB();
  const result = await fn(db);
  if (result && result.__write) {
    await writeDB(result.data);
    return result.returnValue;
  }
  return result;
}