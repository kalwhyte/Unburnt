import PostHog from 'posthog-react-native';
import { AnalyticsEvent } from './events';

let posthog: PostHog | null = null;

export const initPostHog = async () => {
  posthog = await (PostHog as any).initAsync('YOUR_POSTHOG_API_KEY', {
    host: 'https://app.posthog.com',
  });
};

export const trackEvent = (event: AnalyticsEvent) => {
  if (posthog) {
    posthog.capture(event.name, event.properties);
  }
};

export const identifyUser = (userId: string, properties?: Record<string, any>) => {
  if (posthog) {
    posthog.identify(userId, properties);
  }
};

export const resetAnalytics = () => {
  if (posthog) {
    posthog.reset();
  }
};
