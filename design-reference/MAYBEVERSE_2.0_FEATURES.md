# MAYBEVERSE 2.0 — implemented experiences

Pink Mochi follows the unchanged [mandatory design reference](PINK_MOCHI_DESIGN.md). The same cream/pink bunny component appears throughout the site. No alternate star or bear mascot is introduced.

| Experience | Working interactions and persistence |
| --- | --- |
| Welcome portal | Usable YES/NOPE options, at most two playful shifts, dramatic bunny reaction, access-granted scene, original Radli question, enter/close, one-time welcome |
| Pink Mochi | Varied pets, five snacks, nap/wake, blush, sad/angry/confused faces, hug, dance, kiss, spin, hide, celebration, return greeting, idle sleep, eight existing outfit options |
| Emergency happiness | All 32 original responses, emotional reaction, included virtual hug, repeat button |
| Hug machine | Three hug sizes, distinct animations/dialogue, saved hug count, mega-hug secret |
| Fortune cookie | 60 original messages drawn without repetition until the set is exhausted, saved count and history |
| Little garden | Six named pots, five species, three growth steps, water/rename, moonflower unlock and transformation, cat and sleeping-bunny secrets, saved growth, no neglect penalty |
| Free capsules | Unlimited gifts from all 24 sticker designs plus compliments, secret notes, an interactive miniature Pink Mochi, funny achievements, and personal Radli surprises; animated machine, saved ownership, no payment/advertising/daily limits |
| Sticker album | 24 original vector stickers, activity unlocks, collectible gifts, descriptions, ownership, 22 secrets with optional hints |
| Catch the Love | Original 30-second game, three levels, actual timed combo, pause/resume/hidden-tab pause, best score, costume and sticker unlocks |
| Make Mochi Happy | Five random wishes, three choices per wish, retries, real care reactions, score, completion/replay, collectible story star |
| Bubble wrap | All 12 original bubbles, optional sound, random compliments, atomic pop-all, completion, reset/replay, costume/sticker/secret unlocks |
| Night sky | Eight message stars, moon toggle, golden star, persistent five-letter MAYBE constellation, two personal letters, story star |
| Message bottle | 30 original Radli notes with nonrepeating draws, saved history/count, personal-current secret |
| Mood rescue | Six original moods/messages, scene themes, expressive bunny, three-step optional activity per mood, care/sticker feedback |
| Surprise post | 40 distinct deliveries across bulletin, telegram, ticket, chat, note, diploma; gentle food answers; manual repeat; one automatic delivery maximum per visit |
| Daily world | Original 60 daily notes retained; added date-stable dialogue and compliment; sticker/garden/secret/story progress |
| Seven-star chapter | Stars earned in cookie, hug, garden, capsule, happy game, MAYBE constellation, bottle; heart-shaped sky, bunny/envelope, full supplied Radli letter, read-again/back, persistent access |
| Comfort settings | Opt-in sound, extra effects, automatic surprises, night lighting; persisted choices; keyboard/touch support; reduced motion respected |

The original seven letters, 32 surprise messages, 60 daily notes, existing games, original final page, bedroom ending, achievements, sound preference, found-Mochi progress, and offline functionality remain.

## Discoverable secrets

The album provides optional hints for all 22 implemented discoveries. They include the five-tap superhero, ten header hearts, Radli code, forbidden button, original wish star, bedroom window, original care ending, ten-pat dance, moon switch, three petal taps, three drum taps, garden nap, five logo taps/giant Mochi, game costume, golden compliment, all seven letters, three cookies, five bottles, mega hug, pop-all party, Radli plant name, and complete MAYBE constellation.

## Storage and delivery

`maybeverse:universe-v2` holds new garden, collection, story, daily visit, preference, and draw-history data. Existing keys retain their previous meanings. Storage failure falls back to an in-memory experience; saved values are validated on load.

The root production build targets static root hosting. GitHub Pages uses the existing prefix-aware build and URL. The ZIP contains production output only, including local fonts, bunny icons, service worker, and the lazy-loaded experience chunk. Visual evidence and validation results are recorded in [verification](verification/README.md).
