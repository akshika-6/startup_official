import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Menu, LogOut, Bell, Rocket, LayoutDashboard, UserCircle } from 'lucide-react';

const Layout = ({ children }) => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const userData = JSON.parse(atob(token.split('.')[1]));
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/');
  };

  const toggleMenu = () => setMenuOpen(!menuOpen);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white">
      {/* Navbar */}
      <nav className="bg-blue-700 dark:bg-blue-900 text-white px-6 py-4 flex justify-between items-center shadow">
        <Link to="/" className="text-xl font-bold">PitchBridge</Link>

        {/* Desktop Links */}
        <div className="hidden md:flex space-x-6 items-center">
          <NavLinks role={user?.role} />
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="hidden sm:inline">{user.name}</span>
              <UserCircle className="w-6 h-6" />
              <button onClick={handleLogout} className="hover:text-red-300"><LogOut className="w-5 h-5" /></button>
            </div>
          ) : (
            <Link to="/login" className="hover:underline">Login</Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button onClick={toggleMenu} className="md:hidden">
          <Menu className="w-6 h-6" />
        </button>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-blue-600 dark:bg-blue-800 px-6 py-4 space-y-2 text-white">
          <NavLinks role={user?.role} vertical />
          {user ? (
            <button onClick={handleLogout} className="flex items-center space-x-2">
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          ) : (
            <Link to="/login" className="block hover:underline">Login</Link>
          )}
        </div>
      )}

      {/* Page Content */}
      <main className="p-6">
        {children}
      </main>
    </div>
  );
};

const NavLinks = ({ role, vertical = false }) => {
  const base = "hover:underline";
  const linkStyle = vertical ? "block py-1" : "";

  return (
    <>
      <Link to="/startups" className={`${base} ${linkStyle}`}><Rocket className="inline w-4 h-4 mr-1" />Startups</Link>
      {role === 'founder' && (
        <Link to="/pitch" className={`${base} ${linkStyle}`}><Rocket className="inline w-4 h-4 mr-1" />Submit Pitch</Link>
      )}
      {role === 'investor' && (
        <Link to="/rate" className={`${base} ${linkStyle}`}><Rocket className="inline w-4 h-4 mr-1" />Rate Startups</Link>
      )}
      <Link to="/notifications" className={`${base} ${linkStyle}`}><Bell className="inline w-4 h-4 mr-1" />Notifications</Link>
      <Link to="/dashboard" className={`${base} ${linkStyle}`}><LayoutDashboard className="inline w-4 h-4 mr-1" />Dashboard</Link>
    </>
  );
};

export default Layout;
