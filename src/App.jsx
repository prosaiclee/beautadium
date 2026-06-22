import { useState, useEffect } from 'react'
import { initAuth, loadProgress, loadStats } from './firebase'
import DeckSelect from './screens/DeckSelect'
import StudySession from './screens/StudySession'
import Complete from './screens/Complete'
import './styles/global.css'

// ── Initial session state ──────────────────────────────────────
const INIT_SESSION = {
  selectedDeck:    null,
  knownCards:      [],   // card IDs the user marked as known
  unknownCards:    [],   // card IDs to study again
  sessionStartTime: null,
}

export default function App() {
  const [screen,   setScreen]   = useState('loading')
  const [uid,      setUid]      = useState(null)
  const [progress, setProgress] = useState({})   // { [deckId]: { learnedCards, completedSessions, lastStudied } }
  const [stats,    setStats]    = useState({ totalLearned: 0, streak: 0, lastStudied: null })
  const [session,  setSession]  = useState(INIT_SESSION)

  // ── Bootstrap ────────────────────────────────────────────────
  useEffect(() => {
    ;(async () => {
      const resolvedUid = await initAuth()
      setUid(resolvedUid)

      const [prog, st] = await Promise.all([
        loadProgress(resolvedUid),
        loadStats(resolvedUid),
      ])
      setProgress(prog || {})
      setStats(st   || { totalLearned: 0, streak: 0, lastStudied: null })
      setScreen('deck_select')
    })()
  }, [])

  // ── Navigation helper ────────────────────────────────────────
  function navigate(to, data = {}) {
    setSession(prev => ({ ...prev, ...data }))
    setScreen(to)
  }

  // ── Callback: deck selected ──────────────────────────────────
  function handleDeckSelect(deck) {
    navigate('study_session', {
      selectedDeck:     deck,
      knownCards:       [],
      unknownCards:     [],
      sessionStartTime: Date.now(),
    })
  }

  // ── Callback: session complete ───────────────────────────────
  function handleStudyComplete({ knownCards, unknownCards }) {
    setSession(prev => ({ ...prev, knownCards, unknownCards }))
    setScreen('complete')
  }

  // ── Callback: after Complete screen ─────────────────────────
  function handleReturnHome(updatedStats, updatedProgress) {
    if (updatedStats)    setStats(updatedStats)
    if (updatedProgress) setProgress(updatedProgress)
    setSession(INIT_SESSION)
    setScreen('deck_select')
  }

  // ── Loading screen ───────────────────────────────────────────
  if (screen === 'loading') {
    return (
      <div className="app" style={{ alignItems: 'center', justifyContent: 'center', gap: 16 }}>
        <div style={{ fontSize: 56, animation: 'bounce 1s ease infinite' }}>💄</div>
        <p style={{ fontWeight: 700, color: 'var(--primary)', fontSize: 18 }}>
          K-Beauty Cards
        </p>
        <p style={{ color: 'var(--text-light)', fontSize: 14 }}>Loading…</p>
      </div>
    )
  }

  return (
    <div className="app">
      {screen === 'deck_select' && (
        <DeckSelect
          uid={uid}
          progress={progress}
          stats={stats}
          onSelectDeck={handleDeckSelect}
        />
      )}

      {screen === 'study_session' && (
        <StudySession
          uid={uid}
          session={session}
          progress={progress}
          onComplete={handleStudyComplete}
          onBack={() => setScreen('deck_select')}
        />
      )}

      {screen === 'complete' && (
        <Complete
          uid={uid}
          session={session}
          stats={stats}
          progress={progress}
          onHome={handleReturnHome}
        />
      )}
    </div>
  )
}
