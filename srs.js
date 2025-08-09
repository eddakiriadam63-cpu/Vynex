/*
  Very small SM-2 implementation.
  quality: 0-5 (we map UI accordingly)
*/
export function computeNext(card, quality){
  const s = card.srs || {repetitions:0,ef:2.5,interval:0}
  let {repetitions, ef, interval} = s
  if(quality < 3){
    repetitions = 0
    interval = 1
  } else {
    repetitions++
    if(repetitions===1) interval = 1
    else if(repetitions===2) interval = 6
    else interval = Math.round(interval * ef) || 1
    ef = Math.max(1.3, ef + (0.1 - (5-quality)*(0.08 + (5-quality)*0.02)))
  }
  const next = new Date()
  next.setDate(next.getDate() + interval)
  card.srs = {repetitions, ef, interval, nextReview: next.toISOString()}
  return card
}
