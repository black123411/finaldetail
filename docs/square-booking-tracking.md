# Square confirmed-booking tracking

The customer-facing booking flow stays on Square. The website continues to send `booking_select_service` and `begin_booking` before the customer leaves for Square. This Worker adds the missing server-side confirmation layer.

## Endpoint

`https://bryans-detailing-api.bryansmobiledetailing.workers.dev/api/webhooks/square/bookings`

A GET request to that URL reports whether the two required secrets are configured. It never returns the secret values.

## What is sent to GA4

- `booking_confirmed` when Square sends `booking.created`
- `booking_cancelled` when a booking update is cancelled or declined
- `booking_no_show` when the Square booking status is `NO_SHOW`

No customer names, phone numbers, email addresses, notes, or other PII are sent to GA4. The events include only Square booking/event IDs, status, location ID, and the first service variation ID.

Square retries are deduplicated in the existing D1 database by Square `event_id`. Failed GA4 sends remain retryable.

## Required secrets

Do not commit either secret to GitHub.

1. `GA4_API_SECRET`
   - GA4 > Admin > Data streams > the `G-2QGCVR4JJX` web stream > Measurement Protocol API secrets > Create.
   - Store the generated value as the Cloudflare Worker secret `GA4_API_SECRET`.

2. `SQUARE_WEBHOOK_SIGNATURE_KEY`
   - Square Developer Dashboard > the production app > Webhooks.
   - Add the endpoint above and subscribe to `booking.created` and `booking.updated`.
   - Copy the webhook subscription signature key.
   - Store it as the Cloudflare Worker secret `SQUARE_WEBHOOK_SIGNATURE_KEY`.

The non-secret `GA4_MEASUREMENT_ID` and exact Square notification URL are already in `worker/wrangler.jsonc`.

## Cloudflare secret commands

From the repository root after authenticating Wrangler:

```bash
npx wrangler secret put GA4_API_SECRET --config worker/wrangler.jsonc
npx wrangler secret put SQUARE_WEBHOOK_SIGNATURE_KEY --config worker/wrangler.jsonc
```

Then deploy the Worker:

```bash
npm run worker:deploy
```

After both secrets are configured, open the endpoint with GET. Both configuration flags should be true. In Square Developer Dashboard, use Send Test Event to verify the endpoint returns HTTP 200.

`booking_confirmed` should remain configured as a GA4 key event. `begin_booking` remains useful for acquisition/source analysis because the hosted Square booking page does not preserve the original GA browser session for the server-side webhook.
