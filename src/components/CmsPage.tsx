import React, { useEffect, useState } from 'react';
import { apiClient, pick } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { Loader, PageHero } from './ui';

export interface CmsPageData {
  page_key: string;
  title: string;
  title_ta: string | null;
  content: string;
  content_ta: string | null;
}

type LocalizedText = string | { ta: string; en: string };

/** Loads a page managed from the admin "Pages" screen; `page` is null when it hasn't been created yet. */
export function useCmsPage(pageKey: string): { page: CmsPageData | null; loading: boolean } {
  const [page, setPage] = useState<CmsPageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    apiClient
      .get(`/pages/${pageKey}`)
      .then((res) => setPage(res.data.data))
      .catch(() => setPage(null))
      .finally(() => setLoading(false));
  }, [pageKey]);

  return { page, loading };
}

/** The rich-text body of a CMS page (loader / content / "coming soon"). */
export const CmsBody: React.FC<{ page: CmsPageData | null; loading: boolean }> = ({ page, loading }) => {
  const { lang, t } = useLanguage();
  if (loading) return <Loader />;
  if (!page) return <p className="text-muted mb-0">{t('common.pageUpdatedSoon')}</p>;
  return <div className="rich-text" dangerouslySetInnerHTML={{ __html: pick(page, 'content', lang) }} />;
};

/**
 * Renders a page whose text is managed from the admin "Pages" screen.
 * `fallbackTitle` / `fallbackTitleKey` is shown if the page hasn't been created in the CMS yet.
 * The `*Key` props take a translation key and win over the plain/`{ta, en}` props.
 */
export const CmsPage: React.FC<{
  pageKey: string;
  eyebrow?: LocalizedText;
  eyebrowKey?: string;
  fallbackTitle?: LocalizedText;
  fallbackTitleKey?: string;
  image?: string;
  aside?: React.ReactNode;
  children?: React.ReactNode;
}> = ({ pageKey, eyebrow, eyebrowKey, fallbackTitle, fallbackTitleKey, image, aside, children }) => {
  const { lang, t } = useLanguage();
  const resolve = (key?: string, text?: LocalizedText): string =>
    key ? t(key) : typeof text === 'string' ? text : text ? text[lang] : '';
  const { page, loading } = useCmsPage(pageKey);

  const title = page ? pick(page, 'title', lang) : resolve(fallbackTitleKey, fallbackTitle);

  return (
    <>
      <PageHero eyebrow={resolve(eyebrowKey, eyebrow) || undefined} title={title} image={image} />
      <section className="page-body">
        <div className="container">
          <div className="row g-5">
            <div className={aside ? 'col-lg-8' : 'col-lg-10 mx-auto'}>
              <div className="card-custom p-4 p-md-5">
                <CmsBody page={page} loading={loading} />
              </div>
              {children}
            </div>
            {aside && <div className="col-lg-4">{aside}</div>}
          </div>
        </div>
      </section>
    </>
  );
};
