# Flip ad creatives

Competitor research, concepts, and code-built creatives for Flip (fliptexts.com), the AI money manager that lives in iMessage.

- `out/statics/`: 7 static ads, each in **4:5 feed (1080×1350)** and **9:16 story/reels (1080×1920)** PNG
- `out/videos/`: 3 animated **9:16 MP4s** (14–16s, 30fps, H.264)
- `statics/`, `videos/`: the HTML/CSS source for every creative (edit the copy, re-render)
- `shared/`: design tokens, phone and iMessage components, deterministic animation engine

## Research note: what this is based on

The Meta Ad Library (facebook.com/ads/library) and fliptexts.com were **not reachable from the build environment**, because its network policy blocks them. So this is **not** a scrape of live ads. The competitor read below comes from public secondary sources: press coverage, iSpot TV listings, competitor marketing pages, and Flip's own `/compare` pages as indexed by search. Before spending, run the checklist at the bottom against the live Ad Library.

## Competitor teardown

| Competitor | What their ads lean on | The gap Flip can take |
|---|---|---|
| **Rocket Money** | Subscription-discovery hooks: "This app found 6 subscriptions I forgot I was paying for", "Don't be like me", "$740/yr" savings stat. Heavy UGC. The TV spot personifies a forgotten subscription. ([iSpot](https://www.ispot.tv/ad/fN_p/rocket-money-gotten-subscription-he-sucks)) | Their promise is *finding* the leak. Flip's own line: "Rocket Money tells you about the leak, Flip plugs it." → **action vs. awareness** (S1, S5, V1) |
| **Cleo** | Personality and humor. "Roast mode" roasts your spending with GIFs. Gen-Z chat voice. ([Cleo](https://web.meetcleo.com/blog/the-money-app-that-roasts-you)) | The chat-with-your-money format is proven, but Cleo is still an app. Flip does the same thing in iMessage, and it *does* things ("Cleo talks a great game, Flip plays it"). → **friend voice + action** (S7) |
| **Albert** | Celebrity TV (Sarah Hyland) for its AI assistant "Genius": ask for a budget, get a bill saving. ~$40/mo positioning. ([MediaPost](https://www.mediapost.com/publications/article/412099/sarah-hyland-stars-in-ad-for-albert-budgeting-app.html)) | AI money assistant is now a mainstream category claim. Flip's difference is where it lives (your texts) and no app. (S2, V2) |
| **Monarch / Copilot / YNAB** | Dashboard beauty, "see everything in one place", couples and planning. YNAB does little paid social. | "Monarch shows you the money." Dashboards need you to open them. → **"Money apps show you. Flip does it."** (S6) |
| **Splitwise** (and P2P apps) | Utility and word of mouth, very little brand advertising | Nobody owns **group-chat money** in paid social. Flip can be added to the group thread, which also makes a built-in viral loop. (S3) |

Patterns worth borrowing: **UGC-style POV hooks**, **concrete dollar amounts**, **named, relatable subscriptions** (gym, Hulu, Spotify), and **showing the product UI** (here, a text thread that's instantly legible in feed).

## Concepts → creatives

Every creative leads with the thing only Flip has: **the product is a text thread**. So the ad *is* the demo.

| # | File | Angle | Counters |
|---|---|---|---|
| S1 | `01-dont-track-it-text-it` | Budget-app notification vs. Flip actually canceling the gym. **"Don't track it. Text it."** | Rocket Money, Monarch |
| S2 | `02-six-apps-one-thread` | App fatigue: 6 crossed-out money apps → one thread that pays, checks and cancels | Albert, Copilot, all "download our app" |
| S3 | `03-group-chat-split` | Add Flip to the Tahoe-trip group chat, where it splits the Airbnb and sends requests | Splitwise, Venmo requests |
| S4 | `04-payday-autopilot` | "just got paid" → full paycheck plan → "run it" (light theme for feed contrast) | YNAB-style manual budgeting; matches the creator program's paycheck angle |
| S5 | `05-lock-screen-heads-up` | Proactive lock-screen text: "Hulu renews tomorrow, cancel?" → "yes pls" | Rocket Money |
| S6 | `06-they-show-flip-does` | Comparison grid: Typical money app vs. Flip | Everyone (no competitor named, which keeps it policy-safe) |
| S7 | `07-monday-you` | Friend voice: "how bad was my weekend" → move $50 so Monday-you forgives Saturday-you | Cleo |
| V1 | `01-cancel-the-gym.mp4` | POV hook → cancel by text → **+$299.88/yr** counter → end card | Rocket Money |
| V2 | `02-six-apps-one-text.mp4` | 6 app icons shake and fall away → rapid-fire balance/pay/cancel/save thread | App-fatigue angle |
| V3 | `03-payday-autopilot.mp4` | Paycheck plan builds row by row while a bar fills → "run it" → done | Paycheck-budgeting creators |

### Ad copy (ready for Ads Manager)

**S1 / V1: Don't track it. Text it.**
- Primary: *Most money apps send you a notification about your subscriptions. Flip cancels them. Just text it, right in iMessage. No app to download.*
- Headline: *Don't track it. Text it.* · CTA: Learn More / Send Message

**S2 / V2: 6 apps → 1 text**
- Primary: *Budget app. Bill app. Split app. Investing app. Or… one text thread. Flip pays friends back, checks your balance, and cancels subscriptions when you text it.*
- Headline: *Your money, in your texts*

**S3: Group chat**
- Primary: *Add Flip to the group chat. It splits the Airbnb, sends everyone their share, and tracks who's paid, so you're never the one chasing money again.*
- Headline: *The group chat's new treasurer*

**S4 / V3: Payday**
- Primary: *Text "just got paid" and Flip builds your paycheck plan (rent, card, savings, investing, safe-to-spend). Reply "run it" and it's done.*
- Headline: *Payday, on autopilot*

**S5: Lock screen**
- Primary: *Flip texts you before a subscription renews. Reply "yes" and it's canceled. The only money notification you'll actually want.*
- Headline: *Money texts worth replying to*

**S6: Comparison**
- Primary: *Money apps show you where your money went. Flip actually does something about it: cancels, splits, pays, and saves, by text.*
- Headline: *They show. Flip does.*

**S7: Friend voice**
- Primary: *Honest, a little funny, and it actually moves the money. Flip is the money manager that texts like your smartest friend.*
- Headline: *Texts like a friend. Manages like a pro.*

### Test plan (suggested)

1. **Round 1, angle test** (one ad set, broad US 18–34, Advantage+ placements): S1, S2, S3, S5, S7 plus V1, V2. Read CTR and cost per text-start after about 3–5k impressions each.
2. **Round 2**: take the top 2 angles and make hook variants (the first line of the hook and the dollar amount). Every creative is a text edit plus a re-render.
3. **Creator whitelisting**: V1 and V3 are built to become UGC scripts for the creators in `../creator-outreach/`. Creator says the hook to camera, then cuts to the screen-recorded thread.

### Before you ship (compliance / brand)

- **Brand colors are placeholders** (lime `#c8f53c` on ink). Swap `--accent`, `--ink` and `--paper` in `shared/base.css` and re-render. The "f" mark is a stand-in for the real logo.
- **All dollar amounts, names and merchants are illustrative.** Planet Fitness, Hulu and Spotify are named as merchants the user cancels, not as endorsements. Legal may prefer generic names ("my gym").
- Anything that mentions **investing (Roth IRA)** may need an "Investing involves risk" disclosure, depending on how Flip's brokerage feature is licensed.
- Meta's **financial-services** special ad category rules may apply to some targeting options.
- Confirm the SMS number (`+1 (628) 264-7696`) is the one you want in paid media.

### Live Ad Library checklist (once access works)

Search each of these at facebook.com/ads/library (US, All ads, Active): **Cleo, Rocket Money, Albert, Monarch Money, Copilot Money, YNAB, Splitwise, Brigit, Dave, EarnIn, Chime**. For each, note: longest-running ads (running 30+ days = likely winners), format mix (UGC vs. motion vs. static), repeated hooks, offers, and landing pages. Feed anything new back into round 2.

## Editing and re-rendering

```bash
cd ad-creatives
pip install imageio-ffmpeg        # bundles an ffmpeg with libx264 (or put ffmpeg on PATH / set FFMPEG=)
npm i playwright                  # or symlink an existing install into node_modules/
node render.mjs                   # every static (feed + story) and every video
node render.mjs statics
node render.mjs videos payday     # a single video, matched by filename
node render.mjs still 01-cancel-the-gym.html 9.5   # one frame, for review
```

- Change the copy directly in the HTML. Chat threads are the `F.chat([...])` arrays: `{ at: seconds, me | flip | other: "text" }`, and Flip messages get an automatic typing indicator.
- Videos are frame-deterministic: each page exposes `window.__seek(t)`, and the renderer screenshots every frame at 30fps and pipes the frames to ffmpeg. Timing lives in each file's `<script>`.
- The renderer warns (`⚠ … overflows by Npx`) if a static's content would get cropped in either format.
- Open any file in a browser to preview it. Add `?format=story` for 9:16, and `?t=4.2` to freeze a video at 4.2s.
