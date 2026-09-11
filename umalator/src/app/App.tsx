import { h, render } from "preact";

import { IntelDashboard } from "./IntelDashboard";

import "./App.css";

function AppNav() {
  return (
    <header class="appNav">
      <div>
        <strong>《闪耀优俊少女》排期查询</strong>
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
