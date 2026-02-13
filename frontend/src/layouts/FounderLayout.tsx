import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function FounderLayout() {
  return (
    <div className="app-shell">
      <Sidebar
        links={[
          { label: "User Messages", to: "/founder/messages" },
          { label: "Feedback", to: "/founder/feedback" }
        ]}
      />
      <div className="main">
        <Topbar title="Founder Console" />
        <Outlet />
      </div>
    </div>
  );
}
