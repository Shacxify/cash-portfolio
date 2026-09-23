# bikex-bot

Scheduled Cloudflare Worker that reads the [BikeX board](https://cashjohnson.net/bikex)
and posts reminders and announcements to Discord through channel webhooks.
Runs weekdays at 16:00 UTC (9am PDT / 8am PST), plus a weekly scoreboard on
Friday evenings after the sponsor call. Posts nothing when there is nothing to
say.

What it posts:

- Daily, at the top: wins (tasks marked Done since the last run, names
  attached) and anyone who flagged a task Stuck. The first Stuck flag on the
  board gets a louder shout-out. Reminders come after.
- Daily: overdue tasks (with days late), due today, due tomorrow
- Mondays: stalled in-progress tasks and everything due later in the week
- Sponsor call days: an update-your-rows nudge
- Milestones: an @everyone announcement two days out and day-of
- Fridays 6pm PDT / 5pm PST: a scoreboard of the week's finished tasks and
  Stuck flags per person, plus overall board progress

Wins and Stuck flags come from the board's change log, which records edits made
on the web board. Edits made straight in the Google Sheet are not logged, so
they won't show up as wins. A task marked Done and then reopened is not
counted.

## Setup

```sh
# required: webhook for the reminders channel
# (Discord channel settings > Integrations > Webhooks > New Webhook > Copy URL)
npx wrangler secret put WEBHOOK_URL -c bot/wrangler.jsonc

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

# preview this week's scoreboard
curl "https://bikex-bot.<your-subdomain>.workers.dev/run?key=<RUN_KEY>&mode=scoreboard&dry=1"
```
