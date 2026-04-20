import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PrivateRoute } from "./PrivateRoute";
import { Login } from "../pages/Login";
import { Dashboard } from "../pages/Dashboard";
import { CreateBatch } from "../pages/CreateBatch";
import { CreatePlot } from "../pages/CreatePlot";
import { BatchTimeline } from "../pages/BatchTimeline";
import { FinishBatch } from "../pages/FinishBatch";
import { BatchByToken } from "../pages/BatchByToken";

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

        <Route
          path="/create-plot"
          element={
            <PrivateRoute>
              <CreatePlot />
            </PrivateRoute>
          }
        />

        <Route
          path="/ciclo/:id"
          element={
            <PrivateRoute>
              <BatchTimeline />
            </PrivateRoute>
          }
        />

        <Route
          path="/ciclo/:id/finalizar"
          element={
            <PrivateRoute>
              <FinishBatch />
            </PrivateRoute>
          }
        />

        <Route
          path="/ciclo/token/:token"
          element={
            <PrivateRoute>
              <BatchByToken />
            </PrivateRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}
