import { useState, useEffect } from 'react'
import { recordSession } from '../firebase'

// ── Confetti particle ──────────────────────────────────────────
function Confetti() {
  const particles = Array.from({ length: 18 }, (_, i) => ({
    id:    i,
    left:  `${Math.random() * 100}%`,
    delay: `${Math.random() * 1.5}s`,
    color: ['#FF6B9D', '#C77DFF', '#4ADE80', '#FB923C', '#60A5FA', '#FDE68A'][i % 6],
    size:  `${8 + Math.random() * 8}px`,
  }))

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 200, overflow: 'hidden', pointerEvents: 'none' }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position:        'absolute',
            left:            p.left,
            top:             '-10px',
            width:           p.size,
            height:          p.size,
            background:      p.color,
            borderRadius:    '50%',
            animation:       `confetti 2s ${p.delay} ease-in forwards`,
          }}
        />
      ))}
    </div>
  )
}

// ── Main ───────────────────────────────────────────────────────
export default function Complete({ uid, session, stats, progress, onHome }) {
  const { selectedDeck, knownCards, unknownCards } = session
  const [updatedStats,   setUpdatedStats]   = useState(null)
  const [showConfetti,   setShowConfetti]   = useState(false)

  const totalCards   = selectedDeck?.cards?.length || 0
  const knownCount   = knownCards?.length  || 0
  const unknownCount = unknownCards?.length || 0
  const accuracy     = totalCards ? Math.round((knownCount / totalCards) * 100) : 0

  // ── Record session on mount ──────────────────────────────
  useEffect(() => {
    ;(async () => {
      const newStats = await recordSession(uid, selectedDeck.id, knownCount)
      setUpdatedStats(newStats)
      if (knownCount > 0) setShowConfetti(true)
    })()
  }, []) // eslint-disable-line

  // ── Update progress for the parent ──────────────────────
  const updatedProgress = {
    ...progress,
    [selectedDeck.id]: {
      learnedCards:        knownCards,
      unknownCards,
      completedSessions:   (progress[selectedDeck.id]?.completedSessions || 0),
      lastStudied:         new Date().toISOString().slice(0, 10),
    },
  }

  // ── Result message ───────────────────────────────────────
  function resultMsg() {
    if (accuracy === 100) return { emoji: '🏆', text: 'Perfect! You nailed it!' }
    if (accuracy >= 80)  return { emoji: '🎉', text: 'Great job!' }
    if (accuracy >= 50)  return { emoji: '💪', text: 'Good effort! Keep going!' }
    return                      { emoji: '🌱', text: 'Keep practicing — you\'ll get it!' }
  }

  const result = resultMsg()

  return (
    <div className="screen" style={{ position: 'relative', overflowY: 'auto' }}>
      {showConfetti && <Confetti />}

      <div style={{ padding: '32px 20px 24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', animation: 'slideUp 0.4s ease' }}>
          <div style={{ fontSize: 64, marginBottom: 8 }}>{result.emoji}</div>
          <h1 style={{ fontSize: 22, fontWeight: 900, marginBottom: 6 }}>Session Complete!</h1>
          <p style={{ color: 'var(--text-light)', fontSize: 15 }}>{result.text}</p>
        </div>

        {/* Stats card */}
        <div style={{
          background:    '#fff',
          borderRadius:  'var(--radius)',
          padding:       '20px',
          boxShadow:     'var(--shadow)',
          animation:     'slideUp 0.5s ease',
        }}>
          <div style={{
            fontSize:    15,
            fontWeight:  900,
            color:       'var(--text-light)',
            marginBottom: 16,
          }}>
            {selectedDeck.emoji} {selectedDeck.name} · Results
          </div>

          {/* Accuracy ring (simplified) */}
          <div style={{
            display:         'flex',
            alignItems:      'center',
            gap:             20,
            marginBottom:    20,
          }}>
            <div style={{
              width:           80,
              height:          80,
              borderRadius:    '50%',
              background:      `conic-gradient(var(--primary) ${accuracy * 3.6}deg, #F0D0DC ${accuracy * 3.6}deg)`,
              display:         'flex',
              alignItems:      'center',
              justifyContent:  'center',
              flexShrink:      0,
            }}>
              <div style={{
                width:           60,
                height:          60,
                borderRadius:    '50%',
                background:      '#fff',
                display:         'flex',
                alignItems:      'center',
                justifyContent:  'center',
                fontWeight:      900,
                fontSize:        16,
                color:           'var(--primary)',
              }}>
                {accuracy}%
              </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>✓ I know this</span>
                <span style={{
                  fontWeight:   800,
                  fontSize:     15,
                  color:        'var(--green-dark)',
                  background:   '#DCFCE7',
                  borderRadius: 50,
                  padding:      '2px 12px',
                }}>{knownCount}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 14 }}>↩ Review again</span>
                <span style={{
                  fontWeight:   800,
                  fontSize:     15,
                  color:        'var(--orange-dark)',
                  background:   '#FEF3C7',
                  borderRadius: 50,
                  padding:      '2px 12px',
                }}>{unknownCount}</span>
              </div>
            </div>
          </div>

          {/* Total progress bar */}
          <div style={{ marginBottom: 6 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 6 }}>
              <span style={{ color: 'var(--text-light)' }}>Deck progress</span>
              <span style={{ fontWeight: 700 }}>{knownCount} / {totalCards}</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${Math.round((knownCount / totalCards) * 100)}%`,
                  background: `linear-gradient(90deg, ${selectedDeck.colors[0]}, ${selectedDeck.colors[1]})`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Overall stats */}
        <div style={{
          display:       'flex',
          gap:           12,
          animation:     'slideUp 0.6s ease',
        }}>
          <div style={{
            flex:          1,
            background:    'linear-gradient(135deg, #FF6B9D22, #C77DFF22)',
            borderRadius:  'var(--radius-sm)',
            padding:       '16px',
            textAlign:     'center',
            border:        '1.5px solid var(--border)',
          }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--primary)' }}>
              {updatedStats?.totalLearned ?? stats?.totalLearned ?? 0}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>
              Total learned
            </div>
          </div>
          <div style={{
            flex:          1,
            background:    'linear-gradient(135deg, #FB923C22, #FDE68A22)',
            borderRadius:  'var(--radius-sm)',
            padding:       '16px',
            textAlign:     'center',
            border:        '1.5px solid #F0D0B0',
          }}>
            <div style={{ fontSize: 24, fontWeight: 900, color: 'var(--orange-dark)' }}>
              {updatedStats?.streak ?? stats?.streak ?? 0} 🔥
            </div>
            <div style={{ fontSize: 12, color: 'var(--text-light)', marginTop: 4 }}>
              Day streak
            </div>
          </div>
        </div>

        {/* Review list (if any unknown) */}
        {unknownCount > 0 && (
          <div style={{
            background:   '#FFF9F0',
            borderRadius: 'var(--radius-sm)',
            padding:      '16px',
            border:       '1.5px solid #F0D0B0',
            animation:    'slideUp 0.7s ease',
          }}>
            <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--orange-dark)', marginBottom: 10 }}>
              ↩ Cards to review next time
            </div>
            {(unknownCards || []).slice(0, 5).map(cardId => {
              const card = selectedDeck.cards.find(c => c.id === cardId)
              if (!card) return null
              return (
                <div key={cardId} style={{
                  display:        'flex',
                  alignItems:     'center',
                  gap:            10,
                  padding:        '6px 0',
                  borderBottom:   '1px solid #F0E0D0',
                }}>
                  <span style={{ fontSize: 20 }}>{card.emoji}</span>
                  <div>
                    <span style={{ fontWeight: 800, fontSize: 15 }}>{card.word}</span>
                    <span style={{ color: 'var(--text-light)', fontSize: 13, marginLeft: 8 }}>
                      {card.en}
                    </span>
                  </div>
                </div>
              )
            })}
            {unknownCount > 5 && (
              <div style={{ fontSize: 13, color: 'var(--text-light)', marginTop: 8 }}>
                + {unknownCount - 5} more
              </div>
            )}
          </div>
        )}

        {/* CTA buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, animation: 'slideUp 0.8s ease' }}>
          {unknownCount > 0 && (
            <button
              className="btn btn-primary btn-full"
              onClick={() => onHome(updatedStats, updatedProgress)}
              style={{ fontSize: 15 }}
            >
              Review missed cards 🔄
            </button>
          )}
          <button
            className="btn btn-full"
            style={{
              background:  unknownCount > 0 ? '#fff' : 'var(--primary)',
              color:       unknownCount > 0 ? 'var(--primary)' : '#fff',
              border:      unknownCount > 0 ? '2px solid var(--primary)' : 'none',
              fontSize:    15,
              boxShadow:   unknownCount > 0 ? 'none' : 'var(--shadow)',
            }}
            onClick={() => onHome(updatedStats, updatedProgress)}
          >
            ← Back to all decks
          </button>
        </div>

        <div style={{ height: 12 }} />
      </div>
    </div>
  )
}
