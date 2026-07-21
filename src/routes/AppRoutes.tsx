import { Route, Routes } from "react-router-dom";

import { PublicLayout } from "../layouts/PublicLayout";

import { Home } from "../pages/Home";
import { Articles } from "../pages/Articles";
import { Login } from "../pages/Login";
import { Register } from "../pages/Register";

export function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/artigos" element={<Articles />} />
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
      </Route>
    </Routes>
  );
}