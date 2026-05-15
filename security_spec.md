# Security Specification for Bryan's Showroom Quality Detailing

## Data Invariants
1. A user can only access their own profile.
2. Only admins can modify the service catalog, blog, and FAQs.
3. Customers can create and view their own bookings.
4. Quotes can be created by anyone (public) but only read by admins.
5. Reviews are public read.

## The "Dirty Dozen" Payloads
1. **Malicious ID Injection**: Creating a quote with a 2KB ID string.
2. **Identity Spoofing**: User A trying to update User B's profile.
3. **Privilege Escalation**: User A trying to set `role: 'admin'` in their profile.
4. **State Shortcutting**: Updating a booking status from 'pending' directly to 'completed' without admin authority.
5. **PII Leak**: Unauthenticated user trying to read all user profiles.
6. **Orphaned Record**: Creating a booking for a user that doesn't exist.
7. **Shadow Field**: Adding `isVerified: true` to a user profile update.
8. **Denial of Wallet**: Sending a massive string (1MB) in a FAQ answer.
9. **Timeline Tampering**: Setting `createdAt` to a future date from the client.
10. **Resource Exhaustion**: Creating 10,000 quotes in 1 second (Rate limiting - usually handled by Firebase caps, but rules can help with size).
11. **Admin Impersonat**: Attempting to write to `blog` collection without being in `admins` collection.
12. **Null Pointer Attack**: Reading from a collection and expecting a field that isn't there (Validation helpers prevent this).

## The Test Runner (Mock Tests)
- `test('admins/{uid} exists')`: Grants admin rights.
- `test('users/{uid}')`: Strict schema validation.
- `test('bookings/{id}')`: Relation to `userId`.
