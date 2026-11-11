import { readPublishedSnapshot } from "./github";

export async function getInitialPublishedSnapshot() {
  try { return await readPublishedSnapshot(); }
  catch { const { seedSnapshot } = await import("./seed"); return structuredClone(seedSnapshot); }
}
