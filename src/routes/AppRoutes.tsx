import { Route, Routes } from "react-router-dom";

import { PublicLayout } from "../layouts/PublicLayout";
import { Home } from "../pages/Home";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";
import { PostDetails } from "../pages/PostDetails";
import { CreatePost } from "../pages/CreatePost";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/posts/new" element={<CreatePost />} />
        <Route path="/posts/:id" element={<PostDetails />} />
      </Route>
    </Routes>
  );
}