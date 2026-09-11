import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackBackendActivity } from '../analytics/analytics';

export default function AnalyticsTracker() {
    const location = useLocation();

    useEffect(() => {
        const path = location.pathname + location.search;
        console.log(' PAGE_VIEW firing for:', path);

        trackPageView(path, document.title);

        trackBackendActivity('PAGE_VIEW', { pageUrl: location.pathname })
            .then(ok => console.log(' PAGE_VIEW returned:', ok))
            .catch(err => console.error(' PAGE_VIEW threw:', err));
    }, [location.pathname, location.search]);

    return null;
}