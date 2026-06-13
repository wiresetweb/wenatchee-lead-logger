/** Local-SEO content helpers shared by the service×city pages. */
import type { Service } from "@/content/services";
import type { City } from "@/content/cities";
import { CITIES } from "@/content/cities";

export function fmtMoney(n: number): string {
  return `$${n.toLocaleString("en-US")}`;
}

/** The permitting authority note (all WA electrical work goes through L&I). */
export const WA_PERMIT_NOTE =
  "Electrical work in Washington is permitted and inspected through the Department of " +
  "Labor & Industries (L&I). A licensed electrician pulls the permit as part of the job, " +
  "so you don't have to.";

/** A localized intro paragraph, varied by city so pages aren't duplicates. */
export function localizedIntro(service: Service, city: City): string {
  return (
    `Need ${service.name.toLowerCase()} in ${city.name}? Cascade Home Connect matches ` +
    `${city.name} homeowners with trusted, licensed local electricians who do this work ` +
    `every day in ${city.county} County. ${city.blurb} It's always free, and a local pro ` +
    `reaches out the same day.`
  );
}

/** Up to `n` other cities for internal linking (same county first). */
export function nearbyCities(city: City, n = 5): City[] {
  const others = CITIES.filter((c) => c.slug !== city.slug);
  const sameCounty = others.filter((c) => c.county === city.county);
  const rest = others.filter((c) => c.county !== city.county);
  return [...sameCounty, ...rest].slice(0, n);
}

/** A city-specific cost FAQ prepended to the service's standard FAQs. */
export function cityCostFaq(service: Service, city: City) {
  return {
    q: `How much does ${service.name.toLowerCase()} cost in ${city.name}, WA?`,
    a:
      `In and around ${city.name} (${city.county} County), ${service.name.toLowerCase()} ` +
      `typically runs ${fmtMoney(service.costLow)}–${fmtMoney(service.costHigh)}, depending ` +
      `on your home, the scope of work, and local permit fees. Get matched with a ${city.name} ` +
      `electrician for an exact, no-obligation quote.`,
  };
}
