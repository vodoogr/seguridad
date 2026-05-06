import {
  AlertTriangle,
  CalendarDays,
  ClipboardCheck,
  FileText,
  ShieldCheck,
  Users
} from "lucide-react";

export const navItems = [
  { label: "Panel", href: "/" },
  { label: "Incidencias", href: "/incidencias" },
  { label: "Riesgos", href: "/riesgos" },
  { label: "Inspecciones", href: "/inspecciones" },
  { label: "Acciones", href: "/acciones" },
  { label: "Comite", href: "/comite" },
  { label: "Documentacion", href: "/documentacion" },
  { label: "Administrador", href: "/administrador" }
];

export const metrics = [
  { label: "Riesgos abiertos", value: "18", detail: "5 criticos", icon: AlertTriangle },
  { label: "Acciones pendientes", value: "27", detail: "9 vencen esta semana", icon: ClipboardCheck },
  { label: "Inspecciones", value: "12", detail: "3 programadas", icon: ShieldCheck },
  { label: "Comite PRL", value: "6", detail: "miembros activos", icon: Users }
];

export const risks = [
  {
    id: "R-001",
    area: "Muelles de carga",
    risk: "Atropello por carretillas",
    level: "Critico",
    owner: "Jefe de turno",
    due: "10/05/2026",
    status: "Abierto"
  },
  {
    id: "R-002",
    area: "Picking altura",
    risk: "Caida de objetos",
    level: "Alto",
    owner: "Coordinador PRL",
    due: "14/05/2026",
    status: "En curso"
  },
  {
    id: "R-003",
    area: "Camara frigorifica",
    risk: "Exposicion a bajas temperaturas",
    level: "Medio",
    owner: "Mantenimiento",
    due: "22/05/2026",
    status: "Controlado"
  }
];

export const inspections = [
  {
    id: "I-014",
    area: "Zona expediciones",
    type: "Inspeccion mensual",
    date: "08/05/2026",
    owner: "Tecnico PRL",
    result: "Programada"
  },
  {
    id: "I-013",
    area: "Estanterias",
    type: "Revision estructural",
    date: "30/04/2026",
    owner: "Mantenimiento",
    result: "Con observaciones"
  },
  {
    id: "I-012",
    area: "Carga de baterias",
    type: "Verificacion normativa",
    date: "24/04/2026",
    owner: "Coordinador PRL",
    result: "Apta"
  }
];

export const actions = [
  {
    id: "A-021",
    task: "Instalar espejo convexo en cruce de pasillo 4",
    risk: "R-001",
    owner: "Mantenimiento",
    due: "09/05/2026",
    status: "Pendiente"
  },
  {
    id: "A-020",
    task: "Actualizar procedimiento de bloqueo de muelles",
    risk: "R-001",
    owner: "Jefe de almacen",
    due: "12/05/2026",
    status: "En curso"
  },
  {
    id: "A-019",
    task: "Formacion sobre manipulacion segura en altura",
    risk: "R-002",
    owner: "RRHH",
    due: "20/05/2026",
    status: "Planificada"
  }
];

export const committee = {
  nextDate: "15 mayo 2026",
  members: [
    "Responsable PRL",
    "Jefe de almacen",
    "Delegado de prevencion",
    "Mantenimiento",
    "RRHH",
    "Representante operaciones"
  ],
  agenda: [
    "Revision de accidentes e incidentes",
    "Seguimiento de medidas correctoras",
    "Planificacion de simulacro de evacuacion"
  ]
};

export const documents: Array<{
  name: string;
  type: string;
  updated: string;
  icon: typeof FileText;
  fileName?: string;
  fileType?: string;
}> = [
  { name: "Evaluacion de riesgos del almacen", type: "Evaluacion", updated: "02/05/2026", icon: FileText },
  { name: "Plan de emergencia y evacuacion", type: "Plan", updated: "18/04/2026", icon: FileText },
  { name: "Procedimiento de carretillas", type: "Procedimiento", updated: "10/04/2026", icon: FileText }
];

export const calendarItems = [
  { title: "Inspeccion muelles", date: "08/05/2026", icon: CalendarDays },
  { title: "Reunion comite PRL", date: "15/05/2026", icon: CalendarDays },
  { title: "Simulacro evacuacion", date: "28/05/2026", icon: CalendarDays }
];

export const incidents = [
  {
    id: "INC-001",
    title: "Golpe leve en zona de picking",
    area: "Picking",
    severity: "Media",
    owner: "Jefe de turno",
    date: "03/05/2026",
    status: "Abierta"
  }
];

export const appUsers = [
  {
    id: "USR-001",
    name: "Administrador PRL",
    email: "admin@empresa.com",
    role: "Administrador",
    status: "Activo"
  }
];
