export default function SuperadminDashboard() {
  return (
    <main className="min-h-screen bg-blue-50 flex flex-col items-center justify-center p-4 sm:p-8">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-8 border border-blue-100 flex flex-col items-center gap-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-blue-500 mb-2 tracking-tight text-center">Superadmin Dashboard</h1>
        <p className="text-slate-600 text-lg text-center">Welcome! Use the sidebar to manage centers and center admins.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full mt-4">
          <div className="bg-blue-100 rounded-xl p-6 flex flex-col items-center shadow-sm border border-blue-100">
            <span className="text-2xl text-blue-400 mb-2">🏥</span>
            <span className="font-bold text-lg text-slate-700">Centers</span>
            <span className="text-slate-500 text-sm">Manage all healthcare centers</span>
          </div>
          <div className="bg-blue-100 rounded-xl p-6 flex flex-col items-center shadow-sm border border-blue-100">
            <span className="text-2xl text-blue-400 mb-2">🛡️</span>
            <span className="font-bold text-lg text-slate-700">Admins</span>
            <span className="text-slate-500 text-sm">Manage all center admins</span>
          </div>
        </div>
      </div>
    </main>
  );
}
