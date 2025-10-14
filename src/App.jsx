import React, { useState } from 'react'
import QuoteView from './views/QuoteView.jsx'
import SOSView from './views/SOSView.jsx'

export default function App(){
  const [view, setView] = useState('quote') // 'quote' | 'sos'

  return (
    <div style={{fontFamily:'system-ui', padding:16}}>
      <h1>BETERANO Tow (demo)</h1>
      <div style={{display:'flex', gap:8, marginBottom:12}}>
        <button onClick={()=>setView('quote')}>Calcular traslado</button>
        <button onClick={()=>setView('sos')}>SOS en vivo</button>
      </div>
      {view==='quote' ? <QuoteView/> : <SOSView/>}
    </div>
  )
}
