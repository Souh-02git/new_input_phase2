// API client wrapper that follows the backend error contract.
const API_ROOT = '/api'

async function unwrapResponse(resp){
  const text = await resp.text()
  let json = null
  try{ json = text ? JSON.parse(text) : null }catch(e){ }

  if(!resp.ok){
    // FastAPI HTTPException uses {detail: {...}}
    const detail = json && json.detail ? json.detail : null
    const message = detail && detail.message ? detail.message : (json && json.message) ? json.message : resp.statusText
    const err = new Error(message)
    err.status = resp.status
    err.detail = detail
    throw err
  }

  // success envelope: {success: true, data: {...}, message}
  if(json && json.success===false){
    const msg = json.message || (json.data && json.data.message) || 'Request failed'
    const err = new Error(msg)
    err.detail = json
    throw err
  }

  return json && json.data !== undefined ? json.data : json
}

export const api = {
  health: async ()=>{
    const resp = await fetch(`${API_ROOT}/health`)
    return unwrapResponse(resp)
  },
  upload: async (formData)=>{
    const resp = await fetch(`${API_ROOT}/upload`,{method:'POST', body: formData})
    return unwrapResponse(resp)
  },
  demoLoad: async ()=>{
    const resp = await fetch(`${API_ROOT}/demo/load`,{method:'POST'})
    return unwrapResponse(resp)
  },
  demoReset: async ()=>{
    const resp = await fetch(`${API_ROOT}/demo/reset`,{method:'POST'})
    return unwrapResponse(resp)
  },
  metrics: async ()=>{
    const resp = await fetch(`${API_ROOT}/metrics`)
    return unwrapResponse(resp)
  },
  dependencies: async (sessionId='')=>{
    let url = `${API_ROOT}/dependencies`
    if(sessionId){
      url += `?session_id=${encodeURIComponent(sessionId)}`
    }
    const resp = await fetch(url)
    return unwrapResponse(resp)
  },
  spillover: async ()=>{
    const resp = await fetch(`${API_ROOT}/spillover`)
    return unwrapResponse(resp)
  },
  forecast: async ()=>{
    const resp = await fetch(`${API_ROOT}/forecast`)
    return unwrapResponse(resp)
  },
  monteCarlo: async ()=>{
    const resp = await fetch(`${API_ROOT}/monte-carlo`)
    return unwrapResponse(resp)
  },
  risk: async (sessionId='')=>{
    let url = `${API_ROOT}/risk`
    if(sessionId){
      url += `?session_id=${encodeURIComponent(sessionId)}`
    }
    const resp = await fetch(url)
    return unwrapResponse(resp)
  },
  recommendations: async ()=>{
    const resp = await fetch(`${API_ROOT}/recommendations`)
    return unwrapResponse(resp)
  },
  simulateRecommendation: async (body)=>{
    const resp = await fetch(`${API_ROOT}/recommendations/simulate`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
    return unwrapResponse(resp)
  },
  simulateScenario: async (body)=>{
    const resp = await fetch(`${API_ROOT}/recommendations/scenario`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
    return unwrapResponse(resp)
  },
  scopeChange: async (body)=>{
    const resp = await fetch(`${API_ROOT}/scope-change`,{method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(body)})
    return unwrapResponse(resp)
  },
  export: async ()=>{
    const resp = await fetch(`${API_ROOT}/export`)
    if(!resp.ok){
      const text = await resp.text();
      let json=null; try{json=JSON.parse(text)}catch(e){}
      const detail = json && json.detail ? json.detail : null
      const message = detail && detail.message ? detail.message : resp.statusText
      const err = new Error(message)
      throw err
    }
    const blob = await resp.blob()
    return blob
  }
}
