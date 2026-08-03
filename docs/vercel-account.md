# Vercel Account

Saved for this graduation project. Do **not** commit tokens or passwords here.

| Field | Value |
|-------|--------|
| Dashboard | [https://vercel.com/vrj87](https://vercel.com/vrj87) |
| Team / account slug | `vrj87` |
| CLI login | Confirmed — `vercel whoami` → `vrj87` |
| Project name | `category-explorer-mvp` |
| Project URL | [https://vercel.com/vrj87/category-explorer-mvp](https://vercel.com/vrj87/category-explorer-mvp) |
| Project ID | `prj_UTg6w9VBibtWm8tpQjxRopGLRYwH` |
| Org / team ID | `team_EC2mkvrUdptQzGRGbDOSwGzY` |
| Local link | `apps/mvp/.vercel/` (gitignored) |
| Deploy status | **Ready** — run `apps/mvp/scripts/deploy-prod.cmd` or see [DEPLOY.md](../apps/mvp/DEPLOY.md) |
| Production URL | _Pending first deploy — update deck after deploy_ |
| Framework | Next.js |
| CLI | Vercel CLI 58.4.0+ |

## Status

- [x] Account details saved
- [x] CLI authenticated as `vrj87`
- [x] Project linked: `vrj87/category-explorer-mvp`
- [x] Project linked: `vrj87/category-explorer-mvp`
- [ ] Production deploy — run `apps/mvp/scripts/deploy-prod.cmd` (sets env from `.env`, then `vercel --prod`)
- [ ] Env vars set in dashboard (GROQ_API_KEY, N8N_WEBHOOK_SECRET, DATABASE_URL)

## Deploy

```powershell
cd c:\Users\Vinyan\Desktop\nextleap\Cursor\GrauationProject2\apps\mvp
vercel --prod --scope vrj87
```

## Environment variables (set in Vercel dashboard under team vrj87)

| Name | Notes |
|------|--------|
| `DATABASE_URL` | PostgreSQL pooled URL (Neon/Supabase) |
| `DIRECT_URL` | PostgreSQL direct URL (migrations only) |
| `GROQ_API_KEY` | From [console.groq.com/keys](https://console.groq.com/keys) — used for nudge LLM |
| `N8N_WEBHOOK_SECRET` | Shared with n8n workflows |
| `OPENAI_API_KEY` | Optional fallback if Groq unset |
| `NEXT_PUBLIC_APP_URL` | Production URL after first deploy |

## Notes

- Auth tokens stay in the local Vercel CLI store — not in this repo.
- `.vercel/` and `.env.local` are gitignored.
- Never commit API tokens or passwords.
