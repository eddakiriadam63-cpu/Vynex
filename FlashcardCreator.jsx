import React, {useState} from 'react'
import { v4 as uuidv4 } from 'uuid'
import { nowISO } from '../lib/utils'

export default function FlashcardCreator({onCreate}){
  const [q, setQ] = useState('')
  const [a, setA] = useState('')
  const [lang, setLang] = useState('en')

  const handleCreate = ()=>{
    if(!q || !a) return alert('Please add question and answer')
    const card = {
      id: uuidv4(),
      q, a,
      createdAt: nowISO(),
      srs:{repetitions:0,ef:2.5,interval:0,nextReview:nowISO()}
    }
    onCreate(card)
    setQ(''); setA('')
  }

  return (
    <div className='card'>
      <h3>Create flashcard</h3>
      <div>
        <label>Language</label>
        <select value={lang} onChange={e=>setLang(e.target.value)}>
          <option value='en'>English</option>
          <option value='fr'>Français</option>
        </select>
      </div>
      <div style={{marginTop:8}}>
        <input placeholder='Question' value={q} onChange={e=>setQ(e.target.value)} style={{width:'100%',padding:10,borderRadius:10}} />
      </div>
      <div style={{marginTop:8}}>
        <textarea placeholder='Answer' value={a} onChange={e=>setA(e.target.value)} style={{width:'100%',padding:10,borderRadius:10,minHeight:100}} />
      </div>
      <div style={{marginTop:10}}>
        <button onClick={handleCreate}>Save card</button>
      </div>
    </div>
  )
}
