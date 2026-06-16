import { Search } from 'lucide-react';
import useAuthStore from '../../store/auth.store';
import { NotificationsDropdown } from '../common/NotificationsDropdown';

const Navbar = () => {
  const { user } = useAuthStore();

  return (
    <div className="h-16 bg-dark-800 border-b border-slate-700/50 flex items-center justify-between px-6 sticky top-0 z-10">

      {/* Search */}
      <div className="flex items-center gap-2 bg-dark-900 border border-slate-700 rounded-lg px-3 py-2 w-72">
        <Search size={16} className="text-slate-500" />
        <input
          type="text"
          placeholder="Search anything..."
          className="bg-transparent text-sm text-slate-300 placeholder-slate-500 outline-none w-full"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-4">

        {/* Notification bell */}
        <NotificationsDropdown />


        {/* User avatar */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-sm font-semibold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-medium text-white">{user?.name}</p>
            <p className="text-xs text-slate-400">{user?.email}</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Navbar;