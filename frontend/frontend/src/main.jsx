import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./index.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <GoogleOAuthProvider clientId="813807187417-bn4s4dscnfabeshdvfoem0kl1ddb7bac.apps.googleusercontent.com">
      <App />
    </GoogleOAuthProvider>
  </StrictMode>
);