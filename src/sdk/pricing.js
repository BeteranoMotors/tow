export function defaultRules(currency='CHF'){
  return {
    currency,
    base_fee: 80,
    per_km_loaded: 2.5,
    minimum: 120,
    night_hours: { from: 22, to: 6, multiplier: 1.25 },
    weekend_multiplier: 1.10,
    free_km_included: 0
  }
}

function isNight(date=new Date(), from=22, to=6){
  const h = date.getHours()
  return (h >= from || h < to)
}
function isWeekend(date=new Date()){
  const d = date.getDay()
  return d === 6 || d === 0
}

export function calcTowPrice({ km, rules, when=new Date() }){
  const {
    base_fee, per_km_loaded, minimum, night_hours, weekend_multiplier, free_km_included=0, currency
  } = rules

  const billable_km = Math.max(0, km - free_km_included)
  let subtotal = base_fee + Math.max(minimum, billable_km * per_km_loaded)

  let night_multiplier = 1
  let weekend_mult = 1
  const surcharges = {}

  if (night_hours && isNight(when, night_hours.from, night_hours.to)){
    night_multiplier = night_hours.multiplier || 1.25
    surcharges.night = true
  }
  if (isWeekend(when)){
    weekend_mult = weekend_multiplier || 1.1
    surcharges.weekend = true
  }

  let total = subtotal * night_multiplier * weekend_mult
  total = Math.round(total * 100) / 100

  return {
    currency, total,
    base_fee, per_km_loaded, minimum, billable_km,
    night_multiplier, weekend_multiplier: weekend_mult,
    surcharges
  }
}
