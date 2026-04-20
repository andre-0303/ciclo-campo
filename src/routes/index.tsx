import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { CreateBatch } from "../pages/CreateBatch";

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/create-batch"
          element={
            <PrivateRoute>
              <CreateBatch />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
