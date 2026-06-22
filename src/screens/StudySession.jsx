import { useState, useEffect, useCallback } from 'react'
import { saveDeckProgress } from '../firebase'

// ── Card front ─────────────────────────────────────────────────
function CardFront({ card, deck }) {
  return (
    <div style={{
      display:         'flex',
      flexDirection:   'column',
      alignItems:      'center',
      justifyContent:  'center',
      height:          '100%',
      padding:         '32px 24px',
      background:      `linear-gradient(145deg, ${deck.colors[0]}22, ${deck.colors[1]}44)`,
      textAlign:       'center',
      gap:             16,
    }}>
      {/* Emoji */}
      <div style={{ fontSize: 64 }}>{card.emoji}</div>

      {/* Korean word */}
      <div style={{ fontSize: 36, fontWeight: 900, color: 'var(--text)', lineHeight: 1.2 }}>
        {card.word}
      </div>

      {/* Romanization */}
      <div style={{
        fontSize:     15,
        color:        'var(--text-light)',
        fontStyle:    'italic',
        background:   '#fff',
        borderRadius: 50,
        padding:      '6px 16px',
      }}>
        {card.romanization}
      </div>

      {/* Tap hint */}
      <div style={{
        marginTop:  16,
        fontSize:   13,
        color:      deck.colors[0],
        fontWeight: 700,
        opacity:    0.7,
      }}>
        Tap to reveal meaning 👆
      </div>
    </div>
  )
}

// ── Card back ──────────────────────────────────────────────────
function CardBack({ card, deck }) {
  return (
    <div style={{
      display:         'flex',
      flexDirection:   'column',
      justifyContent:  'space-between',
      height:          '100%',
      padding:         '28px 24px',
      background:      '#fff',
      gap:             12,
    }}>
      {/* Word header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
          <span style={{ fontSize: 28, fontWeight: 900 }}>{card.word}</span>
          <span style={{
            fontSize:     12,
            background:   `${deck.colors[0]}33`,
            color:        deck.colors[0],
            borderRadius: 50,
            padding:      '3px 10px',
            fontWeight:   800,
          }}>
            {deck.name}
          </span>
        </div>

        {/* Meanings */}
        <div style={{
          background:   '#FFF5F8',
          borderRadius: 14,
          padding:      '14px 16px',
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 15, color: 'var(--text)', lineHeight: 1.6, marginBottom: 6 }}>
            {card.meaning_ko}
          </div>
          <div style={{ fontSize: 14, color: 'var(--text-light)', lineHeight: 1.5 }}>
            {card.meaning_en}
          </div>
        </div>

        {/* English keyword */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span style={{ fontSize: 18 }}>🇬🇧</span>
          <span style={{
            fontSize:     15,
            fontWeight:   800,
            color:        'var(--secondary-dark)',
            background:   '#F3E8FF',
            borderRadius: 50,
            padding:      '4px 14px',
          }}>
            {card.en}
          </span>
        </div>
      </div>

      {/* Example sentence */}
      <div style={{
        background:   '#F0F9FF',
        borderRadius: 14,
        padding:      '12px 16px',
        borderLeft:   `3px solid ${deck.colors[0]}`,
      }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: deck.colors[0], marginBottom: 6 }}>
          예문 EXAMPLE
        </div>
        <div style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.6, marginBottom: 4 }}>
          {card.example_ko}
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-light)', lineHeight: 1.5 }}>
          {card.example_en}
        </div>
      </div>
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────
export default function StudySession({ uid, session, progress, onComplete, onBack }) {
  const { selectedDeck } = session

  // Build initial queue: unknown cards first, then new cards
  const initialQueue = useCallback(() => {
    const prevLearned = progress[selectedDeck.id]?.learnedCards || []
    const prevUnknown = progress[selectedDeck.id]?.unknownCards || []

    // Cards the user explicitly marked unknown go first
    const unknownFirst = selectedDeck.cards.filter(c => prevUnknown.includes(c.id))
    // New cards (not yet seen) come after
    const newCards     = selectedDeck.cards.filter(c => !prevLearned.includes(c.id) && !prevUnknown.includes(c.id))
    // Already learned cards go to the end (review)
    const learnedCards = selectedDeck.cards.filter(c => prevLearned.includes(c.id))

    return [...unknownFirst, ...newCards, ...learnedCards]
  }, [selectedDeck, progress])

  const [queue,      setQueue]      = useState(initialQueue)
  const [index,      setIndex]      = useState(0)
  const [flipped,    setFlipped]    = useState(false)
  const [knownSet,   setKnownSet]   = useState(new Set())
  const [unknownSet, setUnknownSet] = useState(new Set())
  const [animClass,  setAnimClass]  = useState('')

  const totalCards    = selectedDeck.cards.length
  const currentCard   = queue[index]
  const sessionDone   = index >= queue.length

  // ── Save & finish ──────────────────────────────────────────
  useEffect(() => {
    if (!sessionDone) return

    const learnedCards = [...knownSet]
    const unknownCards = [...unknownSet]

    // Persist to Firebase
    saveDeckProgress(uid, selectedDeck.id, {
      learnedCards,
      unknownCards,
      completedSessions: (progress[selectedDeck.id]?.completedSessions || 0) + 1,
      lastStudied: new Date().toISOString().slice(0, 10),
    })

    onComplete({ knownCards: learnedCards, unknownCards })
  }, [sessionDone]) // eslint-disable-line

  // ── Handlers ──────────────────────────────────────────────
  function handleFlip() {
    setFlipped(f => !f)
  }

  function advance(isKnown) {
    const card = queue[index]
    if (isKnown) {
      setKnownSet(s => new Set([...s, card.id]))
      setUnknownSet(s => { const n = new Set(s); n.delete(card.id); return n })
    } else {
      setUnknownSet(s => new Set([...s, card.id]))
    }

    setAnimClass('animate-fadeIn')
    setFlipped(false)

    // Small delay to let flip-back animation play
    setTimeout(() => {
      setIndex(i => i + 1)
      setAnimClass('')
    }, 120)
  }

  // ── Done screen ───────────────────────────────────────────
  if (sessionDone) {
    return (
      <div className="screen" style={{ alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontSize: 64, animation: 'bounce 1s ease infinite' }}>🎉</div>
        <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 20, marginTop: 12 }}>
          Saving…
        </p>
      </div>
    )
  }

  const progressPct = Math.round((index / queue.length) * 100)

  return (
    <div className="screen">
      {/* Header */}
      <div className="screen-header">
        <button
          onClick={onBack}
          style={{
            background: 'none',
            border:     'none',
            fontSize:   22,
            cursor:     'pointer',
            padding:    0,
            lineHeight: 1,
          }}
          aria-label="Back"
        >
          ←
        </button>
        <div style={{ flex: 1, marginLeft: 4 }}>
          <div style={{ fontSize: 16, fontWeight: 900 }}>
            {selectedDeck.emoji} {selectedDeck.name}
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-light)' }}>
            {index + 1} / {queue.length}
          </div>
        </div>
        <div style={{
          fontSize:   13,
          fontWeight: 700,
          color:      'var(--green-dark)',
          background: '#DCFCE7',
          borderRadius: 50,
          padding:    '4px 12px',
        }}>
          ✓ {knownSet.size}
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ padding: '0 20px 12px', flexShrink: 0 }}>
        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progressPct}%` }} />
        </div>
      </div>

      {/* Flip card */}
      <div
        style={{ flex: 1, padding: '4px 20px', display: 'flex', flexDirection: 'column' }}
        className={animClass}
      >
        <div
          className="flip-container"
          style={{ flex: 1 }}
          onClick={handleFlip}
        >
          <div
            className={`flip-card ${flipped ? 'flipped' : ''}`}
            style={{ height: '100%', minHeight: 340 }}
          >
            <div className="flip-face flip-front">
              <CardFront card={currentCard} deck={selectedDeck} />
            </div>
            <div className="flip-face flip-back">
              <CardBack card={currentCard} deck={selectedDeck} />
            </div>
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding: '16px 20px 28px', flexShrink: 0 }}>
        {flipped ? (
          <div style={{ display: 'flex', gap: 12 }}>
            <button
              className="btn btn-orange"
              style={{ flex: 1, fontSize: 15 }}
              onClick={() => advance(false)}
            >
              ↩ 다시볼게요
            </button>
            <button
              className="btn btn-green"
              style={{ flex: 1, fontSize: 15 }}
              onClick={() => advance(true)}
            >
              알아요 ✓
            </button>
          </div>
        ) : (
          <button
            className="btn btn-primary btn-full"
            style={{ fontSize: 15 }}
            onClick={handleFlip}
          >
            뒤집어서 의미 확인 👆
          </button>
        )}

        {/* Difficulty hint */}
        <div style={{
          textAlign:  'center',
          marginTop:  10,
          fontSize:   12,
          color:      'var(--text-light)',
        }}>
          난이도 {'⭐'.repeat(currentCard.difficulty || 1)}
        </div>
      </div>
    </div>
  )
}
