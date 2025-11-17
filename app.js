// Simple front-end behaviour: navigation, simulated auth, webcam capture
const $ = id => document.getElementById(id)
// Nav buttons
$('nav-login')?.addEventListener('click', ()=> showAuth('login'))
$('nav-register')?.addEventListener('click', ()=> showAuth('register'))
$('get-started')?.addEventListener('click', ()=> showAuth('login'))
$('learn-more')?.addEventListener('click', ()=> alert('This UI is a demo. Integrate face recognition (face-api.js/OpenCV.js) and a backend to complete the project.'))

function showAuth(mode='login'){
  document.getElementById('home').classList.add('hidden')
  document.getElementById('auth').classList.remove('hidden')
  document.getElementById('dashboard')?.classList.add('hidden')
  if(mode==='login'){
    $('login-form').classList.remove('hidden')
    $('register-form').classList.add('hidden')
  } else {
    $('login-form').classList.add('hidden')
    $('register-form').classList.remove('hidden')
  }
}

// Toggle register/login inside auth area
document.querySelectorAll('#auth .card h2')?.forEach(h=>h.addEventListener('click',()=>{}))

// Simulated login
document.getElementById('login-form')?.addEventListener('submit', (e)=>{
  e.preventDefault()
  const name = 'Admin (Demo)'
  enterDashboard(name)
})

// Simulated register
$('reg-sim')?.addEventListener('click', (e)=>{
  e.preventDefault()
  const name = $('reg-name').value || 'New Student'
  const id = $('reg-id').value || 'STU-XXX'
  const email = $('reg-email').value || 'student@uni.edu'
  addStudentRow(id,name,email)
  alert('Student registered (simulated)')
})

function enterDashboard(name){
  document.getElementById('auth').classList.add('hidden')
  document.getElementById('home').classList.add('hidden')
  document.getElementById('dashboard').classList.remove('hidden')
  $('display-name').innerText = name
  $('stat-students').innerText = document.querySelectorAll('#students-table tbody tr').length
  showSection('overview')
}

// Sidebar navigation
document.querySelectorAll('.side-btn').forEach(b=>b.addEventListener('click', ()=> showSection(b.dataset.page)))
function showSection(id){
  ['overview','attendance','students','reports'].forEach(k=>{
    document.getElementById(k).classList.add('hidden')
  })
  document.getElementById(id).classList.remove('hidden')
}

// Logout
$('logout')?.addEventListener('click', ()=>{
  document.getElementById('dashboard').classList.add('hidden')
  document.getElementById('home').classList.remove('hidden')
})

// Students table helper
function addStudentRow(id,name,email){
  const tbody = document.querySelector('#students-table tbody')
  const tr = document.createElement('tr')
  tr.innerHTML = `<td>${id}</td><td>${name}</td><td>${email}</td><td>—</td>`
  tbody.appendChild(tr)
  $('stat-students').innerText = tbody.querySelectorAll('tr').length
}

// Webcam capture (simple demo)
let stream = null
const video = $('video')
const canvas = $('capture-canvas')
const captureResult = $('capture-result')

$('start-camera')?.addEventListener('click', async ()=>{
  if(navigator.mediaDevices && navigator.mediaDevices.getUserMedia){
    try{
      stream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user'}})
      video.srcObject = stream
      video.play()
    }catch(err){
      alert('Camera access denied or not available.')
    }
  } else alert('getUserMedia not supported in this browser')
})

$('stop-camera')?.addEventListener('click', ()=>{
  if(stream){ stream.getTracks().forEach(t=>t.stop()); video.srcObject = null }
})

$('capture')?.addEventListener('click', ()=>{
  if(!stream){ alert('Start the camera first') ; return }
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  const ctx = canvas.getContext('2d')
  ctx.drawImage(video,0,0,canvas.width,canvas.height)
  const dataURL = canvas.toDataURL('image/png')
  // In a full implementation, send dataURL to face recognition pipeline / backend
  captureResult.innerHTML = `<div class=card small><h3>Captured Image</h3><img src='${dataURL}' style='max-width:320px;border-radius:8px'/><p class='muted'>This image would be analysed by the recognizer to mark attendance.</p></div>`
})

// Seed a few demo students
addStudentRow('STU2026001','Aisha Umar','aisha@uni.edu')
addStudentRow('STU2026002','Mohammed Ali','mohammed@uni.edu')

// End of app.js
