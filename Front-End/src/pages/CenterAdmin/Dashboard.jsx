

export default function CenterAdminDashboard() {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="min-h-screen  flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-blue-100 flex flex-col items-center gap-6">
        <h1 className="text-4xl font-extrabold text-blue-500 mb-2 tracking-tight text-center">Welcome, {user?.name}</h1>
        <p className="text-slate-600 text-lg text-center">You are logged in as Center Admin</p>
      </div>
    </div>
  );
}
