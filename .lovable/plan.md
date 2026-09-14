# Daryeel UI/UX Implementation Plan

## Goal
Build a polished, mobile-first Daryeel product prototype covering the full belongings journey, with no backend, database, authentication, APIs, or real QR generation.

## Experience structure
- Create a browsable UI prototype with the requested screens: splash, welcome, sign-up, login, home, items, add-item flow, item details, QR identity, public QR page, lost state, notifications, profile, and empty states.
- Use front-end-only navigation and sample data so every screen and key action can be reviewed.
- Keep the private app shell and public QR page visually distinct; the public page exposes only owner-approved fields.
- Adapt the mobile layout for tablet and desktop while keeping phone use primary.

## Visual system
- Apply the exact teal, gold, neutral, success, warning, and error palette as semantic design tokens.
- Load Inter and establish readable title, section, body, label, and caption styles.
- Create a simple original Daryeel mark combining protection, an item tag, and QR-inspired geometry.
- Standardize soft shadows, 14–18px cards, 12–14px buttons, inputs, chips, badges, progress, dialogs, toasts, and empty states.
- Use Lucide vector icons throughout; no interface emoji.

## Key interactions
- Bottom navigation switches among Home, My Items, Notifications, and Profile.
- Welcome, sign-up, and sign-in screens connect into the visual dashboard journey without real account handling.
- Search, category filters, item views, quick actions, and notification states behave locally.
- Add Item presents a clear four-step visual flow with photo selection affordances and privacy choices.
- QR actions, reminder actions, lost-state actions, dialogs, and toast feedback are demonstrable UI only.

## Technical details
- Keep TanStack Start routing and implement the prototype at `/`.
- Build focused reusable React components for the logo, phone shell, navigation, cards, fields, badges, item rows, and state views.
- Define all colors, fonts, shadows, radii, and animation rules in `src/styles.css`; use semantic utility names in components.
- Add page-specific title, description, Open Graph, and Twitter metadata.
- Use bundled/generated visual assets only if needed; QR visuals remain clearly non-functional placeholders.

## Validation
- Check the complete journey in the running preview at mobile and desktop sizes.
- Confirm navigation and UI-only actions work, text does not overlap, and private details never appear on the public page.
- Confirm no backend, persistence, authentication logic, API endpoints, database work, or QR generation logic is introduced.
