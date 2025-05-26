import { StrictMode } from "react";
// import {createRoot} from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import App from "./App.jsx";
import ReactDOM from "react-dom/client";
import ShopContextProvider, { ShopContext } from "./context/ShopContext.jsx";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId= {import.meta.env.VITE_GOOGLE_CLIENT_ID}>
    <BrowserRouter>
      <ShopContextProvider>
        <App />
      </ShopContextProvider>
    </BrowserRouter>
  </GoogleOAuthProvider>
);
