import AdminNav from '../../components/adminNav'

export default function DashboardLayout({ children }) {
  return (
    <div>
      <AdminNav /> {/* Sidebar or Top Navbar */}
      <main>{children}</main>
    </div>
  );
}
