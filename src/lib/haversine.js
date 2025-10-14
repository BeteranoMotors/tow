export function haversineKm(a, b){
  const R = 6371
  const toRad = (x)=> x * Math.PI / 180
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const s1 = Math.sin(dLat/2), s2 = Math.sin(dLng/2)
  const c = 2*Math.asin(Math.sqrt(s1*s1 + Math.cos(toRad(a.lat))*Math.cos(toRad(b.lat))*s2*s2))
  return R*c
}
