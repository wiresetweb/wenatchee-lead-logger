import Link from "next/link";
import { createAuthClient } from "@/lib/supabase/server-auth";

export const dynamic = "force-dynamic";

interface DeliveryRow {
  id: string;
  delivered_at: string;
  is_intro_free: boolean;
  outcome: string | null;
  contacted_at: string | null;
  leads: {
    id: string;
    full_name: string;
    city: string;
    service_type: string;
    timeline: string | null;
    created_at: string;
  } | null;
}

const GRADE_STYLE: Record<string, string> = {
  A: "bg-brand-100 text-brand-800",
  B: "bg-amber-100 text-amber-800",
  C: "bg-ink-100 text-ink-700",
};

function GradeBadge({ grade }: { grade: string | null }) {
  if (!grade) return <span className="text-ink-400">—</span>;
  return (
    <span
      className={`inline-flex h-7 w-7 items-center justify-center rounded-lg text-sm font-bold ${
        GRADE_STYLE[grade] ?? "bg-ink-100 text-ink-700"
      }`}
    >
      {grade}
    </span>
  );
}

function OutcomePill({ outcome }: { outcome: string | null }) {
  if (!outcome)
    return (
      <span className="rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
        New
      </span>
    );
  const styles: Record<string, string> = {
    contacted: "bg-blue-50 text-blue-700",
    quoted: "bg-indigo-50 text-indigo-700",
    won: "bg-brand-50 text-brand-700",
    lost: "bg-ink-100 text-ink-500",
  };
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${styles[outcome] ?? "bg-ink-100 text-ink-600"}`}>
      {outcome}
    </span>
  );
}

export default async function PortalDashboard() {
  const supabase = await createAuthClient();

  // RLS scopes these to the signed-in buyer's deliveries only.
  const { data: deliveries } = await supabase
    .from("lead_deliveries")
    .select(
      "id, delivered_at, is_intro_free, outcome, contacted_at, leads(id, full_name, city, service_type, timeline, created_at)",
    )
    .order("delivered_at", { ascending: false })
    .returns<DeliveryRow[]>();

  // Enrichment grades (separate query; RLS-scoped via the same delivery join).
  const leadIds = (deliveries ?? []).map((d) => d.leads?.id).filter(Boolean) as string[];
  const gradeByLead = new Map<string, string | null>();
  if (leadIds.length) {
    const { data: enr } = await supabase
      .from("lead_enrichment")
      .select("lead_id, lead_grade")
      .in("lead_id", leadIds)
      .returns<{ lead_id: string; lead_grade: string | null }[]>();
    for (const e of enr ?? []) gradeByLead.set(e.lead_id, e.lead_grade);
  }

  const rows = deliveries ?? [];
  const newCount = rows.filter((d) => !d.outcome).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink-900">Your leads</h1>
          <p className="mt-1 text-sm text-ink-600">
            {rows.length} total · {newCount} new
          </p>
        </div>
      </div>

      {rows.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-ink-300 bg-white p-12 text-center">
          <p className="font-display text-lg font-bold text-ink-900">No leads yet</p>
          <p className="mt-2 text-sm text-ink-600">
            New leads in your service area will appear here the moment they come in — and
            you&apos;ll get an email too.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-200 bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Grade</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">City</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Received</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((d) => (
                <tr key={d.id} className="hover:bg-ink-50/60">
                  <td className="px-4 py-3">
                    <GradeBadge grade={d.leads ? gradeByLead.get(d.leads.id) ?? null : null} />
                  </td>
                  <td className="px-4 py-3 font-medium text-ink-900">
                    {d.leads?.full_name ?? "—"}
                    {d.is_intro_free && (
                      <span className="ml-2 rounded bg-brand-50 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-brand-700">
                        Free
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-ink-700">{d.leads?.service_type ?? "—"}</td>
                  <td className="hidden px-4 py-3 text-ink-600 sm:table-cell">
                    {d.leads?.city ?? "—"}
                  </td>
                  <td className="hidden px-4 py-3 text-ink-500 md:table-cell">
                    {new Date(d.delivered_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3">
                    <OutcomePill outcome={d.outcome} />
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/portal/leads/${d.id}`}
                      className="font-medium text-brand-700 hover:text-brand-800"
                    >
                      View →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
