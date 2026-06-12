/**
 * Renders a JSON-LD <script> for structured data. Pass any schema object(s).
 * Using a component keeps schema co-located with the page that owns it.
 */
export function JsonLd({ data }: { data: object | object[] }) {
  const json = Array.isArray(data) ? data : [data];
  return (
    <>
      {json.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          // Schema is built from our own trusted content, not user input.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
