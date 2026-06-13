import { getAdminServiceClient } from "@/lib/admin";

export const dynamic = "force-dynamic";

interface BuyerRow {
  id: string;
  name: string;
  trade: string;
  contact_email: string | null;
  service_areas: string[];
  min_grade: string;
  price_per_lead: number;
  active: boolean;
}

export default async function AdminBuyersPage() {
  const supabase = await getAdminServiceClient();
  if (!supabase) {
    return (
      <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        Set <code>SUPABASE_SERVICE_ROLE_KEY</code> to view buyers.
      </p>
    );
  }

  const { data: buyers } = await supabase
    .from("buyers")
    .select("id, name, trade, contact_email, service_areas, min_grade, price_per_lead, active")
    .order("created_at", { ascending: false })
    .returns<BuyerRow[]>();

  const rows = buyers ?? [];

  return (
    <div>
      <h1 className="mb-2 font-display text-2xl font-bold text-ink-900">
        Buyers <span className="text-ink-400">({rows.length})</span>
      </h1>
      <p className="mb-6 text-sm text-ink-500">
        Buyers + portal logins are provisioned via SQL/MCP for now (a create-buyer form is
        a future admin feature).
      </p>
      {rows.length === 0 ? (
        <p className="rounded-xl border border-dashed border-ink-300 bg-white p-8 text-center text-sm text-ink-500">
          No buyers yet.
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-ink-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-ink-200 bg-ink-50 text-xs uppercase tracking-wide text-ink-500">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Trade</th>
                <th className="hidden px-4 py-3 font-medium sm:table-cell">Areas</th>
                <th className="px-4 py-3 font-medium">Min grade</th>
                <th className="px-4 py-3 font-medium">$/lead</th>
                <th className="px-4 py-3 font-medium">Active</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {rows.map((b) => (
                <tr key={b.id} className="hover:bg-ink-50/60">
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink-900">{b.name}</div>
                    <div className="text-xs text-ink-500">{b.contact_email}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-700">{b.trade}</td>
                  <td className="hidden px-4 py-3 text-ink-600 sm:table-cell">
                    {b.service_areas.length ? b.service_areas.join(", ") : "All"}
                  </td>
                  <td className="px-4 py-3 text-ink-700">{b.min_grade}</td>
                  <td className="px-4 py-3 text-ink-700">${b.price_per_lead}</td>
                  <td className="px-4 py-3">
                    {b.active ? (
                      <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-medium text-brand-700">
                        Active
                      </span>
                    ) : (
                      <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-medium text-ink-500">
                        Paused
                      </span>
                    )}
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
