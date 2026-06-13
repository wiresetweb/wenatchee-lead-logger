import { describe, it, expect } from "vitest";
import { buyerMatches, type MatchBuyer, type MatchLead } from "../delivery-match";

const buyer: MatchBuyer = {
  trade: "electrical",
  active: true,
  min_grade: "C",
  service_areas: [],
  service_types: [],
};
const lead: MatchLead = {
  trade: "electrical",
  city: "Wenatchee",
  service_type: "Electrical repair",
};

describe("buyerMatches", () => {
  it("matches an active same-trade buyer with no filters", () => {
    expect(buyerMatches(buyer, lead, "B")).toBe(true);
  });

  it("rejects inactive or wrong-trade buyers", () => {
    expect(buyerMatches({ ...buyer, active: false }, lead, "A")).toBe(false);
    expect(buyerMatches({ ...buyer, trade: "plumbing" }, lead, "A")).toBe(false);
  });

  it("enforces minimum grade", () => {
    expect(buyerMatches({ ...buyer, min_grade: "A" }, lead, "B")).toBe(false);
    expect(buyerMatches({ ...buyer, min_grade: "A" }, lead, "A")).toBe(true);
    expect(buyerMatches({ ...buyer, min_grade: "B" }, lead, "A")).toBe(true);
  });

  it("respects service-area allowlist case-insensitively", () => {
    expect(buyerMatches({ ...buyer, service_areas: ["wenatchee"] }, lead, "B")).toBe(true);
    expect(buyerMatches({ ...buyer, service_areas: ["Chelan"] }, lead, "B")).toBe(false);
  });

  it("respects service-type allowlist", () => {
    expect(
      buyerMatches({ ...buyer, service_types: ["Electrical repair"] }, lead, "B"),
    ).toBe(true);
    expect(buyerMatches({ ...buyer, service_types: ["EV charger"] }, lead, "B")).toBe(false);
  });
});
