
import React, { useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Actor = { name: string; url?: string; about?: string };
type Node = {
  id: string;
  title: string;
  category:
    | "Policy & Regulation"
    | "Finance"
    | "Construction & Production"
    | "Services & Research"
    | "Market Participants"
    | "End Users";
  x: number;
  y: number;
  details?: string;
  actors?: Actor[];
};

type Edge = { from: string; to: string; kind?: "flow" | "policy" | "finance" };

const NODES: Node[] = [
  {
    id: "gov",
    title: "Government Departments",
    category: "Policy & Regulation",
    x: 16,
    y: 8,
    details: "Sets and coordinates national/state energy policy frameworks.",
    actors: [
      {
        name: "Department of Climate Change, Energy, the Environment and Water (DCCEEW)",
        url: "https://www.dcceew.gov.au",
        about:
          "Leads Australia's federal energy and climate policy, overseeing NEM governance and transition strategy.",
      },
      {
        name: "State and Territory Energy Departments",
        about:
          "Implement national policy at the state level (e.g., Victoria's DEECA; NSW Energy).",
      },
      {
        name: "Treasury / Finance",
        about:
          "Develops fiscal incentives, funding and regulation frameworks affecting energy markets.",
      },
    ],
  },
  {
    id: "regs",
    title: "Regulation Bodies",
    category: "Policy & Regulation",
    x: 50,
    y: 8,
    details:
      "Rule-making and compliance institutions ensuring efficiency, competition and consumer protection.",
    actors: [
      {
        name: "Australian Energy Market Commission (AEMC)",
        url: "https://www.aemc.gov.au",
        about: "Rule‑maker for the National Electricity Market; sets and amends the National Electricity Rules.",
      },
      {
        name: "Australian Energy Regulator (AER)",
        url: "https://www.aer.gov.au",
        about: "Economic regulator for networks; monitors/enforces wholesale market compliance.",
      },
      {
        name: "Australian Competition & Consumer Commission (ACCC)",
        url: "https://www.accc.gov.au",
        about: "Ensures competition and protects consumers in energy markets; investigates market power.",
      },
    ],
  },
  {
    id: "investors",
    title: "Investors",
    category: "Finance",
    x: 84,
    y: 8,
    details:
      "Provide equity and debt funding for energy infrastructure and clean‑energy projects.",
    actors: [
      {
        name: "Clean Energy Finance Corporation (CEFC)",
        url: "https://www.cefc.com.au",
        about:
          "Government‑owned green bank investing to accelerate Australia's clean‑energy transition.",
      },
      {
        name: "Australian Renewable Energy Agency (ARENA)",
        url: "https://arena.gov.au",
        about:
          "Funds innovative renewable energy projects that improve reliability and affordability.",
      },
      {
        name: "Superannuation & Infrastructure Funds",
        about:
          "Institutional investors providing long‑term capital for generation, storage and networks.",
      },
    ],
  },
  {
    id: "devs",
    title: "Developers",
    category: "Construction & Production",
    x: 10,
    y: 26,
    actors: [
      {
        name: "Neoen Australia",
        url: "https://neoen.com",
        about: "Developer/operator of solar, wind and battery storage projects.",
      },
      {
        name: "Tilt Renewables",
        url: "https://tiltrenewables.com",
        about: "Develops and operates large‑scale wind and solar farms in ANZ.",
      },
      {
        name: "Genex Power",
        url: "https://genexpower.com.au",
        about: "Renewable generation and storage (hydro, battery) developer.",
      },
    ],
  },
  {
    id: "fuel",
    title: "Fuel Suppliers",
    category: "Construction & Production",
    x: 10,
    y: 42,
    actors: [
      {
        name: "Santos Ltd",
        url: "https://www.santos.com",
        about:
          "One of Australia’s largest natural gas producers supplying domestic and export markets.",
      },
      {
        name: "Origin Energy (Gas)",
        url: "https://www.originenergy.com.au",
        about: "Gas exploration, production and supply for power and industry.",
      },
      {
        name: "Glencore Coal",
        url: "https://www.glencore.com.au",
        about: "Major coal producer supplying thermal and metallurgical coal.",
      },
    ],
  },
  {
    id: "equip",
    title: "Equipment Suppliers",
    category: "Construction & Production",
    x: 10,
    y: 58,
    actors: [
      {
        name: "Siemens Energy Australia",
        url: "https://www.siemens-energy.com/au",
        about: "Grid technologies, turbines and renewable integration systems.",
      },
      {
        name: "GE Vernova",
        url: "https://www.gevernova.com",
        about: "Wind turbines, generators and grid infrastructure solutions.",
      },
      {
        name: "Vestas Australia",
        url: "https://www.vestas.com",
        about: "Wind turbines and O&M services across Australia.",
      },
    ],
  },
  {
    id: "svc",
    title: "Service Providers & Consultants",
    category: "Services & Research",
    x: 10,
    y: 76,
    actors: [
      {
        name: "GHD Group",
        url: "https://www.ghd.com",
        about: "Engineering, environmental and advisory services for energy projects.",
      },
      {
        name: "Aurecon",
        url: "https://www.aurecongroup.com",
        about: "Design, engineering and advisory firm with energy/sustainability expertise.",
      },
      {
        name: "Jacobs",
        url: "https://www.jacobs.com",
        about: "Project delivery, planning and technical services in the energy sector.",
      },
    ],
  },
  {
    id: "uni",
    title: "Universities",
    category: "Services & Research",
    x: 10,
    y: 90,
    actors: [
      {
        name: "UNSW Energy Institute",
        url: "https://www.energy.unsw.edu.au",
        about: "PV, storage and sustainable grids research.",
      },
      {
        name: "University of Melbourne Energy Institute (MEI)",
        url: "https://energy.unimelb.edu.au",
        about: "Research on energy transition policy and technologies.",
      },
      {
        name: "ANU Energy Change Institute",
        url: "https://energy.anu.edu.au",
        about: "Interdisciplinary research on renewables, storage and systems integration.",
      },
    ],
  },
  {
    id: "gens",
    title: "Electricity Generators",
    category: "Market Participants",
    x: 36,
    y: 23,
    actors: [
      {
        name: "AGL Energy",
        url: "https://www.agl.com.au",
        about: "Large generator across coal, gas and renewables.",
      },
      {
        name: "Origin Energy",
        url: "https://www.originenergy.com.au",
        about: "Integrated generation, trading and retail company.",
      },
      {
        name: "Snowy Hydro",
        url: "https://www.snowyhydro.com.au",
        about: "Hydro generation and Snowy 2.0 pumped storage.",
      },
    ],
  },
  {
    id: "tx",
    title: "Transmission Providers",
    category: "Market Participants",
    x: 36,
    y: 42,
    actors: [
      {
        name: "Transgrid",
        url: "https://www.transgrid.com.au",
        about: "NSW high‑voltage network and interconnectors operator.",
      },
      {
        name: "Powerlink Queensland",
        url: "https://www.powerlink.com.au",
        about: "Owns and operates Queensland's transmission network.",
      },
      {
        name: "ElectraNet",
        url: "https://www.electranet.com.au",
        about: "South Australian transmission services provider.",
      },
    ],
  },
  {
    id: "dx",
    title: "Distribution Providers",
    category: "Market Participants",
    x: 36,
    y: 60,
    actors: [
      {
        name: "Ausgrid",
        url: "https://www.ausgrid.com.au",
        about: "Distribution to Sydney and Hunter region.",
      },
      {
        name: "Powercor",
        url: "https://www.powercor.com.au",
        about: "Distribution to regional and western Victoria.",
      },
      {
        name: "United Energy",
        url: "https://www.unitedenergy.com.au",
        about: "Distribution to Melbourne’s south‑eastern suburbs.",
      },
    ],
  },
  {
    id: "mo",
    title: "Market Operator",
    category: "Market Participants",
    x: 58,
    y: 42,
    actors: [
      {
        name: "AEMO",
        url: "https://aemo.com.au",
        about:
          "Operates Australia's electricity and gas systems and manages the National Electricity Market (NEM).",
      },
    ],
  },
  {
    id: "traders",
    title: "Traders",
    category: "Market Participants",
    x: 88,
    y: 23,
    actors: [
      {
        name: "Flow Power",
        url: "https://www.flowpower.com.au",
        about:
          "Wholesale‑linked contracting and demand‑response solutions for C&I customers.",
      },
      {
        name: "Shell Energy Australia",
        url: "https://www.shellenergy.com.au",
        about:
          "Power trading, retail and energy solutions for commercial/industrial users.",
      },
      {
        name: "Macquarie Energy Markets",
        url: "https://www.macquarie.com",
        about: "Global commodities and energy trading desk active in the NEM.",
      },
    ],
  },
  {
    id: "retail",
    title: "Electricity Retailers",
    category: "Market Participants",
    x: 88,
    y: 60,
    actors: [
      {
        name: "AGL Energy",
        url: "https://www.agl.com.au",
        about: "Retailer serving households and businesses.",
      },
      {
        name: "Origin Energy",
        url: "https://www.originenergy.com.au",
        about: "Integrated generator/retailer with electricity and gas plans.",
      },
      {
        name: "Amber Electric",
        url: "https://www.amber.com.au",
        about: "Wholesale‑linked pricing and smart metering for customers.",
      },
    ],
  },
  {
    id: "large",
    title: "Large Energy Users",
    category: "End Users",
    x: 60,
    y: 72,
    actors: [
      {
        name: "BHP",
        url: "https://www.bhp.com",
        about:
          "Large electricity consumer procuring renewables for mining operations.",
      },
      {
        name: "Rio Tinto",
        url: "https://www.riotinto.com",
        about: "Smelters/refineries with long‑term renewable contracts.",
      },
      {
        name: "BlueScope Steel",
        url: "https://www.bluescope.com",
        about:
          "High‑consumption manufacturer adopting on‑site generation and efficiency.",
      },
    ],
  },
  {
    id: "homes",
    title: "Households & SMEs",
    category: "End Users",
    x: 60,
    y: 88,
    actors: [
      {
        name: "Residential Consumers",
        about:
          "Households participating in rooftop solar, batteries and virtual power plants.",
      },
      {
        name: "Small & Medium Enterprises",
        about:
          "Commercial users adopting smart metering and energy management systems.",
      },
      {
        name: "Community Energy Groups",
        about:
          "Local cooperatives investing in shared renewable generation and storage.",
      },
    ],
  },
];

const EDGES: Edge[] = [
  { from: "gov", to: "regs", kind: "policy" },
  { from: "gov", to: "gens", kind: "policy" },
  { from: "regs", to: "mo", kind: "policy" },
  { from: "regs", to: "tx", kind: "policy" },
  { from: "regs", to: "dx", kind: "policy" },
  { from: "investors", to: "devs", kind: "finance" },
  { from: "investors", to: "gens", kind: "finance" },
  { from: "devs", to: "gens" },
  { from: "fuel", to: "gens" },
  { from: "equip", to: "gens" },
  { from: "gens", to: "mo" },
  { from: "gens", to: "tx" },
  { from: "tx", to: "dx" },
  { from: "dx", to: "retail" },
  { from: "retail", to: "homes" },
  { from: "mo", to: "traders" },
  { from: "traders", to: "retail" },
  { from: "large", to: "mo" },
  { from: "dx", to: "large" },
];

const CATS: Record<Node["category"], { color: string; border: string }> = {
  "Policy & Regulation": { color: "bg-amber-500/15", border: "border-amber-400/60" },
  Finance: { color: "bg-emerald-500/15", border: "border-emerald-400/60" },
  "Construction & Production": { color: "bg-sky-500/15", border: "border-sky-400/60" },
  "Services & Research": { color: "bg-fuchsia-500/15", border: "border-fuchsia-400/60" },
  "Market Participants": { color: "bg-slate-500/15", border: "border-slate-400/60" },
  "End Users": { color: "bg-teal-500/15", border: "border-teal-400/60" },
};

function getCatColor(cat: Node["category"]) {
  switch (cat) {
    case "Policy & Regulation":
      return "#f59e0b66";
    case "Finance":
      return "#10b98166";
    case "Construction & Production":
      return "#0ea5e966";
    case "Services & Research":
      return "#a855f766";
    case "Market Participants":
      return "#94a3b866";
    case "End Users":
      return "#14b8a666";
  }
}

export default function App() {
  const [selected, setSelected] = useState<Node | null>(null);
  return (
    <div className="min-h-screen w-full bg-zinc-950 text-zinc-100 p-6">
      <h1 className="text-2xl md:text-3xl font-semibold">Interactive Australian NEM Stakeholder Map</h1>
      <p className="text-zinc-400 mt-1">
        Hover to preview • Click a box to view actors • Drag to pan • Wheel/Pinch to zoom • Press R to reset
      </p>

      <div className="mt-4 grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-4 items-start">
        <div className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40">
          <ZoomableCanvas nodes={NODES} edges={EDGES} onSelect={setSelected} />
        </div>

        <KeyPanel node={selected} />
      </div>
    </div>
  );
}

function KeyPanel({ node }: { node: Node | null }) {
  return (
    <aside className="rounded-2xl border border-zinc-800 bg-zinc-900/70 backdrop-blur-md p-5 shadow-xl sticky top-6 h-[80vh] overflow-auto">
      {node ? (
        <div>
          <div className="text-xs uppercase tracking-wide text-zinc-400">{node.category}</div>
          <h3 className="text-xl font-semibold">{node.title}</h3>
          {node.details && <p className="mt-2 text-zinc-300">{node.details}</p>}
          {node.actors && node.actors.length > 0 ? (
            <div className="mt-4">
              <div className="text-sm text-zinc-400 mb-2">Key actors</div>
              <ul className="space-y-3">
                {node.actors.map((a) => (
                  <li key={a.name}>
                    {a.url ? (
                      <a className="text-sky-400 hover:underline" href={a.url} target="_blank" rel="noreferrer">
                        {a.name}
                      </a>
                    ) : (
                      <span className="text-zinc-200">{a.name}</span>
                    )}
                    {a.about && <div className="text-xs text-zinc-400 max-w-[60ch]">{a.about}</div>}
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-sm text-zinc-400 mt-3">No actors listed.</div>
          )}
        </div>
      ) : (
        <div className="text-zinc-300">
          <h3 className="text-lg font-semibold mb-1">Key actors</h3>
          <p className="text-sm text-zinc-400">Click any box on the map to view the relevant organisations here.</p>
        </div>
      )}
    </aside>
  );
}

function ZoomableCanvas({ nodes, edges, onSelect }: { nodes: Node[]; edges: Edge[]; onSelect?: (n: Node) => void }) {
  const [active, setActive] = useState<Node | null>(null);
  const [hover, setHover] = useState<Node | null>(null);
  const [scale, setScale] = useState(1);
  const [tx, setTx] = useState(0);
  const [ty, setTy] = useState(0);
  const dragging = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);

  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = -e.deltaY;
    const factor = Math.exp(delta * 0.001);
    setScale((s) => Math.max(0.5, Math.min(3, s * factor)));
  };

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    last.current = { x: e.clientX, y: e.clientY };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragging.current || !last.current) return;
    const dx = e.clientX - last.current.x;
    const dy = e.clientY - last.current.y;
    last.current = { x: e.clientX, y: e.clientY };
    setTx((v) => v + dx);
    setTy((v) => v + dy);
  };
  const onMouseUp = () => {
    dragging.current = false;
    last.current = null;
  };

  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "r") {
        setScale(1);
        setTx(0);
        setTy(0);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  return (
    <div
      className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/40"
      onWheel={onWheel}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseLeave={onMouseUp}
      style={{ height: "80vh" }}
    >
      <svg
        viewBox="0 0 1000 700"
        className="w-full h-full touch-pan-y touch-pan-x"
        style={{
          background:
            "radial-gradient(1200px 600px at 50% 20%, rgba(255,255,255,0.04), transparent)",
        }}
      >
        <g transform={`translate(${tx},${ty}) scale(${scale})`}>
          {edges.map((e, i) => {
            const a = nodeMap[e.from];
            const b = nodeMap[e.to];
            if (!a || !b) return null;
            const x1 = (a.x / 100) * 1000;
            const y1 = (a.y / 100) * 700;
            const x2 = (b.x / 100) * 1000;
            const y2 = (b.y / 100) * 700;
            const midx = (x1 + x2) / 2;
            const curve = `M ${x1} ${y1} Q ${midx} ${y1} ${x2} ${y2}`;
            const kind = e.kind ?? "flow";
            const stroke = kind === "policy" ? "#f59e0b" : kind === "finance" ? "#10b981" : "#94a3b8";
            return (
              <g key={i}>
                <path d={curve} stroke={stroke} strokeWidth={2.5} fill="none" markerEnd="url(#arrow)" opacity={0.85} />
              </g>
            );
          })}

          <defs>
            <marker id="arrow" markerWidth="8" markerHeight="8" refX="8" refY="4" orient="auto">
              <polygon points="0 0, 8 4, 0 8" fill="#cbd5e1" />
            </marker>
          </defs>

          {nodes.map((n) => (
            <foreignObject
              key={n.id}
              x={(n.x / 100) * 1000 - 100}
              y={(n.y / 100) * 700 - 24}
              width={220}
              height={48}
            >
              <button
                onMouseEnter={() => setHover(n)}
                onMouseLeave={() => setHover((p) => (p?.id === n.id ? null : p))}
                onClick={() => { setActive(n); onSelect?.(n); }}
                className={`w-full h-full rounded-2xl border px-4 py-2 text-left backdrop-blur-sm hover:brightness-110 transition ${CATS[n.category].color} ${CATS[n.category].border}`}
              >
                <div className="text-xs uppercase tracking-wide text-zinc-300">{n.category}</div>
                <div className="font-medium leading-tight">{n.title}</div>
              </button>
            </foreignObject>
          ))}
        </g>
      </svg>

      <AnimatePresence>
        {hover && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="pointer-events-none absolute left-4 bottom-4 bg-zinc-900/90 border border-zinc-700 rounded-xl px-3 py-2 text-sm text-zinc-200"
          >
            <div className="text-xs text-zinc-400">{hover.category}</div>
            <div className="font-medium">{hover.title}</div>
            {hover.details && (
              <div className="text-zinc-400 mt-1 max-w-[44ch]">{hover.details}</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute right-4 bottom-4 flex gap-2">
        <button
          onClick={() => setScale((s) => Math.min(3, s * 1.15))}
          className="rounded-full border border-zinc-700 w-10 h-10 flex items-center justify-center bg-zinc-900/70 hover:bg-zinc-800"
        >
          +
        </button>
        <button
          onClick={() => setScale((s) => Math.max(0.5, s / 1.15))}
          className="rounded-full border border-zinc-700 w-10 h-10 flex items-center justify-center bg-zinc-900/70 hover:bg-zinc-800"
        >
          –
        </button>
        <button
          onClick={() => {
            setScale(1);
            setTx(0);
            setTy(0);
          }}
          className="rounded-full border border-zinc-700 px-3 h-10 flex items-center justify-center bg-zinc-900/70 hover:bg-zinc-800"
        >
          Reset (R)
        </button>
      </div>
    </div>
  );
}

