import { h, render } from "preact";

import { IntelDashboard } from "./IntelDashboard";

import "./App.css";

function appBasePath() {
  if (typeof window === "undefined") return "./";
  const basePath = new URL(import.meta.env.BASE_URL, window.location.href)
    .pathname;
  return window.location.pathname.replace(/\/+$/, "").endsWith("/intel")
    ? `${basePath.replace(/intel\/?$/, "")}`
    : basePath;
}

function AppNav() {
  return (
    <header class="appNav">
      <div>
        <img
          class="appLogo"
          src={`${appBasePath()}logo.png`}
          alt="《闪耀优俊少女》排期查询"
        />
      </div>
    </header>
  );
}

function App() {
  return (
    <div>
      <AppNav />
      <IntelDashboard />
    </div>
  );
}

render(<App />, document.getElementById("app"));
