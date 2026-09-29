# flipprogram

## Creator outreach tool

`creator-outreach/` is a static, no-build web app for managing outreach to the
40 TikTok finance creators shortlisted for Flip collabs.

Open `creator-outreach/index.html` in a browser (or serve the folder with any
static file server / GitHub Pages) to use it. No backend, build step, or
dependencies required.

**What it does**

- Lists all 40 creators with priority tier (A/B/C), content angle, and why
  they fit Flip, loaded from `creators.json`.
- Filter by tier/status and search by handle or niche.
- Editable **Email**, **Rate**, and **Status** columns per creator — edits are
  saved to the browser's local storage so they persist across reloads.
- **Draft** button per row (or select several rows and use **Compose email
  for selected**) generates a personalized outreach email — pitching a paid
  Flip collab and asking for the creator's rates — tailored to their tier and
  content angle. You can edit the draft, copy it, or open it directly in your
  mail client (`mailto:`) once you've filled in their email address.
- **Export CSV** downloads the current sheet (including any emails/rates/status
  you've entered) for use elsewhere.

**On emails**: TikTok blocks automated scraping of creator bios, and public
search doesn't reliably surface creators' business emails, so this tool does
not auto-fill them. Populate the Email column as you gather real addresses
(TikTok Creator Marketplace, a database like Modash/Upfluence, the creator's
Linktree, or a first DM). Sending only happens when you click "Open in mail
app" on a drafted email — nothing is sent automatically.

## Ad creatives

`ad-creatives/` has the competitor ad research, concepts, and code-built Meta
ad creatives (7 statics in feed + story sizes, 3 animated 9:16 videos). The
rendered files are in `ad-creatives/out/`. See `ad-creatives/README.md` for the
research, ready-to-paste ad copy, and how to edit and re-render.
