export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div
      style={{
        padding: "30px",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
      }}
    >
      <h2>User Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      <p>Role: {user?.role}</p>
      <p>Email: {user?.email}</p>
    </div>
  );
}