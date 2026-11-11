# Volunteer homepage integration

## Apply to your existing checkout
Copy these files from this archive to the SAME paths in your repository:
- src/app/volunteer-dashboard/page.tsx (replaced)
- src/components/VolunteerDashboard.tsx (new)
- src/components/volunteerDemoData.ts (new)
- src/__tests__/VolunteerDashboard.test.tsx (new)
- src/__tests__/authService.test.ts (adds the missing signUp method to the existing mock)

Do not replace your .git directory or .env.local. No dependency changes are required.

Create a branch first:
```bash
git switch -c feature/volunteer-homepage
```
After copying the files:
```bash
npm ci
npm run dev
```
Log in with a volunteer account. The existing RoleGuard routes and protects /volunteer-dashboard. The profile email and logout come from the real authentication flow.

Review and commit:
```bash
git add src/app/volunteer-dashboard/page.tsx src/components/VolunteerDashboard.tsx src/components/volunteerDemoData.ts src/__tests__/VolunteerDashboard.test.tsx src/__tests__/authService.test.ts
git commit -m "Add volunteer homepage and demo shift registration"
git push -u origin feature/volunteer-homepage
```
Then open a pull request in GitHub.

## Scope
English React/TypeScript UI with direct Tailwind utility classes, flat buttons and #FF0000 accent. Overview, event/shift selection, review and confirmation, my shifts, calendar, local message preview, account details, real logout.

The uploaded project only defines authentication/profile storage. Events, registrations and messages remain clearly labelled demo data in component state; they reset on reload. No messages are actually sent, and club membership is not inferred from the authenticated account. Replace the fixture through the project's service/repository layers once the team defines event, shift and registration tables. The eventual backend must enforce capacity and unique registrations atomically and protect access with RLS.

## Validation
30 tests pass; ESLint and TypeScript checks pass after `npx next typegen`. No production Supabase login or deployment was tested; the archive does not include your environment variables. No production build or browser visual verification is claimed.
