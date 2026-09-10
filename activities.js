(() => {
const grade=new URLSearchParams(location.search).get("grade")||"1";
const A="/english-class/"; // only informational; relative links are used elsewhere
const esc=s=>String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));

// Alphabet menu
const ac=qs("#alphabetChoices");
if(ac){
 const items=grade==="1"?[
  ["🔎","Letter Hunt","letter-hunt.html?grade=1"],["✏️","Trace the Letter","trace.html?grade=1"],["🃏","Card Game","card-game.html?grade=1"]]:
  [["🎣","Letter Fishing","fishing.html?grade=2"],["🥚","Complete the Egg","egg.html?grade=2"]];
 ac.innerHTML=items.map(x=>`<button class="choice-card" data-go="${x[2]}"><span>${x[0]}</span><b>${x[1]}</b></button>`).join("");
 ac.querySelectorAll("[data-go]").forEach(b=>b.onclick=()=>location.href=b.dataset.go);
}

// Numbers
const nb=qs("#numberBoard"), nm=qs("#numberMode"), lg=qs("#listenGame");
if(nb){
 const nums=Array.from({length:20},(_,i)=>i+1);
 function renderPractice(){nb.innerHTML=nums.map(n=>`<button data-number="${n}">${n}</button>`).join("");nb.classList.remove("hidden");lg?.classList.add("hidden");
 nb.querySelectorAll("button").forEach(b=>b.onclick=()=>b.classList.toggle("selected"))}
 function renderListen(){nb.classList.add("hidden");lg?.classList.remove("hidden");newQuestion()}
 nm.innerHTML=grade==="2"?`<button class="wood-btn" id="practiceNumbers">📚 PRACTICE</button><button class="soft-btn" id="listenNumbers">🎧 LISTEN & CLICK</button>`:"";
 if(grade==="2"){qs("#practiceNumbers").onclick=renderPractice;qs("#listenNumbers").onclick=renderListen}
 renderPractice();
 function newQuestion(){const n=nums[Math.floor(Math.random()*20)];lg.dataset.answer=n;qs("#listenPrompt").textContent="?";speakPrompt=()=>speak(String(n));qs("#numberSpeaker").onclick=speakPrompt;const arr=[n,...nums.filter(x=>x!==n).sort(()=>Math.random()-.5).slice(0,7)].sort(()=>Math.random()-.5);qs("#listenChoices").innerHTML=arr.map(x=>`<button data-n="${x}">${x}</button>`).join("");qs("#listenChoices").querySelectorAll("button").forEach(b=>b.onclick=()=>{if(+b.dataset.n===n){b.classList.add("selected");qs("#listenPrompt").textContent=n;ClassSounds.success()}else ClassSounds.tryAgain()})}
}

// Weather
const wb=qs("#weatherBoard");
if(wb){
 const weather=[["☀️","Sunny"],["🌧️","Rainy"],["☁️","Cloudy"],["💨","Windy"],["⛈️","Stormy"],["❄️","Snowy"]];
 if(grade==="1"){qs("#weatherIntro").textContent="Click a picture, then use the speaker to hear the word.";wb.innerHTML=`<div class="weather-grid">${weather.map((w,i)=>`<button class="weather-card" data-word="${w[1]}"><span>${w[0]}</span>${w[1]} <button class="speaker-btn no-click-sound" data-speak="${w[1]}">🔊</button></button>`).join("")}</div>`;
  wb.querySelectorAll("[data-speak]").forEach(b=>b.onclick=e=>{e.stopPropagation();speak(b.dataset.speak)});wb.querySelectorAll(".weather-card").forEach(b=>b.onclick=e=>{if(!e.target.closest("[data-speak]"))b.classList.toggle("selected")});
 }else{qs("#weatherIntro").textContent="Drag a weather word into the sentence. Teacher checks the answer.";wb.innerHTML=`<div class="sentence-board">Today is <span id="weatherDrop" class="drop-target">________</span> day.</div><div class="drag-bank">${weather.map(w=>`<span class="drag-chip" draggable="true" data-weather="${w[1]}">${w[0]} ${w[1]}</span>`).join("")}</div><div class="action-row"><button class="wood-btn" id="checkWeather">CHECK</button><button class="speaker-btn" id="weatherSpeaker">🔊</button></div><div id="weatherFeedback" class="result-card"></div>`;
  let answer="";wb.querySelectorAll(".drag-chip").forEach(c=>c.ondragstart=e=>e.dataTransfer.setData("text/plain",c.dataset.weather));const d=qs("#weatherDrop");d.ondragover=e=>e.preventDefault();d.ondrop=e=>{answer=e.dataTransfer.getData("text/plain");d.textContent=answer};qs("#checkWeather").onclick=()=>{const ok=!!answer;if(ok){qs("#weatherFeedback").textContent="GREAT JOB!";ClassSounds.success()}else{qs("#weatherFeedback").textContent="TRY AGAIN!";ClassSounds.tryAgain()}};qs("#weatherSpeaker").onclick=()=>answer&&speak(`Today is ${answer} day.`);
 }
}

// Calendar
const cb=qs("#calendarBank");
if(cb){
 const months=["January","February","March","April","May","June","July","August","September","October","November","December"],days=["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"],dates=Array.from({length:31},(_,i)=>i+1);
 let target={month:months[Math.floor(Math.random()*12)],day:days[Math.floor(Math.random()*7)],date:dates[Math.floor(Math.random()*31)]};
 function calendarChoices(){cb.innerHTML=[...months.map(x=>["month",x]),...days.map(x=>["day",x]),...dates.map(x=>["date",x])].sort(()=>Math.random()-.5).slice(0,30).map(([t,x])=>`<span class="drag-chip" draggable="true" data-type="${t}" data-value="${x}">${x}</span>`).join("")}
 // Ensure targets are available
 function addTarget(type,val){if(!cb.querySelector(`[data-type="${type}"][data-value="${val}"]`))cb.insertAdjacentHTML("beforeend",`<span class="drag-chip" draggable="true" data-type="${type}" data-value="${val}">${val}</span>`)}
 calendarChoices();addTarget("month",target.month);addTarget("day",target.day);addTarget("date",target.date);
 qsa(".drag-chip").forEach(c=>c.ondragstart=e=>e.dataTransfer.setData("text/plain",JSON.stringify({type:c.dataset.type,value:c.dataset.value})));
 [["month","#monthSlot"],["day","#daySlot"],["date","#dateSlot"]].forEach(([type,sel])=>{const d=qs(sel);d.ondragover=e=>e.preventDefault();d.ondrop=e=>{const x=JSON.parse(e.dataTransfer.getData("text/plain"));if(x.type===type){d.textContent=x.value;d.dataset.value=x.value}}});
 qs("#checkCalendar").onclick=()=>{const ok=qs("#monthSlot").dataset.value===target.month&&qs("#daySlot").dataset.value===target.day&&+qs("#dateSlot").dataset.value===target.date;qs("#calendarFeedback").textContent=ok?"GREAT JOB!":"TRY AGAIN!";ok?ClassSounds.success():ClassSounds.tryAgain()};
 qs("#newCalendar").onclick=()=>location.reload();qs("#calendarSpeaker").onclick=()=>{const m=qs("#monthSlot").dataset.value,d=qs("#daySlot").dataset.value,dt=qs("#dateSlot").dataset.value;if(m&&d&&dt)speak(`Today is ${d}, ${m} ${dt}.`)};
}

// Spinner
const sw=qs("#spinnerWheel");
if(sw){
 function items(){return qs("#spinnerItems").value.split("\n").map(x=>x.trim()).filter(Boolean)}
 function paint(){const arr=items();const step=360/Math.max(arr.length,1);sw.style.background=`conic-gradient(${arr.map((_,i)=>`${i%2?"#6db85c":"#f6c94c"} ${i*step}deg ${(i+1)*step}deg`).join(",")})`;sw.innerHTML=arr.map((x,i)=>`<span style="position:absolute;transform:rotate(${i*step+step/2}deg) translateY(-${Math.min(180,sw.clientWidth*.33)}px) rotate(-${i*step+step/2}deg);font-weight:800;color:#173d25;text-shadow:0 1px #fff">${esc(x)}</span>`).join("")}
 paint();qs("#applySpinner").onclick=paint;qs("#resetSpinner").onclick=()=>{qs("#spinnerItems").value=grade==="2"?"1\n2\n3\n4\n5\n6\n7\n8":"Anna\nBen\nCarlos\nDina\nEthan\nFaye";paint();qs("#spinnerResult").textContent="Ready!"};
 qs("#spinBtn").onclick=()=>{const arr=items();if(!arr.length)return;ClassSounds.spin();const angle=720+Math.random()*1440;sw.style.transition="transform 3.5s cubic-bezier(.12,.7,.16,1)";sw.style.transform=`rotate(${angle}deg)`;setTimeout(()=>{const result=arr[Math.floor(Math.random()*arr.length)];qs("#spinnerResult").textContent=`RESULT: ${result}`;ClassSounds.success()},3600)};
}

// Colors
const cw=qs("#colorWheel");
if(cw){
 const colors=[["Red","#e83d35"],["Blue","#3d87db"],["Yellow","#f2cf35"],["Purple","#8b5fb6"],["Green","#57a953"],["Orange","#ee8d32"],["Black","#252525"],["White","#fff"],["Brown","#8a5a3b"],["Pink","#e99ac4"],["Gold","#d7a92f"],["Silver","#9ea5aa"]];
 qs("#colorChecks").innerHTML=colors.map((c,i)=>`<label><input type="checkbox" value="${c[0]}" checked> ${c[0]}</label>`).join("");
 let active=colors.map(c=>c[0]);
 function paintColors(){active=qsa("#colorChecks input:checked").map(x=>x.value);const step=360/Math.max(active.length,1);cw.style.background=`conic-gradient(${active.map((n,i)=>{const c=colors.find(x=>x[0]===n)[1];return `${c} ${i*step}deg ${(i+1)*step}deg`}).join(",")})`}
 paintColors();qs("#applyColors").onclick=paintColors;qs("#spinColor").onclick=()=>{if(!active.length)return;const r=active[Math.floor(Math.random()*active.length)];cw.style.transition="transform 3.5s cubic-bezier(.12,.7,.16,1)";cw.style.transform=`rotate(${720+Math.random()*1440}deg)`;ClassSounds.spin();setTimeout(()=>{qs("#colorResult").textContent=r;ClassSounds.success()},3600)};qs("#colorSpeaker").onclick=()=>{const t=qs("#colorResult").textContent;if(t&&t!=="Ready!")speak(t)};
}

// Songs and links
function resourceStore(key){try{return JSON.parse(localStorage.getItem(key)||"[]")}catch{return[]}}
function saveStore(key,data){localStorage.setItem(key,JSON.stringify(data))}
const sl=qs("#songList");
if(sl){const key="englishClassSongs";function render(){const data=resourceStore(key);sl.innerHTML=data.length?data.map((x,i)=>`<div class="resource-card"><div><h3>🎵 ${esc(x.title)}</h3><p>${x.grade}</p></div><div><a href="${esc(x.url)}" target="_blank" rel="noopener">OPEN</a> <button class="soft-btn" data-del="${i}">DELETE</button></div></div>`).join(""):"<p>No songs saved yet.</p>";sl.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{data.splice(+b.dataset.del,1);saveStore(key,data);render()})}render();qs("#saveSong").onclick=()=>{const title=qs("#songTitle").value.trim(),url=qs("#songUrl").value.trim();if(!title||!url)return;const d=resourceStore(key);d.push({title,url,grade:qs("#songGrade").value});saveStore(key,d);qs("#songTitle").value=qs("#songUrl").value="";render()}}
const ll=qs("#linkList");
if(ll){const key="englishClassLinks";function render(){const data=resourceStore(key);ll.innerHTML=data.length?data.map((x,i)=>`<div class="resource-card"><div><h3>🔗 ${esc(x.title)}</h3><p>${x.grade}</p></div><div><a href="${esc(x.url)}" target="_blank" rel="noopener">OPEN</a> <button class="soft-btn" data-del="${i}">DELETE</button></div></div>`).join(""):"<p>No links saved yet.</p>";ll.querySelectorAll("[data-del]").forEach(b=>b.onclick=()=>{data.splice(+b.dataset.del,1);saveStore(key,data);render()})}render();qs("#saveLink").onclick=()=>{const title=qs("#linkTitle").value.trim(),url=qs("#linkUrl").value.trim();if(!title||!url)return;const d=resourceStore(key);d.push({title,url,grade:qs("#linkGrade").value});saveStore(key,d);qs("#linkTitle").value=qs("#linkUrl").value="";render()}}

// Whiteboard
const board=qs("#whiteboard");
if(board){const c=board.getContext("2d");function resize(){const r=board.getBoundingClientRect(),d=window.devicePixelRatio||1;board.width=r.width*d;board.height=r.height*d;c.setTransform(d,0,0,d,0,0);c.fillStyle="#fff";c.fillRect(0,0,r.width,r.height)}resize();addEventListener("resize",resize);let drawing=false,eraser=false,history=[];function pos(e){const r=board.getBoundingClientRect();return [e.clientX-r.left,e.clientY-r.top]}function down(e){drawing=true;history.push(c.getImageData(0,0,board.width,board.height));const [x,y]=pos(e);c.beginPath();c.moveTo(x,y)}function move(e){if(!drawing)return;const [x,y]=pos(e);c.lineWidth=+qs("#brushSize").value;c.lineCap="round";c.strokeStyle=eraser?"#fff":qs("#brushColor").value;c.lineTo(x,y);c.stroke()}function up(){drawing=false}board.addEventListener("pointerdown",down);board.addEventListener("pointermove",move);board.addEventListener("pointerup",up);board.addEventListener("pointerleave",up);qsa("[data-tool]").forEach(b=>b.onclick=()=>eraser=b.dataset.tool==="eraser");qs("#undoBoard").onclick=()=>{const img=history.pop();if(img)c.putImageData(img,0,0)};qs("#clearBoard").onclick=()=>{c.fillStyle="#fff";c.fillRect(0,0,board.width,board.height)};qs("#saveBoard").onclick=()=>{const a=document.createElement("a");a.download="english-class-whiteboard.png";a.href=board.toDataURL("image/png");a.click()}}

// Letter Hunt
const hb=qs("#huntBoard");
if(hb){let target;function newRound(){target=String.fromCharCode(65+Math.floor(Math.random()*26));qs("#huntTarget").textContent=target;hb.innerHTML="";const arr=[...Array(4)].map(()=>target),lower=[...Array(4)].map(()=>target.toLowerCase()),wrong=Array.from({length:14},()=>String.fromCharCode(65+Math.floor(Math.random()*26)));[...arr,...lower,...wrong].sort(()=>Math.random()-.5).forEach(l=>{const s=document.createElement("button");s.className="hunt-letter";s.textContent=l;s.style.left=Math.random()*90+"%";s.style.top=Math.random()*85+"%";s.onclick=()=>{if(l.toUpperCase()===target){qs("#huntFeedback").textContent="GREAT JOB!";ClassSounds.success()}else{qs("#huntFeedback").textContent="TRY AGAIN!";ClassSounds.tryAgain()}};hb.appendChild(s)})}newRound();qs("#newHunt").onclick=newRound;qs("#huntSpeaker").onclick=()=>speak(target)}

// Trace
const tl=qs("#traceLetters");
if(tl){const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");tl.innerHTML=letters.map(l=>`<button data-l="${l}">${l}${l.toLowerCase()}</button>`).join("");const canvas=qs("#traceCanvas"),c=canvas.getContext("2d");function resizeT(){const r=canvas.getBoundingClientRect(),d=devicePixelRatio||1;canvas.width=r.width*d;canvas.height=r.height*d;c.setTransform(d,0,0,d,0,0)}resizeT();addEventListener("resize",resizeT);function setL(l){qs("#traceLetter").textContent=l;c.clearRect(0,0,canvas.clientWidth,canvas.clientHeight)}tl.querySelectorAll("button").forEach(b=>b.onclick=()=>setL(b.dataset.l));setL("A");let drawing=false;function p(e){const r=canvas.getBoundingClientRect();return[e.clientX-r.left,e.clientY-r.top]}canvas.onpointerdown=e=>{drawing=true;c.beginPath();const [x,y]=p(e);c.moveTo(x,y)};canvas.onpointermove=e=>{if(!drawing)return;const [x,y]=p(e);c.lineWidth=8;c.lineCap="round";c.strokeStyle="#2d7b3c";c.lineTo(x,y);c.stroke()};canvas.onpointerup=()=>drawing=false;qs("#clearTrace").onclick=()=>c.clearRect(0,0,canvas.clientWidth,canvas.clientHeight);qs("#randomTrace").onclick=()=>setL(letters[Math.floor(Math.random()*26)])}

// Card game
const cards=qs("#cardBoard");
if(cards){let first=null,busy=false,matched=0;const vals=["A","a","B","b","C","c","D","d"].sort(()=>Math.random()-.5);cards.innerHTML=vals.map((v,i)=>`<button class="memory-card" data-i="${i}" data-v="${v}">?</button>`).join("");cards.querySelectorAll(".memory-card").forEach(b=>b.onclick=()=>{if(busy||b.classList.contains("matched")||b===first)return;b.textContent=b.dataset.v;b.classList.add("open");if(!first){first=b;return}const ok=first.dataset.v.toLowerCase()===b.dataset.v.toLowerCase()&&first.dataset.v!==b.dataset.v;if(ok){first.classList.add("matched");b.classList.add("matched");first=null;matched++;ClassSounds.success();if(matched===4)qs("#cardFeedback").textContent="🎉 GREAT JOB!"}else{busy=true;ClassSounds.tryAgain();setTimeout(()=>{first.textContent=b.textContent="?";b.textContent="?";first.classList.remove("open");b.classList.remove("open");first=null;busy=false},650)}})}

// Fishing
const pond=qs("#pond");
if(pond){let current;function fishRound(){const letters=qs("#fishLetters").value.split(",").map(x=>x.trim().toUpperCase()).filter(Boolean);current=letters[Math.floor(Math.random()*letters.length)]||"A";qs("#fishTarget").textContent="Catch the fish!";pond.innerHTML="";const all=Array.from({length:24},(_,i)=>i===0?current:String.fromCharCode(65+Math.floor(Math.random()*26)));all.sort(()=>Math.random()-.5).forEach((l,i)=>{const f=document.createElement("button");f.className="fish";f.textContent=`🐟${l}`;f.style.left=Math.random()*88+"%";f.style.top=Math.random()*88+"%";f.onclick=()=>{if(l===current){qs("#fishFeedback").textContent="GREAT JOB!";ClassSounds.success();qs("#fishTarget").textContent=`You caught ${l}!`}else{qs("#fishFeedback").textContent="TRY AGAIN!";ClassSounds.tryAgain()}};pond.appendChild(f)})}fishRound();qs("#fishNew").onclick=fishRound;qs("#fishSpeaker").onclick=()=>speak(current)}

// Egg
const es=qs("#eggSequence");
if(es){let target;function newEgg(){const start=1+Math.floor(Math.random()*20),arr=Array.from({length:5},(_,i)=>String.fromCharCode(65+start+i));const miss=2+Math.floor(Math.random()*2);target=arr[miss];es.innerHTML=arr.map((x,i)=>`<div class="egg ${i===miss?"drop":""}" data-missing="${i===miss}">${i===miss?"_":x}</div>`).join("");qs("#eggChoices").innerHTML=[target,...Array.from({length:3},()=>String.fromCharCode(65+Math.floor(Math.random()*26)))].sort(()=>Math.random()-.5).map(x=>`<span class="drag-chip" draggable="true" data-letter="${x}">${x}</span>`).join("");qsa("#eggChoices .drag-chip").forEach(c=>c.ondragstart=e=>e.dataTransfer.setData("text/plain",c.dataset.letter));const d=es.querySelector("[data-missing]");d.ondragover=e=>e.preventDefault();d.ondrop=e=>d.textContent=e.dataTransfer.getData("text/plain");}newEgg();qs("#newEgg").onclick=newEgg;qs("#checkEgg").onclick=()=>{const d=es.querySelector("[data-missing]"),ok=d.textContent===target;qs("#eggFeedback").textContent=ok?"🦜 GREAT JOB!":"TRY AGAIN!";ok?ClassSounds.success():ClassSounds.tryAgain()}}
})();