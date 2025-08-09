import localforage from 'localforage'
localforage.config({name:'discipline-app'})

const CARDS_KEY = 'cards_v1'

export async function saveCard(card){
  const all = (await localforage.getItem(CARDS_KEY))||[]
  const idx = all.findIndex(c=>c.id===card.id)
  if(idx>=0) all[idx]=card
  else all.unshift(card)
  await localforage.setItem(CARDS_KEY, all)
  return card
}

export async function getAllCards(){
  return (await localforage.getItem(CARDS_KEY))||[]
}

export async function getDueCards(){
  const all = await getAllCards()
  const now = new Date()
  return all.filter(c=>{
    const nr = c.srs?.nextReview ? new Date(c.srs.nextReview) : new Date(0)
    return nr <= now
  }).sort((a,b)=> new Date(a.srs.nextReview) - new Date(b.srs.nextReview))
}
