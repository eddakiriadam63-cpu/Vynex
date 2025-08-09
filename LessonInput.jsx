import React, {useState} from 'react'
import { generateFlashcards, summarize, transcribeAudio } from '../lib/ai'
import pdfjsLib from 'pdfjs-dist/build/pdf'
import Tesseract from 'tesseract.js'
import { v4 as uuidv4 } from 'uuid'
import { saveCard } from '../lib/storage'

pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.9.179/pdf.worker.min.js'

export default function LessonInput({onImported}){
  const [loading, setLoading] = useState(false)
  const [text, setText] = useState('')
  const [lang, setLang] = useState('en')

  const handleTextImport = ()=> setText(text.trim())

  const handleFile = async(e)=>{
    const f = e.target.files[0]
    if(!f) return
    setLoading(true)
    try{
      if(f.type === 'application/pdf'){
        const arr = await f.arrayBuffer()
        const pdf = await pdfjsLib.getDocument({data: arr}).promise
        let full = ''
        for(let i=1;i<=pdf.numPages;i++){
          const page = await pdf.getPage(i)
          const txt = await page.getTextContent()
          const strs = txt.items.map(it=>it.str)
          full += strs.join(' ') + '\n'
        }
        setText(full)
      } else if(f.type.startsWith('image/')){
        const { data: { text } } = await Tesseract.recognize(f)
        setText(text)
      } else if(f.type.startsWith('video/') || f.type.startsWith('audio/')){
        // transcribe via Whisper/OpenAI
        const t = await transcribeAudio(f)
        setText(t)
      } else {
        const s = await f.text()
        setText(s)
      }
    }catch(err){
      alert('Error processing file: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGenerate = async(useAI=true)=>{
    if(!text) return alert('No text')
    setLoading(true)
    try{
      const summary = await summarize(text, lang)
      let cards = []
      if(useAI){
        cards = await generateFlashcards(text, lang, 30)
      } else {
        // heuristic: split into sentences
        const parts = text.split(/\n|\.|\?|!/)
        cards = parts.filter(p=>p.trim().length>20).slice(0,20).map(p=>({q: p.trim().slice(0,80)+'...', a: p.trim()}))
      }
      // save generated cards
      for(const c of cards){
        await saveCard({
          id: uuidv4(),
          q:c.q, a:c.a,
          createdAt: new Date().toISOString(),
          srs:{repetitions:0,ef:2.5,interval:0,nextReview:new Date().toISOString()}
        })
      }
      alert('Imported ' + cards.length + ' cards. Summary:\n' + summary.slice(0,300))
      if(onImported) onImported()
    }catch(err){
      alert('AI error: ' + err.message)
    }finally{
      setLoading(false)
    }
  }

  return (
    <div className='card'>
      <h3>Import Lesson</h3>
      <div>
        <label>Language</label>
        <select value={lang} onChange={e=>setLang(e.target.value)}>
          <option value='en'>English</option>
          <option value='fr'>Français</option>
        </select>
      </div>
      <div style={{marginTop:8}}>
        <textarea value={text} onChange={e=>setText(e.target.value)} placeholder='Paste lesson text or import a file' style={{width:'100%',minHeight:120,borderRadius:10,padding:10}} />
      </div>
      <div style={{marginTop:8, display:'flex',gap:8}}>
        <input type='file' onChange={handleFile} />
        <button onClick={()=>handleGenerate(true)} disabled={loading}>Generate with AI</button>
        <button onClick={()=>handleGenerate(false)} disabled={loading}>Generate Heuristic</button>
      </div>
      {loading && <p>Processing...</p>}
    </div>
  )
}
