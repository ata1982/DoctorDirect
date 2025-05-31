import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Error tracking settings
  beforeSend(event) {
    // Filter out non-critical errors in development
    if (process.env.NODE_ENV === 'development') {
      return null;
    }
    return event;
  },

  // Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,

  integrations: [
    Sentry.replayIntegration({
      maskAllText: true,
      blockAllMedia: true,
    }),
  ],

  // Environment and release tracking
  environment: process.env.NODE_ENV,
  release: process.env.VERCEL_GIT_COMMIT_SHA,

  // User context (will be set when user logs in)
  beforeSend(event) {
    // Remove sensitive data
    if (event.request?.data) {
      delete event.request.data.password;
      delete event.request.data.token;
    }
    return event;
  },
});