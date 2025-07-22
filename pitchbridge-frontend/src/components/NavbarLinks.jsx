// src/components/NavbarLinks.jsx
import { Link } from 'react-router-dom';

const NavbarLinks = ({ user, logoutHandler, mobile = false }) => {
  const linkClass = mobile ? 'block' : 'hover:text-blue-500';

  return (
    <>
      <Link to="/" className={linkClass}>Home</Link>
      <Link to="/startups" className={linkClass}>Startups</Link>

      {user?.role === 'founder' && (
        <Link to="/submit-pitch" className={linkClass}>Submit Pitch</Link>
      )}

      {user?.role === 'investor' && (
        <Link to="/notifications" className={linkClass}>Notifications</Link>
      )}

      {user && (
        <Link to="/dashboard" className={linkClass}>Dashboard</Link>
      )}

      {user ? (
        <button
          onClick={logoutHandler}
          className={mobile ? 'block text-red-500 hover:underline' : 'text-red-500 hover:underline'}
        >
          Logout
        </button>
      ) : (
        <>
          <Link to="/login" className={linkClass}>Login</Link>
          <Link to="/register" className={linkClass}>Register</Link>
        </>
      )}
    </>
  );
};

export default NavbarLinks;