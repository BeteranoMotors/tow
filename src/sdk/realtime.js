// Stubs de realtime (sin Firebase).
// En producción, reemplaza con Firestore + Geoqueries, y FCM.

export function subscribeDriversNearby(center, radiusKm=20, onChange){
  // Simulación de 3 conductores moviéndose ligeramente.
  let active = true
  function gen(){
    const rnd = (n)=> (Math.random()-0.5)*n
    const base = [
      { name:'Mario',  status:'available', lat:center.lat + rnd(0.1), lng:center.lng + rnd(0.1) },
      { name:'Lucía',  status:'available', lat:center.lat + rnd(0.12), lng:center.lng + rnd(0.12) },
      { name:'Jürgen', status:'busy',      lat:center.lat + rnd(0.15), lng:center.lng + rnd(0.15) },
    ]
    onChange && onChange(base)
  }
  gen()
  const t = setInterval(()=> active && gen(), 5000)
  return ()=>{ active=false; clearInterval(t) }
}
