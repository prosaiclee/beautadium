// Firebase helper — graceful degradation pattern (adapted from vocatchbook)
// Works offline with in-memory localCache fallback

import { initializeApp } from 'firebase/app'
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth'
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
} from 'firebase/firestore'

// ── Firebase init ──────────────────────────────────────────────
const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             import.meta.env.VITE_FIREBASE_APP_ID,
}

let app = null
let auth = null
let db = null
let isFirebaseAvailable = false

try {
  if (firebaseConfig.apiKey) {
    app  = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db   = getFirestore(app)
    isFirebaseAvailable = true
  }
} catch (e) {
  console.warn('[firebase] init failed, using local cache:', e.message)
}

// ── In-memory cache (offline fallback) ────────────────────────
const localCache = {
  uid:      null,
  stats:    { totalLearned: 0, streak: 0, lastStudied: null },
  progress: {},  // { [deckId]: { learnedCards: [], completedSessions: 0, lastStudied: null } }
}

// ── Auth ───────────────────────────────────────────────────────
export async function initAuth() {
  if (!isFirebaseAvailable) {
    localCache.uid = 'local_' + Math.random().toString(36).slice(2, 10)
    return localCache.uid
  }

  return new Promise((resolve) => {
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        localCache.uid = user.uid
        resolve(user.uid)
      } else {
        try {
          const credential = await signInAnonymously(auth)
          localCache.uid = credential.user.uid
          resolve(credential.user.uid)
        } catch (e) {
          console.warn('[firebase] anon sign-in failed:', e.message)
          localCache.uid = 'local_' + Math.random().toString(36).slice(2, 10)
          resolve(localCache.uid)
        }
      }
    })
  })
}

// ── Helpers ────────────────────────────────────────────────────
function userPath(uid) {
  return `users/${uid}`
}

function isLocal(uid) {
  return !uid || uid.startsWith('local_') || !isFirebaseAvailable
}

// ── Stats ──────────────────────────────────────────────────────
export async function loadStats(uid) {
  if (isLocal(uid)) return { ...localCache.stats }
  try {
    const snap = await getDoc(doc(db, userPath(uid), 'stats'))
    if (snap.exists()) {
      localCache.stats = snap.data()
      return snap.data()
    }
    return { ...localCache.stats }
  } catch (e) {
    console.warn('[firebase] loadStats failed:', e.message)
    return { ...localCache.stats }
  }
}

export async function saveStats(uid, stats) {
  localCache.stats = { ...localCache.stats, ...stats }
  if (isLocal(uid)) return

  try {
    await setDoc(doc(db, userPath(uid), 'stats'), localCache.stats, { merge: true })
  } catch (e) {
    console.warn('[firebase] saveStats failed:', e.message)
  }
}

// ── Deck Progress ──────────────────────────────────────────────
export async function loadProgress(uid) {
  if (isLocal(uid)) return { ...localCache.progress }
  try {
    const snap = await getDoc(doc(db, userPath(uid), 'progress'))
    if (snap.exists()) {
      localCache.progress = snap.data()
      return snap.data()
    }
    return {}
  } catch (e) {
    console.warn('[firebase] loadProgress failed:', e.message)
    return { ...localCache.progress }
  }
}

export async function saveDeckProgress(uid, deckId, deckProgress) {
  if (!localCache.progress) localCache.progress = {}
  localCache.progress[deckId] = deckProgress

  if (isLocal(uid)) return

  try {
    await setDoc(
      doc(db, userPath(uid), 'progress'),
      { [deckId]: deckProgress },
      { merge: true }
    )
  } catch (e) {
    console.warn('[firebase] saveDeckProgress failed:', e.message)
  }
}

// ── Streak / Stats update after session ───────────────────────
export async function recordSession(uid, deckId, learnedCount) {
  const today = new Date().toISOString().slice(0, 10)
  const stats = await loadStats(uid)

  // Streak logic
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
  let newStreak = stats.streak || 0
  if (stats.lastStudied === yesterday) {
    newStreak += 1
  } else if (stats.lastStudied !== today) {
    newStreak = 1
  }

  const updated = {
    totalLearned:  (stats.totalLearned || 0) + learnedCount,
    streak:        newStreak,
    lastStudied:   today,
  }

  await saveStats(uid, updated)
  return updated
}
