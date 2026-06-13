import Link from "next/link";
import { notFound } from "next/navigation";
import { createAuthClient } from "@/lib/supabase/server-auth";
import { OutcomeButtons } from "@/components/portal/OutcomeButtons";

export const dynamic = "force-dynamic";

interface DeliveryDetail {
  id: string;
  delivered_at: string;
  is_intro_free: boolean;
  price: number;
  outcome: string | null;
  contacted_at: string | null;
  leads: {
    id: string;
    full_name: string;
    phone: string;
    email: string;
    city: string;
    address_line1: string | null;
    postal_code: string | null;
    service_type: string;
    timeline: string | null;
    project_details: string | null;
    created_at: string;
  } | null;
}

const TIMELINE_LABEL: Record<string, string> = {
  asap: "As soon as possible",
  this_month: "Within a month",
  researching: "Just researching",
};

export default async function LeadDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createAuthClient();

  const { data: delivery } = await supabase
    .from("lead_deliveries")
    .select(
      "id, delivered_at, is_intro_free, price, outcome, contacted_at, leads(id, full_name, phone, email, city, address_line1, postal_code, service_type, timeline, project_details, created_at)",
    )
    .eq("id", id)
    .maybeSingle<DeliveryDetail>();

  if (!delivery || !delivery.leads) notFound();
  const lead = delivery.leads;

  const { data: enr } = await supabase
    .from("lead_enrichment")
    .select(
      "lead_grade, lead_score, owner_occupied, year_built, property_value, phone_line_type, area_median_income, area_median_home_value, need_flags",
    )
    .eq("lead_id", lead.id)
    .maybeSingle<{
      lead_grade: string | null;
      lead_score: number | null;
      owner_occupied: boolean | null;
      year_built: number | null;
      property_value: number | null;
      phone_line_type: string | null;
      area_median_income: number | null;
      area_median_home_value: number | null;
      need_flags: string[] | null;
    }>();

  const occupancy =
    enr?.owner_occupied == null
      ? "Unverified"
      : enr.owner_occupied
        ? "Owner-occupied"
        : "Likely renter";

  const money = (n: number | null | undefined) =>
    n == null ? "—" : `$${n.toLocaleString("en-US")}`;

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/portal" className="text-sm font-medium text-brand-700 hover:text-brand-800">
        ← Back to leads
      </Link>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-2xl font-bold text-ink-900">{lead.full_name}</h1>
        {enr?.lead_grade && (
          <span className="rounded-lg bg-brand-100 px-3 py-1 text-sm font-bold text-brand-800">
            Grade {enr.lead_grade} · {enr.lead_score ?? "—"}/100
          </span>
        )}
      </div>

      {/* Contact — the money info */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <a
          href={`tel:${lead.phone}`}
          className="rounded-2xl border border-brand-200 bg-brand-50 p-5 transition-colors hover:bg-brand-100"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-brand-700">Call</p>
          <p className="mt-1 font-display text-xl font-bold text-ink-900">{lead.phone}</p>
        </a>
        <a
          href={`mailto:${lead.email}`}
          className="rounded-2xl border border-ink-200 bg-white p-5 transition-colors hover:bg-ink-50"
        >
          <p className="text-xs font-medium uppercase tracking-wide text-ink-500">Email</p>
          <p className="mt-1 truncate font-display text-lg font-bold text-ink-900">
            {lead.email}
          </p>
        </a>
      </div>

      {/* Project details */}
      <div className="mt-4 rounded-2xl border border-ink-200 bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink-900">Project</h2>
        <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          <Detail label="Service" value={lead.service_type} />
          <Detail
            label="Timeline"
            value={lead.timeline ? TIMELINE_LABEL[lead.timeline] ?? lead.timeline : "—"}
          />
          <Detail
            label="Location"
            value={[lead.address_line1, lead.city, lead.postal_code].filter(Boolean).join(", ")}
          />
          <Detail
            label="Received"
            value={new Date(delivery.delivered_at).toLocaleString("en-US")}
          />
        </dl>
        {lead.project_details && (
          <div className="mt-4 rounded-xl bg-ink-50 p-4 text-sm text-ink-700">
            “{lead.project_details}”
          </div>
        )}
      </div>

      {/* Enrichment */}
      <div className="mt-4 rounded-2xl border border-ink-200 bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink-900">Lead insights</h2>
        <p className="mt-1 text-xs text-ink-500">
          Area figures are modeled estimates for context only — not verified individual data.
        </p>
        <dl className="mt-4 grid gap-x-8 gap-y-3 sm:grid-cols-2">
          <Detail label="Occupancy" value={occupancy} />
          {enr?.year_built ? <Detail label="Year built" value={String(enr.year_built)} /> : null}
          {enr?.property_value ? (
            <Detail label="Assessed value" value={money(enr.property_value)} />
          ) : null}
          {enr?.phone_line_type ? (
            <Detail label="Phone type" value={enr.phone_line_type} />
          ) : null}
          <Detail label="Area median income (est.)" value={money(enr?.area_median_income)} />
          <Detail label="Area median home value (est.)" value={money(enr?.area_median_home_value)} />
          {enr?.need_flags && enr.need_flags.length > 0 && (
            <Detail label="Signals" value={enr.need_flags.join(", ")} />
          )}
        </dl>
      </div>

      {/* Outcome */}
      <div className="mt-4 rounded-2xl border border-ink-200 bg-white p-6">
        <h2 className="font-display text-lg font-bold text-ink-900">Update status</h2>
        <p className="mt-1 text-sm text-ink-600">
          Let us know how it goes — it helps us send you better leads.
        </p>
        <div className="mt-4">
          <OutcomeButtons deliveryId={delivery.id} current={delivery.outcome} />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-ink-500">{label}</dt>
      <dd className="mt-0.5 text-sm font-medium text-ink-900">{value || "—"}</dd>
    </div>
  );
}
