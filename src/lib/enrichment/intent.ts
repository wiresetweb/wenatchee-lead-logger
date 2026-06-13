/**
 * Job intent parsing (docs/LEAD_ENRICHMENT.md). Turns the free-text project description
 * and the chosen service into structured buyer-facing signals: job tags, a rough value
 * band, and an urgent-safety flag. Keyword-based and free — no model calls. Helps buyers
 * prioritize and supports premium pricing for big-ticket jobs.
 */

export type JobValueBand = "small" | "medium" | "large" | "unknown";

export interface JobIntent {
  tags: string[];
  valueBand: JobValueBand;
  /** Language suggesting an electrical/structural hazard — call now. */
  urgentSafety: boolean;
}

interface Rule {
  tag: string;
  band: Exclude<JobValueBand, "unknown">;
  re: RegExp;
}

// Electrical + roofing. Keywords are distinct enough to run together regardless of trade.
const RULES: Rule[] = [
  // Electrical — large
  { tag: "panel_upgrade", band: "large", re: /panel|service upgrade|200\s*amp|100\s*amp|breaker box|fuse box|main service|meter base/i },
  { tag: "rewire", band: "large", re: /re-?wire|knob and tube|knob & tube|old wiring|cloth wiring|aluminum wiring|whole house wiring/i },
  { tag: "generator", band: "large", re: /generator|standby power|backup power|transfer switch/i },
  { tag: "new_construction", band: "large", re: /new construction|new build|addition|remodel|adu|accessory dwelling/i },
  // Electrical — medium
  { tag: "ev_charger", band: "medium", re: /ev charger|ev charging|car charger|level 2|tesla|wall connector/i },
  { tag: "subpanel", band: "medium", re: /sub-?panel|garage power|shop power|detached|outbuilding/i },
  { tag: "hot_tub_circuit", band: "medium", re: /hot tub|spa|pool|sauna/i },
  { tag: "heat_pump_circuit", band: "medium", re: /heat pump|mini-?split|mini split|hvac circuit|ac install/i },
  // Electrical — small
  { tag: "lighting", band: "small", re: /lighting|recessed|can light|fixture|chandelier|landscape light|under cabinet/i },
  { tag: "outlets_switches", band: "small", re: /outlet|receptacle|switch|gfci|usb outlet|dimmer/i },
  { tag: "troubleshoot", band: "small", re: /flicker|breaker (keeps|trips)|trips? when|not working|dead outlet|no power/i },
  // Roofing
  { tag: "roof_replacement", band: "large", re: /replace.*roof|new roof|tear-?off|full roof|re-?roof/i },
  { tag: "storm_damage", band: "large", re: /storm|hail|wind damage|fallen tree|tree damage/i },
  { tag: "roof_repair", band: "medium", re: /roof leak|leak|missing shingle|patch|flashing|repair.*roof/i },
];

const SAFETY = /spark|burning smell|smoke|shock|shocked|exposed wire|hot outlet|melting|fire|arc/i;

const BAND_RANK: Record<Exclude<JobValueBand, "unknown">, number> = { small: 1, medium: 2, large: 3 };

export function parseJobIntent(
  serviceType: string,
  projectDetails: string | null | undefined,
): JobIntent {
  const text = `${serviceType} ${projectDetails ?? ""}`;
  const tags: string[] = [];
  let topBand: JobValueBand = "unknown";

  for (const rule of RULES) {
    if (!rule.re.test(text)) continue;
    if (!tags.includes(rule.tag)) tags.push(rule.tag);
    if (topBand === "unknown" || BAND_RANK[rule.band] > BAND_RANK[topBand as Exclude<JobValueBand, "unknown">]) {
      topBand = rule.band;
    }
  }

  return { tags, valueBand: topBand, urgentSafety: SAFETY.test(text) };
}
