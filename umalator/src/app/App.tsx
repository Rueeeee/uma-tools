import { h, render } from "preact";

import { IntelDashboard } from "./IntelDashboard";

import "./App.css";

function AppNav() {
  return (
    <header class="appNav">
      <div>
        <strong>《闪耀优俊少女》工具集</strong>
        <a
          class="appRepositoryLink"
          href="https://github.com/Rueeeee/uma-tools"
        >
          github.com/Rueeeee/uma-tools
        </a>
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
