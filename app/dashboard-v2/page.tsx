import { AlertTriangle, CalendarDays, CheckCircle2, ClipboardCheck, ShieldCheck, Users } from "lucide-react";
import { KpiCard } from "../../components/cards/KpiCard";
import { StatusCard } from "../../components/cards/StatusCard";
import { DataTableShell } from "../../components/data-display/DataTableShell";
import { StatusBadgeV2 } from "../../components/data-display/StatusBadge";
import { AppShellV2 } from "../../components/layout/AppShellV2";
import { FadeIn } from "../../components/motion/FadeIn";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { getActions, getCommittee, getDashboardStats, getRisks } from "../../lib/repository";
import { navItems } from "../data";

const metricIcons = {
  "Riesgos abiertos": AlertTriangle,
  "Acciones pendientes": ClipboardCheck,
  Inspecciones: ShieldCheck,
  "Comite PRL": Users
};

export default async function DashboardV2Page() {
  const [committee, risks, actions, stats] = await Promise.all([
    getCommittee(),
    getRisks(),
    getActions(),
    getDashboardStats()
  ]);

  return (
    <AppShellV2 navItems={navItems}>
      <FadeIn>
        <section className="mb-6 overflow-hidden rounded-xl border border-slate-800 bg-slate-950 p-6 text-white shadow-panel">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="mb-2 text-sm font-semibold text-blue-300">Vista previa UI V2</p>
              <h1 className="text-3xl font-bold tracking-normal md:text-4xl">Panel operativo PRL</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-300">
                Nueva interfaz SaaS con componentes reutilizables, jerarquia visual limpia y datos actuales de la aplicacion.
              </p>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700" variant="default">Preview aislado</Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = metricIcons[stat.label as keyof typeof metricIcons] ?? ShieldCheck;
            const tone = stat.label.includes("Riesgos") ? "danger" : stat.label.includes("Acciones") ? "warning" : "info";
            return <KpiCard detail={stat.detail} icon={Icon} key={stat.label} label={stat.label} tone={tone} value={stat.value} />;
          })}
        </section>

        <section className="mt-6 grid gap-6 xl:grid-cols-[1fr_360px]">
          <DataTableShell count={risks.length} title="Riesgos prioritarios">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="text-xs uppercase text-slate-500">
                <tr className="border-b border-slate-200">
                  <th className="px-3 py-3">Area</th>
                  <th className="px-3 py-3">Riesgo</th>
                  <th className="px-3 py-3">Nivel</th>
                  <th className="px-3 py-3">Responsable</th>
                  <th className="px-3 py-3">Fecha</th>
                </tr>
              </thead>
              <tbody>
                {risks.map((risk) => (
                  <tr className="border-b border-slate-100 last:border-0" key={risk.id}>
                    <td className="px-3 py-4 font-semibold text-slate-800">{risk.area}</td>
                    <td className="px-3 py-4 text-slate-700">{risk.risk}</td>
                    <td className="px-3 py-4"><StatusBadgeV2 status={risk.level} /></td>
                    <td className="px-3 py-4 text-slate-600">{risk.owner}</td>
                    <td className="px-3 py-4 text-slate-600">{risk.due}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </DataTableShell>

          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarDays size={18} />
                  Proxima reunion
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-bold text-slate-950">{committee.nextDate}</p>
                <ul className="mt-5 grid gap-3">
                  {committee.agenda.map((item) => (
                    <li className="flex items-center gap-3 text-sm text-slate-700" key={item}>
                      <CheckCircle2 className="text-blue-700" size={17} />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Acciones correctoras</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-3">
                {actions.slice(0, 3).map((action) => (
                  <StatusCard
                    icon={<ClipboardCheck size={20} />}
                    key={action.id}
                    status={action.status}
                    subtitle={`${action.owner} - ${action.due}`}
                    title={action.task}
                  />
                ))}
              </CardContent>
            </Card>
          </div>
        </section>
      </FadeIn>
    </AppShellV2>
  );
}
