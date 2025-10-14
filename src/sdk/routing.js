import L from 'leaflet'
import 'leaflet-routing-machine'
import { haversineKm } from '../lib/haversine'

export async function getRouteKmMin(origin, destination, { osrmUrl='https://router.project-osrm.org/route/v1' }={}){
  // Usamos LRM en modo programático creando un router y pidiendo route()
  return new Promise((resolve) => {
    const router = L.Routing.osrmv1({ serviceUrl: osrmUrl })
    router.route([ L.latLng(origin.lat, origin.lng), L.latLng(destination.lat, destination.lng) ], (err, routes)=>{
      if (!err && routes && routes[0]){
        const r = routes[0]
        const km = r.summary.totalDistance / 1000
        const min = r.summary.totalTime / 60
        const polyline = r.coordinates?.map(c=> [c.lat, c.lng]) || null
        resolve({ km, min, polyline })
      } else {
        // Fallback haversine (aprox. a vuelo de pájaro * 1.25)
        const base = haversineKm(origin, destination)
        resolve({ km: base*1.25, min: (base*1.25)/60*50, polyline: null })
      }
    })
  })
}
