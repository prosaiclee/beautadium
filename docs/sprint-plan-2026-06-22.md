# Sprint Plan — K-Beauty Cards

**Created:** 2026-06-22
**Revised:** 2026-06-22 — incorporated codebase health review (see §1); folded data-integrity bugs #3–#5 into S1, added Day-0 git setup, rebalanced capacity (S4/S5 → stretch).
**Sprint window:** 2026-06-22 → 2026-07-05 (2 weeks)
**Team:** Solo (1 contributor)
**Theme:** Core card/deck features — *correctness first*

---

## 0. Project Health Snapshot (as of 2026-06-22)

Findings from a full read of the codebase. These reshaped the sprint below.

**What's solid:** Design/UX polish, graceful Firebase→localCache fallback ([firebase.js](../src/firebase.js)), clean static data (60 cards, all IDs unique, no missing fields). Production build passes (618 KB / 161 KB gzip).

**Critical — core learning-loop data integrity (this sprint's focus):**
| # | Issue | Location |
|---|---|---|
| 1 | Learned-cards progress regresses (only current session's known cards saved) | [StudySession.jsx:170](../src/screens/StudySession.jsx#L170), [Complete.jsx:56](../src/screens/Complete.jsx#L56) |
| 2 | "Review missed cards" CTA returns home instead of starting a review | [Complete.jsx:265](../src/screens/Complete.jsx#L265) |
| 3 | `totalLearned` grows unbounded — re-studied cards double-count | [firebase.js:163](../src/firebase.js#L163) |
| 4 | `recordSession` runs in a mount effect → StrictMode double-invoke double-counts stats | [Complete.jsx:47](../src/screens/Complete.jsx#L47) |
| 5 | No defined known/unknown/learned state model — a card can be in two sets at once | (cross-cutting) |

→ **#1–#5 are all the same data flow and are now consolidated into S1.**

**Engineering-foundation gaps (triaged to Day-0 + backlog):**
- No git repo / `.gitignore` → **S0, Day-0**.
- Zero tests → minimal Vitest smoke tests added to **S1 DoD**.
- 618 KB bundle (full Firebase SDK statically imported), session state is volatile on refresh, inline styles pervasive, `lang="en"` on a Korean app → **§3 backlog (next sprint)**.

---

## Sprint Goal

> **A learner can run a focused review-only session, hear correct Korean pronunciation, and trust that their progress and "cards learned" count are always correct — never regressing, never double-counting.**

Success = the core study loop is provably correct (covered by smoke tests), the "review missed cards" promise actually works, and pronunciation audio is live across all decks.

---

## 1. Capacity Estimate

No historical velocity (first tracked sprint) — this establishes a **baseline**. Estimate conservatively, recalibrate at retro.

| Input | Value |
|---|---|
| Working days | 10 (2 × 5-day weeks) |
| Solo focused build hours/day | ~5 |
| Gross capacity | ~50 ideal hours |
| Buffer (bugs, unknowns, tech debt) | −20% (~10 hrs) |
| **Net capacity** | **~40 ideal hours ≈ 14 SP** |

**Point scale (this team):** `1 SP ≈ ½ focused day ≈ 2.5–3 ideal hours.`

- **Capacity:** 14 SP
- **Committed:** 11 SP (S0 + S1–S3)
- **Buffer / stretch:** 3 SP (S4, S5, B1 pulled only if green by day 7)

> **Revision note:** S1 grew from 3 → 5 SP after absorbing bugs #3–#5 and a test harness. To protect the conservative first-sprint commit, **S4 and S5 moved from committed to stretch**. Net: data correctness + the highest-value new feature (TTS) are committed; nice-to-haves are explicitly optional.

---

## 2. Committed Stories

Ordered by sequence. Story points in parentheses.

### S0 — Initialize version control *(Day-0, unpointed setup)* 🔧
**Why:** Project is not a git repo and has no `.gitignore`; there is no rollback or change history while doing risky data-flow surgery in S1.
**AC:**
- `git init`, initial commit of current state.
- `.gitignore` excludes `node_modules/`, `dist/`, `.env*` (keep `.env.example`).
- Done before S1 begins. Not pointed (does not distort baseline velocity).

### S1 — Make the core progress & stats model correct *(5 SP)* 🐛 foundational
**Consolidates health-review bugs #1, #3, #4, #5.**
**Why:** The metrics the entire app displays can regress (#1) and inflate past 100% (#3), and dev-mode StrictMode double-counts them (#4) — all rooted in an undefined card-state model (#5).
**AC:**
- **Spec first:** write the known/unknown/learned state-transition rules (1 short doc/comment) and treat it as the contract for the rest of S1.
- `learnedCards` = **union** of previously-learned + this session's known cards (never regresses; verify monotonic across 2 sessions).
- A card cannot be in `learnedCards` and `unknownCards` simultaneously — define and enforce the precedence rule.
- `totalLearned` is **derived** from the sum of all decks' `learnedCards` (idempotent), not incrementally accumulated → fixes unbounded growth (#3) and removes the StrictMode double-count vector (#4). Confirm "Total learned" never exceeds total card count.
- `completedSessions` increments exactly once per finished session (single source of truth between [StudySession.jsx](../src/screens/StudySession.jsx) and [Complete.jsx](../src/screens/Complete.jsx)).
- **Tests:** stand up Vitest; unit-test the progress-merge/union logic and `totalLearned` derivation (this is the regression net the repo currently lacks).

### S2 — "Review missed cards" actually starts a review session *(3 SP)* 🐛
**Consolidates bug #2.** **Depends on:** S1 (correct `unknownCards`).
**Why:** The prominent CTA ([Complete.jsx:265](../src/screens/Complete.jsx#L265)) calls `onHome(...)` and returns to deck select — it never starts a review. False affordance on the primary action.
**AC:**
- Tapping "Review missed cards" starts a StudySession seeded with **only** the current `unknownCards`.
- Completing a review updates progress per the S1 rules (now-known cards leave the unknown set).
- Button hidden when `unknownCards` is empty (verify).
- Reuses the existing queue logic ([StudySession.jsx:137](../src/screens/StudySession.jsx#L137)), not duplicated.

### S3 — Korean pronunciation audio (TTS) *(3 SP)*
**Why:** Highest-value *new* learning feature; nothing today lets a learner hear the word. Web Speech API (`speechSynthesis`, `ko-KR`) needs no backend or assets.
**Depends on:** none — sequence after S2 to avoid touching StudySession twice.
**AC:**
- A speaker button speaks `card.word` in `ko-KR`.
- Graceful no-op + disabled/hidden button when `speechSynthesis` or a Korean voice is unavailable (mirror the degradation pattern in [firebase.js](../src/firebase.js)).
- Speaker tap does not trigger the flip (`stopPropagation`).
- Verified audible on at least one Chromium browser.

---

## 3. Stretch / Backlog

Pull stretch items only if committed work is green by **day 7**.

**Stretch (this sprint if time):**
- **S4 — Session length & shuffle controls (1 SP):** pick 5 / 10 / All + shuffle toggle; defaults reproduce today's behavior (All, unknown-first).
- **S5 — Reset deck progress (1 SP):** confirm-gated per-deck reset of `learnedCards`/`unknownCards`/`completedSessions` (local + Firestore), reflected immediately in DeckSelect.

**Next-sprint backlog (from health review §0):**
- **Test coverage expansion** beyond S1's smoke tests.
- **Bundle reduction** — audit Firebase modular imports / dynamic `import()` to cut the 618 KB bundle.
- **Session persistence** — store in-progress session in `sessionStorage` to survive refresh.
- **Accessibility/i18n pass** — `lang="ko"`, aria-labels on emoji-only buttons, contrast check, favicon, PWA manifest.
- **Styling refactor** — move pervasive inline styles to CSS classes/modules for reuse.
- **B1 — Card bookmarking / favorites virtual deck (2–3 SP).**

---

## 4. Dependency Map & Critical Path

```
S0 (git) ──► S1 (correct model) ──► S2 (review session) ──► [S5 (reset)]
                   │
                   └──► unblocks trustworthy progress for all screens

S3 (TTS)         — independent (sequence after S2)
[S4 (size/shuffle)] — independent, stretch
```

- **Critical path:** S0 → S1 → S2. S2 is meaningless until S1's data model is correct; S1 is risky surgery, so S0 (version control) must land first.
- **No external/team dependencies.** Web Speech API is browser-native; Firebase already integrated.
- **Order:** S0 → S1 → S2 → S3 → (stretch) S4 → S5.

---

## 5. Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| S1 surgery breaks the working study loop | Med | High | S0 git first; write the state-transition spec before coding; Vitest smoke tests as the safety net (built into S1). |
| Deriving `totalLearned` changes existing users' displayed numbers | Med | Med | Acceptable — current numbers are already wrong; document the one-time correction in the commit. |
| Web Speech API has no `ko-KR` voice on test machine | Med | Med | Feature-detect + degrade (S3 AC); verify on Chrome; don't gate the sprint on audio. |
| Solo dev = single point of failure | Low | High | 20% buffer reserved; S3 and stretch items are independently shippable, so a partial sprint still delivers value. |
| Scope creep into UI polish / backlog items | Med | Med | Theme is *core correctness*; log ideas to §3, don't action mid-sprint. |

---

## 6. Definition of Done (per story)

- Acceptance criteria met and manually smoke-tested in the running app (`npm run dev`).
- For S1: Vitest unit tests pass and cover the progress-merge + `totalLearned` derivation.
- No regression in the core loop: select deck → study → complete → progress persists, is monotonic, and `totalLearned` ≤ total cards.
- Works in both Firebase-connected and local-fallback modes.
- Committed to git with a descriptive message.

---

## 7. Retro Inputs to Capture

- Actual SP completed vs 11 committed → seeds sprint #2 velocity.
- Did absorbing #3–#5 make S1's 5 SP estimate accurate?
- Where the 20% buffer actually went.
- Whether the ½-day = 1 SP scale held.
