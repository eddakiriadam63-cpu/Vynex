import React, {useState, useEffect} from 'react'
import { getDueCards, saveCard } from '../lib/storage'
import { computeNext } from '../lib/srs'

export default function FlashcardReview({cards}){

  const [due, setDue] = useState([])
  const [index, setIndex] = useState(0)
  const [showAnswer, setShowAnswer] = useState(false)

  useEffect(()=>{ (async ()=>{
    const d = await getDueCards()
    setDue(d)
  })() }, [cards])

  const markQuality = async(q)=>{
    const card = due[index]
    if(!card) return
    const updated = computeNext(card, q)
    await saveCard(updated)
    const d = await getDueCards()
    setDue(d)
    setShowAnswer(false)
    setIndex(0)
  }

  if(due.length===0) return <div className='card'><h3>No cards due</h3><p>All clear — good job</p></div>

  const card = due[index] || due[0]

  return (
    <div className='card'>
      <h3>Review</h3>
      <div style={{marginTop:8}}>
        <div style={{padding:16,background:'rgba(255,255,255,0.02)',borderRadius:12}}>
          <strong>Q:</strong>
          <p>{card.q}</p>
          {showAnswer ? <div><strong>A:</strong><p>{card.a}</p></div> : <button onClick={()=>setShowAnswer(true)}>Show answer</button>}
        </div>
        <div style={{marginTop:12}}>
          <p>How well did you recall?</p>
          <div>
            <button onClick={()=>markQuality(5)}>Easy</button>
            <button onClick={()=>markQuality(4)}>Good</button>
            <button onClick={()=>markQuality(3)}>Hard</button>
            <button onClick={()=>markQuality(2)}>Fail</button>
          </div>
        </div>
      </div>
    </div>
  )
}
