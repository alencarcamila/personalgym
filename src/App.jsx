import { useState, useEffect, useRef } from "react";

// ─── YOUTUBE VIDEO IDs POR EXERCÍCIO ───────────────────────────────────────────
// Links do YouTube Embed para demonstração de execução
const EXERCISE_VIDEOS = {
  "Barra Assistida":              "https://www.youtube.com/embed/sIvJTfGxdFo",
  "Remada Curvada com Barra":     "https://www.youtube.com/embed/FWJR5Ve8bnQ",
  "Puxada Alta Pegada Fechada":   "https://www.youtube.com/embed/CAwf7n6Luuc",
  "Remada Baixa Neutra":          "https://www.youtube.com/embed/GZbfZ033f74",
  "Elevação Lateral com Halteres":"https://www.youtube.com/embed/3VcKaXpzqRo",
  "Agachamento Livre":            "https://www.youtube.com/embed/ultWZbUMPL8",
  "Hack Machine":                 "https://www.youtube.com/embed/EdtPqHVhUms",
  "Leg Press 45°":                "https://www.youtube.com/embed/IZxyjW7MPJQ",
  "Cadeira Extensora":            "https://www.youtube.com/embed/YyvSfVjQeL0",
  "Leg Press Unilateral":         "https://www.youtube.com/embed/IZxyjW7MPJQ",
  "Puxada Alta Aberta":           "https://www.youtube.com/embed/CAwf7n6Luuc",
  "Remada Baixa Aberta":          "https://www.youtube.com/embed/GZbfZ033f74",
  "Pulldown Reto":                "https://www.youtube.com/embed/lueEJGjTuPQ",
  "Face Pull":                    "https://www.youtube.com/embed/rep-qVOkqgk",
  "Crucifixo Inverso":            "https://www.youtube.com/embed/k9M3HxGCiSs",
  "Remada Unilateral":            "https://www.youtube.com/embed/roCP5O-K4-M",
  "Desenvolvimento com Halteres": "https://www.youtube.com/embed/qEwKCR5JCog",
  "Elevação Lateral Cabo":        "https://www.youtube.com/embed/3VcKaXpzqRo",
  "Pullover":                     "https://www.youtube.com/embed/lEJJ5OA7Zcw",
  "Spinning":                     "https://www.youtube.com/embed/2OByMfGbBpU",
  "Corrida":                      "https://www.youtube.com/embed/kVnyY17VS9Y",
  "Escada + Caminhada Inclinada": "https://www.youtube.com/embed/HtJEuHrE5O4",
};

// ─── DADOS DOS TREINOS ─────────────────────────────────────────────────────────
const WORKOUTS = [
  {
    id: 1,
    name: "Treino 1 – Costas + Ombro Lateral + Corrida",
    shortName: "Treino 1",
    tag: "Costas",
    cardio: "Corrida 1 km",
    exercises: [
      { id: "e1",  name: "Barra Assistida",             sets: 4, repsMin: 8,  repsMax: 10, muscle: "Costas", secondary: ["Bíceps"],               tips: "Mantenha escápulas retraídas durante todo o movimento", errors: "Não usar momentum ou balanço do corpo", description: "Tração na barra com assistência de contrapeso. Ideal para quem está desenvolvendo força no pull-up livre." },
      { id: "e2",  name: "Remada Curvada com Barra",    sets: 4, repsMin: 8,  repsMax: 10, muscle: "Costas", secondary: ["Bíceps","Core"],          tips: "Tronco a 45°, cotovelos próximos ao corpo", errors: "Não arquear excessivamente a lombar", description: "Remada inclinada com barra livre. Trabalha o espesso das costas com grande ativação do dorsal." },
      { id: "e3",  name: "Puxada Alta Pegada Fechada",  sets: 3, repsMin: 10, repsMax: 12, muscle: "Costas", secondary: ["Bíceps"],               tips: "Traga a barra até o queixo, cotovelos para baixo", errors: "Não inclinar demais o tronco", description: "Puxada com pegada supinada fechada. Enfatiza o bíceps e a parte inferior do dorsal." },
      { id: "e4",  name: "Remada Baixa Neutra",         sets: 3, repsMin: 10, repsMax: 12, muscle: "Costas", secondary: ["Bíceps","Core"],          tips: "Cotovelos a 45° do tronco, aperte no pico", errors: "Não arredondar as costas", description: "Remada na polia baixa com pegada neutra. Excelente para o espessamento das costas." },
      { id: "e5",  name: "Elevação Lateral com Halteres",sets: 4, repsMin: 12, repsMax: 15, muscle: "Ombro", secondary: ["Trapézio"],              tips: "Cotovelo levemente dobrado, polegar levemente para baixo", errors: "Não usar impulso do quadril para subir o peso", description: "Elevação lateral com halteres para deltoides medial. Essencial para ombros largos." },
    ],
  },
  {
    id: 2,
    name: "Treino 2 – Pernas + Escada",
    shortName: "Treino 2",
    tag: "Pernas",
    cardio: "Escada 5-8 min",
    exercises: [
      { id: "e6",  name: "Agachamento Livre",        sets: 4, repsMin: 6,  repsMax: 8,  muscle: "Pernas", secondary: ["Glúteos","Core"],    tips: "Joelhos alinhados com os pés, desça até 90°", errors: "Joelhos não colabarem para dentro", description: "Agachamento com barra livre nas costas. O rei dos exercícios para pernas e glúteos." },
      { id: "e7",  name: "Hack Machine",             sets: 3, repsMin: 8,  repsMax: 10, muscle: "Pernas", secondary: ["Glúteos"],           tips: "Pés na largura dos ombros, costas coladas", errors: "Não travar os joelhos na extensão completa", description: "Agachamento na hack machine. Isola bem o quadríceps com menos pressão na lombar." },
      { id: "e8",  name: "Leg Press 45°",            sets: 4, repsMin: 10, repsMax: 12, muscle: "Pernas", secondary: ["Glúteos"],           tips: "Pés paralelos, desça até 90°, nunca trave os joelhos", errors: "Não deixar o lombar descolar do banco", description: "Leg press inclinado 45 graus. Permite trabalhar com cargas altas em segurança." },
      { id: "e9",  name: "Cadeira Extensora",        sets: 4, repsMin: 12, repsMax: 15, muscle: "Pernas", secondary: [],                   tips: "Extensão completa, desça de forma lenta e controlada", errors: "Não usar impulso para subir o peso", description: "Extensão de joelhos na cadeira. Isolamento do quadríceps." },
      { id: "e10", name: "Leg Press Unilateral",     sets: 3, repsMin: 10, repsMax: 10, muscle: "Pernas", secondary: ["Glúteos"],           tips: "Mantenha o quadril nivelado durante o movimento", errors: "Não rotacionar o quadril", description: "Leg press com uma perna de cada vez. Corrige assimetrias e aumenta ativação muscular." },
    ],
  },
  {
    id: 3,
    name: "Treino 3 – Costas + Ombro Posterior + Escada",
    shortName: "Treino 3",
    tag: "Costas",
    cardio: "Escada 8-12 min",
    exercises: [
      { id: "e11", name: "Puxada Alta Aberta",        sets: 3, repsMin: 10, repsMax: 12, muscle: "Costas", secondary: ["Bíceps"],              tips: "Pegada pronada larga, puxe até o queixo", errors: "Não deixar os ombros subirem em direção às orelhas", description: "Puxada com pegada aberta na barra alta. Trabalha a largura das costas (dorsal)." },
      { id: "e12", name: "Remada Baixa Aberta",       sets: 3, repsMin: 10, repsMax: 12, muscle: "Costas", secondary: ["Bíceps"],              tips: "Cotovelos abertos a 90°, retração escapular no pico", errors: "Não usar impulso do tronco para puxar", description: "Remada na polia baixa com pegada aberta. Enfatiza o trapézio médio e romboides." },
      { id: "e13", name: "Pulldown Reto",              sets: 3, repsMin: 12, repsMax: 15, muscle: "Costas", secondary: ["Tríceps"],             tips: "Traga a barra até a coxa, braços levemente flexionados", errors: "Não dobrar excessivamente os cotovelos", description: "Pulldown reto com barra ou corda. Excelente finalizador para o dorsal." },
      { id: "e14", name: "Face Pull",                  sets: 4, repsMin: 12, repsMax: 15, muscle: "Ombro", secondary: ["Trapézio","Manguito"], tips: "Puxe para o rosto, cotovelos na altura dos ombros ou acima", errors: "Não abaixar os cotovelos durante o movimento", description: "Face pull para ombro posterior e manguito rotador. Fundamental para saúde do ombro." },
      { id: "e15", name: "Crucifixo Inverso",          sets: 3, repsMin: 12, repsMax: 15, muscle: "Ombro", secondary: ["Trapézio"],            tips: "Tronco paralelo ao chão, braços semiflexionados", errors: "Não usar o balanço das costas para levantar o peso", description: "Crucifixo inverso para deltoides posterior. Pode ser feito com halteres ou cabos." },
    ],
  },
  {
    id: 4,
    name: "Treino 4 – Costas + Ombro Completo + Cardio",
    shortName: "Treino 4",
    tag: "Costas",
    cardio: "Corrida ou Spinning",
    exercises: [
      { id: "e16", name: "Barra Assistida",             sets: 4, repsMin: 6,  repsMax: 8,  muscle: "Costas", secondary: ["Bíceps"],              tips: "Controle total na fase excêntrica (descida)", errors: "Não usar balanço ou momentum", description: "Tração na barra com assistência. Neste treino o foco é força — menos reps, mais controle." },
      { id: "e17", name: "Remada Unilateral",            sets: 3, repsMin: 8,  repsMax: 8,  muscle: "Costas", secondary: ["Bíceps","Core"],        tips: "Mantenha o quadril nivelado e costas neutras", errors: "Não rotacionar o tronco em excesso", description: "Remada com haltere apoiado no banco. Permite amplitude de movimento maior e correção de assimetrias." },
      { id: "e18", name: "Desenvolvimento com Halteres", sets: 3, repsMin: 8,  repsMax: 10, muscle: "Ombro", secondary: ["Tríceps","Trapézio"],    tips: "Cotovelos a 90° no início, empurre direto para cima", errors: "Não arquear a lombar para ganhar impulso", description: "Desenvolvimento de ombros com halteres. Trabalha todos os feixes do deltoides." },
      { id: "e19", name: "Elevação Lateral Cabo",        sets: 3, repsMin: 12, repsMax: 15, muscle: "Ombro", secondary: [],                       tips: "Tensão constante no cabo, movimento lento e controlado", errors: "Não levantar o ombro junto com o braço", description: "Elevação lateral no cabo para deltoides medial. O cabo mantém tensão constante ao longo do movimento." },
      { id: "e20", name: "Pullover",                     sets: 3, repsMin: 12, repsMax: 15, muscle: "Costas", secondary: ["Peito","Tríceps"],      tips: "Braços semiflexionados, arco amplo e controlado", errors: "Não dobrar demais os cotovelos durante o movimento", description: "Pullover com halter no banco. Excelente para expandir a caixa torácica e trabalhar o serrátil." },
    ],
  },
  {
    id: 5,
    name: "Treino 5 – Cardio Inteligente",
    shortName: "Treino 5",
    tag: "Cardio",
    cardio: "Spinning 40min / Corrida 3-5km / Escada",
    exercises: [
      { id: "e21", name: "Spinning",                     sets: 1, repsMin: 40, repsMax: 40, muscle: "Cardio", secondary: ["Pernas"],              tips: "Mantenha cadência constante entre 80-100 RPM", errors: "Não pedalar com os joelhos para dentro", description: "Ciclismo indoor de alta intensidade. Ótimo para condicionamento cardiovascular com baixo impacto." },
      { id: "e22", name: "Corrida",                      sets: 1, repsMin: 3,  repsMax: 5,  muscle: "Cardio", secondary: ["Pernas","Core"],        tips: "Passada natural, aterrise com o meio do pé, respire pelo nariz", errors: "Não inclinar excessivamente para frente", description: "Corrida em esteira ou ao ar livre (distância em km). Cardio clássico para queima calórica." },
      { id: "e23", name: "Escada + Caminhada Inclinada", sets: 1, repsMin: 20, repsMax: 30, muscle: "Cardio", secondary: ["Pernas","Glúteos"],     tips: "Mantenha postura ereta, use o calcanhar ao subir", errors: "Não se apoiar no corrimão para facilitar", description: "Subida de escadas seguida de caminhada inclinada (duração em minutos). Alta queima calórica." },
    ],
  },
];

const MUSCLE_GROUPS = {
  "Costas": ["e1","e2","e3","e4","e11","e12","e13","e16","e17","e20"],
  "Pernas": ["e6","e7","e8","e9","e10"],
  "Ombro":  ["e5","e14","e15","e18","e19"],
  "Cardio": ["e21","e22","e23"],
};

const MOTIVATIONAL_PHRASES = [
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
  { emoji: "😴", label: "Descansando",     minStreak: 0,  color: "#64748b" },
  { emoji: "🙂", label: "Regular",          minStreak: 2,  color: "#3b82f6" },
  { emoji: "💪", label: "Bom desempenho",  minStreak: 5,  color: "#10b981" },
  { emoji: "🔥", label: "Em chamas!",       minStreak: 10, color: "#f59e0b" },
  { emoji: "🏆", label: "Campeão!",         minStreak: 20, color: "#8b5cf6" },
];

// ─── HELPERS ───────────────────────────────────────────────────────────────────
const ld = (k, d) => { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } };
const sv = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const today = () => new Date().toISOString().split("T")[0];
const fmt = (d) => new Date(d + "T00:00:00").toLocaleDateString("pt-BR");
const daysInMonth = (y, m) => new Date(y, m + 1, 0).getDate();
const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;

function calcStreak(log) {
  const dates = Object.keys(log).sort().reverse();
  if (!dates.length) return 0;
  let streak = 0, cur = new Date();
  for (const d of dates) {
    const diff = Math.round((cur - new Date(d + "T00:00:00")) / 86400000);
    if (diff <= 1) { streak++; cur = new Date(d + "T00:00:00"); } else break;
  }
  return streak;
}
function getAvatar(streak) {
  let s = AVATAR_STATES[0];
  for (const a of AVATAR_STATES) { if (streak >= a.minStreak) s = a; }
  return s;
}
function beep() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    for (let i = 0; i < 3; i++) {
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = 880;
      g.gain.setValueAtTime(0.3, ctx.currentTime + i * 0.35);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.35 + 0.25);
      o.start(ctx.currentTime + i * 0.35);
      o.stop(ctx.currentTime + i * 0.35 + 0.25);
    }
  } catch {}
}

// ─── COMPONENTES BASE ──────────────────────────────────────────────────────────
function Modal({ children, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.8)" }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
        style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}
        onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ─── TIMER DE DESCANSO ─────────────────────────────────────────────────────────
function RestTimer({ onClose }) {
  const [secs, setSecs] = useState(60);
  const [total, setTotal] = useState(60);
  const [running, setRunning] = useState(false);
  const ref = useRef(null);

  const start = (s) => { clearTimeout(ref.current); setTotal(s); setSecs(s); setRunning(true); };

  useEffect(() => {
    if (running && secs > 0) ref.current = setTimeout(() => setSecs(s => s - 1), 1000);
    else if (running && secs === 0) { setRunning(false); beep(); }
    return () => clearTimeout(ref.current);
  }, [running, secs]);

  const r = 54, circ = 2 * Math.PI * r, pct = total > 0 ? (secs / total) : 1;

  return (
    <Modal onClose={onClose}>
      <div className="p-6 text-center">
        <h3 className="text-white font-bold text-lg mb-4">⏱ Descanso</h3>
        <div className="relative mx-auto mb-5" style={{ width: 140, height: 140 }}>
          <svg width="140" height="140" style={{ transform: "rotate(-90deg)" }}>
            <circle cx="70" cy="70" r={r} fill="none" stroke="#2d2d4e" strokeWidth="8" />
            <circle cx="70" cy="70" r={r} fill="none"
              stroke={secs === 0 ? "#10b981" : "#6366f1"} strokeWidth="8"
              strokeDasharray={circ}
              strokeDashoffset={circ * (1 - pct)}
              strokeLinecap="round"
              style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white text-4xl font-bold tabular-nums">{secs}</span>
          </div>
        </div>
        {secs === 0 && <p className="text-green-400 font-bold mb-3">✓ Descansou! Bora!</p>}
        <div className="grid grid-cols-5 gap-2 mb-4">
          {[30,45,60,90,120].map(s => (
            <button key={s} onClick={() => start(s)}
              className="py-2 rounded-xl text-sm font-semibold"
              style={{ background: total === s && running ? "#6366f1" : "#2d2d4e", color: "white" }}>
              {s}s
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <button onClick={() => setRunning(r => !r)}
            className="flex-1 py-3 rounded-xl font-bold text-white"
            style={{ background: "#6366f1" }}>
            {running ? "Pausar" : "Iniciar"}
          </button>
          <button onClick={onClose} className="flex-1 py-3 rounded-xl font-bold"
            style={{ background: "#2d2d4e", color: "#94a3b8" }}>
            Fechar
          </button>
        </div>
      </div>
    </Modal>
  );
}

// ─── MODAL DE EXECUÇÃO DO EXERCÍCIO ────────────────────────────────────────────
function ExerciseInfoModal({ exercise, onClose, onUploadImage, customImages }) {
  const [tab, setTab] = useState("video");
  const fileRef = useRef();
  const videoUrl = EXERCISE_VIDEOS[exercise.name];
  const customImg = customImages?.[exercise.id];

  return (
    <Modal onClose={onClose}>
      <div className="p-5">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="text-xs font-semibold mb-0.5" style={{ color: "#6366f1" }}>{exercise.muscle}</div>
            <h3 className="text-white font-bold text-lg">{exercise.name}</h3>
          </div>
          <button onClick={onClose} className="text-2xl leading-none" style={{ color: "#64748b" }}>×</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          {["video","info","erros"].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className="flex-1 py-1.5 rounded-xl text-xs font-semibold capitalize"
              style={{ background: tab === t ? "#6366f1" : "#2d2d4e", color: tab === t ? "white" : "#64748b" }}>
              {t === "video" ? "📹 Vídeo" : t === "info" ? "📋 Execução" : "⚠️ Erros"}
            </button>
          ))}
        </div>

        {tab === "video" && (
          <div>
            {customImg ? (
              <div className="rounded-xl overflow-hidden mb-3">
                <img src={customImg} alt={exercise.name} className="w-full object-cover" style={{ maxHeight: 220 }} />
              </div>
            ) : videoUrl ? (
              <div className="rounded-xl overflow-hidden mb-3" style={{ aspectRatio: "16/9" }}>
                <iframe
                  src={`${videoUrl}?rel=0&modestbranding=1`}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={exercise.name}
                  style={{ border: "none" }}
                />
              </div>
            ) : (
              <div className="rounded-xl flex items-center justify-center mb-3"
                style={{ background: "#0f172a", height: 160 }}>
                <span style={{ color: "#64748b" }}>Vídeo não disponível</span>
              </div>
            )}
            <p className="text-sm mb-3" style={{ color: "#94a3b8" }}>{exercise.description}</p>
            <button onClick={() => fileRef.current?.click()}
              className="w-full py-2 rounded-xl text-sm font-semibold"
              style={{ background: "#2d2d4e", color: "#94a3b8" }}>
              📸 Adicionar minha foto/vídeo
            </button>
            <input ref={fileRef} type="file" accept="image/*,video/*" className="hidden"
              onChange={e => {
                const f = e.target.files?.[0];
                if (!f) return;
                const r = new FileReader();
                r.onload = ev => onUploadImage(exercise.id, ev.target.result);
                r.readAsDataURL(f);
              }} />
          </div>
        )}

        {tab === "info" && (
          <div className="space-y-3">
            <div className="rounded-xl p-3" style={{ background: "#0f172a" }}>
              <div className="text-xs font-semibold mb-1" style={{ color: "#6366f1" }}>💡 Dicas de execução</div>
              <p className="text-sm" style={{ color: "#e2e8f0" }}>{exercise.tips}</p>
            </div>
            <div className="rounded-xl p-3" style={{ background: "#0f172a" }}>
              <div className="text-xs font-semibold mb-1" style={{ color: "#10b981" }}>🎯 Músculo principal</div>
              <p className="text-sm text-white">{exercise.muscle}</p>
            </div>
            {exercise.secondary?.length > 0 && (
              <div className="rounded-xl p-3" style={{ background: "#0f172a" }}>
                <div className="text-xs font-semibold mb-1" style={{ color: "#8b5cf6" }}>🔗 Músculos secundários</div>
                <p className="text-sm text-white">{exercise.secondary.join(", ")}</p>
              </div>
            )}
          </div>
        )}

        {tab === "erros" && (
          <div className="rounded-xl p-4" style={{ background: "#1f0f0f", border: "1px solid #ef444440" }}>
            <div className="text-xs font-semibold mb-2" style={{ color: "#ef4444" }}>⚠️ Erros comuns</div>
            <p className="text-sm" style={{ color: "#fca5a5" }}>{exercise.errors}</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── GRÁFICO DE PROGRESSO ─────────────────────────────────────────────────────
function ProgressChart({ data, label = "kg", color = "#6366f1" }) {
  if (!data || data.length < 2)
    return <div className="text-center py-6 text-sm" style={{ color: "#64748b" }}>Registre ao menos 2 sessões para ver o gráfico</div>;

  const vals = data.map(d => d.value);
  const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
  const W = 300, H = 80, pad = 12;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((d.value - min) / range) * (H - pad * 2);
    return [x, y];
  });
  const polyline = pts.map(p => p.join(",")).join(" ");
  const area = `M${pts[0][0]},${H} ` + pts.map(p => `L${p[0]},${p[1]}`).join(" ") + ` L${pts[pts.length-1][0]},${H} Z`;

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="80">
        <defs>
          <linearGradient id={`grad_${color.slice(1)}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill={`url(#grad_${color.slice(1)})`} />
        <polyline points={polyline} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r="3.5" fill={color} stroke="#0f0f1a" strokeWidth="1.5" />)}
      </svg>
      <div className="flex justify-between mt-1">
        {data.slice(-Math.min(data.length, 4)).map((d, i) => (
          <div key={i} className="text-center">
            <div className="text-xs font-bold" style={{ color }}>{d.value}{label}</div>
            <div className="text-xs" style={{ color: "#64748b" }}>{d.date.slice(5)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── CALENDÁRIO ───────────────────────────────────────────────────────────────
function CalendarView({ log, onDayClick }) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const days = daysInMonth(year, month);
  const firstDay = new Date(year, month, 1).getDay();
  const monthStr = new Date(year, month).toLocaleString("pt-BR", { month: "long", year: "numeric" });

  const getStatus = (d) => {
    const s = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
    const e = log[s];
    if (!e) return null;
    return e.isCardio ? "cardio" : "done";
  };

  const prev = () => month === 0 ? (setMonth(11), setYear(y => y-1)) : setMonth(m => m-1);
  const next = () => month === 11 ? (setMonth(0), setYear(y => y+1)) : setMonth(m => m+1);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <button onClick={prev} className="p-2 rounded-xl" style={{ background: "#2d2d4e", color: "white" }}>‹</button>
        <span className="font-bold capitalize text-white text-sm">{monthStr}</span>
        <button onClick={next} className="p-2 rounded-xl" style={{ background: "#2d2d4e", color: "white" }}>›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 mb-2">
        {["D","S","T","Q","Q","S","S"].map((d,i) => (
          <div key={i} className="text-center text-xs font-semibold" style={{ color: "#64748b" }}>{d}</div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {Array(firstDay).fill(null).map((_,i) => <div key={"e"+i} />)}
        {Array(days).fill(null).map((_,i) => {
          const d = i + 1;
          const status = getStatus(d);
          const isToday = d === now.getDate() && month === now.getMonth() && year === now.getFullYear();
          const dateStr = `${year}-${String(month+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;
          return (
            <button key={d} onClick={() => onDayClick(dateStr, log[dateStr])}
              className="aspect-square rounded-xl flex items-center justify-center text-sm font-semibold"
              style={{
                background: status === "done" ? "#10b981" : status === "cardio" ? "#f59e0b" : isToday ? "#2d2d4e" : "transparent",
                color: status ? "white" : isToday ? "white" : "#94a3b8",
                border: isToday && !status ? "2px solid #6366f1" : "2px solid transparent",
              }}>
              {d}
            </button>
          );
        })}
      </div>
      <div className="flex gap-4 mt-4 justify-center">
        {[["#10b981","Treino"],["#f59e0b","Cardio"],["#2d2d4e","Hoje"]].map(([c,l]) => (
          <div key={l} className="flex items-center gap-1.5 text-xs" style={{ color: "#94a3b8" }}>
            <div className="w-3 h-3 rounded-sm" style={{ background: c }} />{l}
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── TREINO ATIVO ─────────────────────────────────────────────────────────────
// Exercícios em QUALQUER ordem. Cada série tem reps + carga individual.
function ActiveWorkout({ workout, history, customImages, onFinish, onBack, onUploadImage }) {
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef(Date.now());
  const [showRest, setShowRest] = useState(false);
  const [infoEx, setInfoEx] = useState(null);

  // Estado por exercício: { [exerciseId]: { done: bool, sets: [{reps,load,done}] } }
  const initState = () => {
    const s = {};
    for (const ex of workout.exercises) {
      s[ex.id] = {
        done: false,
        sets: Array.from({ length: ex.sets }, () => {
          const prev = (history[ex.id] || []).slice(-1)[0];
          return { reps: prev?.reps || ex.repsMin, load: prev?.load || 0, done: false };
        }),
      };
    }
    return s;
  };
  const [exState, setExState] = useState(initState);
  const [activeEx, setActiveEx] = useState(workout.exercises[0]?.id || null);

  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startRef.current) / 1000)), 1000);
    return () => clearInterval(t);
  }, []);

  const totalSets = workout.exercises.reduce((a, ex) => a + ex.sets, 0);
  const doneSets  = Object.values(exState).reduce((a, s) => a + s.sets.filter(s => s.done).length, 0);
  const progress  = totalSets > 0 ? doneSets / totalSets : 0;
  const allDone   = workout.exercises.every(ex => exState[ex.id]?.done);

  const updateSet = (exId, setIdx, field, val) => {
    setExState(prev => {
      const sets = prev[exId].sets.map((s, i) => i === setIdx ? { ...s, [field]: val } : s);
      return { ...prev, [exId]: { ...prev[exId], sets } };
    });
  };

  const markSetDone = (exId, setIdx) => {
    setExState(prev => {
      const sets = prev[exId].sets.map((s, i) => i === setIdx ? { ...s, done: true } : s);
      const allSets = sets.every(s => s.done);
      return { ...prev, [exId]: { sets, done: allSets } };
    });
    setShowRest(true);
  };

  const handleFinish = () => {
    const completed = [];
    for (const ex of workout.exercises) {
      const st = exState[ex.id];
      for (const s of st.sets.filter(s => s.done)) {
        completed.push({ exercise: ex, entry: { load: s.load, reps: s.reps, obs: "" } });
      }
    }
    onFinish(completed, elapsed);
  };

  const curEx = workout.exercises.find(e => e.id === activeEx);
  const curState = activeEx ? exState[activeEx] : null;

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0f0f1a" }}>
      {showRest && <RestTimer onClose={() => setShowRest(false)} />}
      {infoEx && (
        <ExerciseInfoModal exercise={infoEx} onClose={() => setInfoEx(null)}
          onUploadImage={(id, data) => { onUploadImage(id, data); setInfoEx(null); }}
          customImages={customImages} />
      )}

      {/* HEADER */}
      <div className="px-4 pt-6 pb-3 sticky top-0 z-10" style={{ background: "#0f0f1a", borderBottom: "1px solid #1a1a2e" }}>
        <div className="flex items-center justify-between mb-3">
          <button onClick={onBack} className="text-sm px-3 py-1.5 rounded-xl" style={{ color: "#94a3b8", background: "#1a1a2e" }}>← Sair</button>
          <div className="text-center">
            <div className="text-2xl font-bold tabular-nums" style={{ color: "#6366f1" }}>{fmtTime(elapsed)}</div>
            <div className="text-xs" style={{ color: "#64748b" }}>tempo de treino</div>
          </div>
          <button onClick={() => setShowRest(true)} className="text-sm px-3 py-1.5 rounded-xl" style={{ color: "#94a3b8", background: "#1a1a2e" }}>⏱ Rest</button>
        </div>
        <div className="h-1.5 rounded-full" style={{ background: "#2d2d4e" }}>
          <div className="h-1.5 rounded-full transition-all duration-500"
            style={{ width: `${progress * 100}%`, background: "linear-gradient(90deg,#6366f1,#10b981)" }} />
        </div>
        <div className="text-xs mt-1 text-right" style={{ color: "#64748b" }}>{doneSets}/{totalSets} séries</div>
      </div>

      {/* LISTA DE EXERCÍCIOS — escolha livre */}
      <div className="px-4 pt-3 pb-4 flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
        {workout.exercises.map(ex => {
          const st = exState[ex.id];
          const doneCount = st.sets.filter(s => s.done).length;
          const isActive = activeEx === ex.id;
          const isDone = st.done;
          return (
            <button key={ex.id} onClick={() => setActiveEx(ex.id)}
              className="flex-shrink-0 px-3 py-2 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: isDone ? "#10b981" : isActive ? "#6366f1" : "#1a1a2e",
                color: isDone || isActive ? "white" : "#94a3b8",
                border: isActive && !isDone ? "2px solid #6366f1" : "2px solid transparent",
                minWidth: 100,
              }}>
              <div className="truncate max-w-[90px]">{ex.name}</div>
              <div className="mt-0.5 opacity-70">{doneCount}/{ex.sets} séries</div>
            </button>
          );
        })}
      </div>

      {/* EXERCÍCIO ATIVO */}
      {curEx && curState && (
        <div className="px-4 flex-1">
          <div className="rounded-2xl p-5 mb-4" style={{ background: "#1a1a2e", border: "1px solid #6366f1" }}>
            <div className="flex items-start justify-between mb-1">
              <div>
                <div className="text-xs font-semibold" style={{ color: "#8b5cf6" }}>{curEx.muscle}</div>
                <h2 className="text-xl font-bold text-white">{curEx.name}</h2>
                <div className="text-xs" style={{ color: "#64748b" }}>{curEx.sets} séries · {curEx.repsMin}–{curEx.repsMax} reps</div>
              </div>
              <button onClick={() => setInfoEx(curEx)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold"
                style={{ background: "#2d2d4e", color: "#94a3b8" }}>
                📹 Ver
              </button>
            </div>

            {/* SÉRIES */}
            <div className="mt-4 space-y-3">
              {curState.sets.map((set, idx) => (
                <div key={idx} className={`rounded-xl p-3 transition-all`}
                  style={{
                    background: set.done ? "rgba(16,185,129,0.1)" : "#0f172a",
                    border: set.done ? "1px solid #10b981" : "1px solid #2d2d4e",
                    opacity: set.done ? 0.7 : 1,
                  }}>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold"
                      style={{ background: set.done ? "#10b981" : "#2d2d4e", color: "white" }}>
                      {set.done ? "✓" : idx + 1}
                    </div>
                    <span className="text-sm font-semibold text-white">Série {idx + 1}</span>
                    {!set.done && idx > 0 && curState.sets[idx-1]?.done && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#6366f1", color: "white" }}>Atual</span>
                    )}
                    {!set.done && idx === 0 && (
                      <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: "#6366f1", color: "white" }}>Atual</span>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Carga (kg)</label>
                      <input
                        type="number"
                        value={set.load}
                        disabled={set.done}
                        onChange={e => updateSet(curEx.id, idx, "load", parseFloat(e.target.value) || 0)}
                        className="w-full px-3 py-2.5 rounded-xl text-white font-bold text-center text-lg"
                        style={{ background: set.done ? "#1a1a2e" : "#1a1a2e", border: "1px solid #2d2d4e" }} />
                    </div>
                    <div>
                      <label className="text-xs mb-1 block" style={{ color: "#64748b" }}>Reps</label>
                      <input
                        type="number"
                        value={set.reps}
                        disabled={set.done}
                        onChange={e => updateSet(curEx.id, idx, "reps", parseInt(e.target.value) || 0)}
                        className="w-full px-3 py-2.5 rounded-xl text-white font-bold text-center text-lg"
                        style={{ background: set.done ? "#1a1a2e" : "#1a1a2e", border: "1px solid #2d2d4e" }} />
                    </div>
                  </div>
                  {!set.done && (
                    <button onClick={() => markSetDone(curEx.id, idx)}
                      className="w-full py-3 rounded-xl font-bold text-white active:scale-95 transition-transform"
                      style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)", boxShadow: "0 0 20px rgba(99,102,241,0.3)" }}>
                      ✓ Concluir Série {idx + 1}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* BOTÃO FINALIZAR */}
      {allDone && (
        <div className="px-4 pb-8 pt-2">
          <button onClick={handleFinish}
            className="w-full py-5 rounded-2xl font-bold text-white text-xl active:scale-95 transition-transform"
            style={{ background: "linear-gradient(135deg,#10b981,#059669)", boxShadow: "0 0 30px rgba(16,185,129,0.4)" }}>
            🏆 FINALIZAR TREINO
          </button>
        </div>
      )}
    </div>
  );
}

// ─── APP PRINCIPAL ────────────────────────────────────────────────────────────
export default function FitnessApp() {
  const [tab, setTab]         = useState("home");
  const [history, setHistory] = useState(() => ld("history", {}));
  const [log, setLog]         = useState(() => ld("log", {}));
  const [weight, setWeight]   = useState(() => ld("weight", []));
  const [weightGoal, setWeightGoal] = useState(() => ld("weightGoal", 80));
  const [customImages, setCustomImages] = useState(() => ld("customImages", {}));
  const [activeWorkout, setActiveWorkout] = useState(null);
  const [dayDetail, setDayDetail] = useState(null);
  const [weightInput, setWeightInput] = useState("");
  const [goalInput, setGoalInput]   = useState(() => ld("weightGoal", 80).toString());
  const [infoEx, setInfoEx] = useState(null);
  const phraseIdx = Math.floor(Date.now() / 86400000) % MOTIVATIONAL_PHRASES.length;

  const streak = calcStreak(log);
  const avatar = getAvatar(streak);

  const thisMonth = today().slice(0, 7);
  const trainingsThisMonth = Object.keys(log).filter(d => d.startsWith(thisMonth)).length;
  const weekDays = Array.from({length: 7}, (_,i) => { const d = new Date(); d.setDate(d.getDate()-i); return d.toISOString().split("T")[0]; });
  const weekTrainings = weekDays.filter(d => log[d]).length;
  const weekMinutes   = weekDays.reduce((a,d) => a + (log[d]?.duration || 0), 0);
  const curWeight = weight.length > 0 ? weight[weight.length-1].value : null;

  const prs = (() => {
    const r = {};
    for (const [id, entries] of Object.entries(history)) {
      if (!entries.length) continue;
      const max = Math.max(...entries.map(e => e.load));
      const ex = WORKOUTS.flatMap(w => w.exercises).find(e => e.id === id);
      if (ex && max > 0) r[ex.name] = max;
    }
    return r;
  })();

  const bestExercise = (() => {
    let best = null, bestGain = 0;
    for (const [id, entries] of Object.entries(history)) {
      if (entries.length < 2) continue;
      const gain = entries[entries.length-1].load - entries[0].load;
      if (gain > bestGain) { bestGain = gain; best = { id, gain }; }
    }
    if (!best) return null;
    const ex = WORKOUTS.flatMap(w => w.exercises).find(e => e.id === best.id);
    return ex ? `${ex.name} (+${best.gain}kg)` : null;
  })();

  const saveHistory = h => { setHistory(h); sv("history", h); };
  const saveLog     = l => { setLog(l);     sv("log", l); };
  const saveWeight  = w => { setWeight(w);  sv("weight", w); };
  const saveImages  = imgs => { setCustomImages(imgs); sv("customImages", imgs); };

  const handleUploadImage = (exId, data) => saveImages({ ...customImages, [exId]: data });

  const handleWorkoutFinish = (completedExercises, duration) => {
    const newHistory = { ...history };
    const dateStr = today();
    for (const { exercise, entry } of completedExercises) {
      if (!newHistory[exercise.id]) newHistory[exercise.id] = [];
      newHistory[exercise.id].push({ date: dateStr, ...entry, volume: entry.reps * entry.load });
    }
    saveHistory(newHistory);
    const newLog = { ...log, [dateStr]: {
      workoutId: activeWorkout.id,
      name: activeWorkout.shortName,
      exercises: completedExercises.map(({exercise,entry}) => ({ name: exercise.name, ...entry })),
      duration: Math.floor(duration / 60),
      isCardio: activeWorkout.tag === "Cardio",
    }};
    saveLog(newLog);
    setActiveWorkout(null);
    setTab("home");
  };

  if (activeWorkout) {
    return <ActiveWorkout workout={activeWorkout} history={history}
      customImages={customImages} onUploadImage={handleUploadImage}
      onFinish={handleWorkoutFinish} onBack={() => setActiveWorkout(null)} />;
  }

  const TABS = [
    { id: "home",     icon: "🏠", label: "Início" },
    { id: "workouts", icon: "💪", label: "Treinos" },
    { id: "calendar", icon: "📅", label: "Calendário" },
    { id: "progress", icon: "📈", label: "Evolução" },
    { id: "body",     icon: "⚖️", label: "Corpo" },
  ];

  return (
    <div className="min-h-screen pb-24" style={{ background: "#0f0f1a", fontFamily: "'Inter',sans-serif", color: "white" }}>

      {/* Modais globais */}
      {dayDetail && (
        <Modal onClose={() => setDayDetail(null)}>
          <div className="p-5">
            <h3 className="font-bold text-lg text-white mb-1">{fmt(dayDetail.date)}</h3>
            <div className="text-sm mb-3" style={{ color: "#6366f1" }}>{dayDetail.data?.name || "Sem registro"}</div>
            {dayDetail.data?.exercises?.map((ex,i) => (
              <div key={i} className="flex justify-between py-2 border-b" style={{ borderColor: "#2d2d4e" }}>
                <span className="text-sm text-white">{ex.name}</span>
                <span className="text-sm" style={{ color: "#94a3b8" }}>{ex.load}kg × {ex.reps}</span>
              </div>
            ))}
            {dayDetail.data?.duration && <div className="mt-3 text-sm" style={{ color: "#64748b" }}>⏱ {dayDetail.data.duration} min</div>}
            <button onClick={() => setDayDetail(null)} className="w-full mt-4 py-3 rounded-xl font-bold"
              style={{ background: "#2d2d4e", color: "#94a3b8" }}>Fechar</button>
          </div>
        </Modal>
      )}

      {infoEx && (
        <ExerciseInfoModal exercise={infoEx} onClose={() => setInfoEx(null)}
          onUploadImage={handleUploadImage} customImages={customImages} />
      )}

      {/* ─── HOME ─────────────────────────────────────────────────────────── */}
      {tab === "home" && (
        <div>
          <div className="px-4 pt-8 pb-6" style={{ background: "linear-gradient(180deg,#1a0a2e,#0f0f1a)" }}>
            <div className="flex items-center justify-between mb-5">
              <div>
                <div className="text-sm mb-1" style={{ color: "#64748b" }}>Bem-vindo de volta</div>
                <h1 className="text-2xl font-bold text-white">Atleta 🏋️</h1>
              </div>
              <div className="text-center">
                <div className="text-5xl mb-1">{avatar.emoji}</div>
                <div className="text-xs font-semibold" style={{ color: avatar.color }}>{avatar.label}</div>
              </div>
            </div>

            <div className="rounded-2xl p-4 mb-5" style={{ background: "rgba(99,102,241,0.1)", border: "1px solid rgba(99,102,241,0.25)" }}>
              <p className="text-sm italic leading-relaxed" style={{ color: "#c4b5fd" }}>
                "{MOTIVATIONAL_PHRASES[phraseIdx]}"
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-3">
              {[
                { label: "Treinos este mês", value: trainingsThisMonth, unit: "", icon: "🏋️", color: "#6366f1" },
                { label: "Dias seguidos",    value: streak,             unit: " dias", icon: "🔥", color: "#f59e0b" },
                { label: "Treinos na semana",value: weekTrainings,      unit: "/7",    icon: "📅", color: "#10b981" },
                { label: "Tempo na semana",  value: weekMinutes,        unit: " min",  icon: "⏱", color: "#8b5cf6" },
              ].map((s,i) => (
                <div key={i} className="rounded-2xl p-4" style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}>
                  <div className="text-xl mb-1">{s.icon}</div>
                  <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}{s.unit}</div>
                  <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {(curWeight || bestExercise) && (
              <div className="grid grid-cols-2 gap-3">
                {curWeight && (
                  <div className="rounded-2xl p-4" style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}>
                    <div className="text-xl mb-1">⚖️</div>
                    <div className="text-2xl font-bold" style={{ color: "#6366f1" }}>{curWeight}kg</div>
                    <div className="text-xs" style={{ color: "#64748b" }}>
                      {weightGoal ? `Meta: ${weightGoal}kg` : "Peso atual"}
                    </div>
                  </div>
                )}
                {bestExercise && (
                  <div className="rounded-2xl p-4" style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}>
                    <div className="text-xl mb-1">🚀</div>
                    <div className="text-sm font-bold leading-tight" style={{ color: "#f59e0b" }}>{bestExercise}</div>
                    <div className="text-xs mt-1" style={{ color: "#64748b" }}>Maior evolução</div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="px-4">
            <h2 className="text-lg font-bold text-white mb-3">Iniciar Treino</h2>
            <div className="space-y-2">
              {WORKOUTS.map(w => (
                <button key={w.id} onClick={() => setActiveWorkout(w)}
                  className="w-full flex items-center justify-between px-4 py-4 rounded-2xl active:scale-95 transition-transform"
                  style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}>
                  <div className="text-left">
                    <div className="text-xs font-semibold mb-0.5" style={{ color: "#6366f1" }}>{w.shortName}</div>
                    <div className="font-semibold text-white text-sm">{w.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                      {w.exercises.length} exercícios · {w.cardio}
                    </div>
                  </div>
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
                    style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>▶</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ─── TREINOS ──────────────────────────────────────────────────────── */}
      {tab === "workouts" && (
        <div className="px-4 pt-6">
          <h2 className="text-2xl font-bold text-white mb-4">Fichas de Treino</h2>
          {WORKOUTS.map(w => (
            <div key={w.id} className="rounded-2xl mb-5" style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}>
              <div className="p-4 border-b" style={{ borderColor: "#2d2d4e" }}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs font-semibold mb-0.5" style={{ color: "#6366f1" }}>{w.shortName} · {w.tag}</div>
                    <div className="font-bold text-white">{w.name}</div>
                    <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>Cardio: {w.cardio}</div>
                  </div>
                </div>
              </div>
              {w.exercises.map(ex => {
                const exHist = history[ex.id] || [];
                const lastLoad = exHist.slice(-1)[0]?.load;
                const pr = exHist.length > 0 ? Math.max(...exHist.map(e => e.load)) : 0;
                return (
                  <div key={ex.id} className="border-b" style={{ borderColor: "#2d2d4e" }}>
                    <div className="px-4 py-3 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="text-sm font-semibold text-white">{ex.name}</div>
                        <div className="text-xs mt-0.5" style={{ color: "#64748b" }}>
                          {ex.sets}×{ex.repsMin}-{ex.repsMax} · {ex.muscle}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="text-right">
                          {lastLoad > 0 && <div className="text-sm font-bold" style={{ color: "#6366f1" }}>{lastLoad}kg</div>}
                          {pr > 0 && <div className="text-xs" style={{ color: "#f59e0b" }}>🏆 {pr}kg</div>}
                        </div>
                        <button onClick={() => setInfoEx(ex)}
                          className="px-3 py-1.5 rounded-xl text-xs"
                          style={{ background: "#2d2d4e", color: "#94a3b8" }}>
                          📹
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
              <div className="p-3">
                <button onClick={() => setActiveWorkout(w)}
                  className="w-full py-3 rounded-xl font-bold text-white active:scale-95 transition-transform"
                  style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>
                  ▶ Iniciar {w.shortName}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ─── CALENDÁRIO ───────────────────────────────────────────────────── */}
      {tab === "calendar" && (
        <div className="px-4 pt-6">
          <h2 className="text-2xl font-bold text-white mb-4">Calendário</h2>
          <div className="rounded-2xl p-4 mb-4" style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}>
            <CalendarView log={log} onDayClick={(date, data) => setDayDetail({ date, data })} />
          </div>
          <h3 className="text-lg font-bold text-white mb-3">Histórico Recente</h3>
          {Object.entries(log).sort(([a],[b]) => b.localeCompare(a)).slice(0, 10).map(([date, entry]) => (
            <div key={date} className="flex items-center justify-between px-4 py-3 rounded-2xl mb-2"
              style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}>
              <div>
                <div className="text-sm font-semibold text-white">{entry.name}</div>
                <div className="text-xs" style={{ color: "#64748b" }}>{fmt(date)}</div>
              </div>
              <div className="text-right">
                {entry.duration != null && <div className="text-sm" style={{ color: "#6366f1" }}>{entry.duration} min</div>}
                <div className="text-xs" style={{ color: "#10b981" }}>✓ {entry.exercises?.length || 0} séries</div>
              </div>
            </div>
          ))}
          {!Object.keys(log).length && (
            <div className="text-center py-10" style={{ color: "#64748b" }}>
              <div className="text-5xl mb-3">📅</div>
              <div>Nenhum treino registrado ainda</div>
            </div>
          )}
        </div>
      )}

      {/* ─── EVOLUÇÃO ─────────────────────────────────────────────────────── */}
      {tab === "progress" && (
        <div className="px-4 pt-6">
          <h2 className="text-2xl font-bold text-white mb-4">Evolução</h2>

          <div className="rounded-2xl p-4 mb-4" style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}>
            <h3 className="font-bold text-white mb-3">🏆 Recordes Pessoais (PRs)</h3>
            {Object.keys(prs).length === 0
              ? <div className="text-sm" style={{ color: "#64748b" }}>Nenhum PR ainda. Comece a treinar!</div>
              : Object.entries(prs).map(([name, val]) => (
                <div key={name} className="flex items-center justify-between py-2 border-b" style={{ borderColor: "#2d2d4e" }}>
                  <span className="text-sm text-white">{name}</span>
                  <span className="font-bold" style={{ color: "#f59e0b" }}>{val} kg</span>
                </div>
              ))
            }
          </div>

          {WORKOUTS.flatMap(w => w.exercises)
            .filter(ex => (history[ex.id] || []).length >= 2)
            .slice(0, 6)
            .map(ex => {
              const data = (history[ex.id] || []).map(e => ({ date: e.date, value: e.load }));
              const gain = (data[data.length-1]?.value || 0) - (data[0]?.value || 0);
              return (
                <div key={ex.id} className="rounded-2xl p-4 mb-4" style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <div className="text-xs" style={{ color: "#6366f1" }}>{ex.muscle}</div>
                      <div className="font-bold text-white">{ex.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold" style={{ color: gain >= 0 ? "#10b981" : "#ef4444" }}>
                        {gain >= 0 ? "+" : ""}{gain}kg
                      </div>
                      <div className="text-xs" style={{ color: "#64748b" }}>evolução</div>
                    </div>
                  </div>
                  <ProgressChart data={data} label="kg" />
                </div>
              );
            })}

          <div className="rounded-2xl p-4 mb-4" style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}>
            <h3 className="font-bold text-white mb-3">Volume por Músculo</h3>
            {Object.entries(MUSCLE_GROUPS).map(([muscle, ids]) => {
              const vol = ids.reduce((a, id) => a + (history[id] || []).reduce((b, e) => b + (e.volume || 0), 0), 0);
              const maxVol = Math.max(...Object.values(MUSCLE_GROUPS).map(ids2 =>
                ids2.reduce((a, id) => a + (history[id] || []).reduce((b, e) => b + (e.volume || 0), 0), 0)
              ), 1);
              return (
                <div key={muscle} className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-white">{muscle}</span>
                    <span style={{ color: "#6366f1" }}>{vol.toLocaleString()} vol</span>
                  </div>
                  <div className="h-2 rounded-full" style={{ background: "#2d2d4e" }}>
                    <div className="h-2 rounded-full transition-all"
                      style={{ width: `${(vol / maxVol) * 100}%`, background: "linear-gradient(90deg,#6366f1,#8b5cf6)" }} />
                  </div>
                </div>
              );
            })}
          </div>

          {Object.keys(history).length === 0 && (
            <div className="text-center py-12" style={{ color: "#64748b" }}>
              <div className="text-5xl mb-3">📊</div>
              <div>Complete treinos para ver sua evolução</div>
            </div>
          )}
        </div>
      )}

      {/* ─── CORPO ────────────────────────────────────────────────────────── */}
      {tab === "body" && (
        <div className="px-4 pt-6">
          <h2 className="text-2xl font-bold text-white mb-4">Controle Corporal</h2>
          <div className="rounded-2xl p-4 mb-4" style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}>
            <h3 className="font-bold text-white mb-3">Registrar Peso</h3>
            <div className="flex gap-2 mb-3">
              <input value={weightInput} onChange={e => setWeightInput(e.target.value)} type="number"
                className="flex-1 px-4 py-3 rounded-xl text-white font-bold text-center text-xl"
                style={{ background: "#0f172a", border: "1px solid #2d2d4e" }} placeholder="kg" />
              <button onClick={() => {
                if (!weightInput) return;
                const entry = { date: today(), value: parseFloat(weightInput) };
                const newW = [...weight.filter(w => w.date !== today()), entry].sort((a,b) => a.date.localeCompare(b.date));
                saveWeight(newW); setWeightInput("");
              }} className="px-6 py-3 rounded-xl font-bold text-white"
                style={{ background: "linear-gradient(135deg,#6366f1,#8b5cf6)" }}>+</button>
            </div>
            <div className="flex gap-2">
              <input value={goalInput} onChange={e => setGoalInput(e.target.value)} type="number"
                className="flex-1 px-3 py-2 rounded-xl text-white text-center"
                style={{ background: "#0f172a", border: "1px solid #2d2d4e" }} placeholder="Meta (kg)" />
              <button onClick={() => { const g = parseFloat(goalInput); sv("weightGoal", g); setWeightGoal(g); }}
                className="px-4 py-2 rounded-xl text-sm font-bold text-white" style={{ background: "#2d2d4e" }}>
                Salvar meta
              </button>
            </div>
          </div>

          {curWeight && (
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[
                { label: "Atual",  val: `${curWeight}kg`, color: "#6366f1" },
                { label: "Meta",   val: `${weightGoal}kg`, color: "#10b981" },
                { label: curWeight > weightGoal ? "A perder" : "Abaixo!", val: `${Math.abs(curWeight - weightGoal).toFixed(1)}kg`, color: curWeight > weightGoal ? "#ef4444" : "#10b981" },
              ].map((item, i) => (
                <div key={i} className="rounded-2xl p-4 text-center" style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}>
                  <div className="text-xl font-bold" style={{ color: item.color }}>{item.val}</div>
                  <div className="text-xs mt-1" style={{ color: "#64748b" }}>{item.label}</div>
                </div>
              ))}
            </div>
          )}

          {weight.length >= 2 && (
            <div className="rounded-2xl p-4 mb-4" style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}>
              <h3 className="font-bold text-white mb-3">Evolução do Peso</h3>
              <ProgressChart data={weight.map(w => ({ date: w.date, value: w.value }))} label="kg" color="#10b981" />
            </div>
          )}

          <div className="rounded-2xl p-4" style={{ background: "#1a1a2e", border: "1px solid #2d2d4e" }}>
            <h3 className="font-bold text-white mb-3">Histórico de Peso</h3>
            {weight.slice().reverse().slice(0, 10).map((w, i) => (
              <div key={i} className="flex justify-between py-2 border-b" style={{ borderColor: "#2d2d4e" }}>
                <span className="text-sm" style={{ color: "#94a3b8" }}>{fmt(w.date)}</span>
                <span className="font-bold text-white">{w.value} kg</span>
              </div>
            ))}
            {!weight.length && <div className="text-sm" style={{ color: "#64748b" }}>Nenhum registro ainda.</div>}
          </div>
        </div>
      )}

      {/* NAV */}
      <div className="fixed bottom-0 left-0 right-0 flex" style={{ background: "#1a1a2e", borderTop: "1px solid #2d2d4e", paddingBottom: "env(safe-area-inset-bottom)" }}>
        {TABS.map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className="flex-1 py-3 flex flex-col items-center gap-0.5 transition-colors"
            style={{ color: tab === t.id ? "#6366f1" : "#64748b" }}>
            <span className="text-xl">{t.icon}</span>
            <span className="text-xs font-semibold">{t.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
