import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { trackPageView, trackBackendActivity } from '../analytics/analytics';

export default function AnalyticsTracker() {
    const location = useLocation();

    useEffect(() => {
        trackPageView(location.pathname + location.search, document.title);
        trackBackendActivity('PAGE_VIEW', { pageUrl: location.pathname });
    }, [location]);

    return null;
}