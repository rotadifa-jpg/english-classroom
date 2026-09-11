(() => {
  const ctx = {audio:null, musicTimer:null, musicOn:localStorage.getItem("musicOn")==="1"};
  function audioCtx(){ if(!ctx.audio) ctx.audio=new (window.AudioContext||window.webkitAudioContext)(); if(ctx.audio.state==="suspended") ctx.audio.resume(); return ctx.audio; }
  function tone(freq=520,dur=.08,type="sine",gain=.045){
    try{const a=audioCtx(),o=a.createOscillator(),g=a.createGain();o.type=type;o.frequency.value=freq;g.gain.setValueAtTime(gain,a.currentTime);g.gain.exponentialRampToValueAtTime(.001,a.currentTime+dur);o.connect(g).connect(a.destination);o.start();o.stop(a.currentTime+dur)}catch(e){}
  }
  window.SFX={
    click(){tone(520,.06,"triangle",.035)},
    success(){tone(660,.1,"sine",.05);setTimeout(()=>tone(880,.16,"sine",.05),80)},
    try(){tone(210,.12,"triangle",.035)},
    spin(){tone(300,.08,"triangle",.03);setTimeout(()=>tone(420,.08,"triangle",.03),90)},
    splash(){tone(240,.08,"sine",.04);setTimeout(()=>tone(600,.12,"sine",.04),80)}
  };
  function updateMusicButton(){
    document.querySelectorAll(".music-toggle").forEach(b=>b.textContent=ctx.musicOn?"🎵 Music ON":"🔇 Music OFF");
  }
  function startMusic(){
    if(ctx.musicTimer) return;
    let step=0;
    ctx.musicTimer=setInterval(()=>{if(!ctx.musicOn)return; const notes=[261.63,329.63,392,329.63,293.66,349.23,440,349.23];tone(notes[step%notes.length],.22,"sine",.012);step++},700);
  }
  document.addEventListener("click",e=>{
    const b=e.target.closest("button,a");
    if(!b)return;
    if(!b.classList.contains("speaker") && !b.classList.contains("music-toggle") && !b.hasAttribute("data-music")) SFX.click();
  });
  document.addEventListener("click",e=>{
    const b=e.target.closest(".music-toggle,[data-music]"); if(!b)return;
    ctx.musicOn=!ctx.musicOn;
    localStorage.setItem("musicOn",ctx.musicOn?"1":"0");
    updateMusicButton();
    if(ctx.musicOn) startMusic();
  });
  window.speak=(text)=>{ if(!text)return; try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.rate=.82;u.pitch=1.08;speechSynthesis.speak(u)}catch(e){} };
  document.addEventListener("click",e=>{const b=e.target.closest(".speaker");if(b){e.stopPropagation();window.speak(b.dataset.speak||b.textContent.trim())}});
  document.addEventListener("click",e=>{
    const b=e.target.closest("[data-go]"); if(b){location.href=b.dataset.go}
    const h=e.target.closest("[data-home]"); if(h){location.href="index.html"}
    const back=e.target.closest("[data-back]"); if(back){history.length>1?history.back():location.href="index.html"}
  });
  updateMusicButton();
})();
