# bikex-bot

Scheduled Cloudflare Worker that reads the [BikeX board](https://cashjohnson.net/bikex)
and posts reminders and announcements to Discord through channel webhooks.
The cron runs weekdays at 16:00 UTC (9am PDT / 8am PST): milestone
announcements can post any weekday, the standup digest posts Mon/Wed/Fri
to WEBHOOK_STANDUP (falls back to WEBHOOK_URL). Posts nothing when there
is nothing to say.

What the standup digest posts (Mon/Wed/Fri):

- Wins first: everything marked Done since the last standup, with names
- Newly Stuck tasks, framed as a call for help
- Overdue tasks (with days late), due today, due tomorrow
- Mondays: stalled in-progress tasks and everything due later in the week
- Sponsor call days: an update-your-rows nudge
- Milestones: an @everyone announcement two days out and day-of

## Setup

```sh
# required: webhook for the reminders channel
# (Discord channel settings > Integrations > Webhooks > New Webhook > Copy URL)
npx wrangler secret put WEBHOOK_URL -c bot/wrangler.jsonc

# recommended: webhook for #standup; the M/W/F digest goes here
npx wrangler secret put WEBHOOK_STANDUP -c bot/wrangler.jsonc

# optional: separate webhook for #announcements; milestone posts go here with @everyone
npx wrangler secret put WEBHOOK_ANNOUNCE -c bot/wrangler.jsonc

# optional: Discord user ids for pings, JSON of owner name -> id
# (Discord: Settings > Advanced > Developer Mode, then right-click a user > Copy User ID)
npx wrangler secret put MENTIONS -c bot/wrangler.jsonc
# example value: {"Cash Johnson":"123456789","Brandon Le":"987654321"}

# optional: enables manual runs at /run
npx wrangler secret put RUN_KEY -c bot/wrangler.jsonc

npx wrangler deploy -c bot/wrangler.jsonc
```

## Testing

```sh
# see what today's run would post, without posting
curl "https://bikex-bot.<your-subdomain>.workers.dev/run?key=<RUN_KEY>&dry=1"

# force a real post right now
curl -X POST "https://bikex-bot.<your-subdomain>.workers.dev/run?key=<RUN_KEY>"
```
