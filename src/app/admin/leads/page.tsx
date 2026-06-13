import Link from "next/link";
import { getAdminServiceClient } from "@/lib/admin";

export const dynamic = "force-dynamic";

interface LeadRow {
  id: string;
  created_at: string;
  full_name: string;
  city: string;
  service_type: string;
  status: string;
  lead_enrichment: { lead_grade: string | null; lead_score: number | null } | null;
}

const STATUS_STYLE: Record<string, string> = {
  new: "bg-ink-100 text-ink-600",
  scored: "bg-blue-50 text-blue-700",
  delivered: "bg-brand-50 text-brand-700",
  rejected: "bg-red-50 text-red-600",
};

export default async function AdminLeadsPage() {
  const supabase = await getAdminServiceClient();
  if (!supabase) {
    return (
      <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        Set <code>SUPABASE_SERVICE_ROLE_KEY</code> to view leads.
      </p>
    );
  }

  const { data: leads } = await supabase
    .from("leads")
    .select(
      "id, created_at, full_name, city, service_type, status, lead_enrichment(lead_grade, lead_score)",
    )
    .order("created_at", { ascending: false })
    .limit(200)
    .returns<LeadRow[]>();

  const rows = leads ?? [];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold text-ink-900">
        All leads <span className="text-ink-400">({rows.length})</span>
      </h1>
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-300 bg-white p-8 text-center text-sm text-ink-500">
          No leads yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-200 bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Grade</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Service</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">City</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="hidden px-4 py-3 font-medium md:table-cell">Created</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((l) => (
                <tr key={l.id} className="hover:bg-ink-50/60">
                  <td className="px-4 py-3">
                    <span className="font-bold text-ink-900">
                      {l.lead_enrichment?.lead_grade ?? "—"}
                    </span>
                    {l.lead_enrichment?.lead_score != null && (
                      <span className="ml-1 text-xs text-ink-400">
                        {l.lead_enrichment.lead_score}
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink-900">
                    <Link href={`/admin/leads/${l.id}`} className="hover:text-brand-700">
                      {l.full_name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{l.service_type}</td>
                  <td className="hidden px-4 py-3 text-ink-600 sm:table-cell">{l.city}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        STATUS_STYLE[l.status] ?? "bg-ink-100 text-ink-600"
                      }`}
                    >
                      {l.status}
                    </span>
                  </td>
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
  );
}
