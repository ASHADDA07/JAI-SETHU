import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function PublicLayout() {
  return (
    <div className="app-shell">
      <Sidebar
        links={[
          { label: "Talk to AI", to: "/public/ai" },
          { label: "Connect Lawyer", to: "/public/connect" },
          { label: "Evidence Vault", to: "/public/vault" },
          { label: "Founder Ribbon", to: "/public/ribbon" }
        ]}
      />

      <div className="main">
        <Topbar title="Public" />
        <Outlet />
      </div>
    </div>
  );
}
