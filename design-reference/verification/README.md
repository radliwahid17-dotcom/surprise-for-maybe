# Pink Mochi — visual verification

Verified on 14 October 2026 against the mandatory [PINK_MOCHI_DESIGN.md](../PINK_MOCHI_DESIGN.md). The reference document is unchanged.

## Mascot comparison

![Documented CSS bunny alongside the reusable React SVG](reference-comparison.png)

The left bunny renders the original documented HTML/CSS geometry. The right bunny renders the final React SVG at the same scale. Both use the original 270 × 282 body proportions, rotated long cream/pink ears, tiny brown eyes, rosy cheeks, omega mouth, and pink heart badge. The SVG uses a thin peach outline and a soft ground shadow. The hero adds the original peach halo and floating decorations. All mascot appearances use this same bunny component, including accessories and emotional states.

## Production screenshots

These images were captured from the final production build in Chromium with reduced motion enabled, after loading the bundled fonts. No source styles were changed for capture.

| Screenshot | Capture |
| --- | --- |
| [Home desktop](home-desktop.png) | 1440 × 1000 viewport |
| [Room desktop](room-desktop.png) | 1440 × 1000 viewport |
| [Home mobile](home-mobile.png) | Complete hero at 390 px width |
| [Room mobile](room-mobile.png) | Complete care panel at 390 px width |
| [Room mobile viewport](room-mobile-viewport.png) | Actual 390 × 844 touch viewport |
| [Closet mobile](closet-mobile.png) | Complete closet at 390 px width |
| [Hidden ending mobile](hidden-ending-mobile.png) | 390 × 844 viewport; letter scrolls within the dialog |

The complete mobile section captures use a taller capture viewport so the sticky navigation does not cover the bunny. The separate phone viewport capture preserves the regular 844 px screen height. Visual review checked the bunny silhouette, ears, cheeks, mouth, heart badge, accessory previews, cohesive palette, readable controls, and scrollable ending.

## Validation

`npm test` passed all **45 browser tests**, including the existing content and navigation, every care interaction, sleep/wake, emotional reactions, returning greeting, accessory unlock/equip/persistence, both endings, mini game scores and pause/resume, keyboard tabs, accessibility contrast/focus, unavailable or corrupt storage, offline reload and care, and layouts at **320, 390, 768, and 1440 px**. Root and GitHub Pages production builds passed. These are Chromium touchscreen/viewport checks, not a physical iPhone/Safari test.

The production ZIP is generated from `dist/`. GitHub Pages receives the corresponding prefix-aware `dist-pages/` build, preserving the existing `/surprise-for-maybe/` URL.
