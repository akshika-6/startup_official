import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config';

const DeleteAccount = () => {
  const navigate = useNavigate();

  const handleDelete = async () => {
    const token = localStorage.getItem('token');
    if (window.confirm('Are you sure you want to delete your account? This cannot be undone.')) {
      try {
        await axios.delete(`${API_BASE_URL}/settings/delete`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        localStorage.removeItem('token');
        alert('Account deleted');
        navigate('/login');
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting account');
      }
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h2 className="text-xl font-bold text-red-600 mb-4">Delete Account</h2>
      <p className="mb-4">This action is permanent. All your data will be deleted.</p>
      <button onClick={handleDelete} className="bg-red-600 text-white px-4 py-2 rounded">
        Confirm Delete
      </button>
    </div>
  );
};

export default DeleteAccount;
