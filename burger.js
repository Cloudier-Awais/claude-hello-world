// ===== CANVAS SETUP =====
const canvas = document.getElementById('solarCanvas');
const ctx    = canvas.getContext('2d');

let W = canvas.width  = Math.min(window.innerWidth, 860);
let H = canvas.height = Math.min(window.innerHeight * 0.58, 460);
let cx = W / 2, cy = H / 2;

window.addEventListener('resize', () => {
  W = canvas.width  = Math.min(window.innerWidth, 860);
  H = canvas.height = Math.min(window.innerHeight * 0.58, 460);
  cx = W/2; cy = H/2;
});

// ===== STATE =====
let speed        = 1;
let showLabels   = true;
let showOrbits   = true;
let showMoons    = true;
let showAsteroid = true;
let showComet    = true;
let zoom         = 1;
let time         = 0;
let cometActive  = true;
let quizScore    = 0;
let quizTotal    = 0;
let quizIdx      = 0;
let quizAnswered = false;

// ===== STARS =====
const stars = [];
for (let i = 0; i < 280; i++) {
  stars.push({
    x: Math.random() * 860,
    y: Math.random() * 460,
    r: Math.random() * 1.5 + 0.3,
    blink: Math.random() * Math.PI * 2,
    blinkSpeed: 0.02 + Math.random() * 0.03
  });
}

// ===== PLANET DATA =====
const planets = [
  {
    name: 'Mercury', icon: '🪨',
    orbit: 62, size: 5, speed: 4.1, angle: 0,
    color: '#b5b5b5',
    gradient: ['#c8c8c8','#888'],
    desc: 'The smallest planet and closest to the Sun. It has no atmosphere and gets super hot in the day and freezing cold at night!',
    facts: ['No atmosphere at all','A year lasts only 88 Earth days','Surface temperatures: -180°C to 430°C','Has thousands of craters','Named after the Roman messenger god'],
    moons: [],
    rings: false
  },
  {
    name: 'Venus', icon: '🌕',
    orbit: 94, size: 8, speed: 1.6, angle: 1.0,
    color: '#f5deb3',
    gradient: ['#ffe08a','#d4a017'],
    desc: 'The hottest planet in our solar system! It spins backwards and is covered in thick clouds of acid.',
    facts: ['Hottest planet: 465°C average','Spins backwards (east to west)','A day on Venus is longer than its year','Thick clouds of sulphuric acid','Brightest natural object in night sky (after Moon)'],
    moons: [],
    rings: false
  },
  {
    name: 'Earth', icon: '🌍',
    orbit: 130, size: 9, speed: 1.0, angle: 2.1,
    color: '#4169e1',
    gradient: ['#4fa3d1','#2d6a2d'],
    desc: 'Our home! The only planet known to have life. It has liquid water, a breathable atmosphere, and is just the right distance from the Sun.',
    facts: ['Only known planet with life','71% of surface is water','Has 1 moon','Atmosphere is 78% nitrogen, 21% oxygen','About 4.5 billion years old'],
    moons: [{ name:'Moon', orbit:18, size:3.5, speed:13, angle:0, color:'#ccc' }],
    rings: false
  },
  {
    name: 'Mars', icon: '🔴',
    orbit: 170, size: 7, speed: 0.53, angle: 3.8,
    color: '#c1440e',
    gradient: ['#e8704a','#8b1a00'],
    desc: 'The Red Planet! Mars has the tallest volcano in the solar system and we have sent many robots there to explore.',
    facts: ['Has the tallest volcano: Olympus Mons (25km high)','A day on Mars is 24h 37m — close to Earth!','Has 2 small moons: Phobos & Deimos','Red colour from iron oxide (rust)','Humans plan to visit Mars!'],
    moons: [
      { name:'Phobos', orbit:14, size:2.5, speed:28, angle:0, color:'#aaa' },
      { name:'Deimos', orbit:20, size:2,   speed:12, angle:1.2, color:'#bbb' }
    ],
    rings: false
  },
  {
    name: 'Jupiter', icon: '🟤',
    orbit: 228, size: 22, speed: 0.084, angle: 0.5,
    color: '#c88b3a',
    gradient: ['#e8b472','#a0522d'],
    desc: 'The BIGGEST planet! Jupiter is a giant ball of gas with a storm (The Great Red Spot) that has been raging for over 350 years!',
    facts: ['Largest planet — 1300 Earths fit inside!','Great Red Spot is a storm bigger than Earth','Has at least 95 known moons','Io has the most volcanic activity in solar system','Strong magnetic field protects inner solar system'],
    moons: [
      { name:'Io',       orbit:32, size:3.5, speed:18,  angle:0,   color:'#ffe000' },
      { name:'Europa',   orbit:42, size:3,   speed:9,   angle:1.6, color:'#e0d8c8' },
      { name:'Ganymede', orbit:54, size:4,   speed:4.5, angle:3.1, color:'#b0a090' },
      { name:'Callisto', orbit:66, size:3.5, speed:2,   angle:4.7, color:'#888' }
    ],
    rings: false
  },
  {
    name: 'Saturn', icon: '🪐',
    orbit: 298, size: 18, speed: 0.034, angle: 2.2,
    color: '#e8d5a0',
    gradient: ['#f5e8c0','#c8a850'],
    desc: 'The Ringed Planet! Saturn has beautiful rings made of ice and rock. It is so light it could actually float on water!',
    facts: ['Famous for its stunning ring system','Rings are made of ice and rock chunks','Least dense planet — could float on water!','Has 146 known moons','Winds can reach 1800 km/h'],
    moons: [
      { name:'Titan', orbit:34, size:4, speed:3.8, angle:1.0, color:'#f4a460' },
      { name:'Enceladus', orbit:26, size:2.5, speed:8, angle:2.5, color:'#fff' }
    ],
    rings: true,
    ringColor: 'rgba(210,180,140,'
  },
  {
    name: 'Uranus', icon: '🔵',
    orbit: 352, size: 13, speed: 0.012, angle: 1.1,
    color: '#7de8e8',
    gradient: ['#a0f0f0','#40c8c8'],
    desc: 'Uranus spins on its side! This ice giant appears blue-green due to methane in its atmosphere.',
    facts: ['Tilted 98° — spins on its side!','Has 13 known rings (faint)','An ice giant — made of icy materials','Takes 84 Earth years to orbit Sun','27 known moons named after Shakespeare characters'],
    moons: [
      { name:'Titania', orbit:24, size:3, speed:5, angle:0.8, color:'#b0c0d0' },
      { name:'Oberon',  orbit:32, size:3, speed:2.5, angle:2.0, color:'#a0b0c0' }
    ],
    rings: false
  },
  {
    name: 'Neptune', icon: '🌀',
    orbit: 400, size: 12, speed: 0.006, angle: 4.2,
    color: '#3f54ba',
    gradient: ['#5570e8','#1a2a90'],
    desc: 'The windiest planet! Neptune has storms with winds up to 2100 km/h — the fastest in the solar system.',
    facts: ['Strongest winds in solar system: 2100 km/h!','Takes 165 Earth years to orbit the Sun','Has a giant storm called The Great Dark Spot','14 known moons','Triton orbits backwards (retrograde)'],
    moons: [
      { name:'Triton', orbit:26, size:3.5, speed:-3, angle:1.5, color:'#c0d0e0' }
    ],
    rings: false
  }
];

// ===== ASTEROID BELT =====
const asteroids = [];
for (let i = 0; i < 120; i++) {
  const baseOrbit = 196;
  asteroids.push({
    orbit:  baseOrbit + (Math.random() - 0.5) * 28,
    angle:  Math.random() * Math.PI * 2,
    speed:  (0.2 + Math.random() * 0.25) * (Math.random()>0.5?1:-1),
    size:   0.8 + Math.random() * 2.2,
    color:  `rgba(${150+Math.floor(Math.random()*60)},${140+Math.floor(Math.random()*50)},${120+Math.floor(Math.random()*40)},0.8)`
  });
}

// ===== COMET =====
let comet = { x: -100, y: 80, vx: 4.5, vy: 1.8, active: true, timer: 0, interval: 380 };

// ===== QUIZ DATA =====
const quizQuestions = [
  { q:'Which is the largest planet?',          opts:['Earth','Jupiter','Saturn','Uranus'],     ans:1 },
  { q:'Which planet has rings?',               opts:['Mars','Neptune','Saturn','Mercury'],      ans:2 },
  { q:'Which is the hottest planet?',          opts:['Mercury','Venus','Mars','Earth'],         ans:1 },
  { q:'How many planets are in our solar system?', opts:['7','8','9','10'],                    ans:1 },
  { q:'Which planet is called the Red Planet?',opts:['Venus','Jupiter','Mars','Saturn'],       ans:2 },
  { q:'Which planet do we live on?',           opts:['Mars','Venus','Earth','Jupiter'],        ans:2 },
  { q:'Which is the smallest planet?',         opts:['Mercury','Mars','Earth','Pluto'],        ans:0 },
  { q:'Which planet spins on its side?',       opts:['Uranus','Neptune','Saturn','Venus'],     ans:0 },
  { q:'Which planet has the most moons?',      opts:['Earth','Saturn','Jupiter','Mars'],       ans:1 },
  { q:'What is the Sun made of?',              opts:['Rock','Gas (hydrogen & helium)','Water','Metal'], ans:1 },
  { q:'Which planet is farthest from the Sun?',opts:['Uranus','Saturn','Neptune','Mars'],      ans:2 },
  { q:'How long is a year on Earth?',          opts:['100 days','365 days','200 days','500 days'], ans:1 }
];

// ===== DRAW FUNCTIONS =====

function drawStars() {
  stars.forEach(s => {
    s.blink += s.blinkSpeed;
    const alpha = 0.4 + Math.sin(s.blink) * 0.4;
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,255,255,${alpha})`;
    ctx.fill();
  });
}

function drawSun() {
  const x = cx, y = cy;
  const r = 28 * zoom;

  // Outer glow
  for (let i = 4; i > 0; i--) {
    const grd = ctx.createRadialGradient(x,y,r*0.5,x,y,r*(1+i*0.6));
    grd.addColorStop(0, `rgba(255,180,0,${0.06/i})`);
    grd.addColorStop(1, 'rgba(255,120,0,0)');
    ctx.beginPath();
    ctx.arc(x,y,r*(1+i*0.6),0,Math.PI*2);
    ctx.fillStyle = grd;
    ctx.fill();
  }

  // Solar flares
  for (let i = 0; i < 8; i++) {
    const angle = (time * 0.3 + i * Math.PI/4);
    const fl = r * (1.1 + Math.sin(time*2 + i)*0.12);
    const x2 = x + Math.cos(angle)*fl;
    const y2 = y + Math.sin(angle)*fl;
    ctx.beginPath();
    ctx.arc(x2, y2, 3*zoom, 0, Math.PI*2);
    ctx.fillStyle = `rgba(255,200,0,${0.5+Math.sin(time*3+i)*0.3})`;
    ctx.fill();
  }

  // Sun body
  const grd = ctx.createRadialGradient(x-r*0.3,y-r*0.3,0,x,y,r);
  grd.addColorStop(0,'#fff7a0');
  grd.addColorStop(0.3,'#ffe066');
  grd.addColorStop(0.7,'#ff9500');
  grd.addColorStop(1,'#ff5500');
  ctx.beginPath();
  ctx.arc(x,y,r,0,Math.PI*2);
  ctx.fillStyle = grd;
  ctx.fill();

  if (showLabels) {
    ctx.fillStyle = '#ffe066';
    ctx.font = `bold ${11*zoom}px Segoe UI`;
    ctx.textAlign = 'center';
    ctx.fillText('☀️ SUN', x, y + r + 14*zoom);
  }
}

function drawOrbit(orbit) {
  if (!showOrbits) return;
  ctx.beginPath();
  ctx.arc(cx, cy, orbit * zoom, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = 1;
  ctx.setLineDash([4,8]);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPlanet(p) {
  const angle = p.angle;
  const ox = cx + Math.cos(angle) * p.orbit * zoom;
  const oy = cy + Math.sin(angle) * p.orbit * zoom;
  const r  = p.size * zoom;

  // Saturn rings
  if (p.rings) {
    ctx.save();
    ctx.translate(ox, oy);
    ctx.scale(1, 0.35);
    for (let i = 3; i >= 1; i--) {
      ctx.beginPath();
      ctx.arc(0, 0, r + r*0.55*i, 0, Math.PI*2);
      ctx.strokeStyle = `rgba(210,180,140,${0.5-i*0.1})`;
      ctx.lineWidth = 5*zoom*(1/0.35);
      ctx.stroke();
    }
    ctx.restore();
  }

  // Planet glow
  const glow = ctx.createRadialGradient(ox-r*0.3,oy-r*0.3,0,ox,oy,r*2.2);
  glow.addColorStop(0, p.gradient[0]+'44');
  glow.addColorStop(1, 'transparent');
  ctx.beginPath();
  ctx.arc(ox,oy,r*2.2,0,Math.PI*2);
  ctx.fillStyle = glow;
  ctx.fill();

  // Planet body
  const grd = ctx.createRadialGradient(ox-r*0.3,oy-r*0.35,r*0.1,ox,oy,r);
  grd.addColorStop(0, p.gradient[0]);
  grd.addColorStop(1, p.gradient[1]);
  ctx.beginPath();
  ctx.arc(ox,oy,r,0,Math.PI*2);
  ctx.fillStyle = grd;
  ctx.fill();

  // Jupiter stripes
  if (p.name === 'Jupiter') {
    for (let i = -2; i <= 2; i++) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(ox,oy,r,0,Math.PI*2);
      ctx.clip();
      ctx.fillStyle = `rgba(160,80,20,${0.25})`;
      ctx.fillRect(ox-r, oy+i*r*0.38-r*0.12, r*2, r*0.18);
      ctx.restore();
    }
    // Great Red Spot
    const spotX = ox + Math.cos(time*0.5)*r*0.5;
    const spotY = oy + r*0.22;
    ctx.save();
    ctx.beginPath();
    ctx.arc(ox,oy,r,0,Math.PI*2);
    ctx.clip();
    ctx.beginPath();
    ctx.ellipse(spotX, spotY, r*0.28, r*0.16, 0, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(180,40,20,0.7)';
    ctx.fill();
    ctx.restore();
  }

  // Earth land patches
  if (p.name === 'Earth') {
    ctx.save();
    ctx.beginPath();
    ctx.arc(ox,oy,r,0,Math.PI*2);
    ctx.clip();
    const patches = [[-0.2,-0.3,0.4,0.35],[-0.05,0.1,0.3,0.4],[-0.5,-0.1,0.3,0.5]];
    patches.forEach(([dx,dy,pw,ph]) => {
      ctx.beginPath();
      ctx.ellipse(ox+dx*r,oy+dy*r,pw*r,ph*r,time*0.05,0,Math.PI*2);
      ctx.fillStyle = 'rgba(50,140,50,0.65)';
      ctx.fill();
    });
    // Cloud swirl
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.beginPath();
    ctx.ellipse(ox+0.2*r, oy-0.4*r, r*0.5, r*0.18, time*0.08, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }

  // Mars polar cap
  if (p.name === 'Mars') {
    ctx.save();
    ctx.beginPath();
    ctx.arc(ox,oy,r,0,Math.PI*2);
    ctx.clip();
    ctx.beginPath();
    ctx.arc(ox, oy-r*0.72, r*0.35, 0, Math.PI*2);
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fill();
    ctx.restore();
  }

  // Uranus tilt ring
  if (p.name === 'Uranus') {
    ctx.save();
    ctx.translate(ox,oy);
    ctx.rotate(Math.PI/2.2);
    ctx.scale(1,0.28);
    ctx.beginPath();
    ctx.arc(0,0,r*1.5,0,Math.PI*2);
    ctx.strokeStyle = 'rgba(120,230,230,0.35)';
    ctx.lineWidth = 3*zoom*(1/0.28);
    ctx.stroke();
    ctx.restore();
  }

  // Moons
  if (showMoons) {
    p.moons.forEach(m => {
      const ma = m.angle;
      const mx = ox + Math.cos(ma) * m.orbit * zoom;
      const my = oy + Math.sin(ma) * m.orbit * zoom;
      const mr = m.size * zoom;

      if (showOrbits) {
        ctx.beginPath();
        ctx.arc(ox, oy, m.orbit*zoom, 0, Math.PI*2);
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 0.8;
        ctx.stroke();
      }

      const mgrd = ctx.createRadialGradient(mx-mr*0.3,my-mr*0.3,0,mx,my,mr);
      mgrd.addColorStop(0,'#fff');
      mgrd.addColorStop(1, m.color);
      ctx.beginPath();
      ctx.arc(mx,my,mr,0,Math.PI*2);
      ctx.fillStyle = mgrd;
      ctx.fill();

      if (showLabels && zoom > 0.7 && mr > 2) {
        ctx.fillStyle='rgba(200,200,255,0.7)';
        ctx.font=`${8*zoom}px Segoe UI`;
        ctx.textAlign='center';
        ctx.fillText(m.name, mx, my-mr-3);
      }
    });
  }

  // Label
  if (showLabels) {
    ctx.fillStyle = '#fff';
    ctx.font = `bold ${10*zoom}px Segoe UI`;
    ctx.textAlign = 'center';
    ctx.fillText(p.name, ox, oy + r + 13*zoom);
  }

  // Click target
  p._x = ox; p._y = oy; p._r = r;
}

function drawAsteroids() {
  if (!showAsteroid) return;
  asteroids.forEach(a => {
    a.angle += a.speed * 0.001 * speed;
    const ax = cx + Math.cos(a.angle)*a.orbit*zoom;
    const ay = cy + Math.sin(a.angle)*a.orbit*zoom;
    ctx.beginPath();
    ctx.arc(ax,ay,a.size*zoom*0.7,0,Math.PI*2);
    ctx.fillStyle = a.color;
    ctx.fill();
  });
}

function drawComet() {
  if (!showComet) return;
  comet.timer++;
  if (comet.timer > comet.interval) {
    comet.timer = 0;
    comet.x = -60;
    comet.y = 20 + Math.random()*H*0.4;
    comet.vx = 3 + Math.random()*3;
    comet.vy = 0.5 + Math.random()*2;
    comet.active = true;
  }
  if (!comet.active) return;

  comet.x += comet.vx;
  comet.y += comet.vy;
  if (comet.x > W+60) comet.active = false;

  // Tail
  const grad = ctx.createLinearGradient(comet.x-60, comet.y-10, comet.x, comet.y);
  grad.addColorStop(0,'rgba(180,220,255,0)');
  grad.addColorStop(1,'rgba(220,240,255,0.7)');
  ctx.beginPath();
  ctx.moveTo(comet.x-70, comet.y-12);
  ctx.quadraticCurveTo(comet.x-30, comet.y+2, comet.x, comet.y);
  ctx.lineWidth = 4;
  ctx.strokeStyle = grad;
  ctx.stroke();

  // Head
  ctx.beginPath();
  ctx.arc(comet.x, comet.y, 4, 0, Math.PI*2);
  ctx.fillStyle = '#e0f0ff';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(comet.x, comet.y, 2, 0, Math.PI*2);
  ctx.fillStyle = '#fff';
  ctx.fill();

  if (showLabels) {
    ctx.fillStyle='rgba(200,230,255,0.8)';
    ctx.font=`bold 9px Segoe UI`;
    ctx.textAlign='center';
    ctx.fillText('☄️ Comet', comet.x, comet.y-10);
  }
}

// ===== MAIN LOOP =====
function draw() {
  ctx.clearRect(0,0,W,H);

  // Space background
  const bg = ctx.createRadialGradient(cx,cy,0,cx,cy,Math.max(W,H)*0.7);
  bg.addColorStop(0,'#050520');
  bg.addColorStop(1,'#000005');
  ctx.fillStyle = bg;
  ctx.fillRect(0,0,W,H);

  drawStars();
  drawComet();

  // Orbits first
  planets.forEach(p => drawOrbit(p.orbit));

  // Asteroid belt
  drawAsteroids();

  drawSun();

  // Update & draw planets
  planets.forEach(p => {
    p.angle += p.speed * 0.0012 * speed;
    p.moons.forEach(m => {
      m.angle += m.speed * 0.012 * speed;
    });
    drawPlanet(p);
  });

  time += 0.03 * speed;
  requestAnimationFrame(draw);
}

draw();

// ===== CONTROLS =====
function speedUp()   { speed = Math.min(speed * 1.5, 20); }
function slowDown()  { speed = Math.max(speed / 1.5, 0.1); }
function toggleLabels()   { showLabels   = !showLabels; }
function toggleOrbits()   { showOrbits   = !showOrbits; }
function toggleMoons()    { showMoons    = !showMoons; }
function toggleAsteroid() { showAsteroid = !showAsteroid; }
function toggleComet()    { showComet    = !showComet; comet.timer = 0; }
function zoomIn()  { zoom = Math.min(zoom * 1.2, 2.0); }
function zoomOut() { zoom = Math.max(zoom / 1.2, 0.35); }
function resetView() {
  speed=1; zoom=1; showLabels=true; showOrbits=true;
  showMoons=true; showAsteroid=true; showComet=true;
}

// ===== CLICK PLANET =====
canvas.addEventListener('click', e => {
  const rect = canvas.getBoundingClientRect();
  const mx = e.clientX - rect.left;
  const my = e.clientY - rect.top;

  // Check sun
  const sunDist = Math.hypot(mx-cx, my-cy);
  if (sunDist < 32*zoom) {
    showFact({
      name:'The Sun',icon:'☀️',
      gradient:['#ffe066','#ff9500'],
      desc:'The Sun is a giant star at the center of our solar system. It is so big that 1.3 million Earths could fit inside it!',
      facts:['Contains 99.8% of all mass in solar system','Surface temperature: 5,500°C','Core temperature: 15 million °C','Light takes 8 minutes to reach Earth','The Sun is 4.6 billion years old']
    });
    return;
  }

  for (const p of planets) {
    if (!p._x) continue;
    if (Math.hypot(mx-p._x, my-p._y) < p._r + 12) {
      showFact(p);
      return;
    }
  }
});

function showFact(p) {
  document.getElementById('factIcon').textContent  = p.icon;
  document.getElementById('factTitle').textContent = p.name;
  document.getElementById('factDesc').textContent  = p.desc;
  const list = document.getElementById('factsList');
  list.innerHTML = p.facts.map(f=>`<li>${f}</li>`).join('');
  const card = document.getElementById('factCard');
  card.style.borderColor = p.gradient ? p.gradient[0] : '#ffe066';
  card.classList.add('show');
  document.getElementById('overlay').classList.add('show');
}

function closeCard() {
  document.getElementById('factCard').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
}

// ===== QUIZ =====
let shuffledQ = [];
function startQuiz() {
  quizScore=0; quizTotal=0; quizIdx=0; quizAnswered=false;
  shuffledQ = [...quizQuestions].sort(()=>Math.random()-0.5);
  document.getElementById('quizScore').textContent = '';
  document.getElementById('quizFeedback').textContent = '';
  document.getElementById('quizNext').style.display='none';
  document.getElementById('quizPanel').classList.add('show');
  document.getElementById('overlay').classList.add('show');
  loadQuestion();
}

function loadQuestion() {
  if (quizIdx >= shuffledQ.length) { endQuiz(); return; }
  const q = shuffledQ[quizIdx];
  quizAnswered = false;
  document.getElementById('quizQuestion').textContent = `Q${quizIdx+1}: ${q.q}`;
  document.getElementById('quizFeedback').textContent = '';
  document.getElementById('quizNext').style.display = 'none';
  const opts = document.getElementById('quizOptions');
  opts.innerHTML = '';
  q.opts.forEach((o,i) => {
    const btn = document.createElement('button');
    btn.className='quiz-opt';
    btn.textContent = o;
    btn.onclick = () => checkAnswer(i, q.ans);
    opts.appendChild(btn);
  });
}

function checkAnswer(chosen, correct) {
  if (quizAnswered) return;
  quizAnswered = true;
  quizTotal++;
  const opts = document.querySelectorAll('.quiz-opt');
  opts[correct].classList.add('correct');
  if (chosen === correct) {
    quizScore++;
    document.getElementById('quizFeedback').textContent = '✅ Correct! Great job!';
  } else {
    opts[chosen].classList.add('wrong');
    document.getElementById('quizFeedback').textContent = `❌ Not quite! It was: ${shuffledQ[quizIdx].opts[correct]}`;
  }
  document.getElementById('quizScore').textContent = `Score: ${quizScore} / ${quizTotal}`;
  document.getElementById('quizNext').style.display = 'inline-block';
}

function nextQuestion() {
  quizIdx++;
  loadQuestion();
}

function endQuiz() {
  const pct = Math.round((quizScore/quizTotal)*100);
  let emoji = pct>=80?'🏆':pct>=50?'👍':'🌟';
  document.getElementById('quizQuestion').textContent = `${emoji} Quiz Complete!`;
  document.getElementById('quizOptions').innerHTML = '';
  document.getElementById('quizFeedback').textContent = `You got ${quizScore} out of ${quizTotal} correct (${pct}%)`;
  document.getElementById('quizScore').textContent = pct>=80?'Amazing! You\'re a solar system expert! 🚀':pct>=50?'Good job! Keep learning! 🌍':'Keep exploring and try again! 🌠';
  document.getElementById('quizNext').style.display='none';
}

function closeQuiz() {
  document.getElementById('quizPanel').classList.remove('show');
  document.getElementById('overlay').classList.remove('show');
}

document.getElementById('overlay').addEventListener('click', ()=>{
  closeCard();
  closeQuiz();
});
