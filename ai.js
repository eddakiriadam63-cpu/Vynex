/*
 AI wrapper that uses the user's OpenAI API key saved in localStorage as 'openai_key'.
 Functions:
  - generateFlashcards(text, lang): returns array of {q,a}
  - summarize(text, lang): returns string
  - transcribeAudio(file): sends audio/video blob to Whisper transcription endpoint and returns text
*/
async function openaiFetch(path, body, isForm=false){
  const key = localStorage.getItem('openai_key')
  if(!key) throw new Error('No OpenAI API key found in Settings.')
  const base = 'https://api.openai.com/v1'
  const headers = isForm ? {'Authorization': `Bearer ${key}`} : {'Authorization': `Bearer ${key}`, 'Content-Type': 'application/json'}
  const res = await fetch(base + path, {
    method: 'POST',
    headers,
    body: isForm ? body : JSON.stringify(body)
  })
  if(!res.ok){
    const t = await res.text()
    throw new Error('OpenAI API error: ' + res.status + ' ' + t)
  }
  return await res.json()
}

export async function generateFlashcards(text, lang='en', maxCards=20){
  // produce a JSON array of Q/A pairs in the requested language
  const system = `You are a helpful assistant that creates concise study flashcards. Output only valid JSON: an array of objects [{"q":"...","a":"..."}]. Produce up to ${maxCards} cards. Language: ${lang}.`
  const user = `Create flashcards from the following lesson text:\n\n${text}`
  const body = {
    model: "gpt-4o-mini",
    messages: [
      {role: "system", content: system},
      {role: "user", content: user}
    ],
    temperature: 0.2,
    max_tokens: 1200
  }
  const j = await openaiFetch('/chat/completions', body)
  const content = j.choices?.[0]?.message?.content || ''
  // try to extract JSON from response
  const jsonStart = content.indexOf('[')
  const jsonText = jsonStart>=0 ? content.slice(jsonStart) : content
  try {
    const parsed = JSON.parse(jsonText)
    return parsed.map(c=>({q:c.q,a:c.a}))
  } catch(e){
    // fallback: simple split by lines
    return [{q: 'Summary', a: content}]
  }
}

export async function summarize(text, lang='en'){
  const system = `You are a concise summarizer. Output a short bullet list summary in ${lang}.`
  const body = {
    model: "gpt-4o-mini",
    messages: [
      {role: "system", content: system},
      {role: "user", content: text}
    ],
    temperature: 0.2,
    max_tokens: 500
  }
  const j = await openaiFetch('/chat/completions', body)
  return j.choices?.[0]?.message?.content || ''
}

export async function transcribeAudio(file){
  // Whisper transcription using OpenAI's /audio/transcriptions endpoint.
  // file: Blob or File object
  const key = localStorage.getItem('openai_key')
  if(!key) throw new Error('No OpenAI API key found in Settings.')
  const form = new FormData()
  form.append('file', file, file.name || 'audio.webm')
  form.append('model', 'whisper-1')
  const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {'Authorization': `Bearer ${key}`},
    body: form
  })
  if(!res.ok){
    const t = await res.text()
    throw new Error('Whisper error: ' + res.status + ' ' + t)
  }
  const j = await res.json()
  return j.text || ''
}
