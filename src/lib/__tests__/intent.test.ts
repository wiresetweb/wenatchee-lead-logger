import { describe, it, expect } from "vitest";
import { parseJobIntent } from "../enrichment/intent";

describe("parseJobIntent", () => {
  it("tags a panel upgrade as a large job", () => {
    const r = parseJobIntent("Panel upgrade", "Need to upgrade to a 200 amp service");
    expect(r.tags).toContain("panel_upgrade");
    expect(r.valueBand).toBe("large");
  });

  it("picks the highest value band across multiple matches", () => {
    const r = parseJobIntent("Electrical", "Add some outlets and also rewire the whole house");
    expect(r.tags).toEqual(expect.arrayContaining(["outlets_switches", "rewire"]));
    expect(r.valueBand).toBe("large");
  });

  it("detects an EV charger as medium", () => {
    const r = parseJobIntent("EV charger install", "Tesla wall connector in the garage");
    expect(r.tags).toContain("ev_charger");
    expect(r.valueBand).toBe("medium");
  });

  it("flags urgent safety language", () => {
    const r = parseJobIntent("Electrical", "There's a burning smell and sparks from an outlet");
    expect(r.urgentSafety).toBe(true);
  });

  it("returns unknown band when nothing matches", () => {
    const r = parseJobIntent("Something else", "");
    expect(r.tags).toEqual([]);
    expect(r.valueBand).toBe("unknown");
    expect(r.urgentSafety).toBe(false);
  });
});
