import React from 'react'

export default function TowDriverCard({ driver }){
  return (
    <div style={{padding:'8px 10px', border:'1px solid #2a2a2a', borderRadius:10}}>
      <div style={{fontWeight:700}}>{driver.name||'Driver'}</div>
      <div className="small">{driver.status||'available'} · {driver.distance_km?.toFixed?.(1)} km</div>
    </div>
  )
}
