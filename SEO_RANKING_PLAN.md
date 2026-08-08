# Bryan's Detailing — Local SEO Ranking Plan

## Completed in the current source

- Stronger Omaha and Bellevue primary landing-page copy.
- Homepage now has a dedicated Omaha/Bellevue local-service section.
- City pages now include a service-selection process and local FAQ.
- City pages prioritize their featured services and link into those service pages.
- Prerendered city HTML now includes services, local proof points, service areas, process, FAQs, and booking links.
- Core service-category titles/descriptions target Omaha + Bellevue intent.
- LocalBusiness identity and service-area data are centralized.
- Booking/admin/review pages are protected from unnecessary indexing.
- `.env` is excluded from source packages.

## Next: local authority

1. Google Business Profile
   - Verify primary category and relevant secondary categories.
   - Complete service list.
   - Add real job photos consistently.
   - Keep name, address, phone, hours, and website consistent.
   - Ask satisfied customers for honest reviews.

2. Review strategy
   - Build a repeatable post-job review request.
   - Never write or manufacture customer reviews.
   - Do not offer incentives that violate Google's review policies.
   - Respond to reviews naturally and specifically.

3. Local proof
   - Publish real before/after jobs with customer permission.
   - Record vehicle type, service, problem, city, and result.
   - Turn the best real jobs into service/location case studies.

4. Partnerships
   - Pursue legitimate relationships with dealerships, body shops, repair shops,
     tint/PPF businesses, car clubs, and local organizations.
   - Prefer real referrals and relevant mentions over bulk backlink packages.

## Content roadmap

Priority pages:
- Mobile Car Detailing Omaha
- Car Detailing Bellevue
- Interior Car Detailing
- Full Car Detailing
- Paint Correction
- Ceramic Coating

Priority guides:
- How Much Does Car Detailing Cost in Omaha?
- Mobile Car Detailing vs. Drop-Off
- How to Remove Dog Hair From a Car Interior
- Is Ceramic Coating Worth It in Nebraska?
- Paint Correction vs. Polishing
- How Nebraska Winter Road Salt Affects Vehicle Paint
- How to Prepare a Vehicle for Sale in Omaha
- How Often Should You Detail Your Car?

## Measurement

Track Search Console queries, impressions, clicks, rankings, phone clicks, text clicks,
quote starts, booking starts, and completed bookings. Use conversions—not traffic alone—to
decide which pages deserve more content and links.

## Deployment QA

- Build the production site.
- Inspect generated HTML for `/`, `/areas/omaha-ne`, `/areas/bellevue-ne`, and all core service hubs.
- Confirm one canonical URL per indexable page.
- Confirm `noindex` on booking/admin/private routes.
- Validate JSON-LD.
- Submit/update the sitemap in Google Search Console.
