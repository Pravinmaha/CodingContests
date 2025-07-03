import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import AllContestsPage from './pages/AllContests';
import QuestionPage from './pages/QuestionPage';
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
import QuestionSubmissions from './components/QuestionSubmissions';
import SubmissionDetails from './components/SubmissionDetails';
import QuestionDescription from './components/QuestionDescription';
import { SubmissionsProvider } from './contexts/SubmissionContext';
import ContestPageDetails from './pages/ContestPageDetails';
import LoginPage from './auth/Login';
import SignupPage from './auth/SignUp';
import LeaderboardTable from './pages/Leaderboard';
import ViewProblemPage from './admin/ViewProblemPage';
import Layout from './Layout';
import Navbar from './components/Navbar';
import { useAuth } from './contexts/AuthContext';

function App() {
  const { isLoggedIn } = useAuth();


  if (!isLoggedIn) {
    return (
      <Router>
        <Routes>
          <Route path='/login' element={<LoginPage />} />
          <Route path='/signup' element={<SignupPage />} />
          {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
        </Routes>
      </Router>
    )
  }

  return (
    <Router>
      <Routes>


        <Route path='' element={<Layout />} >

          <Route path='/admin' element={<AdminLayout />} >

            <Route path="problems" >
              <Route path='' element={<AdminProblemsPage />} />
              <Route path=":questionId" element={<ViewProblemPage />} />
              <Route path=':questionId/edit' element={<EditQuestionPage />} />
            </Route>

            <Route path='contests' element={
              <ContestsProvider>
                <Contests />
              </ContestsProvider>
            } />
            <Route path='contests/:contestId' element={
              <FullContestProvider>
                <ContestPage />
              </ FullContestProvider>
            } />
            <Route path="add-question" element={<AddQuestionPage />} />
          </Route>
          <Route path="/admin/problems/:questionId" element={
            <FullProblemProvider>
              <SubmissionsProvider>
                <QuestionPage />
              </SubmissionsProvider>
            </FullProblemProvider>
          } >
            <Route path="" element={
              <FullProblemProvider>
                <QuestionDescription />
              </ FullProblemProvider>
            } />
            <Route path="submissions" >
              <Route path='' element={
                <SubmissionsProvider>
                  <QuestionSubmissions />
                </SubmissionsProvider>
              } />
              <Route path=":submissionId" element={
                <SubmissionsProvider>
                  <SubmissionDetails />
                </SubmissionsProvider>
              } />
            </Route>
          </Route>

          <Route path="contests" element={
            <AllContestsProvider>
              <Navbar />
              <AllContestsPage />
            </AllContestsProvider>
          } />
          {/* <Route path="/contests/:contestId" element={
                <FullContestProvider>
                  <ContestInfoPage />
                </FullContestProvider>
              } /> */}
          <Route path="contests/:contestId/questions" element={
            <FullContestProvider>
              <QuestionPageLayout />
            </FullContestProvider>
          } >
            <Route path="" element={
              <FullContestProvider>
                <ContestPageDetails />
              </FullContestProvider>

            } />
            <Route path=':questionId'>
              <Route path="" element={
                <FullProblemProvider>
                  <SubmissionsProvider>
                    <QuestionPage />
                  </SubmissionsProvider>
                </FullProblemProvider>
              } >

                <Route path="" element={
                  <FullProblemProvider>
                    <QuestionDescription />
                  </ FullProblemProvider>
                } />
                <Route path="submissions" >
                  <Route path='' element={
                    <SubmissionsProvider>
                      <QuestionSubmissions />
                    </SubmissionsProvider>
                  } />
                  <Route path=":submissionId" element={
                    <SubmissionsProvider>
                      <SubmissionDetails />
                    </SubmissionsProvider>
                  } />
                </Route>
              </Route>
            </Route>
          </Route>
          <Route path="contests/:contestId/leaderboard" element={<LeaderboardTable />} />
        </Route>
        {/* <Route path="*" element={<Navigate to="/admin/contests" replace />} />

        <Route path='*' element={<Navigate to="/contests" replace />} /> */}


      </Routes>
    </Router>
  );
}

export default App;