import { describe, it, expect } from "vitest";
import { computeOwnership } from "../enrichment/ownership";

const recentSale = new Date(Date.now() - 90 * 24 * 3600 * 1000).toISOString();
const oldSale = new Date(Date.now() - 8 * 365.25 * 24 * 3600 * 1000).toISOString();

describe("computeOwnership", () => {
  it("treats matching mailing + property address as owner-occupied", () => {
    const r = computeOwnership({
      situsAddress: "123 Main St",
      mailingAddress: "123 Main Street",
      saleDate: null,
      salePrice: null,
      nameMatch: "unknown",
    });
    expect(r.ownerOccupied).toBe(true);
    expect(r.absenteeOwner).toBe(false);
    expect(r.basis).toBe("mailing_match");
  });

  it("flags a different mailing address as an absentee owner", () => {
    const r = computeOwnership({
      situsAddress: "123 Main St, Wenatchee",
      mailingAddress: "9000 Investor Blvd, Seattle",
      saleDate: null,
      salePrice: null,
      nameMatch: "matched",
    });
    expect(r.ownerOccupied).toBe(false);
    expect(r.absenteeOwner).toBe(true);
    expect(r.basis).toBe("mailing_mismatch");
  });

  it("falls back to the name match when no mailing address exists", () => {
    const r = computeOwnership({
      situsAddress: "123 Main St",
      mailingAddress: null,
      saleDate: null,
      salePrice: null,
      nameMatch: "matched",
    });
    expect(r.ownerOccupied).toBe(true);
    expect(r.basis).toBe("name_match");
  });

  it("marks a recent purchase as a new homeowner", () => {
    const r = computeOwnership({
      situsAddress: "1 A St",
      mailingAddress: "1 A St",
      saleDate: recentSale,
      salePrice: 450000,
      nameMatch: "unknown",
    });
    expect(r.newHomeowner).toBe(true);
    expect(r.tenureYears).toBeLessThanOrEqual(1);
  });

  it("computes tenure for a long-time owner", () => {
    const r = computeOwnership({
      situsAddress: "1 A St",
      mailingAddress: "1 A St",
      saleDate: oldSale,
      salePrice: null,
      nameMatch: "unknown",
    });
    expect(r.newHomeowner).toBe(false);
    expect(r.tenureYears).toBeGreaterThan(7);
  });

  it("parses ArcGIS epoch-millisecond sale dates", () => {
    const r = computeOwnership({
      situsAddress: "1 A St",
      mailingAddress: "1 A St",
      saleDate: String(Date.now() - 30 * 24 * 3600 * 1000),
      salePrice: null,
      nameMatch: "unknown",
    });
    expect(r.newHomeowner).toBe(true);
  });
});
