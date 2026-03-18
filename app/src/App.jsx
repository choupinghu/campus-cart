import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import WantToBuyPage from './pages/WantToBuyPage'
import ListingDetailPage from './pages/ListingDetailPage'

import CreateListingPage from './pages/CreateListingPage'
import CreateRequestPage from './pages/CreateRequestPage'
import MyListingsPage from './pages/MyListingsPage'
import EditListingPage from './pages/EditListingPage'
import EditRequestPage from './pages/EditRequestPage'
import ProfilePage from './pages/ProfilePage'
import { ProtectedRoute } from './components/ProtectedRoute'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route
          path="/"
          element={
            <MainLayout>
              <HomePage />
            </MainLayout>
          }
        />

        <Route
          path="/want-to-buy"
          element={
            <MainLayout>
              <WantToBuyPage />
            </MainLayout>
          }
        />

        <Route
          path="/listing/:id"
          element={
            <MainLayout>
              <ListingDetailPage />
            </MainLayout>
          }
        />

        <Route
          path="/create-listing"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CreateListingPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-request"
          element={
            <ProtectedRoute>
              <MainLayout>
                <CreateRequestPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/my-listings"
          element={
            <ProtectedRoute>
              <MainLayout>
                <MyListingsPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-listing/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <EditListingPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/edit-request/:id"
          element={
            <ProtectedRoute>
              <MainLayout>
                <EditRequestPage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout>
                <ProfilePage />
              </MainLayout>
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  )
}

export default App
