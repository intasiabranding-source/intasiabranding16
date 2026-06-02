export function OrganizationJsonLd({
  name,
  url,
  description,
}: {
  name: string;
  url: string;
  description?: string;
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url,
    description,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function ArticleJsonLd({
  title,
  description,
  publishedAt,
  author,
  image,
}: {
  title: string;
  description: string;
  publishedAt: string;
  author: string;
  image?: string;
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    datePublished: publishedAt,
    author: { "@type": "Person", name: author },
    image,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

export function FaqJsonLd({ items }: { items: { question: string; answer: string }[] }) {
  const json = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
