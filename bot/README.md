# bikex-bot

Scheduled Cloudflare Worker that reads the [BikeX board](https://cashjohnson.net/bikex)
and posts reminders and announcements to Discord through channel webhooks.
It posts at 10am Pacific. The cron fires at 17:00 and 18:00 UTC on weekdays
and the worker only acts on the run that lands on 10am in Los Angeles, so
daylight saving never moves it. Posts nothing when there is nothing to say.

**Monday 10am, weekly kickoff** (to WEBHOOK_STANDUP, falls back to WEBHOOK_URL)

- Board update: tasks done, how many are due this week, how many are overdue
- The sponsor call coming up this week, if there is one
- Wins since Friday, with names, and anyone who flagged a task Stuck. The
  first Stuck flag on the board gets a louder shout-out.
- Overdue tasks (with days late), everything due this week, stalled work,
  and anything still Stuck

**Friday 10am, weekly wrap** (same channel)

- Sponsor call days: an update-your-rows nudge
- Weekly wins: everything marked Done since Monday, with names
- Morale scoreboard: finished tasks and Stuck flags per person, plus overall
  board progress. Stuck flags score points.
- Critical reminders: overdue, due today, due before Monday's post, and
  anything still Stuck

**Any weekday 10am:** milestone @everyone announcements, two days out and
day-of (to WEBHOOK_ANNOUNCE).

**Phase channels** (if CHANNELS is set): on Mondays and Fridays each
workstream's reminders go to its own channel instead of the team post, along
with any of its tasks newly flagged Stuck. The team post notes which phases
went elsewhere. Wins and the scoreboard stay in the team post.

Long posts are split at section breaks to stay under Discord's 2000
character limit.

Wins and Stuck flags come from the board's change log, which records edits made
on the web board. Edits made straight in the Google Sheet are not logged, so
they won't show up as wins. A task marked Done and then reopened is not
counted.

## Setup

```sh
# required: webhook for the reminders channel
# (Discord channel settings > Integrations > Webhooks > New Webhook > Copy URL)
npx wrangler secret put WEBHOOK_URL -c bot/wrangler.jsonc

# recommended: webhook for the team channel; the Monday and Friday posts go here
npx wrangler secret put WEBHOOK_STANDUP -c bot/wrangler.jsonc

# optional: separate webhook for #announcements; milestone posts go here with @everyone
npx wrangler secret put WEBHOOK_ANNOUNCE -c bot/wrangler.jsonc

# optional: send each workstream's reminders to its own channel.
# JSON of phase -> webhook. Keys are the WBS phase number or the phase name.
# Phases: 1 Project Management, 2 Discovery & Training, 3 Acknowledgements,
# 4 In-Kind Intake, 5 Outgoing Donations, 6 Pilot & Refinement,
# 7 Documentation & Handoff. Phases left out stay in the standup post.
npx wrangler secret put CHANNELS -c bot/wrangler.jsonc
# example value: {"3":"https://discord.com/api/webhooks/...","4":"https://discord.com/api/webhooks/..."}

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

# preview the Monday or Friday post on any day
curl "https://bikex-bot.<your-subdomain>.workers.dev/run?key=<RUN_KEY>&as=monday&dry=1"
curl "https://bikex-bot.<your-subdomain>.workers.dev/run?key=<RUN_KEY>&as=friday&dry=1"
```
