import { Routes, Route } from "react-router-dom";
import Landing from "../pages/landing/Landing";
import Login from "../pages/landing/Login";

import PublicLayout from "../layouts/PublicLayout";
import LawyerLayout from "../layouts/LawyerLayout";
import StudentLayout from "../layouts/StudentLayout";
import FounderLayout from "../layouts/FounderLayout";
import AdminLayout from "../layouts/AdminLayout";

import TalkAI from "../pages/public/AIConsultant.tsx";
import Connect from "../pages/public/ConnectLawyer.tsx";
import Vault from "../pages/public/PublicDashboard.tsx";
import Ribbon from "../pages/public/Ribbon";

import ClientIntake from "../pages/lawyer/ClientIntake";
import DraftAssistant from "../pages/lawyer/DraftAssistant";
import CaseDashboard from "../pages/lawyer/CaseDashboard";
import LawyerMessages from "../pages/lawyer/LawyerMessages.tsx";

import Study from "../pages/student/StudyWorkspace";
import StudentDraft from "../pages/student/DraftPractice";
import Notes from "../pages/student/StudentNotes.tsx";

import FounderMessages from "../pages/founder/Messages";
import Feedback from "../pages/founder/Feedback";

import Approvals from "../pages/admin/Approvals";
import Logs from "../pages/admin/Logs";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />


      {/* PUBLIC */}
      <Route path="/public" element={<PublicLayout />}>
        <Route index element={<TalkAI />} />
        <Route path="ai" element={<TalkAI />} />
        <Route path="connect" element={<Connect />} />
        <Route path="vault" element={<Vault />} />
        <Route path="ribbon" element={<Ribbon />} />
      </Route>

      {/* LAWYER */}
      <Route path="/lawyer" element={<LawyerLayout />}>
        <Route index element={<ClientIntake />} />
        <Route path="intake" element={<ClientIntake />} />
        <Route path="draft" element={<DraftAssistant />} />
        <Route path="cases" element={<CaseDashboard />} />
        <Route path="messages" element={<LawyerMessages />} />
      </Route>

      {/* STUDENT */}
      <Route path="/student" element={<StudentLayout />}>
        <Route index element={<Study />} />
        <Route path="study" element={<Study />} />
        <Route path="draft" element={<StudentDraft />} />
        <Route path="notes" element={<Notes />} />
      </Route>

      {/* FOUNDER */}
      <Route path="/founder" element={<FounderLayout />}>
        <Route index element={<FounderMessages />} />
        <Route path="messages" element={<FounderMessages />} />
        <Route path="feedback" element={<Feedback />} />
      </Route>

      {/* ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Approvals />} />
        <Route path="approvals" element={<Approvals />} />
        <Route path="logs" element={<Logs />} />
      </Route>
    </Routes>
  );
}
