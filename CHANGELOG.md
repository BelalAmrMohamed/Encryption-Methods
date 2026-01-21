# Changelog

## [Unreleased] - 2026-01-21

### Added

- **Scoped Row Transposition Styles:** Added `.row-transposition-page` scope to `styles.css`.
- **Global Selector Update:** Added `#output` to the shared results CSS rule (consolidating logic for `#cipherResult`, `#result`, and `#output`).
- **Responsive Rules:** - Added specific mobile styling for Row Transposition table headers (`th`) to reduce padding on small screens.
  - Added `#prev-step` and `#next-step` (Row Transposition specific IDs) to the mobile-centered button rules.
  - Added `#visual-matrix-area` to the horizontal scroll allow-list for mobile.

### Changed

- **Styling Standardization:** Changed Row Transposition matrix cells from fixed 45px to 40px (desktop) and 32px (mobile) to match the dimensions used in Playfair and Railfence.
- **CSS Extraction:** Moved all styles from `row-transposition.html` to `styles.css`.
- **Mobile UX:** Verified button placement for "Next" and "Previous" in the Row Transposition visualizer is now centered on <480px screens.

### Verified (No Change Needed)

- **Auto-scrolling:** Verified `Script/row-transposition-ui.js` already has `scrollIntoView` calls commented out. No JS changes required.
