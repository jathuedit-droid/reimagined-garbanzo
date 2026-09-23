let me=null;
const $=id=>document.getElementById(id);
function show(id){
 document.querySelectorAll(".page").forEach(x=>x.classList.remove("active"));
 $(id).classList.add("active");
 if(id==="admin") loadUsers();
}
async function api(url,opts={}){const r=await fetch(url,{headers:{"Content-Type":"application/json"},...opts});const d=await r.json();if(!r.ok)throw Error(d.error||"Something went wrong");return d}
async function register(){
 try{const d=await api("/api/register",{method:"POST",body:JSON.stringify({name:$("rname").value,email:$("remail").value,password:$("rpass").value})});setMe(d.user)}
 catch(e){$("rmsg").textContent=e.message}
}
async function login(){
 try{const d=await api("/api/login",{method:"POST",body:JSON.stringify({email:$("lemail").value,password:$("lpass").value})});setMe(d.user)}
 catch(e){$("lmsg").textContent=e.message}
}
function setMe(u){me=u;$("welcome").textContent=`Signed in as ${u.name}`;$("adminBtn").classList.toggle("hidden",!u.is_admin);show("chat")}
async function logout(){await api("/api/logout",{method:"POST"});me=null;show("home")}
async function sendChat(){
 const input=$("chatInput"), msg=input.value.trim(); if(!msg)return;
 addBubble(msg,"me");input.value="";addBubble("Thinking...","ai");
 try{const d=await api("/api/chat",{method:"POST",body:JSON.stringify({message:msg})});document.querySelector(".messages .ai:last-child").textContent=d.reply}
 catch(e){document.querySelector(".messages .ai:last-child").textContent=e.message}
}
function addBubble(t,c){const d=document.createElement("div");d.className="bubble "+c;d.textContent=t;$("messages").appendChild(d);$("messages").scrollTop=$("messages").scrollHeight}
async function loadUsers(){
 try{const d=await api("/api/users");$("users").innerHTML=d.users.map(u=>`<div class="user-row"><div><b>${escapeHtml(u.name)}</b><div class="muted">${escapeHtml(u.email)}</div></div><div class="muted">${u.is_admin?"ADMIN":"USER"}</div></div>`).join("")}
 catch(e){$("users").textContent=e.message}
}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
(async()=>{try{const d=await api("/api/me");if(d.user)setMe(d.user)}catch{}})();
