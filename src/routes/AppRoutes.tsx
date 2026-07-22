import { Route, Routes } from "react-router-dom";

import { ProtectedRoute } from "../components/ProtectedRoute";
import { PublicLayout } from "../layouts/PublicLayout";
import { Articles } from "../pages/Articles";
import { CreatePost } from "../pages/CreatePost";
import { Dashboard } from "../pages/Dashboard";
import { EditPost } from "../pages/EditPost";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { PostDetails } from "../pages/PostDetails";
import { ProfileSettings } from "../pages/ProfileSettings";
import { Register } from "../pages/Register";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/artigos" element={<Articles />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/:id" element={<PostDetails />} />

        <Route
          path="/posts/new"
          element={
            <ProtectedRoute>
              <CreatePost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/posts/:id/edit"
          element={
            <ProtectedRoute>
              <EditPost />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile/settings"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />
      </Route>
    </Routes>
  );
}
