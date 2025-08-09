import React, {useState, useEffect} from 'react'
import FlashcardCreator from './components/FlashcardCreator'
import FlashcardReview from './components/FlashcardReview'
import Settings from './components/Settings'
import LessonInput from './components/LessonInput'
import Calendar from './components/Calendar'
import { getAllCards, saveCard } from './lib/storage'

export default function App(){
  const [view, setView] = useState('home')
  const [cards, setCards] = useState([])

  useEffect(()=>{ (async ()=>{
    const c = await getAllCards()
    setCards(c||[])
  })() }, [])

  const addCard = async(card)=>{
    await saveCard(card)
    const c = await getAllCards()
    setCards(c)
    setView('review')
  }

  return (
    <div className='app-shell'>
      <header className='topbar'>
        <h1>Discipline</h1>
        <div className='nav'>
          <button onClick={()=>setView('create')}>Create</button>
          <button onClick={()=>setView('review')}>Review</button>
          <button onClick={()=>setView('settings')}>Settings</button>
          <button onClick={()=>setView('import')}>Import</button>
          <button onClick={()=>setView('calendar')}>Calendar</button>
        </div>
      </header>

      <main className='main'>
        {view==='create' && <FlashcardCreator onCreate={addCard} />}
        {view==='import' && <LessonInput onImported={async ()=>{ const c = await getAllCards(); setCards(c); setView('review')}} />}
        {view==='review' && <FlashcardReview cards={cards} />}
        {view==='calendar' && <Calendar />}
        {view==='settings' && <Settings />}
        {view==='home' && (
          <div className='home'>
            <p>Welcome! Use Create to add lessons or flashcards. Review will show due cards using SRS.</p>
            <button onClick={()=>setView('create')}>Start</button>
          </div>
        )}
      </main>

      <footer className='footer'>
        <small>Single-user, offline-ready starter</small>
      </footer>
    </div>
  )
}
