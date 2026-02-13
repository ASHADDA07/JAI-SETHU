import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function AdminLayout() {
  return (
    <div className="app-shell">
      <Sidebar
        links={[
          { label: "User Approvals", to: "/admin/approvals" },
          { label: "Logs", to: "/admin/logs" }
        ]}
      />
      <div className="main">
        <Topbar title="Admin Control" />
        <Outlet />
      </div>
    </div>
  );
}
