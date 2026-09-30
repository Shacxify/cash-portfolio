# bikex-bot

Scheduled Cloudflare Worker that reads the [BikeX board](https://cashjohnson.net/bikex)
and posts reminders and announcements to Discord through channel webhooks.
The cron runs weekdays at 16:00 UTC (9am PDT / 8am PST): milestone
announcements can post any weekday, the standup digest posts Mon/Wed/Fri
to WEBHOOK_STANDUP (falls back to WEBHOOK_URL). A weekly scoreboard posts
Friday evenings after the sponsor call. Posts nothing when there is nothing
to say.

What the standup digest posts (Mon/Wed/Fri):

- Wins first: everything marked Done since the last standup, with names
- Anyone who flagged a task Stuck, credited and framed as a call for help.
  The first Stuck flag on the board gets a louder shout-out.
- Overdue tasks (with days late), due today, due tomorrow
- Mondays: stalled in-progress tasks and everything due later in the week
- Phase channels (if CHANNELS is set): each workstream's due today and due
  tomorrow every weekday, its overdue tasks on standup days, and any task in
  it newly flagged Stuck. The standup notes which phases went elsewhere.
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

# recommended: webhook for #standup; the M/W/F digest goes here
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

# preview this week's scoreboard
curl "https://bikex-bot.<your-subdomain>.workers.dev/run?key=<RUN_KEY>&mode=scoreboard&dry=1"
```
