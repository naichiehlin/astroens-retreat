# AstroENS Retreat 2026 — site + cooking vote

## Files
- `index.html` — retreat homepage (vote button in section 03 · Cooking)
- `vote.html` — voting page (weighted scoring, password-locked results)
- `netlify/functions/votes.mjs` — serverless API storing ballots in Netlify Blobs
- `netlify.toml`, `package.json` — Netlify config + dependency

## Deploy
1. Copy these files into your GitHub repo root (keep the `netlify/functions/` path).
2. Commit & push — Netlify redeploys automatically.
3. Done. The vote button on the homepage links to `/vote.html`.

## Change the results password
Netlify dashboard → Site configuration → Environment variables →
add `VOTE_ADMIN_PASSWORD` → redeploy. (Default if unset: `etoile2026`.)

## Notes
- One ballot per (team, name); re-submitting with the same name overwrites.
- Ballot weight = 1 / team size, so each team has equal jury power.
- Results & reset require the password, verified server-side.
- Team names/sizes: edit the `TEAMS` constant in `vote.html` **and**
  `TEAM_IDS` in `netlify/functions/votes.mjs` if teams change.
