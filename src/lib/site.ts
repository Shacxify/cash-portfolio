export const EMAIL = "me@cashjohnson.net";
export const LINKEDIN_URL = "https://www.linkedin.com/in/cash-johnson/";
export const YOUTUBE_URL = "https://www.youtube.com/@Cash-Johnson";
export const GITHUB_USER = "Shacxify";
export const GITHUB_URL = `https://github.com/${GITHUB_USER}`;

// Contact kit links. Leave a value empty to hide its button: drop a PDF into
// public/ and set RESUME_URL to its path (e.g. "/cash-johnson-resume.pdf"), and
// set BOOKING_URL to a Calendly or Cal.com link. Without a booking link the
// "Grab a coffee chat" button falls back to a pre-filled email.
export const RESUME_URL = "";
export const BOOKING_URL = "";

export const COFFEE_CHAT_MAILTO = `mailto:${EMAIL}?subject=${encodeURIComponent(
  "Coffee chat?",
)}&body=${encodeURIComponent("Hi Cash,\n\nI came across your portfolio and would love to chat about ")}`;

// Fired on window so any button can open the palette or the chat without
// threading state through the page.
export const OPEN_PALETTE_EVENT = "cj:open-palette";
export const OPEN_ASK_EVENT = "cj:open-ask";
export const CELEBRATE_EVENT = "cj:celebrate";
