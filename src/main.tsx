import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider } from "antd";
import heIL from "antd/locale/he_IL";
import { HelmetProvider } from "react-helmet-async";
import "./index.css";
import { Layout } from "./Components/Layout/Layout/Layout";
import { refreshAuthState } from "./Context/AuthState";

// Refresh auth state on app load
refreshAuthState();

createRoot(
  document.getElementById("root")!
).render(
  <HelmetProvider>
    <ConfigProvider direction="rtl" locale={heIL}>
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    </ConfigProvider>
  </HelmetProvider>
);
