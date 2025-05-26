// AdminLayout.js
import Sidebar from "../../admin/src/components/Sidebar";
import { Outlet } from 'react-router-dom';

const AdminLayout = () => (
  <div className="flex min-h-screen">
    <Sidebar />
    <div className="flex-1 p-4 overflow-auto"> {/* Adjust padding/margin if needed */}
      <Outlet />
    </div>
  </div>
);

export default AdminLayout;
