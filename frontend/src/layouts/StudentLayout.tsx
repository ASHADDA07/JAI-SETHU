import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function StudentLayout() {
  return (
    <div className="app-shell">
      <Sidebar
        links={[
          { label: "Study Workspace", to: "/student/study" },
          { label: "Draft Practice", to: "/student/draft" },
          { label: "Notes", to: "/student/notes" }
        ]}
      />
      <div className="main">
        <Topbar title="Student Workspace" />
        <Outlet />
      </div>
    </div>
  );
}
