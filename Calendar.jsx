import React, {useState, useEffect} from 'react'
import localforage from 'localforage'
const EVENTS_KEY='events_v1'

export default function Calendar(){
  const [events, setEvents] = useState([])
  const [title,setTitle]=useState('')
  const [date,setDate]=useState('')

  useEffect(()=>{ (async ()=>{
    const e = await localforage.getItem(EVENTS_KEY) || []
    setEvents(e)
  })() },[])

  const save = async()=>{
    if(!title || !date) return alert('Add title and date')
    const e = [...events, {id:Date.now(),title,date}]
    setEvents(e)
    await localforage.setItem(EVENTS_KEY, e)
    scheduleNotification({title, date})
    setTitle(''); setDate('')
  }

  const scheduleNotification = (ev)=>{
    try{
      if('Notification' in window && Notification.permission === 'granted'){
        const when = new Date(ev.date).getTime() - (60*60*1000) // 1 hour before
        const delay = Math.max(0, when - Date.now())
        setTimeout(()=> new Notification('Upcoming: ' + ev.title, {body: 'Event at ' + ev.date}), delay)
      }
    }catch(e){}
  }

  const askPerm = async()=>{
    if('Notification' in window){
      const r = await Notification.requestPermission()
      if(r==='granted') alert('Notifications enabled')
    }
  }

  return (
    <div className='card'>
      <h3>Calendar & Reminders</h3>
      <p>Local events only — stored on your device.</p>
      <div>
        <input placeholder='Title' value={title} onChange={e=>setTitle(e.target.value)} />
        <input type='datetime-local' value={date} onChange={e=>setDate(e.target.value)} />
        <button onClick={save}>Save event</button>
        <button onClick={askPerm}>Enable notifications</button>
      </div>
      <ul>
        {events.map(ev=> <li key={ev.id}>{ev.title} — {ev.date}</li>)}
      </ul>
    </div>
  )
}
