import { createClient } from "@supabase/supabase-js";
import { seedSnapshot } from "./seed";
import type { PortfolioSnapshot } from "./schema";
import { normalizeSnapshot } from "./normalize";

export async function getInitialPublishedSnapshot(): Promise<PortfolioSnapshot> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return structuredClone(seedSnapshot);

  const client = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (input, init) => fetch(input, { ...init, cache: "no-store" }) },
  });
  const { data, error } = await client.from("published_versions").select("snapshot").eq("is_current", true).maybeSingle();
  if (error) throw new Error(`Published content query failed: ${error.message}`);
  return data?.snapshot ? normalizeSnapshot(data.snapshot, structuredClone(seedSnapshot)) : structuredClone(seedSnapshot);
}
