import { useState, useEffect, useRef } from "react";

// ─── FAVICON (injeta no <head> via JS) ────────────────────────────────────────
(function(){
  const existing = document.querySelector("link[rel~='icon']");
  if(existing) existing.remove();
  const link = document.createElement("link");
  link.rel = "icon";
  link.href = "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🏋️</text></svg>";
  document.head.appendChild(link);
})();

// ─── VÍDEOS ───────────────────────────────────────────────────────────────────
const EXERCISE_VIDEOS = {
  "Barra Assistida":               "https://www.youtube.com/embed/sIvJTfGxdFo?rel=0",
  "Remada Curvada com Barra":      "https://www.youtube.com/embed/FWJR5Ve8bnQ?rel=0",
  "Puxada Alta Pegada Fechada":    "https://www.youtube.com/embed/CAwf7n6Luuc?rel=0",
  "Remada Baixa Neutra":           "https://www.youtube.com/embed/GZbfZ033f74?rel=0",
  "Elevação Lateral com Halteres": "https://www.youtube.com/embed/3VcKaXpzqRo?rel=0",
  "Elevação Frontal":              "https://www.youtube.com/embed/gkAT1yAs_Gs?rel=0",
  "Agachamento Livre":             "https://www.youtube.com/embed/ultWZbUMPL8?rel=0",
  "Hack Machine":                  "https://www.youtube.com/embed/EdtPqHVhUms?rel=0",
  "Leg Press 45°":                 "https://www.youtube.com/embed/IZxyjW7MPJQ?rel=0",
  "Cadeira Extensora":             "https://www.youtube.com/embed/YyvSfVjQeL0?rel=0",
  "Leg Press Unilateral":          "https://www.youtube.com/embed/vRLxDqFjkpA?rel=0",
  "Puxada Alta Aberta":            "https://www.youtube.com/embed/0X9OtBBGJNE?rel=0",
  "Remada Baixa Aberta":           "https://www.youtube.com/embed/GZbfZ033f74?rel=0",
  "Pulldown Reto":                 "https://www.youtube.com/embed/lueEJGjTuPQ?rel=0",
  "Face Pull":                     "https://www.youtube.com/embed/rep-qVOkqgk?rel=0",
  "Crucifixo Inverso":             "https://www.youtube.com/embed/k9M3HxGCiSs?rel=0",
  "Remada Unilateral":             "https://www.youtube.com/embed/roCP5O-K4-M?rel=0",
  "Desenvolvimento com Halteres":  "https://www.youtube.com/embed/qEwKCR5JCog?rel=0",
  "Elevação Lateral Cabo":         "https://www.youtube.com/embed/PPF1bnahxNE?rel=0",
  "Pullover":                      "https://www.youtube.com/embed/lEJJ5OA7Zcw?rel=0",
  "Spinning":                      "https://www.youtube.com/embed/2OByMfGbBpU?rel=0",
  "Corrida":                       "https://www.youtube.com/embed/kVnyY17VS9Y?rel=0",
  "Escada + Caminhada Inclinada":  "https://www.youtube.com/embed/HtJEuHrE5O4?rel=0",
};

// ─── TREINOS ──────────────────────────────────────────────────────────────────
// Cardio é um exercício especial (isCardio:true) — aparece como série, obrigatório para finalizar
const WORKOUTS = [
  {
    id:1, shortName:"Treino 1", tag:"Costas",
    name:"Treino 1 – Costas + Ombro Lateral + Corrida",
    exercises:[
      {id:"e1",  name:"Barra Assistida",              sets:4, repsMin:8,  repsMax:10, muscle:"Costas", secondary:["Bíceps"],                tips:"Mantenha escápulas retraídas",              errors:"Não usar momentum ou balanço",           description:"Tração na barra com assistência de contrapeso."},
      {id:"e2",  name:"Remada Curvada com Barra",     sets:4, repsMin:8,  repsMax:10, muscle:"Costas", secondary:["Bíceps","Core"],          tips:"Tronco a 45°, cotovelos próximos ao corpo", errors:"Não arquear excessivamente a lombar",     description:"Remada inclinada com barra livre."},
      {id:"e3",  name:"Puxada Alta Pegada Fechada",   sets:3, repsMin:10, repsMax:12, muscle:"Costas", secondary:["Bíceps"],                tips:"Traga a barra até o queixo",                errors:"Não inclinar demais o tronco",            description:"Puxada com pegada supinada fechada."},
      {id:"e4",  name:"Remada Baixa Neutra",          sets:3, repsMin:10, repsMax:12, muscle:"Costas", secondary:["Bíceps","Core"],          tips:"Cotovelos a 45° do tronco, aperte no pico", errors:"Não arredondar as costas",                description:"Remada na polia baixa com pegada neutra."},
      {id:"e5",  name:"Elevação Lateral com Halteres",sets:4, repsMin:12, repsMax:15, muscle:"Ombro",  secondary:["Trapézio"],              tips:"Cotovelo levemente dobrado, polegar para baixo", errors:"Não usar impulso do quadril",          description:"Elevação lateral para deltoides medial."},
      {id:"ec1", name:"Corrida",                      sets:1, repsMin:1,  repsMax:1,  muscle:"Cardio", secondary:["Pernas"],                tips:"Passada natural, respire pelo nariz",        errors:"Não inclinar para frente em excesso",     description:"Corrida 1 km — registre a distância ou tempo.", isCardio:true},
    ],
  },
  {
    id:2, shortName:"Treino 2", tag:"Pernas",
    name:"Treino 2 – Pernas + Escada",
    exercises:[
      {id:"e6",  name:"Agachamento Livre",            sets:4, repsMin:6,  repsMax:8,  muscle:"Pernas", secondary:["Glúteos","Core"],         tips:"Joelhos alinhados, desça até 90°",           errors:"Joelhos não colabarem para dentro",       description:"Agachamento com barra livre nas costas."},
      {id:"e7",  name:"Hack Machine",                 sets:3, repsMin:8,  repsMax:10, muscle:"Pernas", secondary:["Glúteos"],               tips:"Costas coladas, pés na largura dos ombros",  errors:"Não travar os joelhos na extensão",       description:"Agachamento na hack machine."},
      {id:"e8",  name:"Leg Press 45°",               sets:4, repsMin:10, repsMax:12, muscle:"Pernas", secondary:["Glúteos"],               tips:"Desça até 90°, nunca trave os joelhos",      errors:"Não deixar o lombar descolar do banco",   description:"Leg press inclinado 45 graus."},
      {id:"e9",  name:"Cadeira Extensora",            sets:4, repsMin:12, repsMax:15, muscle:"Pernas", secondary:[],                        tips:"Extensão completa, desça lentamente",         errors:"Não usar impulso para subir",             description:"Extensão de joelhos na cadeira."},
      {id:"e10", name:"Leg Press Unilateral",         sets:3, repsMin:10, repsMax:10, muscle:"Pernas", secondary:["Glúteos"],               tips:"Mantenha o quadril nivelado",                errors:"Não rotacionar o quadril",                description:"Leg press com uma perna de cada vez."},
      {id:"ec2", name:"Escada",                       sets:1, repsMin:1,  repsMax:1,  muscle:"Cardio", secondary:["Pernas","Glúteos"],      tips:"Postura ereta, use o calcanhar ao subir",    errors:"Não se apoiar no corrimão",               description:"Escada 5-8 min — registre o tempo.", isCardio:true},
    ],
  },
  {
    id:3, shortName:"Treino 3", tag:"Costas",
    name:"Treino 3 – Costas + Ombro Posterior + Escada",
    exercises:[
      {id:"e11", name:"Puxada Alta Aberta",           sets:3, repsMin:10, repsMax:12, muscle:"Costas", secondary:["Bíceps"],                tips:"Pegada larga, puxe até o queixo",            errors:"Não deixar os ombros subirem",            description:"Puxada com pegada aberta na barra alta."},
      {id:"e12", name:"Remada Baixa Aberta",          sets:3, repsMin:10, repsMax:12, muscle:"Costas", secondary:["Bíceps"],                tips:"Cotovelos abertos a 90°",                    errors:"Não usar impulso do tronco",              description:"Remada na polia baixa com pegada aberta."},
      {id:"e13", name:"Pulldown Reto",                sets:3, repsMin:12, repsMax:15, muscle:"Costas", secondary:["Tríceps"],               tips:"Traga até a coxa, braços semiflexionados",   errors:"Não dobrar demais os cotovelos",          description:"Pulldown reto com barra ou corda."},
      {id:"e14", name:"Face Pull",                    sets:4, repsMin:12, repsMax:15, muscle:"Ombro",  secondary:["Trapézio","Manguito"],   tips:"Puxe para o rosto, cotovelos acima dos ombros", errors:"Não abaixar os cotovelos",             description:"Face pull para ombro posterior e manguito."},
      {id:"e15", name:"Crucifixo Inverso",            sets:3, repsMin:12, repsMax:15, muscle:"Ombro",  secondary:["Trapézio"],              tips:"Tronco paralelo ao chão, braços semiflexionados", errors:"Não usar balanço das costas",        description:"Crucifixo inverso para deltoides posterior."},
      {id:"e24", name:"Elevação Frontal",             sets:3, repsMin:12, repsMax:15, muscle:"Ombro",  secondary:["Trapézio"],              tips:"Braços semiflexionados, suba até a altura dos ombros", errors:"Não usar balanço do tronco",      description:"Elevação frontal com halteres ou barra para deltoides anterior."},
      {id:"ec3", name:"Escada",                       sets:1, repsMin:1,  repsMax:1,  muscle:"Cardio", secondary:["Pernas"],               tips:"Postura ereta ao subir",                     errors:"Não apoiar no corrimão",                  description:"Escada 8-12 min — registre o tempo.", isCardio:true},
    ],
  },
  {
    id:4, shortName:"Treino 4", tag:"Costas",
    name:"Treino 4 – Costas + Ombro Completo + Cardio",
    exercises:[
      {id:"e16", name:"Barra Assistida",              sets:4, repsMin:6,  repsMax:8,  muscle:"Costas", secondary:["Bíceps"],                tips:"Controle total na descida",                  errors:"Não usar balanço",                        description:"Tração na barra com assistência."},
      {id:"e17", name:"Remada Unilateral",            sets:3, repsMin:8,  repsMax:8,  muscle:"Costas", secondary:["Bíceps","Core"],          tips:"Quadril nivelado, costas neutras",            errors:"Não rotacionar o tronco em excesso",      description:"Remada com haltere apoiado no banco."},
      {id:"e18", name:"Desenvolvimento com Halteres", sets:3, repsMin:8,  repsMax:10, muscle:"Ombro",  secondary:["Tríceps","Trapézio"],    tips:"Cotovelos a 90° no início",                  errors:"Não arquear a lombar",                    description:"Desenvolvimento de ombros com halteres."},
      {id:"e19", name:"Elevação Lateral Cabo",        sets:3, repsMin:12, repsMax:15, muscle:"Ombro",  secondary:[],                        tips:"Tensão constante, movimento lento",           errors:"Não levantar o ombro junto",              description:"Elevação lateral no cabo para deltoides medial."},
      {id:"e20", name:"Pullover",                     sets:3, repsMin:12, repsMax:15, muscle:"Costas", secondary:["Peito","Tríceps"],       tips:"Braços semiflexionados, arco amplo",          errors:"Não dobrar demais os cotovelos",          description:"Pullover com halter no banco."},
      {id:"ec4", name:"Corrida ou Spinning",          sets:1, repsMin:1,  repsMax:1,  muscle:"Cardio", secondary:["Pernas"],               tips:"Mantenha ritmo constante",                   errors:"Não começar muito forte",                 description:"Corrida ou Spinning — registre o tempo ou distância.", isCardio:true},
    ],
  },
  {
    id:5, shortName:"Treino 5", tag:"Cardio",
    name:"Treino 5 – Cardio Inteligente",
    exercises:[
      {id:"e21", name:"Spinning",                     sets:1, repsMin:40, repsMax:40, muscle:"Cardio", secondary:["Pernas"],               tips:"Cadência constante 80-100 RPM",              errors:"Não pedalar com joelhos para dentro",     description:"Ciclismo indoor de alta intensidade — duração em minutos.", isCardio:true},
      {id:"e22", name:"Corrida",                      sets:1, repsMin:3,  repsMax:5,  muscle:"Cardio", secondary:["Pernas","Core"],         tips:"Passada natural, respire pelo nariz",         errors:"Não inclinar excessivamente para frente",  description:"Corrida em esteira ou ao ar livre — distância em km.", isCardio:true},
      {id:"e23", name:"Escada + Caminhada Inclinada", sets:1, repsMin:20, repsMax:30, muscle:"Cardio", secondary:["Pernas","Glúteos"],      tips:"Postura ereta, use o calcanhar",             errors:"Não se apoiar no corrimão",               description:"Subida de escadas + caminhada inclinada — duração em minutos.", isCardio:true},
    ],
  },
];

const MUSCLE_GROUPS = {
  "Costas": ["e1","e2","e3","e4","e11","e12","e13","e16","e17","e20"],
  "Pernas": ["e6","e7","e8","e9","e10"],
  "Ombro":  ["e5","e14","e15","e18","e19","e24"],
  "Cardio": ["e21","e22","e23","ec1","ec2","ec3","ec4"],
};

const PHRASES = [
  "O sucesso não vem de um único treino. Vem da consistência diária.",
  "Cada repetição é um passo mais perto do seu melhor eu.",
  "A dor que sentes hoje é a força que terás amanhã.",
  "Não pare quando estiver cansado. Pare quando terminar.",
  "Seu único competidor é quem você era ontem.",
  "Disciplina é escolher entre o que quer agora e o que quer para sempre.",
  "O corpo consegue quase tudo. É a mente que você precisa convencer.",
  "Treinar dói. Arrependimento dói mais.",
  "Pequeno progresso todo dia soma grandes resultados.",
  "Você não precisa ser perfeito. Precisa ser consistente.",
  "A academia não é castigo. É seu privilégio.",
  "Cada suor é um passo na direção certa.",
  "A mudança começa onde a zona de conforto termina.",
  "Levante pesado. Pense leve. Viva intensamente.",
  "Seu futuro eu está te agradecendo por não desistir.",
  "Força não é apenas física. É mental.",
  "Um dia ruim de treino é melhor que um dia sem treino.",
  "Você é mais forte do que pensa.",
  "O segredo do sucesso é começar.",
  "Consistência bate intensidade no longo prazo.",
  "Resultados chegam para quem aparece todos os dias.",
  "A barra não sabe que você está cansado.",
  "Treinar é conversar com seu futuro eu.",
  "Cada série é um investimento no seu corpo.",
  "Não existe treino perfeito. Existe o treino que você fez.",
  "A diferença entre o bom e o ótimo é um pouco mais de esforço.",
  "Transforme sua dor em combustível.",
  "O melhor projeto em que você pode trabalhar é você mesmo.",
  "Foco. Consistência. Resultados.",
  "Resultados requerem repetição. Repita.",
];

const AVATAR_STATES = [
  {emoji:"😴", label:"Descansando",    minStreak:0,  color:"#64748b"},
  {emoji:"🙂", label:"Regular",         minStreak:2,  color:"#3b82f6"},
  {emoji:"💪", label:"Bom desempenho", minStreak:5,  color:"#10b981"},
  {emoji:"🔥", label:"Em chamas!",      minStreak:10, color:"#f59e0b"},
  {emoji:"🏆", label:"Campeão!",        minStreak:20, color:"#8b5cf6"},
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────
const ld  = (k,d)=>{ try{ const v=localStorage.getItem(k); return v?JSON.parse(v):d; }catch{ return d; }};
const sv  = (k,v)=>{ try{ localStorage.setItem(k,JSON.stringify(v)); }catch{} };
const todayStr = ()=>new Date().toISOString().split("T")[0];
const fmt = d=>new Date(d+"T00:00:00").toLocaleDateString("pt-BR");
const daysInMonth = (y,m)=>new Date(y,m+1,0).getDate();
const fmtTime = s=>`${String(Math.floor(s/60)).padStart(2,"0")}:${String(s%60).padStart(2,"0")}`;

function calcStreak(log){
  const dates=Object.keys(log).sort().reverse();
  if(!dates.length) return 0;
  let streak=0,cur=new Date();
  for(const d of dates){
    const diff=Math.round((cur-new Date(d+"T00:00:00"))/86400000);
    if(diff<=1){streak++;cur=new Date(d+"T00:00:00");}else break;
  }
  return streak;
}
function getAvatar(streak){
  let s=AVATAR_STATES[0];
  for(const a of AVATAR_STATES){if(streak>=a.minStreak)s=a;}
  return s;
}
function beep(){
  try{
    const ctx=new(window.AudioContext||window.webkitAudioContext)();
    [0,0.35,0.7].forEach(t=>{
      const o=ctx.createOscillator(),g=ctx.createGain();
      o.connect(g);g.connect(ctx.destination);
      o.frequency.value=880;
      g.gain.setValueAtTime(0.3,ctx.currentTime+t);
      g.gain.exponentialRampToValueAtTime(0.001,ctx.currentTime+t+0.25);
      o.start(ctx.currentTime+t);o.stop(ctx.currentTime+t+0.25);
    });
  }catch{}
}

// ─── LOGO ─────────────────────────────────────────────────────────────────────
function GymLogo({size=32}){
  return(
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
      <rect x="4"  y="28" width="56" height="8" rx="4" fill="#6366f1"/>
      <rect x="2"  y="18" width="10" height="28" rx="5" fill="#8b5cf6"/>
      <rect x="14" y="22" width="8"  height="20" rx="4" fill="#a78bfa"/>
      <rect x="42" y="22" width="8"  height="20" rx="4" fill="#a78bfa"/>
      <rect x="52" y="18" width="10" height="28" rx="5" fill="#8b5cf6"/>
    </svg>
  );
}

// ─── MODAL ────────────────────────────────────────────────────────────────────
function Modal({children,onClose}){
  return(
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{background:"rgba(0,0,0,0.8)"}} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}
        onClick={e=>e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ─── REST TIMER — roda em background via Web Worker trick ────────────────────
function RestTimer({onClose}){
  const [secs,setSecs]       = useState(60);
  const [total,setTotal]     = useState(60);
  const [running,setRunning] = useState(false);
  const endTimeRef           = useRef(null); // timestamp absoluto de quando acaba
  const rafRef               = useRef(null);

  // Usa requestAnimationFrame + timestamp absoluto para não parar com tela bloqueada
  const tick = ()=>{
    if(!endTimeRef.current) return;
    const remaining = Math.max(0, Math.ceil((endTimeRef.current - Date.now())/1000));
    setSecs(remaining);
    if(remaining > 0){
      rafRef.current = requestAnimationFrame(tick);
    } else {
      setRunning(false);
      beep();
    }
  };

  const start = (s)=>{
    cancelAnimationFrame(rafRef.current);
    endTimeRef.current = Date.now() + s*1000;
    setTotal(s); setSecs(s); setRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  };

  const pause = ()=>{
    cancelAnimationFrame(rafRef.current);
    endTimeRef.current = null;
    setRunning(false);
  };

  const resume = ()=>{
    endTimeRef.current = Date.now() + secs*1000;
    setRunning(true);
    rafRef.current = requestAnimationFrame(tick);
  };

  useEffect(()=>()=>cancelAnimationFrame(rafRef.current),[]);

  const r=54, circ=2*Math.PI*r, pct=total>0?(secs/total):1;
  return(
    <Modal onClose={onClose}>
      <div className="p-6 text-center">
        <h3 className="text-white font-bold text-lg mb-4">⏱ Descanso</h3>
        <div className="relative mx-auto mb-5" style={{width:140,height:140}}>
          <svg width="140" height="140" style={{transform:"rotate(-90deg)"}}>
            <circle cx="70" cy="70" r={r} fill="none" stroke="#2d2d4e" strokeWidth="8"/>
            <circle cx="70" cy="70" r={r} fill="none"
              stroke={secs===0?"#10b981":"#6366f1"} strokeWidth="8"
              strokeDasharray={circ} strokeDashoffset={circ*(1-pct)}
              strokeLinecap="round"/>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-4xl font-bold tabular-nums">{secs}</span>
          </div>
        </div>
        {secs===0&&<p className="font-bold mb-3" style={{color:"#10b981"}}>✓ Pronto! Bora!</p>}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[30,45,60,90,120].map(s=>(
            <button key={s} onClick={()=>start(s)}
              className="py-2 rounded-xl text-sm font-semibold"
              style={{background:total===s&&running?"#6366f1":"#2d2d4e",color:"white"}}>
              {s}s
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={running?pause:resume}
            className="flex-1 py-3 rounded-xl font-bold text-white" style={{background:"#6366f1"}}>
            {running?"Pausar":"Iniciar"}
          </button>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold"
            style={{background:"#2d2d4e",color:"#94a3b8"}}>Fechar</button>
        </div>
      </div>
    </Modal>
  );
}

// ─── INFO EXERCÍCIO ───────────────────────────────────────────────────────────
function ExerciseInfoModal({exercise,onClose,onUploadImage,customImages}){
  const [tab,setTab]=useState("video");
  const fileRef=useRef();
  const videoUrl=EXERCISE_VIDEOS[exercise.name];
  const customImg=customImages?.[exercise.id];
  return(
    <Modal onClose={onClose}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs font-semibold mb-0.5" style={{color:"#6366f1"}}>{exercise.muscle}</div>
            <h3 className="text-white font-bold text-lg">{exercise.name}</h3>
          </div>
          <button onClick={onClose} className="text-2xl leading-none" style={{color:"#64748b"}}>×</button>
        </div>
        <div className="flex gap-2 mb-4">
          {["video","info","erros"].map(t=>(
            <button key={t} onClick={()=>setTab(t)}
              className="flex-1 py-1.5 rounded-xl text-xs font-semibold"
              style={{background:tab===t?"#6366f1":"#2d2d4e",color:tab===t?"white":"#64748b"}}>
              {t==="video"?"📹 Vídeo":t==="info"?"📋 Execução":"⚠️ Erros"}
            </button>
          ))}
        </div>
        {tab==="video"&&(
          <div>
            {customImg
              ?<div className="rounded-xl overflow-hidden mb-3"><img src={customImg} alt={exercise.name} className="w-full object-cover" style={{maxHeight:220}}/></div>
              :videoUrl
                ?<div className="rounded-xl overflow-hidden mb-3" style={{aspectRatio:"16/9",background:"#000"}}>
                   <iframe src={videoUrl} className="w-full h-full" title={exercise.name}
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                     allowFullScreen style={{border:"none",width:"100%",height:"100%"}}/>
                 </div>
                :<div className="rounded-xl flex items-center justify-center mb-3"
                   style={{background:"#0f172a",height:160,color:"#64748b"}}>Vídeo não disponível</div>
            }
            <p className="text-sm mb-3" style={{color:"#94a3b8"}}>{exercise.description}</p>
            <button onClick={()=>fileRef.current?.click()}
              className="w-full py-2 rounded-xl text-sm font-semibold"
              style={{background:"#2d2d4e",color:"#94a3b8"}}>📸 Adicionar minha foto/vídeo</button>
            <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
              onChange={e=>{
                const f=e.target.files?.[0];if(!f)return;
                const r=new FileReader();
                r.onload=ev=>onUploadImage(exercise.id,ev.target.result);
                r.readAsDataURL(f);
              }}/>
          </div>
        )}
        {tab==="info"&&(
          <div className="space-y-3">
            <div className="rounded-xl p-3" style={{background:"#0f172a"}}>
              <div className="text-xs font-semibold mb-1" style={{color:"#6366f1"}}>💡 Dicas de execução</div>
              <p className="text-sm" style={{color:"#e2e8f0"}}>{exercise.tips}</p>
            </div>
            <div className="rounded-xl p-3" style={{background:"#0f172a"}}>
              <div className="text-xs font-semibold mb-1" style={{color:"#10b981"}}>🎯 Músculo principal</div>
              <p className="text-sm text-white">{exercise.muscle}</p>
            </div>
            {exercise.secondary?.length>0&&(
              <div className="rounded-xl p-3" style={{background:"#0f172a"}}>
                <div className="text-xs font-semibold mb-1" style={{color:"#8b5cf6"}}>🔗 Secundários</div>
                <p className="text-sm text-white">{exercise.secondary.join(", ")}</p>
              </div>
            )}
          </div>
        )}
        {tab==="erros"&&(
          <div className="rounded-xl p-4" style={{background:"#1f0f0f",border:"1px solid #ef444440"}}>
            <div className="text-xs font-semibold mb-2" style={{color:"#ef4444"}}>⚠️ Erros comuns</div>
            <p className="text-sm" style={{color:"#fca5a5"}}>{exercise.errors}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── GRÁFICO ──────────────────────────────────────────────────────────────────
function ProgressChart({data,label="kg",color="#6366f1"}){
  if(!data||data.length<2)
    return <div className="text-center py-6 text-sm" style={{color:"#64748b"}}>Registre ao menos 2 sessões para ver o gráfico</div>;
  const vals=data.map(d=>d.value);
  const min=Math.min(...vals),max=Math.max(...vals),range=max-min||1;
  const W=300,H=80,pad=12;
  const pts=data.map((d,i)=>{
    const x=pad+(i/(data.length-1))*(W-pad*2);
    const y=H-pad-((d.value-min)/range)*(H-pad*2);
    return [x,y];
  });
  const polyline=pts.map(p=>p.join(",")).join(" ");
  const area=`M${pts[0][0]},${H} `+pts.map(p=>`L${p[0]},${p[1]}`).join(" ")+` L${pts[pts.length-1][0]},${H} Z`;
  return(
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="80">
        <defs>
          <linearGradient id={`g${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25"/>
            <stop offset="100%" stopColor={color} stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#g${color.slice(1)})`}/>
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        {pts.map(([x,y],i)=><circle key={i} cx={x} cy={y} r="3.5" fill={color} stroke="#0f0f1a" strokeWidth="1.5"/>)}
      </svg>
      <div className="flex justify-between mt-1">
        {data.slice(-4).map((d,i)=>(
          <div key={i} className="text-center">
            <div className="text-xs font-bold" style={{color}}>{d.value}{label}</div>
            <div className="text-xs" style={{color:"#64748b"}}>{d.date.slice(5)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CALENDÁRIO ───────────────────────────────────────────────────────────────
function CalendarView({log,onDayClick}){
  const now=new Date();
  const [year,setYear]=useState(now.getFullYear());
  const [month,setMonth]=useState(now.getMonth());
  const days=daysInMonth(year,month);
  const firstDay=new Date(year,month,1).getDay();
  const monthStr=new Date(year,month).toLocaleString("pt-BR",{month:"long",year:"numeric"});
  const prev=()=>month===0?(setMonth(11),setYear(y=>y-1)):setMonth(m=>m-1);
  const next=()=>month===11?(setMonth(0),setYear(y=>y+1)):setMonth(m=>m+1);
  const getStatus=d=>{
    const s=`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const e=log[s];if(!e)return null;
    return e.isCardio?"cardio":"done";
  };
  return(
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-2 rounded-xl" style={{background:"#2d2d4e",color:"white"}}>‹</button>
        <span className="font-bold capitalize text-white text-sm">{monthStr}</span>
        <button onClick={next} className="p-2 rounded-xl" style={{background:"#2d2d4e",color:"white"}}>›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["D","S","T","Q","Q","S","S"].map((d,i)=>(
          <div key={i} className="text-center text-xs font-semibold" style={{color:"#64748b"}}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay).fill(null).map((_,i)=><div key={"e"+i}/>)}
        {Array(days).fill(null).map((_,i)=>{
          const d=i+1,status=getStatus(d);
          const isToday=d===now.getDate()&&month===now.getMonth()&&year===now.getFullYear();
          const dateStr=`${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          return(
            <button key={d} onClick={()=>onDayClick(dateStr,log[dateStr])}
              className="aspect-square rounded-xl flex items-center justify-center text-sm font-semibold"
              style={{
                background:status==="done"?"#10b981":status==="cardio"?"#f59e0b":isToday?"#2d2d4e":"transparent",
                color:status?"white":isToday?"white":"#94a3b8",
                border:isToday&&!status?"2px solid #6366f1":"2px solid transparent",
              }}>{d}</button>
          );
        })}
      </div>
      <div className="flex gap-4 mt-4 justify-center">
        {[["#10b981","Treino"],["#f59e0b","Cardio"],["#2d2d4e","Hoje"]].map(([c,l])=>(
          <div key={l} className="flex items-center gap-1.5 text-xs" style={{color:"#94a3b8"}}>
            <div className="w-3 h-3 rounded-sm" style={{background:c}}/>{l}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── INPUT DE NÚMERO com limpeza automática ao focar ─────────────────────────
function NumInput({value, onChange, disabled, placeholder="0"}){
  const [local, setLocal] = useState(String(value ?? ""));

  useEffect(()=>{
    setLocal(String(value ?? ""));
  },[value]);

  return(
    <input
      type="number"
      inputMode="decimal"
      value={local}
      disabled={disabled}
      placeholder={placeholder}
      onFocus={e=>{ setLocal(""); e.target.select(); }}
      onChange={e=>setLocal(e.target.value)}
      onBlur={()=>{
        const parsed = parseFloat(local);
        if(!isNaN(parsed)){ onChange(parsed); setLocal(String(parsed)); }
        else { setLocal(String(value ?? "")); }
      }}
      className="w-full px-3 py-2.5 rounded-xl text-white font-bold text-center text-lg"
      style={{background:"#0f172a",border:"1px solid #2d2d4e",opacity:disabled?0.5:1}}
    />
  );
}

// ─── TREINO ATIVO ─────────────────────────────────────────────────────────────
function ActiveWorkout({workout,history,customImages,onFinish,onBack,onUploadImage,savedState,onSaveState}){
  const [elapsed,setElapsed]   = useState(savedState?.elapsed||0);
  const startRef               = useRef(Date.now()-(savedState?.elapsed||0)*1000);
  const [showRest,setShowRest] = useState(false);
  const [infoEx,setInfoEx]     = useState(null);
  const rafRef                 = useRef(null);

  // Cronômetro principal — usa timestamp absoluto, roda sempre
  useEffect(()=>{
    const tick=()=>{
      setElapsed(Math.floor((Date.now()-startRef.current)/1000));
      rafRef.current=requestAnimationFrame(tick);
    };
    rafRef.current=requestAnimationFrame(tick);
    return()=>cancelAnimationFrame(rafRef.current);
  },[]);

  const initExState=()=>{
    if(savedState?.exState) return savedState.exState;
    const s={};
    for(const ex of workout.exercises){
      const prev=(history[ex.id]||[]).slice(-1)[0];
      s[ex.id]={
        done:false,
        sets:Array.from({length:ex.sets},()=>({
          reps: prev?.reps || ex.repsMin,
          load: prev?.load || 0,
          done: false,
        })),
      };
    }
    return s;
  };
  const [exState,setExState]   = useState(initExState);
  const [activeEx,setActiveEx] = useState(savedState?.activeEx||workout.exercises[0]?.id||null);

  // Persiste a cada mudança
  useEffect(()=>{
    onSaveState({elapsed,exState,activeEx,workoutId:workout.id});
  },[elapsed,exState,activeEx]);

  const totalSets = workout.exercises.reduce((a,ex)=>a+ex.sets,0);
  const doneSets  = Object.values(exState).reduce((a,s)=>a+s.sets.filter(s=>s.done).length,0);
  const progress  = totalSets>0?doneSets/totalSets:0;
  // Todos os exercícios (incluindo cardio) precisam estar concluídos
  const allDone   = workout.exercises.every(ex=>exState[ex.id]?.done);

  const updateSet=(exId,setIdx,field,val)=>{
    setExState(prev=>{
      const sets=prev[exId].sets.map((s,i)=>i===setIdx?{...s,[field]:val}:s);
      return{...prev,[exId]:{...prev[exId],sets}};
    });
  };

  const markSetDone=(exId,setIdx)=>{
    setExState(prev=>{
      const sets=prev[exId].sets.map((s,i)=>i===setIdx?{...s,done:true}:s);
      const allSets=sets.every(s=>s.done);
      const newState={...prev,[exId]:{sets,done:allSets}};

      // Avança automaticamente para o próximo exercício se esse ficou completo
      if(allSets){
        const exOrder=workout.exercises.map(e=>e.id);
        const curIdx=exOrder.indexOf(exId);
        const nextId=exOrder.find((id,i)=>i>curIdx&&!newState[id]?.done);
        if(nextId) setTimeout(()=>setActiveEx(nextId),300);
      }
      return newState;
    });
    setShowRest(true);
  };

  const handleFinish=()=>{
    const completed=[];
    for(const ex of workout.exercises){
      const st=exState[ex.id];
      for(const s of st.sets.filter(s=>s.done))
        completed.push({exercise:ex,entry:{load:s.load,reps:s.reps,obs:""}});
    }
    onFinish(completed,elapsed);
  };

  const curEx=workout.exercises.find(e=>e.id===activeEx);
  const curState=activeEx?exState[activeEx]:null;

  return(
    <div className="min-h-screen flex flex-col" style={{background:"#0f0f1a"}}>
      {showRest&&<RestTimer onClose={()=>setShowRest(false)}/>}
      {infoEx&&(
        <ExerciseInfoModal exercise={infoEx} onClose={()=>setInfoEx(null)}
          onUploadImage={(id,data)=>{onUploadImage(id,data);setInfoEx(null);}}
          customImages={customImages}/>
      )}

      {/* HEADER */}
      <div className="px-4 pt-6 pb-3 sticky top-0 z-10"
        style={{background:"#0f0f1a",borderBottom:"1px solid #1a1a2e"}}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="text-sm px-3 py-1.5 rounded-xl"
            style={{color:"#94a3b8",background:"#1a1a2e"}}>← Sair</button>
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums" style={{color:"#6366f1"}}>{fmtTime(elapsed)}</div>
            <div className="text-xs" style={{color:"#64748b"}}>tempo de treino</div>
          </div>
          <button onClick={()=>setShowRest(true)} className="text-sm px-3 py-1.5 rounded-xl"
            style={{color:"#94a3b8",background:"#1a1a2e"}}>⏱ Rest</button>
        </div>
        <div className="h-1.5 rounded-full" style={{background:"#2d2d4e"}}>
          <div className="h-1.5 rounded-full transition-all duration-300"
            style={{width:`${progress*100}%`,background:"linear-gradient(90deg,#6366f1,#10b981)"}}/>
        </div>
        <div className="text-xs mt-1 text-right" style={{color:"#64748b"}}>{doneSets}/{totalSets} séries</div>
      </div>

      {/* CHIPS DE EXERCÍCIOS */}
      <div className="px-4 pt-3 pb-2 flex gap-2 overflow-x-auto" style={{scrollbarWidth:"none"}}>
        {workout.exercises.map(ex=>{
          const st=exState[ex.id];
          const doneCount=st.sets.filter(s=>s.done).length;
          const isActive=activeEx===ex.id;
          const isDone=st.done;
          return(
            <button key={ex.id} onClick={()=>setActiveEx(ex.id)}
              className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background:isDone?"#10b981":isActive?ex.isCardio?"#f59e0b":"#6366f1":"#1a1a2e",
                color:isDone||isActive?"white":"#94a3b8",
                border:isActive&&!isDone?`2px solid ${ex.isCardio?"#f59e0b":"#6366f1"}`:"2px solid transparent",
                minWidth:90,
              }}>
              <div className="truncate max-w-[85px]">{ex.isCardio?"🏃 ":""}{ex.name}</div>
              <div className="mt-0.5 opacity-70">{doneCount}/{ex.sets} séries</div>
            </button>
          );
        })}
      </div>

      {/* EXERCÍCIO ATIVO */}
      {curEx&&curState&&(
        <div className="px-4 flex-1 pb-6">
          <div className="rounded-2xl p-5 mb-3"
            style={{background:"#1a1a2e",border:`1px solid ${curEx.isCardio?"#f59e0b":"#6366f1"}`}}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs font-semibold"
                  style={{color:curEx.isCardio?"#f59e0b":"#8b5cf6"}}>
                  {curEx.isCardio?"🏃 Cardio":curEx.muscle}
                </div>
                <h2 className="text-xl font-bold text-white">{curEx.name}</h2>
                <div className="text-xs" style={{color:"#64748b"}}>
                  {curEx.sets} série(s) · {curEx.description}
                </div>
              </div>
              <button onClick={()=>setInfoEx(curEx)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{background:"#2d2d4e",color:"#94a3b8"}}>📹 Ver</button>
            </div>

            <div className="space-y-3">
              {curState.sets.map((set,idx)=>{
                const prevDone=idx===0||curState.sets[idx-1]?.done;
                const isCurrentSet=!set.done&&prevDone;
                return(
                  <div key={idx} className="rounded-xl p-3 transition-all"
                    style={{
                      background:set.done?"rgba(16,185,129,0.08)":"#0f172a",
                      border:set.done?"1px solid #10b981":isCurrentSet?`1px solid ${curEx.isCardio?"#f59e0b":"#6366f1"}`:"1px solid #2d2d4e",
                      opacity:!set.done&&!isCurrentSet?0.4:1,
                    }}>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                        style={{background:set.done?"#10b981":isCurrentSet?curEx.isCardio?"#f59e0b":"#6366f1":"#2d2d4e",color:"white"}}>
                        {set.done?"✓":idx+1}
                      </div>
                      <span className="text-sm font-semibold text-white">
                        {curEx.isCardio?"Cardio":"Série"} {idx+1}
                      </span>
                      {isCurrentSet&&(
                        <span className="text-xs px-2 py-0.5 rounded-full font-bold"
                          style={{background:curEx.isCardio?"#f59e0b":"#6366f1",color:"white"}}>Atual</span>
                      )}
                    </div>

                    {/* Campos de input — só série atual fica habilitada */}
                    <div className="grid grid-cols-2 gap-2 mb-2">
                      <div>
                        <label className="text-xs mb-1 block" style={{color:"#64748b"}}>
                          {curEx.isCardio?"Tempo/Dist.":"Carga (kg)"}
                        </label>
                        <NumInput value={set.load} disabled={set.done}
                          onChange={v=>updateSet(curEx.id,idx,"load",v)}/>
                      </div>
                      <div>
                        <label className="text-xs mb-1 block" style={{color:"#64748b"}}>
                          {curEx.isCardio?"Min / km":"Reps"}
                        </label>
                        <NumInput value={set.reps} disabled={set.done}
                          onChange={v=>updateSet(curEx.id,idx,"reps",v)}/>
                      </div>
                    </div>

                    {!set.done&&isCurrentSet&&(
                      <button onClick={()=>markSetDone(curEx.id,idx)}
                        className="w-full py-3 rounded-xl font-bold text-white active:scale-95 transition-transform"
                        style={{
                          background:curEx.isCardio
                            ?"linear-gradient(135deg,#f59e0b,#d97706)"
                            :"linear-gradient(135deg,#6366f1,#8b5cf6)",
                          boxShadow:curEx.isCardio
                            ?"0 0 20px rgba(245,158,11,0.3)"
                            :"0 0 20px rgba(99,102,241,0.3)",
                        }}>
                        {curEx.isCardio?"🏃 Cardio Concluído!":"✓ Concluir Série "+(idx+1)}
                      </button>
                    )}
                    {!set.done&&!isCurrentSet&&(
                      <div className="text-center text-xs py-1" style={{color:"#64748b"}}>
                        Aguardando série anterior
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* FINALIZAR — só aparece quando tudo incluindo cardio estiver feito */}
      {allDone&&(
        <div className="px-4 pb-10">
          <button onClick={handleFinish}
            className="w-full py-5 rounded-2xl font-bold text-white text-xl active:scale-95 transition-transform"
            style={{background:"linear-gradient(135deg,#10b981,#059669)",boxShadow:"0 0 30px rgba(16,185,129,0.4)"}}>
            🏆 FINALIZAR TREINO
          </button>
        </div>
      )}
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function FitnessApp(){
  const [tab,setTab]                     = useState("home");
  const [history,setHistory]             = useState(()=>ld("gym_history",{}));
  const [log,setLog]                     = useState(()=>ld("gym_log",{}));
  const [weight,setWeight]               = useState(()=>ld("gym_weight",[]));
  const [weightGoal,setWeightGoal]       = useState(()=>ld("gym_goal",80));
  const [customImages,setCustomImages]   = useState(()=>ld("gym_images",{}));
  const [activeWorkout,setActiveWorkout] = useState(()=>{
    const s=ld("gym_active_workout",null);
    if(!s)return null;
    return WORKOUTS.find(w=>w.id===s.workoutId)||null;
  });
  const [activeSavedState,setActiveSavedState] = useState(()=>ld("gym_active_state",null));
  const [dayDetail,setDayDetail]         = useState(null);
  const [weightInput,setWeightInput]     = useState("");
  const [editWeightIdx,setEditWeightIdx] = useState(null);
  const [editWeightVal,setEditWeightVal] = useState("");
  const [goalInput,setGoalInput]         = useState(()=>ld("gym_goal",80).toString());
  const [infoEx,setInfoEx]               = useState(null);

  const phraseIdx = Math.floor(Date.now()/86400000)%PHRASES.length;
  const streak    = calcStreak(log);
  const avatar    = getAvatar(streak);
  const thisMonth = todayStr().slice(0,7);
  const trainingsThisMonth = Object.keys(log).filter(d=>d.startsWith(thisMonth)).length;
  const weekDays  = Array.from({length:7},(_,i)=>{const d=new Date();d.setDate(d.getDate()-i);return d.toISOString().split("T")[0];});
  const weekTrainings = weekDays.filter(d=>log[d]).length;
  const weekMinutes   = weekDays.reduce((a,d)=>a+(log[d]?.duration||0),0);
  const curWeight     = weight.length>0?weight[weight.length-1].value:null;

  const prs=(()=>{
    const r={};
    for(const [id,entries] of Object.entries(history)){
      if(!entries.length)continue;
      const max=Math.max(...entries.map(e=>e.load));
      const ex=WORKOUTS.flatMap(w=>w.exercises).find(e=>e.id===id);
      if(ex&&max>0&&!ex.isCardio)r[ex.name]=max;
    }
    return r;
  })();

  const bestExercise=(()=>{
    let best=null,bestGain=0;
    for(const [id,entries] of Object.entries(history)){
      if(entries.length<2)continue;
      const gain=entries[entries.length-1].load-entries[0].load;
      if(gain>bestGain){bestGain=gain;best={id,gain};}
    }
    if(!best)return null;
    const ex=WORKOUTS.flatMap(w=>w.exercises).find(e=>e.id===best.id);
    return ex?`${ex.name} (+${best.gain}kg)`:null;
  })();

  const saveHistory = h=>{setHistory(h);sv("gym_history",h);};
  const saveLog     = l=>{setLog(l);sv("gym_log",l);};
  const saveWeight  = w=>{setWeight(w);sv("gym_weight",w);};
  const saveImages  = i=>{setCustomImages(i);sv("gym_images",i);};
  const handleUploadImage=(exId,data)=>saveImages({...customImages,[exId]:data});

  const handleSaveActiveState=state=>{
    sv("gym_active_workout",{workoutId:state.workoutId});
    sv("gym_active_state",state);
    setActiveSavedState(state);
  };

  const handleWorkoutFinish=(completedExercises,duration)=>{
    const newHistory={...history};
    const dateStr=todayStr();
    for(const {exercise,entry} of completedExercises){
      if(!newHistory[exercise.id])newHistory[exercise.id]=[];
      newHistory[exercise.id].push({date:dateStr,load:entry.load,reps:entry.reps,volume:entry.reps*entry.load});
    }
    saveHistory(newHistory);
    const newLog={...log,[dateStr]:{
      workoutId:activeWorkout.id,
      name:activeWorkout.shortName,
      exercises:completedExercises.map(({exercise,entry})=>({name:exercise.name,...entry})),
      duration:Math.floor(duration/60),
      isCardio:activeWorkout.tag==="Cardio",
    }};
    saveLog(newLog);
    sv("gym_active_workout",null);sv("gym_active_state",null);
    setActiveSavedState(null);setActiveWorkout(null);setTab("home");
  };

  const handleStartWorkout=w=>{
    const saved=ld("gym_active_workout",null);
    if(saved&&saved.workoutId!==w.id){sv("gym_active_state",null);setActiveSavedState(null);}
    setActiveWorkout(w);
  };

  if(activeWorkout){
    return(
      <ActiveWorkout workout={activeWorkout} history={history}
        customImages={customImages} onUploadImage={handleUploadImage}
        onFinish={handleWorkoutFinish} onBack={()=>setActiveWorkout(null)}
        savedState={activeSavedState?.workoutId===activeWorkout.id?activeSavedState:null}
        onSaveState={handleSaveActiveState}/>
    );
  }

  const TABS=[
    {id:"home",     icon:"🏠",label:"Início"},
    {id:"workouts", icon:"💪",label:"Treinos"},
    {id:"calendar", icon:"📅",label:"Calendário"},
    {id:"progress", icon:"📈",label:"Evolução"},
    {id:"body",     icon:"⚖️",label:"Corpo"},
  ];

  return(
    <div className="min-h-screen pb-24" style={{background:"#0f0f1a",fontFamily:"'Inter',sans-serif",color:"white"}}>

      {dayDetail&&(
        <Modal onClose={()=>setDayDetail(null)}>
          <div className="p-5">
            <h3 className="font-bold text-lg text-white mb-1">{fmt(dayDetail.date)}</h3>
            <div className="text-sm mb-3" style={{color:"#6366f1"}}>{dayDetail.data?.name||"Sem registro"}</div>
            {dayDetail.data?.exercises?.map((ex,i)=>(
              <div key={i} className="flex justify-between py-2 border-b" style={{borderColor:"#2d2d4e"}}>
                <span className="text-sm text-white">{ex.name}</span>
                <span className="text-sm" style={{color:"#94a3b8"}}>{ex.load}kg × {ex.reps}</span>
              </div>
            ))}
            {dayDetail.data?.duration!=null&&<div className="mt-3 text-sm" style={{color:"#64748b"}}>⏱ {dayDetail.data.duration} min</div>}
            <button onClick={()=>setDayDetail(null)} className="w-full mt-4 py-3 rounded-xl font-bold"
              style={{background:"#2d2d4e",color:"#94a3b8"}}>Fechar</button>
          </div>
        </Modal>
      )}

      {infoEx&&(
        <ExerciseInfoModal exercise={infoEx} onClose={()=>setInfoEx(null)}
          onUploadImage={handleUploadImage} customImages={customImages}/>
      )}

      {/* ── HOME ─────────────────────────────────────────────────────────── */}
      {tab==="home"&&(
        <div>
          <div className="px-4 pt-8 pb-6" style={{background:"linear-gradient(180deg,#1a0a2e,#0f0f1a)"}}>
            {/* Banner treino em andamento */}
            {activeSavedState&&(()=>{
              const w=WORKOUTS.find(w=>w.id===activeSavedState.workoutId);
              return w?(
                <button onClick={()=>setActiveWorkout(w)}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-2xl mb-4 active:scale-95 transition-transform"
                  style={{background:"rgba(99,102,241,0.2)",border:"2px solid #6366f1"}}>
                  <div className="text-left">
                    <div className="text-xs font-bold" style={{color:"#a78bfa"}}>⚡ Treino em andamento</div>
                    <div className="text-sm font-bold text-white">{w.shortName}</div>
                    <div className="text-xs" style={{color:"#64748b"}}>{fmtTime(activeSavedState.elapsed||0)} decorridos</div>
                  </div>
                  <div className="text-white font-bold px-4 py-2 rounded-xl" style={{background:"#6366f1"}}>Continuar →</div>
                </button>
              ):null;
            })()}

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <GymLogo size={40}/>
                <div>
                  <div className="text-sm" style={{color:"#64748b"}}>Bem-vindo de volta</div>
                  <h1 className="text-xl font-bold text-white">Alencar 💪</h1>
                </div>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-0.5">{avatar.emoji}</div>
                <div className="text-xs font-semibold" style={{color:avatar.color}}>{avatar.label}</div>
              </div>
            </div>

            <div className="rounded-2xl p-4 mb-5"
              style={{background:"rgba(99,102,241,0.1)",border:"1px solid rgba(99,102,241,0.25)"}}>
              <p className="text-sm italic leading-relaxed" style={{color:"#c4b5fd"}}>"{PHRASES[phraseIdx]}"</p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {[
                {label:"Treinos este mês", value:trainingsThisMonth, unit:"",      icon:"🏋️",color:"#6366f1"},
                {label:"Dias seguidos",    value:streak,             unit:" dias", icon:"🔥",color:"#f59e0b"},
                {label:"Treinos na semana",value:weekTrainings,      unit:"/7",    icon:"📅",color:"#10b981"},
                {label:"Tempo na semana",  value:weekMinutes,        unit:" min",  icon:"⏱",color:"#8b5cf6"},
              ].map((s,i)=>(
                <div key={i} className="rounded-2xl p-4" style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}>
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-bold" style={{color:s.color}}>{s.value}{s.unit}</div>
                  <div className="text-xs mt-0.5" style={{color:"#64748b"}}>{s.label}</div>
                </div>
              ))}
            </div>

            {(curWeight||bestExercise)&&(
              <div className="grid grid-cols-2 gap-3">
                {curWeight&&(
                  <div className="rounded-2xl p-4" style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}>
                    <div className="text-xl mb-1">⚖️</div>
                    <div className="text-2xl font-bold" style={{color:"#6366f1"}}>{curWeight}kg</div>
                    <div className="text-xs" style={{color:"#64748b"}}>{weightGoal?`Meta: ${weightGoal}kg`:"Peso atual"}</div>
                  </div>
                )}
                {bestExercise&&(
                  <div className="rounded-2xl p-4" style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}>
                    <div className="text-xl mb-1">🚀</div>
                    <div className="text-sm font-bold leading-tight" style={{color:"#f59e0b"}}>{bestExercise}</div>
                    <div className="text-xs mt-1" style={{color:"#64748b"}}>Maior evolução</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-4">
            <h2 className="text-lg font-bold text-white mb-3">Iniciar Treino</h2>
            <div className="space-y-2">
              {WORKOUTS.map(w=>(
                <button key={w.id} onClick={()=>handleStartWorkout(w)}
                  className="w-full flex items-center justify-between px-4 py-4 rounded-2xl active:scale-95 transition-transform"
                  style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}>
                  <div className="text-left">
                    <div className="text-xs font-semibold mb-0.5" style={{color:"#6366f1"}}>{w.shortName} · {w.tag}</div>
                    <div className="font-semibold text-white text-sm">{w.name}</div>
                    <div className="text-xs mt-0.5" style={{color:"#64748b"}}>
                      {w.exercises.filter(e=>!e.isCardio).length} exercícios + cardio
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>▶</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── TREINOS ──────────────────────────────────────────────────────────── */}
      {tab==="workouts"&&(
        <div className="px-4 pt-6">
          <h2 className="text-2xl font-bold text-white mb-4">Fichas de Treino</h2>
          {WORKOUTS.map(w=>(
            <div key={w.id} className="rounded-2xl mb-5" style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}>
              <div className="p-4 border-b" style={{borderColor:"#2d2d4e"}}>
                <div className="text-xs font-semibold mb-0.5" style={{color:"#6366f1"}}>{w.shortName} · {w.tag}</div>
                <div className="font-bold text-white">{w.name}</div>
              </div>
              {w.exercises.map(ex=>{
                const exHist=history[ex.id]||[];
                const lastEntry=exHist.slice(-1)[0];
                const pr=exHist.length>0?Math.max(...exHist.map(e=>e.load)):0;
                return(
                  <div key={ex.id} className="border-b" style={{borderColor:"#2d2d4e"}}>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-semibold" style={{color:ex.isCardio?"#f59e0b":"white"}}>
                          {ex.isCardio?"🏃 ":""}{ex.name}
                        </div>
                        <div className="text-xs mt-0.5" style={{color:"#64748b"}}>
                          {ex.sets}×{ex.repsMin}{ex.repsMin!==ex.repsMax?`-${ex.repsMax}`:""} · {ex.muscle}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          {lastEntry?.load>0&&<div className="text-sm font-bold" style={{color:"#6366f1"}}>{lastEntry.load}kg</div>}
                          {pr>0&&!ex.isCardio&&<div className="text-xs" style={{color:"#f59e0b"}}>🏆 {pr}kg</div>}
                        </div>
                        <button onClick={()=>setInfoEx(ex)}
                          className="px-3 py-1.5 rounded-xl text-xs"
                          style={{background:"#2d2d4e",color:"#94a3b8"}}>📹</button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="p-3">
                <button onClick={()=>handleStartWorkout(w)}
                  className="w-full py-3 rounded-xl font-bold text-white active:scale-95 transition-transform"
                  style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>
                  ▶ Iniciar {w.shortName}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── CALENDÁRIO ───────────────────────────────────────────────────────── */}
      {tab==="calendar"&&(
        <div className="px-4 pt-6">
          <h2 className="text-2xl font-bold text-white mb-4">Calendário</h2>
          <div className="rounded-2xl p-4 mb-4" style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}>
            <CalendarView log={log} onDayClick={(date,data)=>setDayDetail({date,data})}/>
          </div>
          <h3 className="text-lg font-bold text-white mb-3">Histórico Recente</h3>
          {Object.entries(log).sort(([a],[b])=>b.localeCompare(a)).slice(0,10).map(([date,entry])=>(
            <div key={date} className="flex items-center justify-between px-4 py-3 rounded-2xl mb-2"
              style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}>
              <div>
                <div className="text-sm font-semibold text-white">{entry.name}</div>
                <div className="text-xs" style={{color:"#64748b"}}>{fmt(date)}</div>
              </div>
              <div className="text-right">
                {entry.duration!=null&&<div className="text-sm" style={{color:"#6366f1"}}>{entry.duration} min</div>}
                <div className="text-xs" style={{color:"#10b981"}}>✓ {entry.exercises?.length||0} séries</div>
              </div>
            </div>
          ))}
          {!Object.keys(log).length&&(
            <div className="text-center py-10" style={{color:"#64748b"}}>
              <div className="text-5xl mb-3">📅</div>
              <div>Nenhum treino registrado ainda</div>
            </div>
          )}
        </div>
      )}

      {/* ── EVOLUÇÃO ─────────────────────────────────────────────────────────── */}
      {tab==="progress"&&(
        <div className="px-4 pt-6">
          <h2 className="text-2xl font-bold text-white mb-4">Evolução</h2>
          <div className="rounded-2xl p-4 mb-4" style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}>
            <h3 className="font-bold text-white mb-3">🏆 Recordes Pessoais</h3>
            {Object.keys(prs).length===0
              ?<div className="text-sm" style={{color:"#64748b"}}>Nenhum PR ainda. Complete um treino!</div>
              :Object.entries(prs).map(([name,val])=>(
                <div key={name} className="flex items-center justify-between py-2 border-b" style={{borderColor:"#2d2d4e"}}>
                  <span className="text-sm text-white">{name}</span>
                  <span className="font-bold" style={{color:"#f59e0b"}}>{val} kg</span>
                </div>
              ))
            }
          </div>

          {WORKOUTS.flatMap(w=>w.exercises)
            .filter(ex=>!ex.isCardio&&(history[ex.id]||[]).length>=2)
            .slice(0,6).map(ex=>{
              const byDate={};
              for(const e of (history[ex.id]||[])){
                if(!byDate[e.date]||e.load>byDate[e.date])byDate[e.date]=e.load;
              }
              const data=Object.entries(byDate).sort(([a],[b])=>a.localeCompare(b)).map(([date,value])=>({date,value}));
              const gain=(data[data.length-1]?.value||0)-(data[0]?.value||0);
              return(
                <div key={ex.id} className="rounded-2xl p-4 mb-4" style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-xs" style={{color:"#6366f1"}}>{ex.muscle}</div>
                      <div className="font-bold text-white">{ex.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold" style={{color:gain>=0?"#10b981":"#ef4444"}}>
                        {gain>=0?"+":""}{gain}kg
                      </div>
                      <div className="text-xs" style={{color:"#64748b"}}>evolução</div>
                    </div>
                  </div>
                  <ProgressChart data={data} label="kg"/>
                </div>
              );
            })}

          <div className="rounded-2xl p-4 mb-4" style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}>
            <h3 className="font-bold text-white mb-3">Volume por Músculo</h3>
            {Object.entries(MUSCLE_GROUPS).filter(([m])=>m!=="Cardio").map(([muscle,ids])=>{
              const vol=ids.reduce((a,id)=>a+(history[id]||[]).reduce((b,e)=>b+(e.volume||0),0),0);
              const maxVol=Math.max(...Object.entries(MUSCLE_GROUPS).filter(([m])=>m!=="Cardio").map(([,ids2])=>
                ids2.reduce((a,id)=>a+(history[id]||[]).reduce((b,e)=>b+(e.volume||0),0),0)
              ),1);
              return(
                <div key={muscle} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{muscle}</span>
                    <span style={{color:"#6366f1"}}>{vol.toLocaleString()}</span>
                  </div>
                  <div className="h-2 rounded-full" style={{background:"#2d2d4e"}}>
                    <div className="h-2 rounded-full"
                      style={{width:`${(vol/maxVol)*100}%`,background:"linear-gradient(90deg,#6366f1,#8b5cf6)"}}/>
                  </div>
                </div>
              );
            })}
          </div>

          {Object.keys(history).length===0&&(
            <div className="text-center py-12" style={{color:"#64748b"}}>
              <div className="text-5xl mb-3">📊</div>
              <div>Complete treinos para ver sua evolução</div>
            </div>
          )}
        </div>
      )}

      {/* ── CORPO ────────────────────────────────────────────────────────────── */}
      {tab==="body"&&(
        <div className="px-4 pt-6">
          <h2 className="text-2xl font-bold text-white mb-4">Controle Corporal</h2>
          <div className="rounded-2xl p-4 mb-4" style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}>
            <h3 className="font-bold text-white mb-3">Registrar Peso</h3>
            <div className="flex gap-2 mb-3">
              <input value={weightInput} onChange={e=>setWeightInput(e.target.value)}
                type="number" inputMode="decimal"
                onFocus={e=>{setWeightInput("");e.target.select();}}
                className="flex-1 px-4 py-3 rounded-xl text-white font-bold text-center text-xl"
                style={{background:"#0f172a",border:"1px solid #2d2d4e"}} placeholder="kg"/>
              <button onClick={()=>{
                if(!weightInput)return;
                const entry={date:todayStr(),value:parseFloat(weightInput)};
                const newW=[...weight.filter(w=>w.date!==todayStr()),entry].sort((a,b)=>a.date.localeCompare(b.date));
                saveWeight(newW);setWeightInput("");
              }} className="px-6 py-3 rounded-xl font-bold text-white"
                style={{background:"linear-gradient(135deg,#6366f1,#8b5cf6)"}}>+</button>
            </div>
            <div className="flex gap-2">
              <input value={goalInput} onChange={e=>setGoalInput(e.target.value)}
                type="number" inputMode="decimal"
                className="flex-1 px-3 py-2 rounded-xl text-white text-center"
                style={{background:"#0f172a",border:"1px solid #2d2d4e"}} placeholder="Meta (kg)"/>
              <button onClick={()=>{const g=parseFloat(goalInput);sv("gym_goal",g);setWeightGoal(g);}}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{background:"#2d2d4e"}}>
                Salvar meta
              </button>
            </div>
          </div>

          {curWeight&&(
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                {label:"Atual",  val:`${curWeight}kg`,color:"#6366f1"},
                {label:"Meta",   val:`${weightGoal}kg`,color:"#10b981"},
                {label:curWeight>weightGoal?"A perder":"Abaixo!",
                  val:`${Math.abs(curWeight-weightGoal).toFixed(1)}kg`,
                  color:curWeight>weightGoal?"#ef4444":"#10b981"},
              ].map((item,i)=>(
                <div key={i} className="rounded-2xl p-4 text-center" style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}>
                  <div className="text-xl font-bold" style={{color:item.color}}>{item.val}</div>
                  <div className="text-xs mt-1" style={{color:"#64748b"}}>{item.label}</div>
                </div>
              ))}
            </div>
          )}

          {weight.length>=2&&(
            <div className="rounded-2xl p-4 mb-4" style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}>
              <h3 className="font-bold text-white mb-3">Evolução do Peso</h3>
              <ProgressChart data={weight.map(w=>({date:w.date,value:w.value}))} label="kg" color="#10b981"/>
            </div>
          )}

          <div className="rounded-2xl p-4" style={{background:"#1a1a2e",border:"1px solid #2d2d4e"}}>
            <h3 className="font-bold text-white mb-3">Histórico de Peso</h3>
            {weight.slice().reverse().slice(0,15).map((w,i)=>{
              const realIdx=weight.length-1-i;
              const isEditing=editWeightIdx===realIdx;
              return(
                <div key={i} className="flex items-center justify-between py-2 border-b" style={{borderColor:"#2d2d4e"}}>
                  <span className="text-sm" style={{color:"#94a3b8"}}>{fmt(w.date)}</span>
                  {isEditing?(
                    <div className="flex items-center gap-2">
                      <input value={editWeightVal} onChange={e=>setEditWeightVal(e.target.value)}
                        type="number" inputMode="decimal"
                        className="w-20 px-2 py-1 rounded-lg text-white text-center font-bold"
                        style={{background:"#0f172a",border:"1px solid #6366f1"}}/>
                      <button onClick={()=>{
                        const newW=weight.map((item,idx)=>idx===realIdx?{...item,value:parseFloat(editWeightVal)||item.value}:item);
                        saveWeight(newW);setEditWeightIdx(null);
                      }} className="text-xs px-2 py-1 rounded-lg font-bold text-white" style={{background:"#10b981"}}>✓</button>
                      <button onClick={()=>setEditWeightIdx(null)}
                        className="text-xs px-2 py-1 rounded-lg font-bold" style={{background:"#2d2d4e",color:"#94a3b8"}}>✕</button>
                    </div>
                  ):(
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-white">{w.value} kg</span>
                      <button onClick={()=>{setEditWeightIdx(realIdx);setEditWeightVal(w.value.toString());}}
                        className="text-xs px-2 py-1 rounded-lg" style={{background:"#2d2d4e",color:"#94a3b8"}}>✏️</button>
                    </div>
                  )}
                </div>
              );
            })}
            {!weight.length&&<div className="text-sm" style={{color:"#64748b"}}>Nenhum registro ainda.</div>}
          </div>
        </div>
      )}

      {/* NAV */}
      <div className="fixed bottom-0 left-0 right-0 flex"
        style={{background:"#1a1a2e",borderTop:"1px solid #2d2d4e",paddingBottom:"env(safe-area-inset-bottom)"}}>
        {TABS.map(t=>(
          <button key={t.id} onClick={()=>setTab(t.id)}
            className="flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors"
            style={{color:tab===t.id?"#6366f1":"#64748b"}}>
            <span className="text-xl">{t.icon}</span>
            <span className="text-xs font-semibold">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
