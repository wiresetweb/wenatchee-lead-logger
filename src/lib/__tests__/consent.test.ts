import { describe, it, expect } from "vitest";
import { sameDayContactLine, sameDayBadge, CONSENT_TEXT } from "../consent";
import { isDisposableEmail } from "../enrichment/email";

function at(hour: number) {
  const d = new Date();
  d.setHours(hour, 0, 0, 0);
  return d;
}

describe("same-day cutoff (5pm)", () => {
  it("promises same-day before 5pm", () => {
    expect(sameDayContactLine(at(9))).toMatch(/same day/i);
    expect(sameDayBadge(at(16))).toMatch(/same-day/i);
  });

  it("falls back to next business day at/after 5pm", () => {
    expect(sameDayContactLine(at(17))).toMatch(/next business day/i);
    expect(sameDayContactLine(at(21))).toMatch(/next business day/i);
    expect(sameDayBadge(at(18))).toMatch(/next-business-day/i);
  });
});

describe("consent text", () => {
  it("identifies the seller and references opt-out (TCPA)", () => {
    expect(CONSENT_TEXT).toMatch(/Emerald Lead Co\./);
    expect(CONSENT_TEXT.toLowerCase()).toContain("opt out");
    expect(CONSENT_TEXT.toLowerCase()).toContain("consent is not a condition");
  });
});

describe("isDisposableEmail", () => {
  it("flags known throwaway domains, allows real ones", () => {
    expect(isDisposableEmail("x@mailinator.com")).toBe(true);
    expect(isDisposableEmail("homeowner@gmail.com")).toBe(false);
    expect(isDisposableEmail("not-an-email")).toBe(false);
  });
});
