const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scale = 20; // size of one cell
const rows = canvas.height / scale;
const cols = canvas.width / scale;

let snake;
let food;
let dir;
let score = 0;
let loopTimeout = null;
let baseDelay = 150; // default ms per tick (slower)
let currentDelay = baseDelay;
let running = false;
let flash = 0;
let renderPositions = [];
let tongueProgress = 0;
let musicOn = false;
let musicNodes = null; // {osc1, osc2, gain, timer}

// Audio
let audioCtx = null;
function ensureAudio(){ if(!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
function playTone(type){
  try{
    ensureAudio();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.connect(g); g.connect(audioCtx.destination);
    if(type === 'eat'){ o.frequency.value = 800; g.gain.value = 0.05; }
    else if(type === 'game'){ o.frequency.value = 220; g.gain.value = 0.08; }
    else if(type === 'tongue'){ o.frequency.value = 1200; g.gain.value = 0.02; }
    else { o.frequency.value = 440; g.gain.value = 0.03; }
    o.start();
    setTimeout(()=>{ o.stop(); }, 120);
  }catch(e){ /* audio may be blocked until user interacts */ }
}

function startGame(){
  snake = [{x: Math.floor(cols/2), y: Math.floor(rows/2)}];
  dir = {x:1,y:0};
  placeFood();
  score = 0;
  flash = 0;
  // initialize render positions (pixel centers)
  renderPositions = snake.map(s=>({x: s.x*scale + scale/2, y: s.y*scale + scale/2}));
  tongueProgress = 0;
  document.getElementById('score').textContent = 'Score: 0';
  updateHighScoreDisplay();
  stopLoop();
  running = true;
  computeDelay();
  scheduleNext();
}

function restartGame(){
  stopLoop();
  startGame();
}

function stopLoop(){ if(loopTimeout) clearTimeout(loopTimeout); loopTimeout = null; }
function scheduleNext(){ stopLoop(); loopTimeout = setTimeout(tick, currentDelay); }

function placeFood(){
  let valid = false;
  while(!valid){
    food = {x: Math.floor(Math.random()*cols), y: Math.floor(Math.random()*rows)};
    valid = !snake.some(s => s.x===food.x && s.y===food.y);
  }
}

function tick(){
  update();
  draw();
  if(running) scheduleNext();
}

function computeDelay(){
  const dynamic = document.getElementById('dynamicDifficulty')?.checked;
  const base = Number(document.getElementById('speedRange')?.value || baseDelay);
  baseDelay = base;
  if(dynamic){
    currentDelay = Math.max(40, baseDelay - score*5);
  } else {
    currentDelay = baseDelay;
  }
  document.getElementById('delayVal').textContent = currentDelay;
}

function update(){
  const head = {...snake[0]};
  head.x += dir.x;
  head.y += dir.y;

  // wall collision
  if(head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows){
    return gameOver();
  }

  // self collision
  if(snake.some(s => s.x===head.x && s.y===head.y)) return gameOver();

  snake.unshift(head);

  // food
  if(head.x === food.x && head.y === food.y){
    score += 1;
    document.getElementById('score').textContent = 'Score: ' + score;
    playTone('eat');
    flash = 3;
    placeFood();
    // trigger tongue animation briefly
    tongueProgress = 1.0;
    playTone('tongue');
    computeDelay();
    // update high score
    const hs = Number(localStorage.getItem('snakeHighScore') || 0);
    if(score > hs){ localStorage.setItem('snakeHighScore', score); updateHighScoreDisplay(); }
  } else {
    snake.pop();
  }
}

function draw(){
  // flash effect on eat
  if(flash>0){ ctx.fillStyle = '#0a1730'; flash--; } else { ctx.fillStyle = '#071129'; }
  ctx.fillRect(0,0,canvas.width,canvas.height);

  // draw food with small pulse when eaten
  ctx.fillStyle = '#ff4d6d';
  ctx.fillRect(food.x*scale, food.y*scale, scale, scale);

  // helper: rounded rect
  function roundRect(ctx,x,y,w,h,r, fill, stroke){
    if (typeof r === 'undefined') r = 5;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y,     x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x,     y + h, r);
    ctx.arcTo(x,     y + h, x,     y,     r);
    ctx.arcTo(x,     y,     x + w, y,     r);
    ctx.closePath();
    if(fill) ctx.fill();
    if(stroke) ctx.stroke();
  }

  // ensure renderPositions length matches snake (when growing)
  while(renderPositions.length < snake.length){
    const last = renderPositions[renderPositions.length-1] || {x:0,y:0};
    renderPositions.push({x: last.x, y: last.y});
  }

  // draw segments using renderPositions for smooth interpolation
  for(let i=snake.length-1;i>=0;i--){
    const target = {x: snake[i].x*scale + scale/2, y: snake[i].y*scale + scale/2};
    // lerp render position toward target
    const rp = renderPositions[i] || {x: target.x, y: target.y};
    const lerp = Math.max(0.2, Math.min(0.7, 60 / Math.max(40, currentDelay)) );
    rp.x += (target.x - rp.x) * lerp;
    rp.y += (target.y - rp.y) * lerp;
    renderPositions[i] = rp;

    const cx = rp.x;
    const cy = rp.y;
    const t = (snake.length - 1 - i) / (snake.length - 1 || 1); // 0=head, 1=tail
    const segSize = scale * (1 - 0.35 * t);

    // gradient for 3D look
    const grad = ctx.createRadialGradient(cx - segSize*0.15, cy - segSize*0.15, segSize*0.05, cx, cy, segSize);
    if(i===0){
      grad.addColorStop(0, '#b7f7d7');
      grad.addColorStop(1, '#0f6b3a');
    } else {
      grad.addColorStop(0, '#c8fbd6');
      grad.addColorStop(1, '#145d33');
    }

    ctx.fillStyle = grad;
    ctx.strokeStyle = '#083012';
    ctx.lineWidth = Math.max(1, Math.round(segSize*0.07));
    roundRect(ctx, cx - segSize/2, cy - segSize/2, segSize, segSize, segSize*0.3, true, true);

    // subtle scale pattern: thin lighter arcs
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(cx, cy, segSize*0.35, Math.PI*0.2, Math.PI*0.8);
    ctx.stroke();
  }

  // draw head eye (directional)
  if(snake && snake[0]){
    const head = snake[0];
    const hx = renderPositions[0].x;
    const hy = renderPositions[0].y;
    const dirVec = dir || {x:1,y:0};
    const eyeOffset = Math.max(4, scale*0.25);
    const ex = hx + dirVec.x * eyeOffset - dirVec.y * (eyeOffset*0.4);
    const ey = hy + dirVec.y * eyeOffset + dirVec.x * (eyeOffset*0.4);

    ctx.fillStyle = '#fff';
    ctx.beginPath(); ctx.arc(ex, ey, Math.max(2, scale*0.12), 0, Math.PI*2); ctx.fill();
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(ex + Math.max(0.8, scale*0.04), ey, Math.max(1, scale*0.07), 0, Math.PI*2); ctx.fill();

    // tongue animation (smooth flick with forked tip)
    if(tongueProgress > 0.02){
      // ease curve
      const ease = Math.sin(Math.min(1, tongueProgress) * Math.PI);
      const len = scale * (0.6 + 1.2 * ease);
      const angle = Math.atan2(dirVec.y, dirVec.x);
      const tx = hx + Math.cos(angle) * (segSize/2 + 2);
      const ty = hy + Math.sin(angle) * (segSize/2 + 2);

      // central tongue
      const tip1x = tx + Math.cos(angle) * len;
      const tip1y = ty + Math.sin(angle) * len;
      // fork tips
      const tip2x = tx + Math.cos(angle + 0.32) * (len * 0.85);
      const tip2y = ty + Math.sin(angle + 0.32) * (len * 0.85);
      const tip3x = tx + Math.cos(angle - 0.32) * (len * 0.85);
      const tip3y = ty + Math.sin(angle - 0.32) * (len * 0.85);

      // draw main shape (slightly translucent)
      ctx.fillStyle = 'rgba(255,122,162,' + (0.9*ease) + ')';
      ctx.beginPath();
      ctx.moveTo(tx, ty);
      ctx.lineTo(tip2x, tip2y);
      ctx.lineTo(tip1x, tip1y);
      ctx.lineTo(tip3x, tip3y);
      ctx.closePath();
      ctx.fill();

      // inner dark crease for depth
      ctx.strokeStyle = 'rgba(0,0,0,' + (0.5*ease) + ')';
      ctx.lineWidth = Math.max(1, scale * 0.04);
      ctx.beginPath();
      ctx.moveTo(tx + Math.cos(angle)*2, ty + Math.sin(angle)*2);
      ctx.lineTo(tip1x - Math.cos(angle)*2, tip1y - Math.sin(angle)*2);
      ctx.stroke();

      // decay tongue smoothly
      tongueProgress -= 0.06 + (0.02 * (150/currentDelay));
      if(tongueProgress < 0) tongueProgress = 0;
    }
  }
}

function gameOver(){
  running = false;
  stopLoop();
  playTone('game');
  setTimeout(()=>{ alert('Game over — Score: ' + score); }, 20);
}

function togglePause(){
  if(!running){
    running = true; computeDelay(); scheduleNext();
  } else {
    running = false; stopLoop();
  }
}

window.addEventListener('keydown', e => {
  const key = e.key;
  if(key === 'ArrowUp' || key === 'w' || key === 'W') setDir(0,-1);
  if(key === 'ArrowDown' || key === 's' || key === 'S') setDir(0,1);
  if(key === 'ArrowLeft' || key === 'a' || key === 'A') setDir(-1,0);
  if(key === 'ArrowRight' || key === 'd' || key === 'D') setDir(1,0);
  if(key === ' '){ e.preventDefault(); togglePause(); }
});

function setDir(x,y){
  if(!dir) return; if(dir.x === -x && dir.y === -y) return; // no reverse
  dir = {x,y};
}

document.getElementById('startBtn').addEventListener('click', ()=>{
  // resume audio on user gesture
  ensureAudio();
  if(!running) startGame();
});
document.getElementById('restartBtn').addEventListener('click', ()=>{ restartGame(); });

// speed slider
const speedRange = document.getElementById('speedRange');
if(speedRange){
  speedRange.addEventListener('input', ()=>{ computeDelay(); });
}
const dynamicChk = document.getElementById('dynamicDifficulty');
if(dynamicChk) dynamicChk.addEventListener('change', ()=>{ computeDelay(); });

// high score display
function updateHighScoreDisplay(){
  const hs = Number(localStorage.getItem('snakeHighScore') || 0);
  const el = document.getElementById('highScore');
  if(el) el.textContent = 'High: ' + hs;
}
updateHighScoreDisplay();

// touch controls
['upBtn','downBtn','leftBtn','rightBtn'].forEach(id=>{
  const el = document.getElementById(id);
  if(!el) return;
  const map = {upBtn:[0,-1],downBtn:[0,1],leftBtn:[-1,0],rightBtn:[1,0]};
  el.addEventListener('touchstart', e=>{ e.preventDefault(); const [x,y]=map[id]; setDir(x,y); });
  el.addEventListener('mousedown', e=>{ e.preventDefault(); const [x,y]=map[id]; setDir(x,y); });
});

// Background music (simple synth loop)
function startMusic(){
  try{
    ensureAudio();
    if(musicNodes) return; // already running
    const osc1 = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc1.type = 'sine'; osc2.type = 'triangle';
    osc1.frequency.value = 220; osc2.frequency.value = 330;
    gain.gain.value = 0.02;
    osc1.connect(gain); osc2.connect(gain); gain.connect(audioCtx.destination);
    osc1.start(); osc2.start();
    // subtle frequency modulation
    let step = 0;
    const timer = setInterval(()=>{
      step = (step+1)%8;
      const f1 = 180 + (step%4)*20 + Math.sin(step)*8;
      const f2 = 300 + ((step+2)%4)*16 + Math.cos(step)*6;
      osc1.frequency.linearRampToValueAtTime(f1, audioCtx.currentTime + 0.2);
      osc2.frequency.linearRampToValueAtTime(f2, audioCtx.currentTime + 0.2);
    }, 420);
    musicNodes = {osc1, osc2, gain, timer};
  }catch(e){ /* ignore */ }
}

function stopMusic(){
  if(!musicNodes) return;
  try{
    clearInterval(musicNodes.timer);
    musicNodes.osc1.stop(); musicNodes.osc2.stop();
    musicNodes.gain.disconnect();
  }catch(e){}
  musicNodes = null;
}

const musicBtn = document.getElementById('musicToggle');
if(musicBtn){
  musicBtn.addEventListener('click', ()=>{
    musicOn = !musicOn;
    if(musicOn){ startMusic(); musicBtn.textContent = 'Music: On'; musicBtn.classList.add('active'); }
    else { stopMusic(); musicBtn.textContent = 'Music: Off'; musicBtn.classList.remove('active'); }
  });
}

// Auto-start for convenience
startGame();
