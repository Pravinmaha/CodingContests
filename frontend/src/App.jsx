import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AllContestsPage from './pages/AllContests';
import ContestInfoPage from './pages/ContestPage';
import QuestionPage from './pages/QuestionPage';
import LeaderboardPage from './pages/Leaderboard';
import AddQuestionPage from './admin/AddQuestionPage';
import EditQuestionPage from './admin/EditQuestionPage';
import AdminProblemsPage from './admin/AdminProblemsPage';
import AdminLayout from './admin/AdminLayout';
import Contests from './admin/AdminContests';
import ContestPage from './admin/AdminContestPage';
import { FullProblemProvider } from './contexts/FullProblemContext';
import { ContestsProvider } from './contexts/ContestContext';
import { AllContestsProvider } from './contexts/AllContestsContext';
import QuestionPageLayout from './user/QuestionPageLayout';
import { FullContestProvider } from './contexts/FullContestContext';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/admin' element={<AdminLayout />} >
          <Route path="problems" element={<AdminProblemsPage />} />
          <Route path='contests' element={
            <ContestsProvider>
              <Contests />
            </ContestsProvider>
          } />
          <Route path='contests/:id' element={<ContestPage />} />
          <Route path="add-question" element={<AddQuestionPage />} />
          <Route path="edit-question/:questionId" element={
            <FullProblemProvider>
              <EditQuestionPage />
            </FullProblemProvider>
          } />
        </Route>
        <Route path="/admin/problems/:questionId" element={
          <FullProblemProvider>
            <QuestionPage />
          </FullProblemProvider>
        } />

        <Route path="/contests" element={
          <AllContestsProvider>
            <AllContestsPage />
          </AllContestsProvider>
        } />
        <Route path="/contests/:contestId" element={
          <FullContestProvider>
            <ContestInfoPage />
          </FullContestProvider>
        } />
        <Route path="/contests/:contestId/questions/" element={
          <FullContestProvider>
            <QuestionPageLayout />
          </FullContestProvider>
        } >
          <Route path=':questionId' element={
            <FullProblemProvider>
              <QuestionPage />
            </FullProblemProvider>
          } />
        </Route>
        <Route path="/contests/:contestId/leaderboard" element={<LeaderboardPage />} />
        <Route path="*" element={<Navigate to="/contests" replace />} />
      </Routes>
    </Router>
  );
}

export default App;