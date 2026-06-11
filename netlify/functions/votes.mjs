import { getStore } from "@netlify/blobs";

// 🔑 Set VOTE_ADMIN_PASSWORD in Netlify → Site configuration → Environment variables.
// Falls back to this default if the variable isn't set:
const ADMIN_PASSWORD = process.env.VOTE_ADMIN_PASSWORD || "etoile2026";

const TEAM_IDS = ["parmesan", "teamb", "cralactic"];
const CAT_IDS = ["entree", "plat", "dessert", "service"];

export default async (req) => {
  const store = getStore("cooking-votes");
  const url = new URL(req.url);

  // ---------- POST: anyone can submit a ballot ----------
  if (req.method === "POST") {
    let body;
    try {
      body = await req.json();
    } catch {
      return json({ error: "Invalid JSON" }, 400);
    }
    const { name, team, scores } = body || {};
    if (!name || typeof name !== "string" || !name.trim() || name.length > 40)
      return json({ error: "Invalid name" }, 400);
    if (!TEAM_IDS.includes(team)) return json({ error: "Invalid team" }, 400);

    // Validate: scores only for the two OTHER teams, integers 1–10, all present
    const targets = TEAM_IDS.filter((t) => t !== team);
    const clean = {};
    for (const t of targets) {
      clean[t] = {};
      for (const c of CAT_IDS) {
        const v = scores?.[t]?.[c];
        if (typeof v !== "number" || v < 1 || v > 10)
          return json({ error: `Missing or invalid score: ${c} for ${t}` }, 400);
        clean[t][c] = Math.round(v);
      }
    }

    const slug = name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9àâçéèêëîïôûùüÿñ-]+/gi, "_")
      .slice(0, 40);
    // One ballot per (team, name): re-submitting overwrites
    await store.setJSON(`vote_${team}_${slug}`, {
      name: name.trim(),
      team,
      scores: clean,
      ts: Date.now(),
    });
    return json({ ok: true });
  }

  // ---------- GET / DELETE: organizers only (server-side password check) ----------
  const pwd = url.searchParams.get("pwd") || "";
  if (pwd !== ADMIN_PASSWORD) return json({ error: "Wrong password" }, 401);

  if (req.method === "GET") {
    const { blobs } = await store.list();
    const ballots = [];
    for (const b of blobs) {
      const v = await store.get(b.key, { type: "json" });
      if (v) ballots.push(v);
    }
    return json({ ballots });
  }

  if (req.method === "DELETE") {
    const { blobs } = await store.list();
    await Promise.all(blobs.map((b) => store.delete(b.key)));
    return json({ ok: true, deleted: blobs.length });
  }

  return json({ error: "Method not allowed" }, 405);
};

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export const config = { path: "/api/votes" };
