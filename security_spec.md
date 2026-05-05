# Security Specification - Hari Academy

## Data Invariants
1. A user profile document must correspond to the `request.auth.uid`.
2. Users can only read and write their own profile.
3. Course progress can only be read/written by the owner of the parent user profile.
4. Emails must be verified for all write operations.

## The Dirty Dozen Payloads (Target: Users & Progress)

| ID | Target | Payload | Intent | Expected |
|----|--------|---------|--------|----------|
| 1 | /users/attacker | `{ "displayName": "Spoof", "email": "admin@hari.com" }` | Create profile for someone else | DENY |
| 2 | /users/me | `{ "displayName": "Me", "email": "me@me.com", "isAdmin": true }` | Inject unauthorized field | DENY |
| 3 | /users/me | `{ "displayName": "Me", "email": "me@me.com", "xp": 9999999 }` | Inflate XP beyond logic | DENY (size/range check) |
| 4 | /users/victim | `(any)` | Read another user's profile | DENY |
| 5 | /users/me/progress/math | `{ "courseId": "math", "progress": 150 }` | Progress > 100% | DENY |
| 6 | /users/me | `{ "createdAt": "2020-01-01" }` | Spoof createdAt (not server time) | DENY |
| 7 | /users/me | `{ "displayName": "a".repeat(2000) }` | Resource exhaustion via large string | DENY |
| 8 | /users/me | `{ "lastActive": "not-a-date" }` | Type poisoning | DENY |
| 9 | /users/me | `{ "displayName": "New Name" }` | Partial update missing required fields | DENY (if schema is strict) |
| 10| /users/me/progress/eng | `{ "courseId": "wrong" }` | Mismatching courseId in path vs data | DENY |
| 11| /users/me | `{ "email": "verified@me.com" }` (auth.email_verified=false) | Write without email verification | DENY |
| 12| /users/me | `{ "xp": "level-up" }` | Type poisoning (string for int) | DENY |

## Test Runner Logic
Verified via `firestore.rules.test.ts`.
