import { SITE_URL } from "@/lib/site";

type JsonLdNode = Record<string, unknown>;

/**
 * JSON-LD микроразметка (Schema.org).
 * `<` в теле JSON экранируется, чтобы строка вида «</script>»
 * в данных не закрыла тег раньше времени.
 */
export function JsonLd({ data }: { data: JsonLdNode | JsonLdNode[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/** Автор цикла намеренно не называет себя — узел описательный, без выдуманных имён. */
export const AUTHOR_NODE = {
  "@type": "Person",
  name: "Автор цикла «История Даро»",
  url: `${SITE_URL}/author`,
} as const;
