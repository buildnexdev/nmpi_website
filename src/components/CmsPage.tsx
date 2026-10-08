import React, { useEffect, useState } from 'react';
import { apiClient, pick } from '../services/apiClient';
import { useLanguage } from '../context/LanguageContext';
import { Loader, PageHero } from './ui';

interface CmsPageData {
  page_key: string;
  title: string;
  title_ta: string | null;
  content: string;
  content_ta: string | null;
}

type LocalizedText = string | { ta: string; en: string };

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

  const title = page ? pick(page, 'title', lang) : resolve(fallbackTitleKey, fallbackTitle);

  return (
    <>
      <PageHero eyebrow={resolve(eyebrowKey, eyebrow) || undefined} title={title} image={image} />
      <section className="page-body">
        <div className="container">
          <div className="row g-5">
            <div className={aside ? 'col-lg-8' : 'col-lg-10 mx-auto'}>
              <div className="card-custom p-4 p-md-5">
                {loading ? (
                  <Loader />
                ) : page ? (
                  <div className="rich-text" dangerouslySetInnerHTML={{ __html: pick(page, 'content', lang) }} />
                ) : (
                  <p className="text-muted mb-0">{t('common.pageUpdatedSoon')}</p>
                )}
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
