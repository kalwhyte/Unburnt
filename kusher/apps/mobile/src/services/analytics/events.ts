export const ANALYTICS_EVENTS = {
  AUTH: {
    LOGIN_SUCCESS: "login_success",
    LOGIN_FAILED: "login_failed",
    REGISTER_SUCCESS: "register_success",
    LOGOUT: "logout",
  },
  QUIT_PLAN: {
    CREATED: "quit_plan_created",
    UPDATED: "quit_plan_updated",
  },
  CRAVING: {
    LOGGED: "craving_logged",
    BEATEN: "craving_beaten",
    RELAPSED: "craving_relapsed",
    BREATHING_STARTED: "breathing_exercise_started",
  },
  SMOKING: {
    LOGGED: "cigarette_logged",
  },
  NAVIGATION: {
    SCREEN_VIEW: "screen_view",
  },
};

export type AnalyticsEvent =
  | { name: typeof ANALYTICS_EVENTS.AUTH.LOGIN_SUCCESS; properties?: { method: string } }
  | { name: typeof ANALYTICS_EVENTS.CRAVING.LOGGED; properties: { intensity: number; trigger?: string } }
  | { name: typeof ANALYTICS_EVENTS.SMOKING.LOGGED; properties?: { count: number } }
  | { name: string; properties?: Record<string, any> };
