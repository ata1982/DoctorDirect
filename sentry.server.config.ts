import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  
  // Performance Monitoring
  tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.1 : 1.0,
  
  // Environment and release tracking
  environment: process.env.NODE_ENV,
  release: process.env.VERCEL_GIT_COMMIT_SHA,

  // Enhanced error context for medical app
  beforeSend(event) {
    // Remove sensitive medical data
    if (event.request?.data) {
      delete event.request.data.password;
      delete event.request.data.medicalRecord;
      delete event.request.data.healthData;
      delete event.request.data.personalInfo;
    }
    
    // Add medical app context
    event.tags = {
      ...event.tags,
      component: 'medical-platform',
      compliance: 'hipaa-aware',
    };
    
    return event;
  },

  // Database transaction tracking
  integrations: [
    Sentry.prismaIntegration(),
  ],
});