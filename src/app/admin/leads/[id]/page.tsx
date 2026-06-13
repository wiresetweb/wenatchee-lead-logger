import Link from "next/link";
import { notFound } from "next/navigation";
import { getAdminServiceClient } from "@/lib/admin";
import { DeleteLeadButton } from "@/components/admin/DeleteLeadButton";

export const dynamic = "force-dynamic";

export default async function AdminLeadDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await getAdminServiceClient();
  if (!supabase) {
    return (
      <p className="rounded-xl bg-amber-50 p-4 text-sm text-amber-800">
        Set <code>SUPABASE_SERVICE_ROLE_KEY</code> to view this lead.
      </p>
    );
  }

  const { data: lead } = await supabase
    .from("leads")
    .select("*")
    .eq("id", id)
    .maybeSingle<Record<string, unknown>>();
  if (!lead) notFound();

  const { data: enrichment } = await supabase
    .from("lead_enrichment")
    .select("*")
    .eq("lead_id", id)
    .maybeSingle<Record<string, unknown>>();

  const { data: deliveries } = await supabase
    .from("lead_deliveries")
    .select("id, delivered_at, price, is_intro_free, status, outcome, buyers(name)")
    .eq("lead_id", id)
    .returns<
      {
        id: string;
        delivered_at: string;
        price: number;
        is_intro_free: boolean;
        status: string;
        outcome: string | null;
        buyers: { name: string } | null;
      }[]
    >();

  const fmt = (v: unknown) =>
    v == null || v === "" ? "—" : typeof v === "object" ? JSON.stringify(v) : String(v);

  const leadFields = [
    "full_name",
    "phone",
    "email",
    "service_type",
    "timeline",
    "project_details",
    "address_line1",
    "city",
    "postal_code",
    "county",
    "status",
    "consent_at",
    "consent_version",
    "ip",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "landing_page",
    "created_at",
  ];
  const enrichFields = enrichment
    ? [
        "lead_grade",
        "lead_score",
        "owner_occupied",
        "property_value",
        "year_built",
        "area_median_income",
        "area_median_home_value",
        "census_tract",
        "email_valid",
        "email_disposable",
        "phone_valid",
        "need_flags",
        "fraud_flags",
        "enriched_at",
      ]
    : [];

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/admin/leads" className="text-sm font-medium text-brand-700 hover:underline">
        ← All leads
      </Link>
      <div className="mt-3 flex items-center justify-between gap-4">
        <h1 className="font-display text-2xl font-bold text-ink-900">
          {fmt(lead.full_name)}
        </h1>
        <DeleteLeadButton
          id={id}
          name={typeof lead.full_name === "string" ? lead.full_name : undefined}
          redirectTo="/admin/leads"
          label="Delete lead"
        />
      </div>

      <Section title="Lead">
        <Table fields={leadFields} data={lead} fmt={fmt} />
      </Section>

      <Section title="Enrichment">
        {enrichment ? (
          <Table fields={enrichFields} data={enrichment} fmt={fmt} />
        ) : (
          <p className="text-sm text-ink-500">Not enriched yet.</p>
        )}
      </Section>

      <Section title="Deliveries">
        {(deliveries ?? []).length === 0 ? (
          <p className="text-sm text-ink-500">Not delivered to any buyer.</p>
        ) : (
          <ul className="space-y-2">
            {(deliveries ?? []).map((d) => (
              <li key={d.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                <span className="font-medium text-ink-900">{d.buyers?.name ?? "—"}</span>
                <span className="text-ink-600">
                  {d.is_intro_free ? "Free intro" : `$${Number(d.price).toLocaleString("en-US")}`} ·{" "}
                  {d.status}
                  {d.outcome ? ` · ${d.outcome}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mt-5 rounded-2xl border border-ink-200 bg-white p-6">
      <h2 className="mb-3 font-display text-lg font-bold text-ink-900">{title}</h2>
      {children}
    </div>
  );
}

function Table({
  fields,
  data,
  fmt,
}: {
  fields: string[];
  data: Record<string, unknown>;
  fmt: (v: unknown) => string;
}) {
  return (
    <dl className="grid gap-x-8 gap-y-2 sm:grid-cols-2">
      {fields.map((f) => (
        <div key={f} className="flex justify-between gap-4 border-b border-ink-50 py-1">
          <dt className="text-xs uppercase tracking-wide text-ink-400">{f}</dt>
          <dd className="text-right text-sm text-ink-800">{fmt(data[f])}</dd>
        </div>
      ))}
    </dl>
  );
}
