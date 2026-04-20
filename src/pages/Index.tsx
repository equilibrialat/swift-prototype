import { useMemo, useState, useEffect } from "react";
import logoUrl from "../assets/logo.png";

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
  dot: string;
  grad: string;
  icon: string;
}

interface Client {
  id: string;
  name: string;
  contact: string;
  phone?: string;
  email?: string;
  value: number;
  stage: StageId;
  temp: Temp;
  lastAction: string;
  date: string;
  lastContactDate?: string;
}

// --- Data ---
const STAGES: Stage[] = [
  { id: "mapeados", label: "MAPEADOS", category: "Active", dot: "bg-slate-500", grad: "grad-mapeados", icon: "📍" },
  { id: "invitacion_por_enviar", label: "INVITACIÓN X ENVIAR", category: "Active", dot: "bg-yellow-500", grad: "grad-invitacion", icon: "✉️" },
  { id: "invitacion_enviada", label: "INVITACIÓN ENVIADA", category: "Active", dot: "bg-yellow-600", grad: "grad-invitacion", icon: "📤" },
  { id: "demo_agendado", label: "DEMO AGENDADO", category: "Active", dot: "bg-orange-500", grad: "grad-demo", icon: "📅" },
  { id: "elaborar_propuesta", label: "ELABORAR PROP.", category: "Active", dot: "bg-orange-600", grad: "grad-propuesta", icon: "📝" },
  { id: "propuesta_enviada", label: "PROPUESTA ENVIADA", category: "Active", dot: "bg-red-500", grad: "grad-propuesta", icon: "🚀" },
  { id: "negociacion", label: "NEGOCIACIÓN", category: "Active", dot: "bg-red-600", grad: "grad-negociacion", icon: "💬" },
  { id: "aprobado", label: "APROBADO", category: "Active", dot: "bg-emerald-500", grad: "grad-aprobado", icon: "👍" },
  { id: "contrato_firmado", label: "CONTRATO FIRMADO", category: "Active", dot: "bg-emerald-600", grad: "grad-aprobado", icon: "✍️" },
  { id: "aliados", label: "ALIADOS", category: "Done", dot: "bg-blue-500", grad: "grad-aliados", icon: "🤝" },
  { id: "complete", label: "COMPLETE", category: "Closed", dot: "bg-purple-500", grad: "grad-complete", icon: "✅" },
];

const MOCK_CLIENTS: Client[] = [
  { id: "c1", name: "TechCorp LATAM", contact: "María González", phone: "+51999888777", email: "maria@techcorp.com", value: 15000, stage: "mapeados", temp: "cold", lastAction: "Encontrado en LinkedIn", date: "Hace 8 días", lastContactDate: new Date(Date.now() - 8 * 86400000).toISOString() },
  { id: "c2", name: "Inversiones Globales", contact: "Carlos Ruiz", phone: "+51999666555", email: "cruiz@invglobales.com", value: 45000, stage: "invitacion_por_enviar", temp: "hot", lastAction: "Redactando email", date: "Hoy", lastContactDate: new Date().toISOString() },
  { id: "c3", name: "Grupo Retail Sur", contact: "Ana Vega", phone: "+51999444333", email: "ana.vega@retailsur.com", value: 25000, stage: "demo_agendado", temp: "warm", lastAction: "Demo confirmada", date: "Ayer", lastContactDate: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: "c4", name: "Fintech Solutions", contact: "Luis Torres", phone: "+51999222111", email: "luis@fintechsol.com", value: 60000, stage: "negociacion", temp: "hot", lastAction: "Revisando descuento", date: "Ayer", lastContactDate: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "c5", name: "EcoFoods Peru", contact: "Sofia Paz", phone: "+51999111000", email: "spaz@ecofoods.pe", value: 18000, stage: "contrato_firmado", temp: "hot", lastAction: "Esperando pago 1", date: "Hace 2 días", lastContactDate: new Date(Date.now() - 2 * 86400000).toISOString() },
];

// --- Helper ---
const calculateTemp = (isoDate?: string): Temp => {
  if (!isoDate) return "cold";
  const daysDiff = (Date.now() - new Date(isoDate).getTime()) / (1000 * 60 * 60 * 24);
  if (daysDiff <= 3) return "hot";
  if (daysDiff > 3 && daysDiff <= 7) return "warm"; 
  return "cold";
};

const getGCalLink = (client: Client) => {
  const text = encodeURIComponent(`Llamar a ${client.contact} (${client.name})`);
  const details = encodeURIComponent(`Recordatorio de CRM para ${client.name}.\nTel: ${client.phone || 'N/A'}\nEmail: ${client.email || 'N/A'}`);
  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&details=${details}`;
};

// --- Icons ---
const IconPhone = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" /></svg>;
const IconMail = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>;
const IconNote = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
const IconClock = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconPlus = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" /></svg>;
const IconCalendar = () => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>;
const IconChevronRight = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="m9 18 6-6-6-6"/></svg>;
const IconNoteSmall = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" /></svg>;
const IconClockSmall = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>;
const IconX = ({ className }: { className?: string }) => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>;

// --- Components ---
function ClientCard({ client, onClick, onOpenStageSelect }: { client: Client; onClick: (c: Client) => void, onOpenStageSelect: (c: Client) => void }) {
  const stage = STAGES.find((s) => s.id === client.stage)!;
  const tempStyle =
    client.temp === "hot"
      ? "text-emerald-600 bg-emerald-100 border-emerald-200"
      : client.temp === "warm"
        ? "text-orange-600 bg-orange-100 border-orange-200"
        : "text-red-600 bg-red-100 border-red-200";
  const tempLabel = client.temp === "hot" ? "🔥 Al día" : client.temp === "warm" ? "⚠️ Contactar" : "🚨 Urgente";

  return (
    <div
      onClick={() => onClick(client)}
      className="bg-card border border-border shadow-sm rounded-xl p-3 mb-3 relative overflow-hidden cursor-pointer transition-transform active:scale-[0.98]"
    >
      <div className={`absolute left-0 top-0 bottom-0 w-1 ${stage.dot}`} />

      {/* Row 1: Name and Value */}
      <div className="flex justify-between items-start mb-1.5 pl-2">
        <h3 className="font-bold text-base leading-tight text-foreground truncate pr-2">{client.name}</h3>
        <span className="font-bold text-primary text-base shrink-0">${client.value.toLocaleString()}</span>
      </div>

      {/* Row 2: Temp and Contact */}
      <div className="flex items-center gap-2 mb-2.5 pl-2">
        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${tempStyle}`}>
          {client.temp === "hot" ? "🔥" : client.temp === "warm" ? "⚠️" : "🚨"}
        </span>
        <p className="text-sm text-muted-foreground truncate">{client.contact}</p>
      </div>

      {/* Row 3: Stage Dropdown and Action Buttons */}
      <div className="flex gap-2 items-center pl-2">
        <button
          className="flex-1 min-w-0 bg-secondary/50 border border-border rounded-lg p-2 text-xs font-semibold text-foreground focus:outline-none text-left flex justify-between items-center transition active:scale-95"
          onClick={(e) => {
            e.stopPropagation();
            onOpenStageSelect(client);
          }}
        >
          <span className="truncate">{STAGES.find((s) => s.id === client.stage)?.icon} {STAGES.find((s) => s.id === client.stage)?.label}</span>
          <IconChevronRight className="rotate-90 w-3 h-3 text-muted-foreground shrink-0" />
        </button>
        <div className="flex gap-1 shrink-0">
          <a
            href={client.phone ? `tel:${client.phone}` : "#"}
            className="p-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition active:scale-90"
            onClick={(e) => e.stopPropagation()}
          >
            <IconPhone />
          </a>
          <a
            href={client.email ? `mailto:${client.email}` : "#"}
            className="p-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition active:scale-90"
            onClick={(e) => e.stopPropagation()}
          >
            <IconMail />
          </a>
          <a
            href={getGCalLink(client)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition active:scale-90"
            onClick={(e) => e.stopPropagation()}
          >
            <IconCalendar />
          </a>
        </div>
      </div>

      {/* Row 4: Last Action (Super Compact) */}
      <div className="mt-2 pl-2 flex justify-between items-center text-[11px] text-muted-foreground/80 border-t border-border/50 pt-2">
        <span className="truncate pr-2">{client.lastAction}</span>
        <span className="shrink-0 flex items-center gap-1"><IconClockSmall /> {client.date}</span>
      </div>
    </div>
  );
}

const Index = () => {
  const [clients, setClients] = useState<Client[]>(() => {
    const saved = localStorage.getItem('crm_clients');
    if (saved) return JSON.parse(saved);
    return MOCK_CLIENTS.map(c => ({ ...c, temp: calculateTemp(c.lastContactDate) }));
  });
  
  const [viewMode, setViewMode] = useState<"smart_list" | "accordion">(() => {
    return (localStorage.getItem('crm_viewMode') as "smart_list" | "accordion") || "smart_list";
  });

  useEffect(() => {
    localStorage.setItem('crm_clients', JSON.stringify(clients));
  }, [clients]);

  useEffect(() => {
    localStorage.setItem('crm_viewMode', viewMode);
  }, [viewMode]);

  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [noteText, setNoteText] = useState("");
  
  // Filters
  const [activeTempFilter, setActiveTempFilter] = useState<Temp | null>(null);
  const [activeStageFilter, setActiveStageFilter] = useState<StageId | null>(null);
  const [isStageFilterOpen, setIsStageFilterOpen] = useState(false);
  const [stageSelectClient, setStageSelectClient] = useState<Client | null>(null);

  const [expandedStage, setExpandedStage] = useState<StageId | null>(null);

  const [newClient, setNewClient] = useState({ name: "", contact: "", phone: "", email: "", value: "" });

  const filteredClients = useMemo(() => {
    const filtered = clients.filter(c => {
      if (activeTempFilter && c.temp !== activeTempFilter) return false;
      if (activeStageFilter && c.stage !== activeStageFilter) return false;
      return true;
    });

    const tempOrder = { cold: 1, warm: 2, hot: 3 };
    return filtered.sort((a, b) => tempOrder[a.temp] - tempOrder[b.temp]);
  }, [clients, activeTempFilter, activeStageFilter]);

  const totalPipeline = useMemo(() => 
    clients
      .filter(c => c.stage !== 'aliados' && c.stage !== 'complete')
      .reduce((sum, c) => sum + c.value, 0), 
  [clients]);

  const getCountByTemp = (t: Temp) => clients.filter((c) => c.temp === t).length;
  const getCountByStage = (s: StageId) => clients.filter((c) => c.stage === s).length;

  const handleStageChange = (id: string, newStage: StageId) => {
    setClients((prev) => prev.map((c) => (c.id === id ? { ...c, stage: newStage } : c)));
    if (activeClient?.id === id) {
      setActiveClient(prev => prev ? { ...prev, stage: newStage } : null);
    }
  };

  const handleCreate = () => {
    if (!newClient.name || !newClient.contact || !newClient.value) return;
    const client: Client = {
      id: "c" + Date.now(),
      name: newClient.name,
      contact: newClient.contact,
      phone: newClient.phone,
      email: newClient.email,
      value: Number(newClient.value),
      stage: "mapeados",
      temp: "hot",
      lastAction: "Lead Creado",
      date: "Hoy",
      lastContactDate: new Date().toISOString()
    };
    setClients(prev => [...prev, client]);
    setIsCreating(false);
    setNewClient({ name: "", contact: "", phone: "", email: "", value: "" });
  };

  const handleAddNote = () => {
    if (!activeClient || !noteText) return;
    const now = new Date().toISOString();
    setClients(prev => prev.map(c => {
      if (c.id === activeClient.id) {
        return {
          ...c,
          lastAction: noteText,
          lastContactDate: now,
          date: "Hoy",
          temp: "hot" // Update makes it hot again
        };
      }
      return c;
    }));
    setActiveClient(prev => prev ? { ...prev, lastAction: noteText, lastContactDate: now, date: "Hoy", temp: "hot" } : null);
    setNoteText("");
  };

  const todayDateObj = new Date();
  const todayFormatted = new Intl.DateTimeFormat('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }).format(todayDateObj);
  const displayDate = todayFormatted.charAt(0).toUpperCase() + todayFormatted.slice(1);

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-background mx-auto max-w-md sm:max-w-lg md:max-w-xl">
      {/* Header & Filters */}
      <header className="pt-4 pb-2 px-2 glass-panel border-b border-border z-10 shrink-0">
        <div className="flex justify-between items-center mb-3 px-2">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 shrink-0 mr-1">
              <img src={logoUrl} alt="Equilibria" className="h-full object-contain" />
            </div>
            <div className="bg-primary/10 border border-primary/20 px-3 py-1.5 rounded-lg flex flex-col justify-center shadow-sm">
              <span className="text-[9px] font-extrabold text-primary uppercase tracking-wider leading-none mb-0.5">Pipeline Potencial</span>
              <h1 className="text-xl font-extrabold text-foreground leading-none">${totalPipeline.toLocaleString()}</h1>
            </div>
          </div>
          {/* View Toggle (Tiny) */}
          <div className="flex bg-secondary p-0.5 rounded-lg shrink-0">
            <button 
              onClick={() => setViewMode("smart_list")}
              className={`px-2 py-1 text-[10px] font-bold rounded-md transition active:scale-95 ${viewMode === "smart_list" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Lista
            </button>
            <button 
              onClick={() => setViewMode("accordion")}
              className={`px-2 py-1 text-[10px] font-bold rounded-md transition active:scale-95 ${viewMode === "accordion" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"}`}
            >
              Acordeón
            </button>
          </div>
        </div>

        {viewMode === "smart_list" && (
          <>
            {/* Level 1: Urgency Filters (Pills) */}
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide mb-2 px-2 snap-x">
          <button 
            onClick={() => setActiveTempFilter(activeTempFilter === "cold" ? null : "cold")}
            className={`border rounded-full px-3 py-1.5 transition active:scale-95 flex items-center gap-1 min-w-max shadow-sm snap-start ${activeTempFilter === "cold" ? "bg-red-100 border-red-200 text-red-700 ring-1 ring-red-400" : "bg-card border-border text-muted-foreground hover:bg-secondary/80"}`}
          >
            <span className="font-bold text-xs whitespace-nowrap">🚨 Urgentes <span className="font-normal opacity-80 ml-1">+7d</span> ({getCountByTemp("cold")})</span>
          </button>
          <button 
            onClick={() => setActiveTempFilter(activeTempFilter === "warm" ? null : "warm")}
            className={`border rounded-full px-3 py-1.5 transition active:scale-95 flex items-center gap-1 min-w-max shadow-sm snap-start ${activeTempFilter === "warm" ? "bg-orange-100 border-orange-200 text-orange-700 ring-1 ring-orange-400" : "bg-card border-border text-muted-foreground hover:bg-secondary/80"}`}
          >
            <span className="font-bold text-xs whitespace-nowrap">⚠️ Contactar <span className="font-normal opacity-80 ml-1">4-7d</span> ({getCountByTemp("warm")})</span>
          </button>
          <button 
            onClick={() => setActiveTempFilter(activeTempFilter === "hot" ? null : "hot")}
            className={`border rounded-full px-3 py-1.5 transition active:scale-95 flex items-center gap-1 min-w-max shadow-sm snap-start ${activeTempFilter === "hot" ? "bg-emerald-100 border-emerald-200 text-emerald-700 ring-1 ring-emerald-400" : "bg-card border-border text-muted-foreground hover:bg-secondary/80"}`}
          >
            <span className="font-bold text-xs whitespace-nowrap">🔥 Al día <span className="font-normal opacity-80 ml-1">0-3d</span> ({getCountByTemp("hot")})</span>
          </button>
        </div>

        {/* Level 2: Stage Filters */}
        <div className="px-2 pb-2">
          <button 
            onClick={() => setIsStageFilterOpen(true)}
            className="w-full bg-card border border-border rounded-xl p-3 text-sm font-bold text-foreground focus:outline-none shadow-sm flex justify-between items-center transition active:scale-95"
          >
            <span className="truncate">
              {activeStageFilter ? `${STAGES.find(s => s.id === activeStageFilter)?.icon} ${STAGES.find(s => s.id === activeStageFilter)?.label} (${getCountByStage(activeStageFilter)})` : "📋 TODAS LAS FASES"}
            </span>
            <IconChevronRight className="rotate-90 w-4 h-4 text-muted-foreground shrink-0" />
          </button>
        </div>
          </>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto relative bg-secondary/20">
        {viewMode === "smart_list" ? (
          <div className="p-4 pb-24">
            {filteredClients.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-muted-foreground font-medium">No hay leads que coincidan con estos filtros.</p>
                <button onClick={() => { setActiveTempFilter(null); setActiveStageFilter(null); }} className="mt-4 text-primary font-bold text-base">
                  Limpiar filtros
                </button>
              </div>
            ) : (
              filteredClients.map(c => (
                <ClientCard 
                  key={c.id} 
                  client={c} 
                  onClick={setActiveClient} 
                  onOpenStageSelect={setStageSelectClient}
                />
              ))
            )}
          </div>
        ) : (
          <div className="p-4 pb-24 space-y-3">
            {STAGES.map(stage => {
              const stageClients = clients.filter(c => c.stage === stage.id);
              const isExpanded = expandedStage === stage.id;
              // Generate dynamic light background for header
              const headerBg = isExpanded ? 'bg-primary/5' : 'bg-card';
              const borderCol = isExpanded ? 'border-primary/20' : 'border-border';
              
              return (
                <div key={stage.id} className={`border ${borderCol} rounded-2xl overflow-hidden bg-card shadow-sm transition-colors`}>
                  <button 
                    onClick={() => setExpandedStage(isExpanded ? null : stage.id)}
                    className={`w-full flex items-center justify-between p-4 transition-colors ${headerBg}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${stage.dot}`} />
                      <span className="font-bold text-foreground text-base tracking-wide">{stage.label}</span>
                      <span className="text-sm font-semibold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">({stageClients.length})</span>
                    </div>
                    <IconChevronRight className={`transition-transform duration-300 ${isExpanded ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                  </button>
                  
                  {/* Expanded Content */}
                  <div className={`transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}>
                    <div className="p-3 bg-secondary/30 flex flex-col gap-3">
                      {stageClients.length === 0 ? (
                        <p className="text-sm text-muted-foreground text-center py-4">No hay leads en esta fase.</p>
                      ) : (
                        stageClients.map(c => (
                          <div key={c.id} onClick={() => setActiveClient(c)} className="bg-card border border-border p-3 rounded-xl shadow-sm cursor-pointer hover:border-primary/50 transition">
                            <div className="flex justify-between items-start mb-2">
                              <div className="min-w-0 pr-2">
                                <h4 className="font-bold text-base text-foreground truncate">{c.name}</h4>
                                <p className="text-sm text-muted-foreground truncate">{c.contact}</p>
                              </div>
                              <span className="font-bold text-primary text-base">${c.value.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-muted-foreground">
                              <span className="truncate pr-2 flex items-center gap-1"><IconNoteSmall className="w-3 h-3"/> {c.lastAction}</span>
                              <span className="shrink-0 flex items-center gap-1"><IconClockSmall className="w-3 h-3"/> {c.date}</span>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* FAB */}
      <button
        onClick={() => setIsCreating(true)}
        className="absolute bottom-6 right-6 w-14 h-14 bg-primary hover:bg-primary/90 rounded-full flex items-center justify-center text-primary-foreground shadow-[0_4px_15px_hsl(var(--primary)/0.4)] transition-transform active:scale-90 z-20"
        aria-label="Nuevo cliente"
      >
        <IconPlus />
      </button>

      {/* Create Lead Sheet */}
      {isCreating && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsCreating(false)}
        >
          <div
            className="w-full max-w-md bg-card rounded-t-3xl border-t border-border p-6 animate-sheet-up max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsCreating(false)} className="absolute top-6 right-6 p-1 text-muted-foreground hover:text-foreground transition active:scale-90"><IconX /></button>
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Nuevo Lead</h2>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-sm font-bold text-muted-foreground uppercase">Empresa</label>
                <input 
                  type="text" 
                  value={newClient.name} 
                  onChange={e => setNewClient({...newClient, name: e.target.value})}
                  className="w-full mt-1 bg-input border border-border rounded-lg p-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ej: TechCorp" 
                />
              </div>
              <div>
                <label className="text-sm font-bold text-muted-foreground uppercase">Contacto</label>
                <input 
                  type="text" 
                  value={newClient.contact} 
                  onChange={e => setNewClient({...newClient, contact: e.target.value})}
                  className="w-full mt-1 bg-input border border-border rounded-lg p-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ej: María González" 
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-bold text-muted-foreground uppercase">Teléfono</label>
                  <input 
                    type="tel" 
                    value={newClient.phone} 
                    onChange={e => setNewClient({...newClient, phone: e.target.value})}
                    className="w-full mt-1 bg-input border border-border rounded-lg p-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Ej: 999888777" 
                  />
                </div>
                <div>
                  <label className="text-sm font-bold text-muted-foreground uppercase">Email</label>
                  <input 
                    type="email" 
                    value={newClient.email} 
                    onChange={e => setNewClient({...newClient, email: e.target.value})}
                    className="w-full mt-1 bg-input border border-border rounded-lg p-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="Ej: info@empresa.com" 
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-bold text-muted-foreground uppercase">Valor Estimado ($)</label>
                <input 
                  type="number" 
                  value={newClient.value} 
                  onChange={e => setNewClient({...newClient, value: e.target.value})}
                  className="w-full mt-1 bg-input border border-border rounded-lg p-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Ej: 15000" 
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setIsCreating(false)}
                className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground rounded-xl py-3 font-bold transition active:scale-95"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreate}
                className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl py-3 font-bold transition shadow-md active:scale-95"
              >
                Crear Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail & Add Note Sheet */}
      {activeClient && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setActiveClient(null)}
        >
          <div
            className="w-full max-w-md bg-card rounded-t-3xl border-t border-border p-6 animate-sheet-up max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setActiveClient(null)} className="absolute top-6 right-6 p-1 text-muted-foreground hover:text-foreground transition active:scale-90"><IconX /></button>
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />

            <div className="flex justify-between items-start mb-6 gap-3">
              <div className="min-w-0">
                <h2 className="text-3xl font-bold text-foreground mb-1 truncate">{activeClient.name}</h2>
                <p className="text-muted-foreground truncate">{activeClient.contact}</p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-bold text-primary">${activeClient.value.toLocaleString()}</div>
                <div className="text-sm font-semibold px-2 py-1 rounded-md bg-secondary text-foreground mt-1 inline-block border">
                  {STAGES.find((s) => s.id === activeClient.stage)?.label}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 mb-6">
              <a 
                href={activeClient.phone ? `tel:${activeClient.phone}` : "#"}
                className="bg-secondary hover:bg-secondary/80 text-foreground rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition border active:scale-95"
              >
                <IconPhone />
                <span className="text-sm font-medium">Llamar</span>
              </a>
              <a 
                href={activeClient.email ? `mailto:${activeClient.email}` : "#"}
                className="bg-secondary hover:bg-secondary/80 text-foreground rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition border active:scale-95"
              >
                <IconMail />
                <span className="text-sm font-medium">Email</span>
              </a>
              <a 
                href={getGCalLink(activeClient)}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary hover:bg-secondary/80 text-foreground rounded-xl p-3 flex flex-col items-center justify-center gap-2 transition border active:scale-95"
              >
                <IconCalendar />
                <span className="text-sm font-medium">Agendar</span>
              </a>
            </div>

            <div className="bg-secondary/30 rounded-xl p-4 border border-border mb-6">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">Registrar Avance</h4>
                <span className="text-sm font-medium bg-primary/10 text-primary px-2 py-0.5 rounded-full">Hoy, {new Date().toLocaleDateString('es-ES')}</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Añadir una nota actualizará la fecha de contacto a hoy y pasará al cliente a estado 🔥 Al día.</p>
              <textarea
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Ej: Me pidió que le enviara el contrato el viernes..."
                className="w-full bg-input border border-border rounded-lg p-3 text-base text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none mb-3"
                rows={3}
              />
              <button
                onClick={handleAddNote}
                disabled={!noteText}
                className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground rounded-lg py-2.5 font-bold transition active:scale-95 text-base"
              >
                Guardar Nota y Actualizar
              </button>
            </div>

            <button
              onClick={() => setActiveClient(null)}
              className="w-full bg-secondary hover:bg-secondary/80 border text-foreground rounded-xl py-3 font-bold transition active:scale-95"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Stage Filter Sheet */}
      {isStageFilterOpen && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setIsStageFilterOpen(false)}
        >
          <div
            className="w-full max-w-md bg-card rounded-t-3xl border-t border-border p-6 animate-sheet-up max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setIsStageFilterOpen(false)} className="absolute top-6 right-6 p-1 text-muted-foreground hover:text-foreground transition active:scale-90"><IconX /></button>
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">Filtrar por Fase</h2>
            
            <div className="flex flex-col gap-2 pb-6">
              <button 
                onClick={() => { setActiveStageFilter(null); setIsStageFilterOpen(false); }}
                className={`flex items-center justify-between p-4 rounded-xl border transition active:scale-95 ${!activeStageFilter ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/20 border-border text-foreground hover:bg-secondary/50'}`}
              >
                <span className="font-bold text-base">📋 TODAS LAS FASES</span>
                <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{clients.length}</span>
              </button>
              {STAGES.map(stage => {
                const count = getCountByStage(stage.id);
                const isActive = activeStageFilter === stage.id;
                return (
                  <button 
                    key={stage.id}
                    onClick={() => { setActiveStageFilter(stage.id); setIsStageFilterOpen(false); }}
                    className={`flex items-center justify-between p-4 rounded-xl border transition active:scale-95 ${isActive ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/20 border-border text-foreground hover:bg-secondary/50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${stage.dot}`} />
                      <span className="font-bold text-base">{stage.icon} {stage.label}</span>
                    </div>
                    <span className="text-sm font-semibold px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Change Stage Sheet */}
      {stageSelectClient && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
          onClick={() => setStageSelectClient(null)}
        >
          <div
            className="w-full max-w-md bg-card rounded-t-3xl border-t border-border p-6 animate-sheet-up max-h-[90vh] overflow-y-auto relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setStageSelectClient(null)} className="absolute top-6 right-6 p-1 text-muted-foreground hover:text-foreground transition active:scale-90"><IconX /></button>
            <div className="w-12 h-1.5 bg-muted rounded-full mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-1">Mover a Fase</h2>
            <p className="text-sm text-muted-foreground mb-4">Actualizando fase para: <span className="font-bold text-foreground">{stageSelectClient.name}</span></p>
            
            <div className="flex flex-col gap-2 pb-6">
              {STAGES.map(stage => {
                const isActive = stageSelectClient.stage === stage.id;
                return (
                  <button 
                    key={stage.id}
                    onClick={() => { handleStageChange(stageSelectClient.id, stage.id); setStageSelectClient(null); }}
                    className={`flex items-center justify-between p-4 rounded-xl border transition active:scale-95 ${isActive ? 'bg-primary/10 border-primary text-primary' : 'bg-secondary/20 border-border text-foreground hover:bg-secondary/50'}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${stage.dot}`} />
                      <span className="font-bold text-base">{stage.icon} {stage.label}</span>
                    </div>
                    {isActive && <span className="text-xs font-bold bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Actual</span>}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;

