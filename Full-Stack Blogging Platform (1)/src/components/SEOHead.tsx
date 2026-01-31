import { useEffect } from 'react';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string[];
  author?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEOHead({
  title = 'BlogHub - Share Your Stories',
  description = 'A modern blogging platform for writers and readers. Share your stories, connect with others, and explore diverse perspectives.',
  keywords = ['blog', 'writing', 'articles', 'stories'],
  author,
  image = 'https://images.unsplash.com/photo-1566709603547-638aba3dbbc0',
  url = 'https://bloghub.com',
  type = 'website',
  publishedTime,
  modifiedTime
}: SEOHeadProps) {
  useEffect(() => {
    // Update document title
    document.title = title;

    // Helper function to set or update meta tags
    const setMetaTag = (name: string, content: string, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      
      element.setAttribute('content', content);
    };

    // Standard meta tags
    setMetaTag('description', description);
    setMetaTag('keywords', keywords.join(', '));
    if (author) {
      setMetaTag('author', author);
    }

    // Open Graph meta tags
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:image', image, true);
    
    if (type === 'article' && publishedTime) {
      setMetaTag('article:published_time', publishedTime, true);
    }
    if (type === 'article' && modifiedTime) {
      setMetaTag('article:modified_time', modifiedTime, true);
    }
    if (type === 'article' && author) {
      setMetaTag('article:author', author, true);
    }
    if (type === 'article') {
      setMetaTag('article:tag', keywords.join(', '), true);
    }

    // Twitter Card meta tags
    setMetaTag('twitter:card', 'summary_large_image');
    setMetaTag('twitter:title', title);
    setMetaTag('twitter:description', description);
    setMetaTag('twitter:image', image);

    // Additional SEO tags
    setMetaTag('robots', 'index, follow');
    setMetaTag('viewport', 'width=device-width, initial-scale=1.0');
  }, [title, description, keywords, author, image, url, type, publishedTime, modifiedTime]);

  return null;
}
