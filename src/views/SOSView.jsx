import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../microfront/styles.css'
import { subscribeDriversNearby } from '../sdk/realtime'

export default function SOSView(){
  const mapRef = useRef(null)
  const mapEl = useRef(null)
  const [pos, setPos] = useState({lat:46.948, lng:7.447})
  const [drivers, setDrivers] = useState([])

  useEffect(()=>{
    if (mapRef.current) return
    const map = L.map(mapEl.current).setView([pos.lat, pos.lng], 12)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map)
    L.marker([pos.lat,pos.lng]).addTo(map).bindPopup('Tú')
    mapRef.current = map

    if ('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition(g=>{
        const p = { lat: g.coords.latitude, lng: g.coords.longitude }
        setPos(p)
        map.setView([p.lat,p.lng], 13)
      })
    }
  }, [])

  useEffect(()=>{
    // stub realtime subscription
    const unsub = subscribeDriversNearby(pos, 20, (list)=>{
      setDrivers(list)
      if (mapRef.current){
        // limpia prev
        if (mapRef.current._drivers) {
          mapRef.current._drivers.forEach(m=>m.remove())
        }
        mapRef.current._drivers = list.map(d=>{
          const m = L.circleMarker([d.lat, d.lng], { radius:6 }).addTo(mapRef.current)
          m.bindPopup(`${d.name||'Driver'} · ${d.status}`)
          return m
        })
      }
    })
    return ()=>unsub && unsub()
  }, [pos.lat, pos.lng])

  return (
    <div className="btr-tow__panel">
      <h2>SOS grúa</h2>
      <p className="small">Comparte tu ubicación para ver conductores disponibles cerca.</p>
      <div ref={mapEl} className="btr-tow__map" />
      <div style={{marginTop:10}} className="small">
        Conductores cercanos: {drivers.length}
      </div>
      <div style={{display:'flex', gap:8, marginTop:8}}>
        <button>Pedir grúa</button>
        <button onClick={()=>{
          if ('geolocation' in navigator){
            navigator.geolocation.getCurrentPosition(g=>{
              const p = { lat: g.coords.latitude, lng: g.coords.longitude }
              setPos(p)
              mapRef.current && mapRef.current.setView([p.lat,p.lng], 13)
            })
          }
        }}>Reubicar</button>
      </div>
    </div>
  )
}
