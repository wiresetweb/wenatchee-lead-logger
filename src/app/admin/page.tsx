import Link from "next/link";
import { getAdminServiceClient } from "@/lib/admin";

export const dynamic = "force-dynamic";

const UPGRADE_TRIGGER = 200; // $ profit to unlock paid enrichment (docs/LEAD_ENRICHMENT §3)

function Stat({ label, value, sub }: { label: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border border-ink-200 bg-white p-5">
      <p className="text-xs uppercase tracking-wide text-ink-500">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold text-ink-900">{value}</p>
      {sub && <p className="mt-0.5 text-xs text-ink-500">{sub}</p>}
    </div>
  );
}

export default async function AdminOverview() {
  const supabase = await getAdminServiceClient();
  if (!supabase) {
    return (
      <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        Supabase service role isn&apos;t configured. Set <code>SUPABASE_SERVICE_ROLE_KEY</code>{" "}
        to view admin data.
      </p>
    );
  }

  const [{ count: totalLeads }, { data: grades }, { data: deliveries }, { data: recent }] =
    await Promise.all([
      supabase.from("leads").select("id", { count: "exact", head: true }),
      supabase.from("lead_enrichment").select("lead_grade").returns<{ lead_grade: string | null }[]>(),
      supabase
        .from("lead_deliveries")
        .select("price, is_intro_free")
        .returns<{ price: number; is_intro_free: boolean }[]>(),
      supabase
        .from("leads")
        .select("id, created_at, full_name, city, service_type, status")
        .order("created_at", { ascending: false })
        .limit(8)
        .returns<
          {
            id: string;
            created_at: string;
            full_name: string;
            city: string;
            service_type: string;
            status: string;
          }[]
        >(),
    ]);

  const gradeCounts = { A: 0, B: 0, C: 0, reject: 0 } as Record<string, number>;
  for (const g of grades ?? []) if (g.lead_grade) gradeCounts[g.lead_grade] = (gradeCounts[g.lead_grade] ?? 0) + 1;

  const paid = (deliveries ?? []).filter((d) => !d.is_intro_free);
  const revenue = paid.reduce((sum, d) => sum + Number(d.price || 0), 0);
  const introFree = (deliveries ?? []).filter((d) => d.is_intro_free).length;
  const progress = Math.min(100, Math.round((revenue / UPGRADE_TRIGGER) * 100));

  return (
    <div className="space-y-8">
      <h1 className="font-display text-2xl font-bold text-ink-900">Overview</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Total leads" value={String(totalLeads ?? 0)} />
        <Stat
          label="Lead grades"
          value={`${gradeCounts.A} / ${gradeCounts.B} / ${gradeCounts.C}`}
          sub="A / B / C"
        />
        <Stat
          label="Revenue"
          value={`$${revenue.toLocaleString("en-US")}`}
          sub={`${paid.length} paid · ${introFree} free intro`}
        />
        <Stat label="Deliveries" value={String((deliveries ?? []).length)} />
      </div>

      {/* Enrichment upgrade trigger progress */}
      <div className="rounded-2xl border border-ink-200 bg-white p-6">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="font-display text-lg font-bold text-ink-900">
              Paid-enrichment upgrade trigger
            </h2>
            <p className="mt-1 text-sm text-ink-600">
              At ${UPGRADE_TRIGGER} profit, turn on paid property + phone enrichment.
            </p>
          </div>
          <p className="font-display text-xl font-bold text-brand-700">
            ${revenue.toLocaleString("en-US")} / ${UPGRADE_TRIGGER}
          </p>
        </div>
        <div className="mt-4 h-3 overflow-hidden rounded-full bg-ink-100">
          <div className="h-full rounded-full bg-brand-600" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Recent leads */}
      <div>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-bold text-ink-900">Recent leads</h2>
          <Link href="/admin/leads" className="text-sm font-medium text-brand-700 hover:underline">
            View all →
          </Link>
        </div>
        {(recent ?? []).length === 0 ? (
          <p className="rounded-xl border border-dashed border-ink-300 bg-white p-8 text-center text-sm text-ink-500">
            No leads yet. They&apos;ll show up here as they come in.
          </p>
        ) : (
          <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
            <table className="w-full text-left text-sm">
              <tbody className="divide-y divide-ink-100">
                {(recent ?? []).map((l) => (
                  <tr key={l.id} className="hover:bg-ink-50/60">
                    <td className="px-4 py-3 font-medium text-ink-900">
                      <Link href={`/admin/leads/${l.id}`} className="hover:text-brand-700">
                        {l.full_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-ink-600">{l.service_type}</td>
                    <td className="hidden px-4 py-3 text-ink-600 sm:table-cell">{l.city}</td>
                    <td className="px-4 py-3 text-ink-500">{l.status}</td>
                    <td className="hidden px-4 py-3 text-ink-400 md:table-cell">
                      {new Date(l.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
