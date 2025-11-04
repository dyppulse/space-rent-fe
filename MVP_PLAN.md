# MVP Simplification Plan

## File Deletion Checklist

### Pages to Delete:
- [x] `src/pages/HomePage.jsx` ✅ DELETED
- [x] `src/pages/BookingWizard.jsx` ✅ DELETED
- [x] `src/pages/SignupPage.jsx` ✅ DELETED
- [x] `src/pages/OwnerSignupPage.jsx` ✅ DELETED
- [x] `src/pages/DashboardPage.jsx` ✅ DELETED
- [x] `src/pages/ClientDashboardPage.jsx` ✅ DELETED
- [x] `src/pages/NewSpacePage.jsx` ✅ DELETED
- [x] `src/pages/EditSpace.jsx` ✅ DELETED
- [x] `src/pages/BookingsManagementPage.jsx` ✅ DELETED
- [x] `src/pages/UpgradeRequestPage.jsx` ✅ DELETED
- [x] `src/pages/PendingVerificationPage.jsx` ✅ DELETED
- [x] `src/pages/EmailVerificationPage.jsx` ✅ DELETED
- [x] `src/pages/HowItWorksPage.jsx` ✅ DELETED
- [x] `src/pages/AboutPage.jsx` ✅ DELETED
- [x] `src/pages/ContactPage.jsx` ✅ DELETED
- [x] `src/pages/PrivacyPolicyPage.jsx` ✅ DELETED
- [x] `src/pages/TermsOfServicePage.jsx` ✅ DELETED
- [x] `src/pages/WorkInProgress.jsx` ✅ DELETED

### Components to Review/Delete:
- [x] `src/components/DashboardWrapper.jsx` ✅ DELETED
- [x] `src/components/SignupTypeDialog.jsx` ✅ DELETED
- [x] `src/components/RoleSwitcher.jsx` ✅ DELETED
- [x] Review `src/components/ConfirmDialog.jsx` - ✅ KEPT (used in Header for logout confirmation)

---

## Implementation Summary ✅

### Completed Phases:

✅ **Phase 1: Update Routing (App.jsx)**
- Removed all non-essential route imports
- Updated Routes to only include MVP routes (/, /spaces, /spaces/:id, /auth/login, /admin/*, *)
- Added redirect from `/` to `/spaces`
- Kept all admin routes intact

✅ **Phase 2: Simplify Header**
- Removed dashboard/owner links
- Removed role switcher component and logic
- Simplified navigation (only "Spaces" link)
- Kept admin link if user is admin
- Updated logout redirect to `/spaces`
- Removed signup button (only login for admin access)

✅ **Phase 3: Simplify Footer**
- Removed all navigation links (Quick Links, For Hosts, Legal sections)
- Kept minimal contact info (email, phone, location)
- Simplified layout with centered content

✅ **Phase 4: Update SpaceDetailPage**
- Removed booking button and booking wizard redirect
- Removed authentication dialog for booking
- Kept all display content (details, images, amenities, location tabs)
- Full-width layout for better display

✅ **Phase 5: Update SmartRoute**
- Changed redirect logic for logged-in non-admin users to `/spaces` instead of dashboard

✅ **Phase 6: Cleanup**
- Deleted 18 unused page files
- Deleted 3 unused components
- Removed unused imports from remaining files
- Verified no broken imports (linting passed ✅)

✅ **Phase 7: Testing**
- Linting passed with 0 errors
- All imports resolved correctly

---

## MVP Implementation Complete! 🎉

### Final Structure:

**Public Routes (3):**
- `/` → Redirects to `/spaces`
- `/spaces` → SpacesPage (listing with filters)
- `/spaces/:id` → SpaceDetailPage (individual space details)

**Auth Routes (1):**
- `/auth/login` → LoginPage (for admin access)

**Admin Routes (9):**
- All admin routes remain intact and functional

**Total Routes:** ~13 (down from 25+)

**Files Removed:** 21 files (18 pages + 3 components)

**Status:** ✅ Ready for testing and deployment!
