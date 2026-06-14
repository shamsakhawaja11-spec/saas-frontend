import {Building2, CheckSquare, FolderKanban, LayoutDashboard, SquareKanban,LogOut} from 'lucide-react';
import { useLocation, Link } from 'react-router-dom';
import useAuthStore from '../../store/auth.store';

const navItems=[
    { label:'Dashboard',icon:LayoutDashboard,path:'/dashboard'},
    { label:'Workspaces',icon:Building2,path:'/workspaces'},
    { label:'Projects',icon:FolderKanban,path:'/workspaces'},
    { label:'Boards',icon:SquareKanban,path:'/boards'},
    { label:'Tasks',icon:CheckSquare,path:'/tasks'},
];
const Sidebar=()=>{
    const location=useLocation();
    const {logout,user}=useAuthStore();

return (
    <div className="w-64 h-screen bg-dark-800 border-r border-slate-700 flex flex-col fixed left-0 top-0">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-slate-700">
        <h1 className="text-xl font-bold text-white">SaaS Manager</h1>
        <p className="text-xs text-slate-400 mt-0.5">Project Management</p>
      </div>

      {/* User info */}
      <div className="px-6 py-4 border-b border-slate-700">
        <p className="text-sm font-medium text-white">{user?.name}</p>
        <p className="text-xs text-slate-400">{user?.email}</p>
      </div>

      {/* Nav items */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                isActive
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-400 hover:bg-dark-700 hover:text-white'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="px-3 py-4 border-t border-slate-700">
        <button
          onClick={logout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-400 hover:bg-dark-700 hover:text-white transition w-full"
        >
          <LogOut size={18} />
          Logout
        </button>
      </div>

    </div>
  );
};

export default Sidebar;
