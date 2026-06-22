import { useMemo } from 'react'
import decksData from '../data/decks.json'

// ── Deck card ──────────────────────────────────────────────────
function DeckCard({ deck, deckProgress, onClick }) {
  const totalCards   = deck.cards.length
  const learnedCount = deckProgress?.learnedCards?.length || 0
  const pct          = totalCards ? Math.round((learnedCount / totalCards) * 100) : 0
  const isDone       = learnedCount >= totalCards

  return (
    <button
      onClick={() => onClick(deck)}
      style={{
        display:       'flex',
        flexDirection: 'column',
        background:    '#fff',
        border:        `2px solid ${isDone ? 'var(--green)' : 'var(--border)'}`,
        borderRadius:  'var(--radius)',
        padding:       '18px 20px',
        width:         '100%',
        textAlign:     'left',
        cursor:        'pointer',
        boxShadow:     isDone ? '0 4px 16px rgba(74,222,128,0.2)' : 'var(--shadow)',
        transition:    'all 0.2s ease',
        outline:       'none',
        WebkitTapHighlightColor: 'transparent',
      }}
    >
      {/* Top row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 12 }}>
        {/* Emoji badge */}
        <div style={{
          width:           52,
          height:          52,
          borderRadius:    14,
          background:      `linear-gradient(135deg, ${deck.colors[0]}, ${deck.colors[1]})`,
          display:         'flex',
          alignItems:      'center',
          justifyContent:  'center',
          fontSize:        26,
          flexShrink:      0,
        }}>
          {deck.emoji}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 17, fontWeight: 900 }}>{deck.name}</span>
            {isDone && (
              <span style={{
                fontSize:     11,
                background:   'var(--green)',
                color:        '#fff',
                borderRadius: 50,
                padding:      '2px 8px',
                fontWeight:   700,
              }}>완료 ✓</span>
            )}
          </div>
          <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 2 }}>
            {deck.name_en} · {totalCards}장
          </div>
        </div>

        <div style={{
          textAlign:    'right',
          fontSize:     13,
          fontWeight:   700,
          color:        isDone ? 'var(--green-dark)' : 'var(--primary)',
          flexShrink:   0,
        }}>
          {learnedCount}/{totalCards}
        </div>
      </div>

      {/* Description */}
      <div style={{ fontSize: 13, color: '#777', marginBottom: 12, lineHeight: 1.4 }}>
        {deck.description}
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{
            width:      `${pct}%`,
            background: isDone
              ? 'linear-gradient(90deg, var(--green), var(--green-dark))'
              : `linear-gradient(90deg, ${deck.colors[0]}, ${deck.colors[1]})`,
          }}
        />
      </div>
    </button>
  )
}

// ── Main ───────────────────────────────────────────────────────
export default function DeckSelect({ uid, progress, stats, onSelectDeck }) {
  const { decks } = decksData

  const totalLearned  = stats?.totalLearned  || 0
  const streak        = stats?.streak        || 0

  // Summary: how many total cards learned across all decks
  const allLearnedCount = useMemo(() => {
    return decks.reduce((sum, deck) => {
      return sum + (progress[deck.id]?.learnedCards?.length || 0)
    }, 0)
  }, [decks, progress])

  const allCardsCount = decks.reduce((s, d) => s + d.cards.length, 0)

  return (
    <div className="screen" style={{ overflowY: 'auto' }}>
      {/* Hero header */}
      <div style={{
        background:    'linear-gradient(135deg, #FF6B9D, #C77DFF)',
        padding:       '28px 20px 24px',
        color:         '#fff',
        flexShrink:    0,
      }}>
        <div style={{ fontSize: 13, fontWeight: 700, opacity: 0.85, marginBottom: 4 }}>
          K-Beauty Cards 💄
        </div>
        <h1 style={{ fontSize: 24, fontWeight: 900, lineHeight: 1.2, marginBottom: 16 }}>
          What will you<br />learn today?
        </h1>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 12 }}>
          <div style={{
            background:   'rgba(255,255,255,0.2)',
            borderRadius: 12,
            padding:      '10px 16px',
            flex:         1,
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{allLearnedCount}</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Cards learned</div>
          </div>
          <div style={{
            background:   'rgba(255,255,255,0.2)',
            borderRadius: 12,
            padding:      '10px 16px',
            flex:         1,
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{streak} 🔥</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Day streak</div>
          </div>
          <div style={{
            background:   'rgba(255,255,255,0.2)',
            borderRadius: 12,
            padding:      '10px 16px',
            flex:         1,
            backdropFilter: 'blur(8px)',
          }}>
            <div style={{ fontSize: 20, fontWeight: 900 }}>{allCardsCount}</div>
            <div style={{ fontSize: 12, opacity: 0.9 }}>Total cards</div>
          </div>
        </div>
      </div>

      {/* Deck list */}
      <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
        <h2 style={{ fontSize: 15, fontWeight: 900, color: 'var(--text-light)', marginBottom: 4 }}>
          CHOOSE A DECK
        </h2>

        {decks.map(deck => (
          <DeckCard
            key={deck.id}
            deck={deck}
            deckProgress={progress[deck.id]}
            onClick={onSelectDeck}
          />
        ))}

        <div style={{ height: 8 }} />
      </div>
    </div>
  )
}
