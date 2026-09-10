import { useEffect } from 'react';

export default function SEO({ title, description, image, url, type = 'website' }) {
    useEffect(() => {
        if (title) document.title = title;

        const updateMetaTag = (name, content, property = false) => {
            if (!content) return;
            const attr = property ? 'property' : 'name';
            let tag = document.querySelector(`meta[${attr}="${name}"]`);
            if (!tag) {
                tag = document.createElement('meta');
                tag.setAttribute(attr, name);
                document.head.appendChild(tag);
            }
            tag.setAttribute('content', content);
        };

        updateMetaTag('description', description);
        updateMetaTag('og:title', title, true);
        updateMetaTag('og:description', description, true);
        updateMetaTag('og:type', type, true);
        updateMetaTag('og:url', url, true);
        updateMetaTag('og:image', image, true);
        updateMetaTag('twitter:card', 'summary_large_image');
        updateMetaTag('twitter:title', title);
        updateMetaTag('twitter:description', description);
        updateMetaTag('twitter:image', image);

        let canonical = document.querySelector('link[rel="canonical"]');
        if (!canonical) {
            canonical = document.createElement('link');
            canonical.setAttribute('rel', 'canonical');
            document.head.appendChild(canonical);
        }
        canonical.setAttribute('href', url || window.location.href);
    }, [title, description, image, url, type]);

    return null;
}