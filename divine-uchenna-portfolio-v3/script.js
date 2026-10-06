
const root=document.documentElement;
const saved=localStorage.getItem("theme");
if(saved==="light") root.classList.add("light");

const themeBtn=document.querySelector("[data-theme]");
if(themeBtn){
  const update=()=>themeBtn.textContent=root.classList.contains("light")?"☾ Dark":"☀ Light";
  update();
  themeBtn.addEventListener("click",()=>{
    root.classList.toggle("light");
    localStorage.setItem("theme",root.classList.contains("light")?"light":"dark");
    update();
  });
}

const cursor=document.querySelector(".cursor-glow");
window.addEventListener("pointermove",e=>{
  if(cursor){cursor.style.left=e.clientX+"px";cursor.style.top=e.clientY+"px";}
});

const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}
  });
},{threshold:.12});
document.querySelectorAll(".reveal,.stagger").forEach(el=>observer.observe(el));

function count(el){
  const target=Number(el.dataset.target);
  const start=Number(el.dataset.start ?? (target>=100?100:0));
  const duration=Number(el.dataset.duration||1400);
  const t0=performance.now();
  function tick(now){
    const p=Math.min((now-t0)/duration,1);
    const eased=1-Math.pow(1-p,3);
    const value=Math.floor(start+(target-start)*eased);
    el.textContent=value.toLocaleString();
    if(p<1) requestAnimationFrame(tick);
    else el.textContent=target.toLocaleString();
  }
  requestAnimationFrame(tick);
}
const counterObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting && !e.target.dataset.done){e.target.dataset.done="1";count(e.target);}});
},{threshold:.65});
document.querySelectorAll("[data-counter]").forEach(el=>counterObs.observe(el));

document.querySelectorAll("[data-tilt]").forEach(card=>{
  card.addEventListener("pointermove",e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left)/r.width-.5, y=(e.clientY-r.top)/r.height-.5;
    card.style.transform=`perspective(800px) rotateX(${y*-5}deg) rotateY(${x*6}deg) translateY(-8px)`;
  });
  card.addEventListener("pointerleave",()=>card.style.transform="");
});

const modal=document.querySelector(".modal");
const modalImg=modal?.querySelector("img");
document.querySelectorAll("[data-full]").forEach(item=>{
  item.addEventListener("click",()=>{
    if(!modal)return;
    modalImg.src=item.dataset.full;
    modalImg.alt=item.dataset.alt||"Project preview";
    modal.classList.add("open");
    document.body.style.overflow="hidden";
  });
});
function closeModal(){if(!modal)return;modal.classList.remove("open");document.body.style.overflow="";modalImg.src="";}
modal?.addEventListener("click",e=>{if(e.target===modal)closeModal()});
modal?.querySelector(".close")?.addEventListener("click",closeModal);
window.addEventListener("keydown",e=>{if(e.key==="Escape")closeModal()});

document.querySelectorAll("[data-parallax]").forEach(scene=>{
  scene.addEventListener("pointermove",e=>{
    const r=scene.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;
    scene.querySelectorAll(".float-card").forEach((card,i)=>card.style.transform=`translate(${x*(i+1)*12}px,${y*(i+1)*12}px) rotate(${(i%2? -1:1)*(5+i)}deg)`);
  });
  scene.addEventListener("pointerleave",()=>scene.querySelectorAll(".float-card").forEach(c=>c.style.transform=""));
});

document.querySelectorAll(".contact-form").forEach(form=>{
  form.addEventListener("submit",e=>{
    e.preventDefault();
    const name=form.querySelector("[name=name]")?.value.trim()||"there";
    const email="nwanoruedivine@gmail.com";
    const subject=encodeURIComponent("Portfolio enquiry");
    const body=encodeURIComponent(`Hello Divine,\\n\\nMy name is ${name}.\\n\\n${form.querySelector("[name=message]")?.value||""}`);
    window.location.href=`mailto:${email}?subject=${subject}&body=${body}`;
  });
});

const page=document.body.dataset.page;
document.querySelectorAll(".nav a[data-page]").forEach(a=>{
  if(a.dataset.page===page)a.classList.add("active");
});
