import React from 'react'
import { createRoot } from 'react-dom/client'
import QuoteView from '../views/QuoteView.jsx'
import SOSView from '../views/SOSView.jsx'
import './styles.css'

let _root = null
let _container = null

function mount({ targetId='tow-container', view='quote', props={} } = {}){
  const el = document.getElementById(targetId)
  if (!el) throw new Error(`[btr-tow] No se encuentra #${targetId}`)
  _container = el
  const root = createRoot(el)
  _root = root

  const View = view === 'sos' ? SOSView : QuoteView
  root.render(React.createElement(View, { ...props }))
}

function unmount(){
  if (_root && _container){
    _root.unmount()
    _root = null
    _container = null
  }
}

export { mount, unmount }

// Exponer global si se carga vía <script>
if (typeof window !== 'undefined') {
  window.BTR_Tow = window.BTR_Tow || { mount, unmount }
}
