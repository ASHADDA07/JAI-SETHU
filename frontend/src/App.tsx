import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import { LanguageProvider } from './context/LanguageContext';
import IncidentWizard from './pages/public/IncidentWizard';

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
      <UserProvider>
        <BrowserRouter>
          <Routes>
            {/* 1. CORE ROUTES */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            
            {/* THIS WAS MISSING: Fallback if they just type /register */}
            <Route path="/register" element={<Register />} />
            
            {/* Dynamic Route: /public/register or /lawyer/register */}
            <Route path="/:role/register" element={<Register />} />
            <Route path="incident/new" element={<IncidentWizard />} />

            {/* 2. LAWYER ROUTES */}
            <Route path="/lawyer" element={<LawyerDashboard />} />
            <Route path="/lawyer/intake" element={<ClientIntake />} />
            <Route path="/lawyer/draft" element={<DraftAssistant />} />
            <Route path="/lawyer/messages" element={<LawyerMessages />} />
            <Route path="/lawyer/associates" element={<AssociateTeam />} />
            <Route path="/lawyer/profile" element={<ProfileSettings role="lawyer" />} />

            {/* 3. STUDENT ROUTES */}
            <Route path="/student" element={<StudyWorkspace />} />
            <Route path="/student/practice" element={<DraftPractice />} />
            <Route path="/student/notes" element={<StudentNotes />} />
            <Route path="/student/profile" element={<ProfileSettings role="student" />} />
            
            {/* 4. PUBLIC ROUTES */}
            <Route path="/public" element={<PublicDashboard />} />
            <Route path="/public/vault" element={<EvidenceVault />} />
            <Route path="/public/ai" element={<AIConsultant />} />
            <Route path="/public/connect" element={<ConnectLawyer />} />
            <Route path="/public/messages" element={<PublicMessages />} />
            <Route path="/public/profile" element={<ProfileSettings role="public" />} />
            
            {/* 5. ADMIN/FOUNDER */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/founder" element={<FounderDashboard />} />
            
            {/* Catch All - Redirects unknown pages to Home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </LanguageProvider>
  );
}