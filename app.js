(() => {
const root = document.documentElement;
const musicKey="englishClassMusic";
const audioCtx = window.AudioContext || window.webkitAudioContext;
let ctx;
function tone(freq=520,dur=.07,type="sine",gain=.035){
  try{ctx=ctx||new audioCtx(); if(ctx.state==="suspended")ctx.resume(); const o=ctx.createOscillator(),g=ctx.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain,ctx.currentTime);g.gain.exponentialRampToValueAtTime(.001,ctx.currentTime+dur);o.connect(g).connect(ctx.destination);o.start();o.stop(ctx.currentTime+dur)}catch(e){}
}
function clickSound(){tone(620,.055,"triangle",.035)}
function successSound(){tone(660,.08,"sine",.04);setTimeout(()=>tone(880,.12,"sine",.04),70)}
function trySound(){tone(220,.13,"triangle",.025)}
window.ClassSounds={click:clickSound,success:successSound,tryAgain:trySound,spin:()=>tone(330,.09,"sawtooth",.025)};
document.addEventListener("click",e=>{const b=e.target.closest("button");if(b&&!b.disabled&&!b.matches(".no-click-sound"))clickSound()});
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>location.href=b.dataset.go));
document.querySelectorAll("[data-home]").forEach(b=>b.addEventListener("click",()=>location.href="../index.html"));
document.querySelectorAll("[data-back]").forEach(b=>b.addEventListener("click",()=>history.length>1?history.back():location.href="../index.html"));
function updateMusicUI(){const on=localStorage.getItem(musicKey)==="on";document.querySelectorAll("[data-music-state]").forEach(x=>x.textContent=on?"ON":"OFF");}
document.querySelectorAll("[data-music-toggle]").forEach(b=>b.addEventListener("click",()=>{const on=localStorage.getItem(musicKey)==="on";localStorage.setItem(musicKey,on?"off":"on");updateMusicUI()}));
updateMusicUI();
window.speak = text => { if(!text)return; try{speechSynthesis.cancel(); const u=new SpeechSynthesisUtterance(text);u.rate=.82;u.pitch=1.15;speechSynthesis.speak(u)}catch(e){} };
window.qs=s=>document.querySelector(s);
window.qsa=s=>[...document.querySelectorAll(s)];
})();