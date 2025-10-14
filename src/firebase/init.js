// Inicializa Firebase si window.__BTR_FIREBASE está disponible.
// Devuelve { app, db, auth, messaging } o null si no configurado.
export async function initFirebaseIfAvailable(){
  const cfg = window.__BTR_FIREBASE
  if (!cfg) return null
  const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js')
  const { getFirestore } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js')
  const { getAuth } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js')
  const { getMessaging } = await import('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging.js')
  const app = initializeApp(cfg)
  const db = getFirestore(app)
  const auth = getAuth(app)
  let messaging = null
  try { messaging = getMessaging(app) } catch {}
  return { app, db, auth, messaging }
}
