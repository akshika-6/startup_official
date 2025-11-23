import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const SubmitPitch = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to founder dashboard since pitch functionality is now there
    navigate("/founder-dashboard", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">
          Redirecting to Founder Dashboard...
        </p>
      </div>
    </div>
  );
};

export default SubmitPitch;
