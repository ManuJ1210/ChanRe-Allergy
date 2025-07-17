

export default function CenterAdminDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="flex">
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold text-blue-700">Welcome, {user?.name}</h2>
        <p className="text-gray-600">You are logged in as Center Admin</p>
      </div>
    </div>
  );
}
