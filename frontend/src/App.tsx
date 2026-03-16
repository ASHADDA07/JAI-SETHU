import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import IncidentWizard from './pages/public/IncidentWizard';
import RoleProtectedRoute from './router/RoleProtectedRoute'; // The Bouncer!

// Pages
import Landing from './pages/landing/Landing';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';

// Lawyer
import LawyerDashboard from './pages/lawyer/LawyerDashboard';
import ClientIntake from './pages/lawyer/ClientIntake';
import DraftAssistant from './pages/lawyer/DraftAssistant';
import LawyerMessages from './pages/lawyer/LawyerMessages';
import AssociateTeam from './pages/lawyer/AssociateTeam';

// Student
import StudyWorkspace from './pages/student/StudyWorkspace';
import DraftPractice from './pages/student/DraftPractice';
import StudentNotes from './pages/student/StudentNotes';
import StudentNetwork from './pages/student/StudentNetwork';
import StudentMessages from './pages/student/StudentMessages';

// Public
import PublicDashboard from './pages/public/PublicDashboard';
import EvidenceVault from './pages/public/EvidenceVault';
import AIConsultant from './pages/public/AIConsultant';
import ConnectLawyer from './pages/public/ConnectLawyer';
import PublicMessages from './pages/public/PublicMessages';

// Shared
import ProfileSettings from './pages/shared/ProfileSettings';

// Admin
import AdminDashboard from './pages/admin/AdminDashboard';
import FounderDashboard from './pages/founder/FounderDashboard';

export default function App() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          {/* 1. OPEN ROUTES (No login required to see these) */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/:role/register" element={<Register />} />
          <Route path="/incident/new" element={<IncidentWizard />} />

          {/* ======================================= */}
          {/* 🔒 LAWYER ONLY ROUTES                     */}
          {/* ======================================= */}
          <Route element={<RoleProtectedRoute allowedRoles={['lawyer']} />}>
            <Route path="/lawyer/dashboard" element={<LawyerDashboard />} />
            <Route path="/lawyer/intake" element={<ClientIntake />} />
            <Route path="/lawyer/draft" element={<DraftAssistant />} />
            <Route path="/lawyer/messages" element={<LawyerMessages />} />
            <Route path="/lawyer/associates" element={<AssociateTeam />} />
            <Route path="/lawyer/profile" element={<ProfileSettings role="lawyer" />} />
          </Route>

          {/* ======================================= */}
          {/* 🔒 STUDENT ONLY ROUTES                    */}
          {/* ======================================= */}
          <Route element={<RoleProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student/workspace" element={<StudyWorkspace />} />
            <Route path="/student/practice" element={<DraftPractice />} />
            <Route path="/student/notes" element={<StudentNotes />} />
            <Route path="/student/profile" element={<ProfileSettings role="student" />} />
            <Route path="/student/network" element={<StudentNetwork />} />
            <Route path="/student/messages" element={<StudentMessages />} />
          </Route>

          {/* ======================================= */}
          {/* 🔒 PUBLIC CLIENT ONLY ROUTES              */}
          {/* ======================================= */}
          <Route element={<RoleProtectedRoute allowedRoles={['public']} />}>
            <Route path="/public/dashboard" element={<PublicDashboard />} />
            <Route path="/public/vault" element={<EvidenceVault />} />
            <Route path="/public/ai" element={<AIConsultant />} />
            <Route path="/public/connect" element={<ConnectLawyer />} />
            <Route path="/public/messages" element={<PublicMessages />} />
            <Route path="/public/profile" element={<ProfileSettings role="public" />} />
          </Route>

          {/* ======================================= */}
          {/* 🔒 ADMIN & FOUNDER ROUTES                 */}
          {/* ======================================= */}
          <Route element={<RoleProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Route>
          
          <Route element={<RoleProtectedRoute allowedRoles={['founder']} />}>
            <Route path="/founder" element={<FounderDashboard />} />
          </Route>

          {/* Catch All - Redirects unknown pages to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}