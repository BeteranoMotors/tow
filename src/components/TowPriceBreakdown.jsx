import React from 'react'

export default function TowPriceBreakdown({ price, currency='CHF' }){
  if (!price) return null
  const cur = (n)=> new Intl.NumberFormat('es-CH', { style:'currency', currency }).format(n)
  const s = price.surcharges||{}
  return (
    <div className="breakdown">
      <div><strong>Total:</strong> {cur(price.total)}</div>
      <div className="small">Base: {cur(price.base_fee)}</div>
      <div className="small">Km facturables: {price.billable_km.toFixed(1)} km × {cur(price.per_km_loaded)}/km</div>
      {s.night ? <div className="small">Recargo noche: ×{price.night_multiplier}</div> : null}
      {s.weekend ? <div className="small">Recargo fin de semana: ×{price.weekend_multiplier}</div> : null}
      <div className="small">Mínimo: {cur(price.minimum)}</div>
    </div>
  )
}
