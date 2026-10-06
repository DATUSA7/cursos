import * as THREE from "three";
import "./style.css";

const sceneObserver=new IntersectionObserver((entries,observer)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting) return;
    const el=entry.target;
    if(el.querySelector("iframe")) return;
    const iframe=document.createElement("iframe");
    iframe.src=el.dataset.src;
    iframe.title=el.dataset.title||"Escena 3D DATUSA";
    iframe.loading="lazy";
    iframe.allow="fullscreen; autoplay";
    iframe.referrerPolicy="strict-origin-when-cross-origin";
    iframe.addEventListener("load",()=>el.classList.add("loaded"));
    el.appendChild(iframe);
    observer.unobserve(el);
  });
},{rootMargin:"500px 0px",threshold:.01});

document.querySelectorAll(".scene").forEach(el=>sceneObserver.observe(el));

const revealObserver=new IntersectionObserver((entries,observer)=>{
  entries.forEach(entry=>{
    if(!entry.isIntersecting)return;
    entry.target.classList.add("visible");
    observer.unobserve(entry.target);
  });
},{rootMargin:"0px 0px -70px",threshold:.08});

document.querySelectorAll(".reveal").forEach(el=>revealObserver.observe(el));

const menu=document.querySelector("#menu");
const nav=document.querySelector("#nav");
menu?.addEventListener("click",()=>{
  const open=nav.classList.toggle("open");
  menu.setAttribute("aria-expanded",String(open));
});
nav?.addEventListener("click",e=>{
  if(e.target.closest("a")){
    nav.classList.remove("open");
    menu?.setAttribute("aria-expanded","false");
  }
});

/* Uso ligero de Three.js: ambiente visual; las escenas publicadas son protagonistas. */
const host=document.querySelector("#ambient-3d");
if(host&&!matchMedia("(prefers-reduced-motion: reduce)").matches){
  const scene=new THREE.Scene();
  const camera=new THREE.PerspectiveCamera(45,innerWidth/innerHeight,.1,100);
  camera.position.z=6;
  const renderer=new THREE.WebGLRenderer({alpha:true,antialias:true,powerPreference:"low-power"});
  renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));
  renderer.setSize(innerWidth,innerHeight);
  host.appendChild(renderer.domElement);

  const geometry=new THREE.BufferGeometry();
  const n=120;
  const positions=new Float32Array(n*3);
  for(let i=0;i<n;i++){const p=i*3;positions[p]=(Math.random()-.5)*14;positions[p+1]=(Math.random()-.5)*9;positions[p+2]=(Math.random()-.5)*8;}
  geometry.setAttribute("position",new THREE.BufferAttribute(positions,3));
  const points=new THREE.Points(geometry,new THREE.PointsMaterial({size:.025,transparent:true,opacity:.25}));
  scene.add(points);

  function animate(){requestAnimationFrame(animate);points.rotation.y+=.0008;points.rotation.x+=.0002;renderer.render(scene,camera)}
  addEventListener("resize",()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight)});
  animate();
}
