# Google Ads launch preview — Bryan's Showroom Quality Detailing

Status: **PREVIEW ONLY — do not activate without Bryan's approval**

Account: `948-126-4203`<br>
Campaign: `Search | High Intent | Omaha Metro`<br>
Budget ceiling: **$20/day**<br>
Network: **Google Search only**; Search Partners and Display disabled

## Why the previous campaign produced nothing

- Last observed 30 days: 0 impressions, 0 clicks, and $0 spend.
- The campaign was eligible but limited because it did not contain enough relevant keywords.
- Seven conversion actions showed no recent recorded conversions.
- The imported GA4 `booking_confirmed` action was enabled as primary but still awaiting its first verified conversion.

This means the immediate problem was delivery and measurement, not that visitors clicked and refused to book.

## Launch gate

Do not activate until all three checks pass:

1. Complete one controlled test booking and confirm that GA4 receives `booking_confirmed` once.
2. Confirm that the imported Google Ads booking conversion changes from awaiting/unverified to recording.
3. Make `booking_confirmed` the primary website conversion. Keep `generate_lead` and `begin_booking` secondary/observation-only until their values are validated.

Google explains that primary actions are used for bidding while secondary actions are observation-only:
https://support.google.com/google-ads/answer/11461796

## Campaign settings

- Objective: Leads
- Type: Search
- Bidding for launch: Maximize Clicks
- Maximum CPC limit: $4.00
- Daily budget: $20.00
- Language: English
- Ad schedule: 6:00 AM–10:00 PM daily
- Call asset schedule: only hours when Bryan can answer
- Final URL expansion: off
- Automatically created assets: review before enabling

Maximize Clicks can use a CPC limit to control the highest click bid:
https://support.google.com/google-ads/answer/6336101

## Locations

Target:

- Bellevue, Nebraska
- Omaha, Nebraska
- Papillion, Nebraska
- La Vista, Nebraska
- Ralston, Nebraska
- Council Bluffs, Iowa

Advanced location option: **Presence — people in or regularly in the targeted locations**. Do not use the broader default that can include people who merely showed interest in Omaha.

Official location-option explanation:
https://support.google.com/google-ads/answer/1722038

## Ad group 1 — Interior detailing

Landing page: `https://bryansdetailingomaha.com/services/category/interior-detailing`

Keywords:

- `[interior car detailing omaha]`
- `"interior detailing omaha"`
- `[car interior cleaning bellevue ne]`
- `"interior car detailing near me"`
- `[car seat shampoo omaha]`

Headlines:

- Interior Detailing Omaha
- Bellevue Interior Detail
- Interior Detailing From $139
- Stains, Mats & Glass Cleaned
- Book Your Detail Online
- Local Professional Detailer

Descriptions:

- Interior detailing for dust, crumbs, mats, glass and light stains. Book online.
- Bellevue-based detailing serving the Omaha metro. Sedan packages start at $139.

## Ad group 2 — Full detailing

Landing page: `https://bryansdetailingomaha.com/services/category/full-detailing`

Keywords:

- `[full car detail omaha]`
- `"auto detailing omaha"`
- `[car detailing bellevue ne]`
- `"mobile detailing bellevue"`
- `[complete car detail near me]`

Headlines:

- Full Car Detailing Omaha
- Bellevue Auto Detailing
- Full Detail From $269
- Interior & Exterior Detail
- See Prices Before Booking
- Book Your Detail Online

Descriptions:

- Complete interior and exterior detailing with clear pricing and online booking.
- Local Bellevue detailer serving Omaha, Papillion, La Vista and nearby areas.

## Ad group 3 — System X ceramic coating

Landing page: `https://bryansdetailingomaha.com/ceramic-coating`

Keywords:

- `[ceramic coating omaha]`
- `"system x ceramic coating"`
- `[ceramic coating bellevue ne]`
- `"professional ceramic coating near me"`
- `[system x installer omaha]`

Headlines:

- System X Certified Installer
- Ceramic Coating Omaha
- Bellevue Ceramic Coating
- Ceramic Packages From $700
- Crystal+ & Pro+ Available
- Get A Ceramic Quote

Descriptions:

- Certified System X coating options with proper paint prep and local installation.
- Compare ceramic packages, see real work and request the right coating for your vehicle.

## Ad group 4 — Paint correction

Landing page: `https://bryansdetailingomaha.com/services/category/paint-correction`

Keywords:

- `[paint correction omaha]`
- `"paint correction bellevue"`
- `[swirl removal omaha]`
- `"car paint polishing near me"`
- `[scratch removal car omaha]`

Headlines:

- Paint Correction Omaha
- Remove Swirls & Wash Haze
- Bellevue Paint Polishing
- Restore Gloss & Clarity
- See Paint Correction Prices
- Request A Paint Assessment

Descriptions:

- Machine polishing for swirl marks, wash haze and dull paint in the Omaha metro.
- Choose enhancement or correction work after an honest paint-condition assessment.

## Shared negative keywords

`jobs`, `job`, `salary`, `career`, `training`, `class`, `course`, `certification`, `DIY`, `how to`, `supplies`, `products`, `kit`, `Amazon`, `Walmart`, `free`, `self service`, `automatic car wash`, `touchless car wash`, `wholesale`, `distributor`

## First 14-day operating rule

- Do not change the budget during the first 7 days unless search terms are clearly irrelevant.
- Check search terms every 48 hours and add negatives.
- Pause any keyword after meaningful spend with no qualified calls, quotes, or bookings.
- Do not switch to Maximize Conversions until real booking/call conversion data is recording consistently.
- Report booked revenue separately from clicks and form starts.
