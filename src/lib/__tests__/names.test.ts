import { describe, it, expect } from "vitest";
import { matchOwnerName, ownerOccupiedFromMatch, isEntityOwner } from "../enrichment/names";

describe("matchOwnerName", () => {
  it("matches first + last in 'LAST FIRST' record format", () => {
    expect(matchOwnerName("John Smith", "SMITH JOHN A")).toBe("matched");
    expect(matchOwnerName("Robert Johnson", "JOHNSON ROBERT LEE")).toBe("matched");
  });

  it("matches 'LAST, FIRST' format", () => {
    expect(matchOwnerName("John Smith", "SMITH, JOHN")).toBe("matched");
  });

  it("matches a spouse listed in a joint record", () => {
    expect(matchOwnerName("Jane Smith", "SMITH JOHN & JANE")).toBe("matched");
  });

  it("returns no_match when neither name lines up (the fake-name case)", () => {
    expect(matchOwnerName("Test McTest", "GARCIA MARIA")).toBe("no_match");
    expect(matchOwnerName("Bob Jones", "SMITH JOHN")).toBe("no_match");
  });

  it("returns unknown for entity owners (LLC/trust) — not a renter", () => {
    expect(matchOwnerName("John Smith", "SMITH FAMILY TRUST")).toBe("unknown");
    expect(matchOwnerName("Bob Jones", "WENATCHEE RENTALS LLC")).toBe("unknown");
    expect(isEntityOwner("CASCADE HOLDINGS INC")).toBe(true);
  });

  it("returns unknown when no owner record is available", () => {
    expect(matchOwnerName("John Smith", null)).toBe("unknown");
    expect(matchOwnerName("John Smith", "")).toBe("unknown");
  });

  it("maps match results to owner_occupied", () => {
    expect(ownerOccupiedFromMatch("matched")).toBe(true);
    expect(ownerOccupiedFromMatch("no_match")).toBe(false);
    expect(ownerOccupiedFromMatch("unknown")).toBe(null);
  });
});
