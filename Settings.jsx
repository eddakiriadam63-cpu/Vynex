import React, {useState, useEffect} from 'react'
import { generateFlashcards } from '../lib/ai'

export default function Settings(){
  const [apiKey, setApiKey] = useState('')

  useEffect(()=>{
    const k = localStorage.getItem('openai_key')||''
    setApiKey(k)
  },[])

  const save = ()=>{
    localStorage.setItem('openai_key', apiKey)
    alert('API key saved locally (optional).')
  }

  const test = async()=>{
    try{
      const res = await generateFlashcards('This is a short test about photosynthesis. Plants use sunlight to convert CO2 and water into glucose.', 'en', 3)
      alert('AI test successful. Generated ' + res.length + ' cards.')
    }catch(err){
      alert('Test failed: ' + err.message)
    }
  }

  return (
    <div className='card'>
      <h3>Settings</h3>
      <p>Optional: paste your OpenAI API key to enable AI features (costs may apply).</p>
      <input value={apiKey} onChange={e=>setApiKey(e.target.value)} placeholder='sk-...' style={{width:'100%',padding:10,borderRadius:8}} />
      <div style={{marginTop:8}}>
        <button onClick={save}>Save key</button>
        <button onClick={test}>Test AI</button>
      </div>
    </div>
  )
}
