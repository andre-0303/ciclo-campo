import { logout } from "../services/auth.service";

export function Dashboard() {
  return (
    <div>
      <h1>Dashboard</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
