import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import "./index.css";
import "./seller/Index.css";
import App from "./App.jsx";
import theme from "./theme.js";
import { Analytics } from "@vercel/analytics/react"
import * as Sentry from "@sentry/react";

const DSN = import.meta.env.VITE_SENTRY_DSN;
if (DSN) {
  Sentry.init({
    dsn: DSN,
    environment: import.meta.env.VITE_NODE_ENV,
    tracesSampleRate: 0.25,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    integrations: [Sentry.browserTracingIntegration(), Sentry.replayIntegration()],
  });
}

const required = ["VITE_API_URL", "VITE_PAYSTACK_PUBLIC_KEY"];
const missing = required.filter((key) => !import.meta.env[key]);
if (missing.length > 0) {
  console.error(`Missing required env vars: ${missing.join(", ")}`);
}

window.onerror = (message, source, lineno, colno, error) => {
  console.error("[Global Error]", { message, source, lineno, colno, error });
  if (DSN && error) Sentry.captureException(error);
};

window.onunhandledrejection = (event) => {
  console.error("[Unhandled Promise Rejection]", event.reason);
  if (DSN) Sentry.captureException(event.reason);
};

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Sentry.ErrorBoundary fallback={<div className="flex items-center justify-center min-h-screen p-8 text-center">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 mb-2">Something went wrong</h1>
          <p className="text-neutral-500 mb-4">Please try refreshing the page.</p>
          <button onClick={() => window.location.reload()} className="px-6 py-2 bg-primary-500 text-white rounded-lg font-semibold hover:bg-primary-600 transition cursor-pointer">
            Refresh Page
          </button>
        </div>
      </div>}>
        <App />
      </Sentry.ErrorBoundary>
      <Analytics />
    </ThemeProvider>
  </StrictMode>,
)
