import { describe, it, expect } from "vitest";
import { scoreLead, type ScoreInput } from "../enrichment/score";

const base: ScoreInput = {
  timeline: "researching",
  serviceType: "Electrical repair",
  hasAddress: false,
  phoneE164: true,
  emailMx: true,
  emailDisposable: false,
  isDuplicate: false,
  areaMedianIncome: 60_000,
};

describe("scoreLead", () => {
  it("grades a strong, urgent, high-ticket lead as A", () => {
    const res = scoreLead({
      ...base,
      timeline: "asap",
      serviceType: "Electrical panel / breaker box upgrade",
      hasAddress: true,
      areaMedianIncome: 95_000,
    });
    expect(res.grade).toBe("A");
    expect(res.score).toBeGreaterThanOrEqual(75);
    expect(res.needFlags).toContain("high_ticket_service");
  });

  it("flags and rejects a disposable-email duplicate", () => {
    const res = scoreLead({
      ...base,
      emailDisposable: true,
      isDuplicate: true,
      phoneE164: false,
      emailMx: false,
    });
    expect(res.fraudFlags).toContain("disposable_email");
    expect(res.fraudFlags).toContain("duplicate_recent");
    expect(res.grade).toBe("reject");
  });

  it("keeps the score within 0–100", () => {
    const maxed = scoreLead({
      ...base,
      timeline: "asap",
      serviceType: "Generator (standby/whole-home) installation",
      hasAddress: true,
      areaMedianIncome: 200_000,
    });
    expect(maxed.score).toBeLessThanOrEqual(100);
    expect(maxed.score).toBeGreaterThanOrEqual(0);
  });

  it("ranks an urgent panel upgrade above casual research", () => {
    const hot = scoreLead({ ...base, timeline: "asap", serviceType: "panel upgrade", hasAddress: true });
    const cold = scoreLead({ ...base, timeline: "researching", serviceType: "Lighting" });
    expect(hot.score).toBeGreaterThan(cold.score);
  });
});
