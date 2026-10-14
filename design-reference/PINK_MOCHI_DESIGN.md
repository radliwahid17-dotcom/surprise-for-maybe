# MAYBEVERSE — Pink Mochi Design Reference

This is the **source-of-truth design contract** for the pink bunny mascot shown in Radli's `MAYBEVERSE-preview.html`. Keep this identity across all MAYBEVERSE updates. It is not the yellow pudding-star character currently in `src/Mochi.tsx`.

## Exact design cues (from the preview)
- Silhouette: rounded, squishy upright bunny with a slightly irregular cream-pink body, approximately 270 × 282 CSS pixels at desktop hero size.
- Two long upright-but-tilted rabbit ears with strawberry-pink inner ear, slightly behind the head.
- Minimal vertical oval dark-brown eyes (left/right), round pink blush patches, tiny `ω` mouth.
- A tiny pink heart bow/badge on lower torso.
- Warm cream body: `linear-gradient(125deg,#fffdf8,#f6e9de)`; ear fill `#fffaf5`; inner ear `#f4c2c7`; blush `#edb3bb9e`; bow `#d18b9d`; eyes `#694d49`.
- Behind: giant peach halo, small floating stars/hearts/flowers, speech bubbles ("Hey May! You got this! ✨" and "Mochi loves you ♡").
- Mood: kawaii, cozy, gentle, playful, hand-made, not an emoji and not a yellow star.
- The main protagonist is the bunny. The mascot can have pink outfits / alternate pink colorways, but it must remain recognizably the same bunny.

## Original prototype markup (for recreation in React)

```html
<div class="hero-art">
  <div class="halo"></div>
  <span class="spark s1">✦</span><span class="spark s2">♡</span>
  <span class="spark s3">✧</span><span class="spark s4">✿</span>
  <div class="mochi">
    <div class="ear left"></div><div class="ear right"></div>
    <div class="eye left"></div><div class="eye right"></div>
    <div class="blush left"></div><div class="blush right"></div>
    <div class="mouth">ω</div><div class="bow">♥</div>
  </div>
  <div class="floatnote fn1">Hey May! You got this! ✨</div>
  <div class="floatnote fn2">Mochi loves you ♡</div>
</div>
```

## Original prototype character CSS (starting point, then refactor to scoped styles / SVG)

```css
.mochi{position:relative;width:270px;height:282px;border-radius:49% 50% 43% 45%;background:linear-gradient(125deg,#fffdf8,#f6e9de);box-shadow:inset -18px -12px 0 #f6e2d7,0 23px 28px #926a6525;animation:bob 3s ease-in-out infinite}
.ear{position:absolute;top:-56px;width:84px;height:112px;background:#fffaf5;border:9px solid #fffaf5;border-radius:50% 50% 25% 25%;box-shadow:inset 0 0 0 17px #f4c2c7;z-index:-1}
.ear.left{left:20px;transform:rotate(-24deg)}.ear.right{right:20px;transform:rotate(24deg)}
.eye{position:absolute;top:118px;width:12px;height:19px;border-radius:50%;background:#694d49}
.eye.left{left:75px}.eye.right{right:75px}
.blush{width:47px;height:20px;background:#edb3bb9e;border-radius:50%;position:absolute;top:151px}
.blush.left{left:32px}.blush.right{right:32px}
.mouth{position:absolute;top:151px;left:124px;font-size:30px;line-height:1}
.bow{position:absolute;top:217px;left:110px;background:#d18b9d;color:#fff;border-radius:50%;width:42px;height:31px;text-align:center;line-height:30px}
```

## Implementation contract
1. Keep React + TypeScript + Vite, routes, all existing messages/surprises, games, localStorage persistence and PWA behavior.
2. Replace the star-shape implementation of `Mochi` in `src/Mochi.tsx` with an original, accessible, SVG-or-component recreation of the **bunny above**. Preserve the existing public component interface (`className`, `expression`, `superhero`) and support expression transitions. A new prop may be added for interactions.
3. Use scoped CSS/unique gradient IDs. Avoid using global class names `.ear`/`.eye` and avoid clipping the ears in responsive containers.
4. Add gentle bunny expressions: happy/blush, sleepy, sad, confused, hopping, virtual hug, happy dance; preserve reduced-motion support.
5. Update hero layout to feel closer to the HTML preview: generous whitespace, blush pastel colors, peach circular halo, handwritten love notes. **Do not overwrite existing features**.
6. Test at 320/390/768/1440px and verify visually that the bunny is **not a yellow star** in home, modal, games and secret interactions.
7. Run `npm run build`, `npm test` (or explain test environment blockers), and regenerate production ZIP + GitHub Pages build if that is how the site is deployed.
8. NEVER claim it matches the visual reference based on code alone. Inspect a screenshot (desktop + mobile), refine alignment, colors, and proportions.

## Creative direction for future updates
Pink Mochi should become a **little living companion**, not a replacement mascot: pet, snack, tickle, sleep, peek, happy dance, mini speech bubbles, cute audio optional (off by default), unlocking stickers, encouragement when Maybe is tired. No intrusive auto-popups.
