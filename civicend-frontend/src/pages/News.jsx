import React, { useEffect, useMemo, useState } from "react";

/**
 * CivicLink - News / Notices page (single file)
 * - Full-bleed breakout (works even if parent layout is max-width)
 * - Widgets row (dept summaries)
 * - Featured notice (large card)
 * - Latest notices (grid)
 * - Add Notice form (demo)
 * - Save + modal
 */

const DEPTS = [
  { key: "ALL", name: "All Departments", icon: "🏛️" },
  { key: "ELECTRICITY", name: "Electricity Dept", icon: "⚡" },
  { key: "WATER", name: "Water Board", icon: "🚰" },
  { key: "BUS", name: "Bus (Ceylon)", icon: "🚌" },
  { key: "RAIL", name: "Railway (Ceylon)", icon: "🚆" },
  { key: "ROAD", name: "Road / Traffic Dept", icon: "🚧" },
];

const PROVINCES = [
  "Western Province",
  "Central Province",
  "Southern Province",
  "Northern Province",
  "Eastern Province",
  "North Western Province",
  "North Central Province",
  "Uva Province",
  "Sabaragamuwa Province",
];

const SEVERITY = ["Low", "Medium", "High"];

const SEED_NOTICES = [
  {
    id: 101,
    dept: "WATER",
    title: "Water cut notice for Western Province",
    place: "Colombo",
    province: "Western Province",
    locations: ["Colombo", "Dehiwala", "Maharagama"],
    start: "08:00 AM",
    end: "02:00 PM",
    date: "Dec 27, 2025",
    reason: "pipeline maintenance work",
    severity: "High",
    image: "https://static.vecteezy.com/system/resources/previews/014/656/127/non_2x/save-water-logo-vector.jpg",
    featured: true,
  },
  {
    id: 102,
    dept: "ELECTRICITY",
    title: "Scheduled power interruption in Kandy",
    place: "Kandy",
    province: "Central Province",
    locations: ["Kandy", "Peradeniya"],
    start: "06:00 AM",
    end: "04:00 PM",
    date: "Dec 27, 2025",
    reason: "grid restoration and system stabilization",
    severity: "Medium",
    image: "https://images.seeklogo.com/logo-png/22/1/ceylon-electricity-board-logo-png_seeklogo-226257.png",
  },
  {
    id: 103,
    dept: "BUS",
    title: "Service alert: Additional buses deployed for holiday travel",
    place: "Colombo",
    province: "Western Province",
    routes: ["100", "138", "154"],
    locations: ["Colombo Central", "Pettah", "Maharagama"],
    start: "05:00 AM",
    end: "11:00 PM",
    date: "Dec 31, 2025",
    reason: "holiday travel demand accommodation",
    severity: "Low",
    image: "https://www.shutterstock.com/image-vector/logo-bus-icon-school-vector-600nw-2381986327.jpg",
  },
  {
    id: 104,
    dept: "RAIL",
    title: "Update: Railway schedules adjusted on coastal line — expect delays",
    place: "Galle",
    province: "Southern Province",
    railLine: "Coastal Line",
    locations: ["Galle Station"],
    start: "05:00 AM",
    end: "11:00 AM",
    date: "Dec 30, 2025",
    reason: "schedule adjustments and inspections",
    severity: "Medium",
    image: "https://www.shutterstock.com/image-vector/indian-locomotive-logo-vector-illustration-260nw-2557372583.jpg",
  },
  {
    id: 105,
    dept: "ROAD",
    title: "Alert: Temporary road closures near Fort for public event",
    place: "Colombo Fort",
    province: "Western Province",
    locations: ["Colombo Fort"],
    start: "02:00 PM",
    end: "09:00 PM",
    date: "Dec 30, 2025",
    reason: "public event — temporary closures",
    severity: "Low",
    image:
      "https://img.freepik.com/premium-vector/tree-growing-center-road-surrounded-by-asphalt-dividing-path-vehicles-craft-simple-elegant-logo-that-captures-essence-open-road_538213-64431.jpg?semt=ais_hybrid&w=740&q=80",
  },
  {
    id: 106,
    dept: "WATER",
    title: "Breaking: City prepares emergency water supply plan for weekend",
    place: "Colombo",
    province: "Western Province",
    locations: ["Colombo"],
    start: "10:00 AM",
    end: "06:00 PM",
    date: "Dec 30, 2025",
    reason: "emergency water supply planning",
    severity: "Medium",
    image: "https://static.vecteezy.com/system/resources/previews/014/656/127/non_2x/save-water-logo-vector.jpg",
  },
  {
    id: 107,
    dept: "BUS",
    title: "Bus route delays due to road works",
    place: "Pettah",
    province: "Western Province",
    routes: ["100 (Pettah–Panadura)", "138 (Pettah–Maharagama)"],
    locations: ["Pettah Junction", "Maradana"],
    start: "07:00 AM",
    end: "11:00 PM",
    date: "Dec 27, 2025",
    reason: "temporary road diversion near the junction",
    severity: "Medium",
    image: "https://www.shutterstock.com/image-vector/logo-bus-icon-school-vector-600nw-2381986327.jpg",
  },
  {
    id: 108,
    dept: "RAIL",
    title: "Rail service advisory: delays expected on coastal line",
    place: "Galle",
    province: "Southern Province",
    railLine: "Coastal Line",
    locations: ["Galle Station", "Hikkaduwa Station"],
    start: "05:30 AM",
    end: "10:30 AM",
    date: "Dec 27, 2025",
    reason: "signal issue and inspection",
    severity: "High",
    image: "https://www.shutterstock.com/image-vector/indian-locomotive-logo-vector-illustration-260nw-2557372583.jpg",
  },
  {
    id: 109,
    dept: "ROAD",
    title: "Traffic advisory: partial lane closure near Fort",
    place: "Colombo Fort",
    province: "Western Province",
    locations: ["Colombo Fort", "Pettah"],
    start: "04:00 PM",
    end: "08:00 PM",
    date: "Dec 27, 2025",
    reason: "event-related traffic control",
    severity: "Low",
    image:
      "https://img.freepik.com/premium-vector/tree-growing-center-road-surrounded-by-asphalt-dividing-path-vehicles-craft-simple-elegant-logo-that-captures-essence-open-road_538213-64431.jpg?semt=ais_hybrid&w=740&q=80",
  },
];

function cx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function deptMeta(deptKey) {
  return DEPTS.find((d) => d.key === deptKey) || DEPTS[0];
}

function joinNice(arr) {
  if (!arr || arr.length === 0) return "";
  if (arr.length === 1) return arr[0];
  if (arr.length === 2) return `${arr[0]} and ${arr[1]}`;
  return `${arr.slice(0, -1).join(", ")} and ${arr[arr.length - 1]}`;
}

function parseCsv(text) {
  return text
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

function buildLocationLine(n) {
  const parts = [];
  if (n.place) parts.push(`Place: ${n.place}`);
  if (n.province) parts.push(`Province: ${n.province}`);
  if (n.locations?.length) parts.push(`Locations: ${joinNice(n.locations)}`);
  if (n.routes?.length) parts.push(`Routes: ${joinNice(n.routes)}`);
  if (n.railLine) parts.push(`Rail line: ${n.railLine}`);
  return parts.join(" • ");
}

function buildVerbiage(n) {
  const base = `Date: ${n.date} • ${buildLocationLine(n)} • Severity: ${n.severity}`;

  if (n.dept === "WATER") {
    const locText = n.locations?.length ? `Affected locations: ${joinNice(n.locations)}.` : "";
    return [
      base,
      `The Water Board informs the public that a water supply interruption/low-pressure situation will occur in ${n.province}${
        n.place ? ` (around ${n.place})` : ""
      } from ${n.start} to ${n.end} due to ${n.reason}.`,
      locText,
      `Residents are requested to store sufficient water in advance and use water carefully during this period.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (n.dept === "ELECTRICITY") {
    const locText = n.locations?.length ? `Affected locations: ${joinNice(n.locations)}.` : "";
    return [
      base,
      `The Electricity Department announces a scheduled power interruption in ${n.province}${
        n.place ? ` (around ${n.place})` : ""
      } from ${n.start} to ${n.end} for ${n.reason}.`,
      locText,
      `Please take necessary precautions (charge devices, switch off sensitive appliances, and plan accordingly).`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (n.dept === "BUS") {
    const routeText = n.routes?.length ? `Routes impacted: ${joinNice(n.routes)}.` : "";
    const locText = n.locations?.length ? `Key locations: ${joinNice(n.locations)}.` : "";
    return [
      base,
      `Bus services may experience delays or diversions in ${n.province}${n.place ? ` (near ${n.place})` : ""} from ${
        n.start
      } to ${n.end} due to ${n.reason}.`,
      routeText,
      locText,
      `Passengers are advised to start early and consider alternative routes where possible.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  if (n.dept === "RAIL") {
    const lineText = n.railLine ? `Line/Section: ${n.railLine}.` : "";
    const locText = n.locations?.length ? `Stations/locations: ${joinNice(n.locations)}.` : "";
    return [
      base,
      `Sri Lanka Railways advises that delays and operational adjustments may occur in ${n.province}${
        n.place ? ` (around ${n.place})` : ""
      } from ${n.start} to ${n.end} due to ${n.reason}.`,
      lineText,
      locText,
      `Passengers are advised to check station announcements and allow extra travel time.`,
    ]
      .filter(Boolean)
      .join("\n\n");
  }

  const locText = n.locations?.length ? `Affected locations: ${joinNice(n.locations)}.` : "";
  return [
    base,
    `The Road/Traffic Department issues a public advisory for ${n.province}${n.place ? ` (near ${n.place})` : ""} from ${
      n.start
    } to ${n.end} due to ${n.reason}.`,
    locText,
    `Motorists are advised to follow police instructions, use alternate routes, and expect delays during peak hours.`,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function summarizeDept(sortedNotices, deptKey) {
  const deptNotices = sortedNotices.filter((n) => n.dept === deptKey);
  const latest = deptNotices[0];
  if (!latest) return { value: "No updates", sub: "No notices posted", tag: "OK" };

  const sev = latest.severity;

  const value =
    deptKey === "WATER"
      ? sev === "High"
        ? "Cut"
        : "Notice"
      : deptKey === "ELECTRICITY"
      ? sev === "High"
        ? "Outage"
        : "Scheduled"
      : deptKey === "BUS"
      ? "Delay"
      : deptKey === "RAIL"
      ? "Delay"
      : "Advisory";

  const sub = `${latest.place ? latest.place + " • " : ""}${latest.start}–${latest.end}`;
  return { value, sub, tag: sev };
}

function todayLabel() {
  return "Dec 27, 2025";
}

export default function News() {
  const [deptFilter, setDeptFilter] = useState("ALL");
  const [query, setQuery] = useState("");

  const [notices, setNotices] = useState(() => SEED_NOTICES);

  const [saved, setSaved] = useState(() => new Set());
  const [openNotice, setOpenNotice] = useState(null);

  const PAGE_SIZE = 6;
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, []);

  const [formOpen, setFormOpen] = useState(false);
  const [fDept, setFDept] = useState("WATER");
  const [fTitle, setFTitle] = useState("");
  const [fPlace, setFPlace] = useState("Colombo");
  const [fProvince, setFProvince] = useState("Western Province");
  const [fLocations, setFLocations] = useState("Colombo, Dehiwala");
  const [fRoutes, setFRoutes] = useState("100 (Pettah–Panadura)");
  const [fRailLine, setFRailLine] = useState("Coastal Line");
  const [fStart, setFStart] = useState("08:00 AM");
  const [fEnd, setFEnd] = useState("02:00 PM");
  const [fReason, setFReason] = useState("maintenance work");
  const [fSeverity, setFSeverity] = useState("Medium");

  const sortedNotices = useMemo(() => [...notices].sort((a, b) => b.id - a.id), [notices]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return sortedNotices.filter((n) => {
      const deptOk = deptFilter === "ALL" ? true : n.dept === deptFilter;
      const text = [
        n.title,
        n.place,
        n.province,
        n.reason,
        ...(n.locations || []),
        ...(n.routes || []),
        n.railLine || "",
        n.date,
      ]
        .join(" ")
        .toLowerCase();

      const qOk = !q ? true : text.includes(q);
      return deptOk && qOk;
    });
  }, [sortedNotices, deptFilter, query]);

  const featured = filtered.find((n) => n.featured) || filtered[0];
  const latestAll = filtered.filter((n) => n.id !== featured?.id);

  const latest = latestAll.slice(0, visibleCount);
  const hasMore = latestAll.length > visibleCount;

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [deptFilter, query]);

  const toggleSave = (id) => {
    setSaved((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const isSaved = (id) => saved.has(id);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setOpenNotice(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const widgets = useMemo(() => {
    const deptKeys = ["ELECTRICITY", "WATER", "BUS", "RAIL", "ROAD"];
    return deptKeys.map((k) => {
      const meta = deptMeta(k);
      const summary = summarizeDept(sortedNotices, k);
      return { key: k, icon: meta.icon, title: meta.name, ...summary };
    });
  }, [sortedNotices]);

  const addNotice = (e) => {
    e.preventDefault();
    if (!fTitle.trim() || !fReason.trim()) return;

    const nextId = Math.max(...notices.map((n) => n.id)) + 1;

    const imageForDept =
      fDept === "WATER"
        ? "https://static.vecteezy.com/system/resources/previews/014/656/127/non_2x/save-water-logo-vector.jpg"
        : fDept === "ELECTRICITY"
        ? "https://images.seeklogo.com/logo-png/22/1/ceylon-electricity-board-logo-png_seeklogo-226257.png"
        : fDept === "BUS"
        ? "https://www.shutterstock.com/image-vector/logo-bus-icon-school-vector-600nw-2381986327.jpg"
        : fDept === "RAIL"
        ? "https://www.shutterstock.com/image-vector/indian-locomotive-logo-vector-illustration-260nw-2557372583.jpg"
        : "https://img.freepik.com/premium-vector/tree-growing-center-road-surrounded-by-asphalt-dividing-path-vehicles-craft-simple-elegant-logo-that-captures-essence-open-road_538213-64431.jpg?semt=ais_hybrid&w=740&q=80";

    const newNotice = {
      id: nextId,
      dept: fDept,
      title: fTitle.trim(),
      place: fPlace,
      province: fProvince,
      locations: parseCsv(fLocations),
      routes: fDept === "BUS" ? parseCsv(fRoutes) : undefined,
      railLine: fDept === "RAIL" ? fRailLine.trim() : undefined,
      start: fStart,
      end: fEnd,
      date: todayLabel(),
      reason: fReason.trim(),
      severity: fSeverity,
      image: imageForDept,
    };

    setNotices((prev) => [newNotice, ...prev]);
    setFTitle("");
    setFReason("maintenance work");
    setFormOpen(false);
    setVisibleCount((v) => Math.max(v, PAGE_SIZE));
  };

  const styles = `
    html, body, #root{
      width:100%;
      margin:0;
      padding:0;
      overflow-x:hidden;
      background:#eef2f5;
    }

    :root{
      --bg:#eef2f5;
      --card:#ffffff;
      --text:#0f172a;
      --muted:#52606d;
      --border:#e5e9ef;
      --navy:#134c73;
      --navy2:#0f3f61;
      --shadow: 0 14px 34px rgba(15, 23, 42, 0.10);
      --shadow2: 0 18px 46px rgba(15, 23, 42, 0.14);
      --radius: 18px;
    }

    /* FULL BLEED BREAKOUT (fixed) */
    .fullBleed{
      width:100vw;
      position:relative;
      left:50%;
      right:50%;
      margin-left:-50vw;
      margin-right:-50vw;
    }

    .page{
      min-height:100vh;
      background:
        radial-gradient(1200px 600px at 50% 0%, rgba(19,76,115,0.14), transparent 60%),
        var(--bg);
      color:var(--text);
      font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
    }

    .hero{
      background: linear-gradient(180deg, var(--navy), var(--navy2));
      color:#fff;
      padding: 22px 18px 16px;
      box-shadow: 0 16px 34px rgba(15,63,97,0.22);
    }
    .heroInner{
      width:100%;
      max-width: 1400px;
      margin:0 auto;
      padding:0;
    }
    .crumbs{ opacity:.9; font-weight:800; font-size:14px; }
    .crumbs span{ margin:0 8px; opacity:.75; }
    .title{ margin: 10px 0 10px; font-size: 44px; line-height:1.05; letter-spacing:-.6px; }
    .subtitle{ margin:0 0 14px; max-width: 980px; opacity:.92; line-height:1.6; }

    .heroControls{
      display:flex;
      gap: 12px;
      flex-wrap: wrap;
      align-items:center;
      margin-top: 10px;
    }

    .searchWrap{
      position: relative;
      flex: 1;
      min-width: min(520px, 92vw);
      max-width: 720px;
    }
    .searchIcon{
      position:absolute;
      left: 12px;
      top: 50%;
      transform: translateY(-50%);
      opacity: .85;
      pointer-events:none;
    }
    .search{
      width: 100%;
      background:#fff;
      border: 1px solid rgba(255,255,255,0.55);
      border-radius: 14px;
      padding: 12px 12px 12px 40px;
      outline: none;
      box-shadow: 0 12px 30px rgba(0,0,0,0.10);
    }

    .heroBtn{
      background:#fff;
      color: var(--navy);
      border: 1px solid rgba(255,255,255,0.65);
      border-radius: 14px;
      padding: 11px 16px;
      font-weight: 1000;
      cursor:pointer;
      transition: transform .18s ease;
      white-space: nowrap;
      min-width: 140px;
    }
    .heroBtn:hover{ transform: translateY(-1px); }

    .content{
      width: 100%;
      padding: 18px 18px 60px;
    }
    .wide{
      width: 100%;
      max-width: 1400px;
      margin: 0 auto;
    }

    .widgets{
      display:grid;
      grid-template-columns: repeat(5, 1fr);
      gap: 12px;
      margin: 10px 0 18px;
    }
    @media (max-width: 1200px){ .widgets{ grid-template-columns: repeat(3, 1fr); } }
    @media (max-width: 820px){ .widgets{ grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 560px){ .widgets{ grid-template-columns: 1fr; } }

    .widget{
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      box-shadow: var(--shadow);
      padding: 14px;
      transition: transform .18s ease, box-shadow .18s ease;
      cursor: pointer;
      text-align: left;
    }
    .widget:hover{ transform: translateY(-2px); box-shadow: var(--shadow2); }

    .widgetTop{ display:flex; justify-content:space-between; align-items:center; margin-bottom: 6px; gap:10px; }
    .widgetTitle{ font-size: 14px; margin:0; font-weight:1000; display:flex; align-items:center; gap:8px; }
    .badge{
      font-size: 12px;
      padding: 5px 10px;
      border-radius: 999px;
      background: rgba(19,76,115,0.10);
      border: 1px solid rgba(19,76,115,0.18);
      color: var(--navy);
      font-weight: 900;
      white-space: nowrap;
    }
    .widgetValue{ font-size: 22px; font-weight:1000; margin: 8px 0 4px; }
    .widgetSub{ color: var(--muted); font-size: 13px; margin:0; line-height: 1.45; }

    .featured{
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: 22px;
      overflow: hidden;
      display:grid;
      grid-template-columns: 1.25fr 1fr;
      box-shadow: var(--shadow2);
    }
    @media (max-width: 980px){ .featured{ grid-template-columns: 1fr; } }

    .featuredImg{ min-height: 340px; background-size: cover; background-position: center; position: relative; }
    .featuredImg::after{
      content:"";
      position:absolute; inset:0;
      background: linear-gradient(90deg, rgba(15,23,42,0.18), rgba(15,23,42,0));
    }
    .featuredBody{ padding: 18px 18px 20px; }

    .metaRow{ display:flex; align-items:center; flex-wrap:wrap; gap:10px; color: var(--muted); font-size:13px; }
    .pill{
      background: rgba(19,76,115,0.10);
      border: 1px solid rgba(19,76,115,0.18);
      color: var(--navy);
      padding: 6px 10px;
      border-radius: 999px;
      font-weight: 1000;
      font-size: 12px;
      white-space: nowrap;
    }
    .dot{ opacity:.7; }
    .featuredTitle{ margin: 10px 0 10px; font-size: 30px; line-height:1.18; letter-spacing:-.4px; }
    .featuredExcerpt{ margin: 0 0 14px; color: var(--muted); line-height: 1.75; font-size: 14px; }

    .btnRow{ display:flex; gap:10px; flex-wrap:wrap; align-items:center; margin-top: 8px; }
    .btnPrimary{
      background: var(--navy);
      border: 1px solid var(--navy);
      color:#fff;
      padding: 10px 14px;
      border-radius: 14px;
      font-weight: 1000;
      cursor:pointer;
      transition: transform .18s ease, background .18s ease;
    }
    .btnPrimary:hover{ background: var(--navy2); transform: translateY(-1px); }

    .btnGhost{
      background: #fff;
      border: 1px solid rgba(19,76,115,0.25);
      color: var(--navy);
      padding: 10px 14px;
      border-radius: 14px;
      font-weight: 1000;
      cursor:pointer;
      transition: background .18s ease, transform .18s ease;
    }
    .btnGhost:hover{ background: rgba(19,76,115,0.06); transform: translateY(-1px); }
    .btnSaved{ background: rgba(16,185,129,0.14); border:1px solid rgba(16,185,129,0.35); color:#0f766e; }

    .sectionHead{ display:flex; justify-content:space-between; align-items:baseline; margin-top: 18px; }
    .sectionHead h3{ margin:0; font-size:20px; }

    .small{ color: rgba(82,96,109,0.95); font-size: 13px; }

    .grid{
      display:grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-top: 14px;
    }
    @media (max-width: 980px){ .grid{ grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 560px){ .grid{ grid-template-columns: 1fr; } }

    .card{
      background: var(--card);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      overflow:hidden;
      box-shadow: var(--shadow);
      display:flex;
      flex-direction: column;
      transition: transform .18s ease, box-shadow .18s ease;
    }
    .card:hover{ transform: translateY(-3px); box-shadow: var(--shadow2); }
    .cardImg{ height: 180px; background-size: cover; background-position: center; transition: transform .25s ease; }
    .card:hover .cardImg{ transform: scale(1.05); }
    .cardBody{ padding: 14px; }
    .cardTitle{ margin: 8px 0 10px; font-size: 18px; line-height:1.25; }
    .cardExcerpt{ margin: 0; color: var(--muted); line-height: 1.6; font-size: 14px; }
    .cardFooter{ margin-top: 12px; display:flex; justify-content:space-between; align-items:center; gap:10px; }

    .link{
      background: transparent;
      border:none;
      padding:0;
      color: var(--navy);
      font-weight: 1000;
      cursor:pointer;
    }
    .link:hover{ text-decoration: underline; }

    .loadMoreWrap{ display:flex; justify-content:center; margin-top: 16px; }
    .btnLoad{
      background:#fff;
      border: 1px solid var(--border);
      padding: 11px 16px;
      border-radius: 14px;
      cursor:pointer;
      font-weight: 1000;
      color: var(--navy);
      box-shadow: 0 12px 26px rgba(15,23,42,0.08);
      transition: transform .18s ease, box-shadow .18s ease;
    }
    .btnLoad:hover{ transform: translateY(-1px); box-shadow: 0 18px 40px rgba(15,23,42,0.12); }

    .modalBackdrop{
      position: fixed; inset:0;
      background: rgba(15,23,42,0.55);
      backdrop-filter: blur(6px);
      display:grid; place-items:center;
      padding: 18px;
      z-index: 999;
    }
    .modal{
      width: min(920px, 96vw);
      background:#fff;
      border: 1px solid var(--border);
      border-radius: 22px;
      overflow:hidden;
      box-shadow: 0 30px 80px rgba(0,0,0,0.35);
      animation: pop .18s ease-out;
    }
    @keyframes pop{
      from{ transform: translateY(10px) scale(.98); opacity:0; }
      to{ transform: translateY(0) scale(1); opacity:1; }
    }
    .modalHero{ height: 260px; background-size:cover; background-position:center; position:relative; }
    .modalHero::after{ content:""; position:absolute; inset:0; background: linear-gradient(180deg, rgba(0,0,0,0.10), rgba(0,0,0,0.55)); }
    .modalClose{
      position:absolute; top:12px; right:12px; z-index:2;
      border: 1px solid rgba(255,255,255,0.45);
      background: rgba(15,23,42,0.45);
      color:#fff;
      border-radius: 14px;
      padding: 8px 10px;
      cursor:pointer;
      font-weight: 1000;
    }
    .modalBody{ padding: 16px 18px 18px; }
    .modalTitle{ margin: 10px 0 10px; font-size: 26px; line-height:1.2; }
    .modalContent{ color: var(--muted); line-height: 1.75; font-size: 14px; margin: 0 0 14px; white-space: pre-line; }
    .modalFooter{
      display:flex; gap:10px; flex-wrap:wrap;
      align-items:center; justify-content:flex-end;
      border-top: 1px solid var(--border);
      padding: 12px 18px;
      background: rgba(15,23,42,0.02);
    }

    .panel{
      background: #fff;
      border: 1px solid var(--border);
      border-radius: 18px;
      box-shadow: var(--shadow);
      margin-top: 14px;
      overflow: hidden;
    }
    .panelHead{
      display:flex;
      align-items:center;
      justify-content: space-between;
      padding: 14px 14px;
      border-bottom: 1px solid var(--border);
      background: rgba(15,23,42,0.02);
    }
    .panelHead h3{ margin:0; font-size: 16px; }
    .panelBody{ padding: 14px; }

    .formGrid{
      display:grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 12px;
    }
    @media (max-width: 980px){ .formGrid{ grid-template-columns: repeat(2, 1fr); } }
    @media (max-width: 560px){ .formGrid{ grid-template-columns: 1fr; } }

    .field label{
      display:block;
      font-size: 12px;
      color: var(--muted);
      font-weight: 900;
      margin-bottom: 6px;
    }
    .input, .selectLight{
      width: 100%;
      border: 1px solid var(--border);
      border-radius: 14px;
      padding: 11px 12px;
      outline: none;
      background: #fff;
    }
    .help{
      font-size: 12px;
      color: var(--muted);
      margin-top: 6px;
      line-height: 1.4;
    }
    .rowEnd{
      display:flex;
      gap: 10px;
      justify-content: flex-end;
      margin-top: 12px;
      flex-wrap: wrap;
    }

    .skeleton{ position: relative; overflow: hidden; background: rgba(15, 23, 42, 0.06); }
    .skeleton::after{
      content:"";
      position:absolute; inset:0;
      transform: translateX(-100%);
      background: linear-gradient(90deg, transparent, rgba(255,255,255,0.55), transparent);
      animation: shimmer 1.1s infinite;
    }
    @keyframes shimmer{ 100% { transform: translateX(100%); } }
    .skelLine{ height: 12px; border-radius: 10px; margin: 10px 0; }
    .skelSm{ width: 45%; }
    .skelMd{ width: 70%; }
    .skelLg{ width: 92%; }
    .skelPill{ width: 88px; height: 24px; border-radius: 999px; }
    .skelBtn{ width: 130px; height: 40px; border-radius: 14px; }

    .fadeInUp{ animation: fadeInUp .48s ease both; }
    @keyframes fadeInUp{ from{ opacity:0; transform: translateY(8px);} to{ opacity:1; transform: translateY(0);} }

    .slideTitle{ animation: slideTitle .6s ease both; }
    @keyframes slideTitle{ from{ opacity:0; transform: translateY(-6px);} to{ opacity:1; transform: translateY(0);} }
  `;

  const SkeletonFeatured = () => (
    <section className="featured">
      <div className="featuredImg skeleton" />
      <div className="featuredBody">
        <div className="metaRow">
          <div className="skelPill skeleton" />
          <div className={cx("skelLine", "skelSm", "skeleton")} style={{ margin: 0, height: 14 }} />
        </div>
        <div className={cx("skelLine", "skelLg", "skeleton")} />
        <div className={cx("skelLine", "skelMd", "skeleton")} />
        <div className={cx("skelLine", "skelLg", "skeleton")} />
        <div className="btnRow">
          <div className={cx("skelBtn", "skeleton")} />
          <div className={cx("skelBtn", "skeleton")} />
        </div>
      </div>
    </section>
  );

  const SkeletonCard = ({ i }) => (
    <article className="card" key={i}>
      <div className="cardImg skeleton" />
      <div className="cardBody">
        <div className="metaRow">
          <div className="skelPill skeleton" />
          <div className={cx("skelLine", "skelSm", "skeleton")} style={{ margin: 0, height: 12 }} />
        </div>
        <div className={cx("skelLine", "skelLg", "skeleton")} />
        <div className={cx("skelLine", "skelMd", "skeleton")} />
        <div className={cx("skelLine", "skelLg", "skeleton")} />
      </div>
    </article>
  );

  return (
    <div className="fullBleed">
      <div className="page">
        <style>{styles}</style>

        <header className="hero">
          <div className="heroInner">
            <div className="crumbs">
              Home <span>›</span> CivicLink
            </div>

            <h1 className={cx("title", "slideTitle")}>Latest News</h1>
            <div className="subtitle">Latest updates from civic departments across the island</div>

            <div className="heroControls">
              <div className="searchWrap">
                <span className="searchIcon">🔎</span>
                <input
                  className="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search (place, province, location, route, reason)..."
                />
              </div>

              <button className="heroBtn" type="button" onClick={() => setFormOpen(true)}>
                + Add Notice
              </button>
            </div>
          </div>
        </header>

        <main className="content">
          <div className="wide">
            <section className="widgets">
              {widgets.map((w) => (
                <button
                  key={w.key}
                  className="widget"
                  type="button"
                  onClick={() => setDeptFilter(w.key)}
                  title={`Filter: ${w.title}`}
                >
                  <div className="widgetTop">
                    <h4 className="widgetTitle">
                      {w.icon} {w.title}
                    </h4>
                    <span className="badge">{w.tag}</span>
                  </div>
                  <div className="widgetValue">{w.value}</div>
                  <p className="widgetSub">{w.sub}</p>
                </button>
              ))}
            </section>

            {formOpen && (
              <div className="panel">
                <div className="panelHead">
                  <h3>Add a new notice (fake/demo)</h3>
                  <button className="btnGhost" type="button" onClick={() => setFormOpen(false)}>
                    Close
                  </button>
                </div>

                <div className="panelBody">
                  <form onSubmit={addNotice}>
                    <div className="formGrid">
                      <div className="field">
                        <label>Department</label>
                        <select className="selectLight" value={fDept} onChange={(e) => setFDept(e.target.value)}>
                          {DEPTS.filter((d) => d.key !== "ALL").map((d) => (
                            <option key={d.key} value={d.key}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="field">
                        <label>Place</label>
                        <input className="input" value={fPlace} onChange={(e) => setFPlace(e.target.value)} />
                      </div>

                      <div className="field">
                        <label>Province</label>
                        <select className="selectLight" value={fProvince} onChange={(e) => setFProvince(e.target.value)}>
                          {PROVINCES.map((p) => (
                            <option key={p} value={p}>
                              {p}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="field" style={{ gridColumn: "1 / -1" }}>
                        <label>Title</label>
                        <input
                          className="input"
                          value={fTitle}
                          onChange={(e) => setFTitle(e.target.value)}
                          placeholder="Example: Water cut notice for Western Province"
                        />
                      </div>

                      <div className="field" style={{ gridColumn: "1 / -1" }}>
                        <label>Reason</label>
                        <input
                          className="input"
                          value={fReason}
                          onChange={(e) => setFReason(e.target.value)}
                          placeholder="Example: pipeline maintenance work"
                        />
                      </div>

                      <div className="field">
                        <label>Start time</label>
                        <input className="input" value={fStart} onChange={(e) => setFStart(e.target.value)} />
                      </div>

                      <div className="field">
                        <label>End time</label>
                        <input className="input" value={fEnd} onChange={(e) => setFEnd(e.target.value)} />
                      </div>

                      <div className="field">
                        <label>Severity</label>
                        <select className="selectLight" value={fSeverity} onChange={(e) => setFSeverity(e.target.value)}>
                          {SEVERITY.map((s) => (
                            <option key={s} value={s}>
                              {s}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="field" style={{ gridColumn: "1 / -1" }}>
                        <label>Locations (comma separated)</label>
                        <input
                          className="input"
                          value={fLocations}
                          onChange={(e) => setFLocations(e.target.value)}
                          placeholder="Colombo, Dehiwala, Maharagama"
                        />
                        <div className="help">Used for Water/Electricity/Road/Rail. You can type any places.</div>
                      </div>

                      {fDept === "BUS" && (
                        <div className="field" style={{ gridColumn: "1 / -1" }}>
                          <label>Bus routes (comma separated)</label>
                          <input
                            className="input"
                            value={fRoutes}
                            onChange={(e) => setFRoutes(e.target.value)}
                            placeholder="100 (Pettah–Panadura), 138 (Pettah–Maharagama)"
                          />
                        </div>
                      )}

                      {fDept === "RAIL" && (
                        <div className="field" style={{ gridColumn: "1 / -1" }}>
                          <label>Rail line</label>
                          <input
                            className="input"
                            value={fRailLine}
                            onChange={(e) => setFRailLine(e.target.value)}
                            placeholder="Coastal Line"
                          />
                        </div>
                      )}
                    </div>

                    <div className="rowEnd">
                      <button className="btnGhost" type="button" onClick={() => setFormOpen(false)}>
                        Cancel
                      </button>
                      <button className="btnPrimary" type="submit">
                        Add Notice
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loading ? (
              <SkeletonFeatured />
            ) : featured ? (
              <section className={cx("featured", "fadeInUp")}>
                <div className="featuredImg" style={{ backgroundImage: `url(${featured.image})` }} />
                <div className="featuredBody">
                  <div className="metaRow">
                    <span className="pill">{deptMeta(featured.dept).name}</span>
                    <span>{buildLocationLine(featured)}</span>
                    <span className="dot">•</span>
                    <span>
                      {featured.start}–{featured.end}
                    </span>
                    <span className="dot">•</span>
                    <span>{featured.date}</span>
                  </div>

                  <h2 className="featuredTitle">{featured.title}</h2>
                  <p className="featuredExcerpt">{buildVerbiage(featured).split("\n\n")[1]}</p>

                  <div className="btnRow">
                    <button className="btnPrimary" type="button" onClick={() => setOpenNotice(featured)}>
                      Read Full Notice
                    </button>

                    <button
                      className={cx("btnGhost", isSaved(featured.id) && "btnSaved")}
                      type="button"
                      onClick={() => toggleSave(featured.id)}
                    >
                      {isSaved(featured.id) ? "Saved ✓" : "Save"}
                    </button>
                  </div>
                </div>
              </section>
            ) : (
              <div style={{ marginTop: 18, padding: 16, background: "#fff", borderRadius: 16 }}>
                No notices found.
              </div>
            )}

            <div className="sectionHead">
              <h3>Latest Notices</h3>
              <span className="small">
                Filtered: {deptFilter === "ALL" ? "All departments" : deptMeta(deptFilter).name}
              </span>
            </div>

            <section className="grid">
              {loading
                ? Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} i={i} />)
                : latest.map((n) => (
                    <article className={cx("card", "fadeInUp")} key={n.id}>
                      <div className="cardImg" style={{ backgroundImage: `url(${n.image})` }} />
                      <div className="cardBody">
                        <div className="metaRow">
                          <span className="pill">{deptMeta(n.dept).name}</span>
                          <span>{buildLocationLine(n)}</span>
                        </div>

                        <h4 className="cardTitle">{n.title}</h4>
                        <p className="cardExcerpt">{buildVerbiage(n).split("\n\n")[1]}</p>

                        <div className="cardFooter">
                          <button className="link" type="button" onClick={() => setOpenNotice(n)}>
                            Read notice →
                          </button>

                          <button
                            className={cx("btnGhost", isSaved(n.id) && "btnSaved")}
                            type="button"
                            onClick={() => toggleSave(n.id)}
                          >
                            {isSaved(n.id) ? "Saved ✓" : "Save"}
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
            </section>

            {!loading && latestAll.length > 0 && (
              <div className="loadMoreWrap">
                {hasMore ? (
                  <button className="btnLoad" type="button" onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}>
                    Load more
                  </button>
                ) : (
                  <span className="small">You’ve reached the end.</span>
                )}
              </div>
            )}
          </div>
        </main>

        {openNotice && (
          <div className="modalBackdrop" onClick={() => setOpenNotice(null)} role="dialog" aria-modal="true">
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <div className="modalHero" style={{ backgroundImage: `url(${openNotice.image})` }}>
                <button className="modalClose" onClick={() => setOpenNotice(null)} type="button">
                  ✕ Close
                </button>
              </div>

              <div className="modalBody">
                <div className="metaRow">
                  <span className="pill">{deptMeta(openNotice.dept).name}</span>
                  <span>{buildLocationLine(openNotice)}</span>
                  <span className="dot">•</span>
                  <span>
                    {openNotice.start}–{openNotice.end}
                  </span>
                  <span className="dot">•</span>
                  <span>{openNotice.date}</span>
                  <span className="dot">•</span>
                  <span>Severity: {openNotice.severity}</span>
                </div>

                <h2 className="modalTitle">{openNotice.title}</h2>
                <p className="modalContent">{buildVerbiage(openNotice)}</p>
              </div>

              <div className="modalFooter">
                <button
                  className={cx("btnGhost", isSaved(openNotice.id) && "btnSaved")}
                  type="button"
                  onClick={() => toggleSave(openNotice.id)}
                >
                  {isSaved(openNotice.id) ? "Saved ✓" : "Save"}
                </button>

                <button className="btnPrimary" type="button" onClick={() => setOpenNotice(null)}>
                  Done
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
