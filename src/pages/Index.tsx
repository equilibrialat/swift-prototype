import { useMemo, useState } from "react";

// --- Types ---
type Temp = "hot" | "warm" | "cold";
type StageId =
  | "mapeados"
  | "invitacion_por_enviar"
  | "invitacion_enviada"
  | "demo_agendado"
  | "elaborar_propuesta"
  | "propuesta_enviada"
  | "negociacion"
  | "aprobado"
  | "contrato_firmado"
  | "aliados"
  | "complete";

interface Stage {
  id: StageId;
  label: string;
  category: string;
  dot: string; // tailwind bg-* for accent line / dot
  grad: string; // gradient class
  icon: string;
}

interface Client {
  id: string;
  name: string;
  contact: string;
  value: number;
  stage: StageId;
  temp: Temp;
  lastAction: string;
  date: string;
}

// --- Data ---
const STAGES: Stage[] = [
  { id: "mapeados", label: "MAPEADOS", category: "Active", dot: "bg-slate-500", grad: "grad-mapeados", icon: "📍" },
  { id: "invitacion_por_enviar", label: "INVITACIÓN POR ENVIAR", category: "Active", dot: "bg-yellow-500", grad: "grad-invitacion", icon: "✉️" },
  { id: "invitacion_enviada", label: "INVITACIÓN ENVIADA", category: "Active", dot: "bg-yellow-600", grad: "grad-invitacion", icon: "📤" },
  { id: "demo_agendado", label: "DEMO AGENDADO", category: "Active", dot: "bg-orange-500", grad: "grad-demo", icon: "📅" },
  { id: "elaborar_propuesta", label: "ELABORAR PROPUESTA", category: "Active", dot: "bg-orange-600", grad: "grad-propuesta", icon: "📝" },
  { id: "propuesta_enviada", label: "PROPUESTA ENVIADA", category: "Active", dot: "bg-red-500", grad: "grad-propuesta", icon: "🚀" },
  { id: "negociacion", label: "NEGOCIACIÓN", category: "Active", dot: "bg-red-600", grad: "grad-negociacion", icon: "💬" },
  { id: "aprobado", label: "APROBADO", category: "Active", dot: "bg-emerald-500", grad: "grad-aprobado", icon: "👍" },
  { id: "contrato_firmado", label: "CONTRATO FIRMADO", category: "Active", dot: "bg-emerald-600", grad: "grad-aprobado", icon: "✍️" },
  { id: "aliados", label: "ALIADOS", category: "Done", dot: "bg-blue-500", grad: "grad-aliados", icon: "🤝" },
  { id: "complete", label: "COMPLETE", category: "Closed", dot: "bg-purple-500", grad: "grad-complete", icon: "✅" },
];

const MOCK_CLIENTS: Client[] = [
  { id: "c1", name: "TechCorp LATAM", contact: "María González", value: 15000, stage: "mapeados", temp: "cold", lastAction: "Encontrado en LinkedIn", date: "Hace 2 días" },
  { id: "c2", name: "Inversiones Globales", contact: "Carlos Ruiz", value: 45000, stage: "invitacion_por_enviar", temp: "warm", lastAction: "Redactando email", date: "Hoy" },
  { id: "c3", name: "Grupo Retail Sur", contact: "Ana Vega", value: 25000, stage: "demo_agendado", temp: "hot", lastAction: "Demo confirmada", date: "Mañana 10:00 AM" },
  { id: "c4", name: "Fintech Solutions", contact: "Luis Torres", value: 60000, stage: "negociacion", temp: "hot", lastAction: "Revisando descuento", date: "Ayer" },
  { id: "c5", name: "EcoFoods Peru", contact: "Sofia Paz", value: 18000, stage: "contrato_firmado", temp: "hot", lastAction: "Esperando pago 1", date: "Hace 3 días" },
];

// --- Icons ---
const IconPhone = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const IconMail = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="20" height="16" x="2" y="4" rx="2" />
    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
  </svg>
);
const IconMore = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="1" />
    <circle cx="19" cy="12" r="1" />
    <circle cx="5" cy="12" r="1" />
  </svg>
);
const IconNote = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
    <line x1="16" y1="13" x2="8" y2="13" />
    <line x1="16" y1="17" x2="8" y2="17" />
    <polyline points="10 9 9 9 8 9" />
  </svg>
);
const IconClock = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IconPlus = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

// --- Components ---
function ClientCard({ client, onClick }: { client: Client; onClick: (c: Client) => void }) {
  const stage = STAGES.find((s) => s.id === client.stage)!;
  const tempStyle =
    client.temp === "hot"
      ? "text-red-400 bg-red-400/10 border-red-400/20"
      : client.temp === "warm"
        ? "text-yellow-400 bg-yellow-400/10 border-yellow-400/20"
        : "text-blue-400 bg-blue-400/10 border-blue-400/20";
  const tempLabel = client.temp === "hot" ? "🔥 Caliente" : client.temp === "warm" ? "⭐ Tibio" : "❄️ Frío";

  return (
    <div
      onClick={() => onClick(client)}
      className="glass-panel rounded-2xl p-4 mb-4 animate-slide-up relative overflow-hidden cursor-pointer transition-transform active:scale-[0.98]"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${stage.dot}`} />

      <div className="flex justify-between items-start mb-3">
        <div className="min-w-0">
          <h3 className="font-bold text-lg leading-tight text-foreground truncate">{client.name}</h3>
          <p className="text-sm text-muted-foreground truncate">{client.contact}</p>
        </div>
        <button
          className="text-muted-foreground hover:text-foreground p-1 shrink-0"
          onClick={(e) => e.stopPropagation()}
          aria-label="Más opciones"
        >
          <IconMore />
        </button>
      </div>

      <div className="flex justify-between items-center mb-4">
        <span className={`text-xs font-semibold px-2 py-1 rounded-md border ${tempStyle}`}>{tempLabel}</span>
        <span className="font-bold text-primary">${client.value.toLocaleString()}</span>
      </div>

      <div className="bg-background/50 rounded-lg p-2 flex justify-between items-center gap-2">
        <span className="text-xs text-muted-foreground truncate">{client.lastAction}</span>
        <span className="text-[10px] text-muted-foreground/80 whitespace-nowrap flex items-center gap-1">
          <IconClock /> {client.date}
        </span>
      </div>

      <div className="flex gap-2 mt-3 pt-3 border-t border-white/5">
        <button
          className="flex-1 bg-white/5 hover:bg-white/10 text-foreground rounded-lg py-2 flex justify-center items-center gap-2 text-xs font-medium transition"
          onClick={(e) => e.stopPropagation()}
        >
          <IconPhone /> Llamar
        </button>
        <button
          className="flex-1 bg-white/5 hover:bg-white/10 text-foreground rounded-lg py-2 flex justify-center items-center gap-2 text-xs font-medium transition"
          onClick={(e) => e.stopPropagation()}
        >
          <IconMail /> Correo
        </button>
      </div>
    </div>
  );
}

function KanbanColumn({ stage, clients, onCardClick }: { stage: Stage; clients: Client[]; onCardClick: (c: Client) => void }) {
  return (
    <div className="kanban-column pt-4">
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${stage.grad} shadow-lg shadow-black/20 shrink-0`}>
            <span className="text-sm">{stage.icon}</span>
          </div>
          <div className="min-w-0">
            <h2 className="font-bold text-sm tracking-wide text-foreground truncate">{stage.label}</h2>
            <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{stage.category}</p>
          </div>
        </div>
        <span className="text-xs font-bold text-muted-foreground bg-white/5 rounded-full px-2.5 py-1 shrink-0">
          {clients.length}
        </span>
      </div>

      <div className="column-content px-2">
        {clients.length === 0 ? (
          <div className="text-center text-xs text-muted-foreground/70 py-8 border border-dashed border-white/10 rounded-xl">
            Sin clientes en esta etapa
          </div>
        ) : (
          clients.map((c) => <ClientCard key={c.id} client={c} onClick={onCardClick} />)
        )}
      </div>
    </div>
  );
}

const Index = () => {
  const [clients, setClients] = useState<Client[]>(MOCK_CLIENTS);
  const [activeClient, setActiveClient] = useState<Client | null>(null);

  const totalPipeline = useMemo(() => clients.reduce((sum, c) => sum + c.value, 0), [clients]);
  const hotCount = useMemo(() => clients.filter((c) => c.temp === "hot").length, [clients]);
  const todayCount = useMemo(() => clients.filter((c) => c.date.toLowerCase().includes("hoy") || c.date.toLowerCase().includes("mañana")).length, [clients]);
  const signCount = useMemo(() => clients.filter((c) => c.stage === "contrato_firmado" || c.stage === "aprobado").length, [clients]);

  const handleStageChange = (newStage: StageId) => {
    if (!activeClient) return;
    setClients((prev) => prev.map((c) => (c.id === activeClient.id ? { ...c, stage: newStage } : c)));
    setActiveClient({ ...activeClient, stage: newStage });
  };

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-background mx-auto max-w-md sm:max-w-lg md:max-w-xl">
      {/* Header */}
      <header className="pt-12 pb-4 px-6 glass-panel border-b border-white/5 z-10">
        <div className="flex justify-between items-end">
          <div>
            <p className="text-primary text-xs font-bold tracking-widest uppercase mb-1">Pipeline Total</p>
            <h1 className="text-3xl font-extrabold text-foreground tracking-tight">${totalPipeline.toLocaleString()}</h1>
          </div>
          <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-500 border-2 border-background flex items-center justify-center shadow-lg">
            <span className="font-bold text-sm text-white">EQ</span>
          </div>
        </div>

        <div className="flex gap-3 mt-6 overflow-x-auto pb-2 scrollbar-hide">
          <button className="bg-white/10 border border-white/10 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap text-foreground hover:bg-white/20 transition">
            🔥 Calientes ({hotCount})
          </button>
          <button className="bg-white/5 border border-white/5 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground hover:bg-white/10 transition">
            ⚡ Para hoy ({todayCount})
          </button>
          <button className="bg-white/5 border border-white/5 rounded-full px-4 py-1.5 text-sm font-medium whitespace-nowrap text-muted-foreground hover:bg-white/10 transition">
            ✍️ Por firmar ({signCount})
          </button>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 overflow-hidden relative pl-4">
        <div className="kanban-container pt-2">
          {STAGES.map((stage) => (
            <KanbanColumn
              key={stage.id}
              stage={stage}
              clients={clients.filter((c) => c.stage === stage.id)}
              onCardClick={(c) => setActiveClient(c)}
            />
          ))}
        </div>
      </main>

      {/* FAB */}
      <button
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center text-primary-foreground shadow-[0_0_20px_hsl(var(--primary)/0.4)] transition-transform active:scale-90 z-20"
        aria-label="Nuevo cliente"
      >
        <IconPlus />
      </button>

      {/* Bottom Sheet */}
      {activeClient && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveClient(null)}
        >
          <div
            className="w-full max-w-md bg-card rounded-t-3xl border-t border-white/10 p-6 animate-sheet-up"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />

            <div className="flex justify-between items-start mb-6 gap-3">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold text-foreground mb-1 truncate">{activeClient.name}</h2>
                <p className="text-muted-foreground truncate">{activeClient.contact}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xl font-bold text-primary">${activeClient.value.toLocaleString()}</div>
                <div className="text-[10px] font-semibold px-2 py-1 rounded-md bg-white/5 text-foreground mt-1 inline-block">
                  {STAGES.find((s) => s.id === activeClient.stage)?.label}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition">
                <IconPhone />
                <span className="text-xs font-medium">Llamar</span>
              </button>
              <button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition">
                <IconMail />
                <span className="text-xs font-medium">Email</span>
              </button>
              <button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition">
                <IconNote />
                <span className="text-xs font-medium">Nota</span>
              </button>
              <button className="bg-secondary hover:bg-secondary/80 text-secondary-foreground rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition">
                <IconClock />
                <span className="text-xs font-medium">Recordatorio</span>
              </button>
            </div>

            <div className="bg-background/50 rounded-xl p-4 border border-white/5 mb-6">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Mover a etapa</h4>
              <select
                className="w-full bg-input border border-border rounded-lg p-2.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                value={activeClient.stage}
                onChange={(e) => handleStageChange(e.target.value as StageId)}
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={() => setActiveClient(null)}
              className="w-full bg-white/10 hover:bg-white/20 text-foreground rounded-xl py-3 font-bold transition"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
