export type AboutContentSection = {
  id: string;
  title: string;
  html: string;
};

export function parseAboutHtml(html: string): { leadHtml: string; sections: AboutContentSection[] } {
  let cleaned = html.replace(/<p class="about-meta"[\s\S]*?<\/p>/gi, '').trim();
  const chunks = cleaned.split(/(?=<h3\b)/i).map((s) => s.trim()).filter(Boolean);

  let leadHtml = '';
  if (chunks.length && !/^<h3/i.test(chunks[0])) {
    leadHtml = chunks.shift()!;
  }

  const sections = chunks.map((chunk, i) => {
    const match = chunk.match(/^<h3[^>]*>([\s\S]*?)<\/h3>/i);
    const title = match ? stripTags(match[1]) : '';
    const body = match ? chunk.slice(match[0].length).trim() : chunk;
    return {
      id: `about-section-${i}`,
      title,
      html: body,
    };
  });

  return { leadHtml, sections };
}

function stripTags(s: string) {
  return s.replace(/<[^>]+>/g, '').trim();
}
