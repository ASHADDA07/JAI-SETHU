import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function LawyerLayout() {
  return (
    <div className="app-shell">
      <Sidebar
        links={[
          { label: "Client Intake", to: "/lawyer/intake" },
          { label: "Draft Assistant", to: "/lawyer/draft" },
          { label: "Case Dashboard", to: "/lawyer/cases" },
          { label: "Messages", to: "/lawyer/messages" }
        ]}
      />
      <div className="main">
        <Topbar title="Lawyer Panel" />
        <Outlet />
      </div>
    </div>
  );
}
