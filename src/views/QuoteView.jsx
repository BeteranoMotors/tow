import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-routing-machine'
import '../microfront/styles.css'
import { getRouteKmMin } from '../sdk/routing'
import { calcTowPrice, defaultRules } from '../sdk/pricing'
import TowPriceBreakdown from '../components/TowPriceBreakdown.jsx'

export default function QuoteView({
  osrmUrl = 'https://router.project-osrm.org/route/v1',
  currency = 'CHF'
}){
  const mapRef = useRef(null)
  const mapEl = useRef(null)
  const [origin, setOrigin] = useState({ lat: 46.948, lng: 7.447 }) // Bern
  const [dest, setDest] = useState({ lat: 46.204, lng: 6.143 })     // Genève
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  // init map once
  useEffect(()=>{
    if (mapRef.current) return
    const map = L.map(mapEl.current).setView([origin.lat, origin.lng], 8)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap'
    }).addTo(map)
    mapRef.current = map
  }, [])

  async function handleCalc(ev){
    ev && ev.preventDefault()
    setLoading(true)
    try {
      const { km, min, polyline } = await getRouteKmMin(origin, dest, { osrmUrl })
      const price = calcTowPrice({ km, rules: defaultRules(currency) })
      setResult({ km, min, price, polyline })
      // draw polyline
      if (polyline && mapRef.current){
        if (mapRef.current._routeLayer){
          mapRef.current.removeLayer(mapRef.current._routeLayer)
        }
        const line = L.polyline(polyline, { weight: 5 }).addTo(mapRef.current)
        mapRef.current._routeLayer = line
        mapRef.current.fitBounds(line.getBounds(), { padding: [20,20] })
      }
    } catch (e) {
      console.error(e)
      alert('No se pudo calcular la ruta. Intenta de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="btr-tow__panel">
      <h2>Calcular traslado</h2>
      <form className="btr-tow__form" onSubmit={handleCalc}>
        <div className="btr-tow__row">
          <div>
            <label>Origen (lat,lng)</label>
            <input value={`${origin.lat}, ${origin.lng}`}
              onChange={e=>{
                const [a,b]=e.target.value.split(',').map(s=>Number(s.trim()))
                if(!isNaN(a)&&!isNaN(b)) setOrigin({lat:a,lng:b})
              }} />
          </div>
          <div>
            <label>Destino (lat,lng)</label>
            <input value={`${dest.lat}, ${dest.lng}`}
              onChange={e=>{
                const [a,b]=e.target.value.split(',').map(s=>Number(s.trim()))
                if(!isNaN(a)&&!isNaN(b)) setDest({lat:a,lng:b})
              }} />
          </div>
        </div>
        <div style={{display:'flex', gap:8}}>
          <button type="submit" disabled={loading}>{loading?'Calculando…':'Calcular'}</button>
          <button type="button" onClick={()=>{
            // swap
            setOrigin(dest); setDest(origin);
          }}>Invertir</button>
        </div>
      </form>

      <div ref={mapEl} className="btr-tow__map" />

      {result && (
        <div style={{marginTop:12}}>
          <div className="small">Ruta: {result.km.toFixed(1)} km · {Math.round(result.min)} min</div>
          <TowPriceBreakdown price={result.price} currency={currency} />
        </div>
      )}
    </div>
  )
}
