import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Edit3,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  AlertCircle,
} from "lucide-react";
import { toast } from "react-toastify";
import DashboardLayout from "../layouts/DashboardLayout";
import { API_BASE_URL } from "../../config";

const FounderDashboard = () => {
  const navigate = useNavigate();
  const [startups, setStartups] = useState([]);
  const [pitches, setPitches] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [selectedStartup, setSelectedStartup] = useState(null);
  const [investors, setInvestors] = useState([]);

  // Form states
  const [newStartup, setNewStartup] = useState({
    startupName: "",
    domain: "",
    stage: "idea",
    summary: "",
    location: "",
    targetRaise: "",
    equityOffered: "",
    pitchDeck: "",
    videoPitch: "",
  });

  const [newPitch, setNewPitch] = useState({
    investorId: "",
    message: "",
  });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch founder's startups
      const startupsRes = await fetch(`${API_BASE_URL}/api/startups/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (startupsRes.ok) {
        const startupsData = await startupsRes.json();
        setStartups(startupsData.data);
      }

      // Fetch pitches for founder's startups
      const pitchesRes = await fetch(`${API_BASE_URL}/api/pitches/my`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (pitchesRes.ok) {
        const pitchesData = await pitchesRes.json();
        setPitches(pitchesData.data);
      }

      // Fetch dashboard stats
      const dashboardRes = await fetch(
        `${API_BASE_URL}/api/dashboard/founder`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (dashboardRes.ok) {
        const dashboardData = await dashboardRes.json();
        setDashboardStats(dashboardData.data);
      }

      // Fetch investors for pitch creation
      const investorsRes = await fetch(
        `${API_BASE_URL}/api/users?role=investor`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (investorsRes.ok) {
        const investorsData = await investorsRes.json();
        setInvestors(investorsData.data || []);
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateStartup = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/startups`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newStartup),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Startup created successfully!");
        setStartups([data.data, ...startups]);
        setShowCreateModal(false);
        setNewStartup({
          startupName: "",
          domain: "",
          stage: "idea",
          summary: "",
          location: "",
          targetRaise: "",
          equityOffered: "",
          pitchDeck: "",
          videoPitch: "",
        });
      } else {
        toast.error(data.message || "Failed to create startup");
      }
    } catch (error) {
      console.error("Error creating startup:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const handleCreatePitch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/pitches/startup/${selectedStartup._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(newPitch),
        },
      );

      const data = await response.json();

      if (response.ok) {
        toast.success("Pitch sent successfully!");
        setPitches([data.data, ...pitches]);
        setShowPitchModal(false);
        setSelectedStartup(null);
        setNewPitch({ investorId: "", message: "" });
      } else {
        toast.error(data.message || "Failed to send pitch");
      }
    } catch (error) {
      console.error("Error creating pitch:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const getStageColor = (stage) => {
    const colors = {
      idea: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      MVP: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
      revenue:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    };
    return colors[stage] || colors.idea;
  };

  const getStatusColor = (status) => {
    const colors = {
      pending:
        "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
      viewed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
      interested:
        "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
      rejected: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
    };
    return colors[status] || colors.pending;
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-96">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Founder Dashboard
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your startups and track investor interest
            </p>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Startup
          </button>
        </div>

        {/* Stats Cards */}
        {dashboardStats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 dark:bg-blue-900">
                  <TrendingUp className="h-6 w-6 text-blue-600 dark:text-blue-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Startups
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {startups.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 dark:bg-green-900">
                  <Users className="h-6 w-6 text-green-600 dark:text-green-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Total Pitches
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pitches.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-orange-100 dark:bg-orange-900">
                  <Eye className="h-6 w-6 text-orange-600 dark:text-orange-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Interested
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pitches.filter((p) => p.status === "interested").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-purple-100 dark:bg-purple-900">
                  <Calendar className="h-6 w-6 text-purple-600 dark:text-purple-300" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
                    Pending
                  </p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {pitches.filter((p) => p.status === "pending").length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Startups List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Your Startups
            </h2>
          </div>

          {startups.length === 0 ? (
            <div className="text-center py-12">
              <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                No startups
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Get started by creating a new startup.
              </p>
              <div className="mt-6">
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  New Startup
                </button>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {startups.map((startup) => (
                <div key={startup._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                        {startup.startupName}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                        {startup.domain} • {startup.location}
                      </p>
                      {startup.summary && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                          {startup.summary}
                        </p>
                      )}
                      <div className="flex items-center mt-3 space-x-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(startup.stage)}`}
                        >
                          {startup.stage}
                        </span>
                        {startup.targetRaise && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Target: $
                            {Number(startup.targetRaise).toLocaleString()}
                          </span>
                        )}
                        {startup.equityOffered && (
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            Equity: {startup.equityOffered}%
                          </span>
                        )}
                      </div>

                      {/* Pitches for this startup */}
                      <div className="mt-4">
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Pitches sent:{" "}
                          {
                            pitches.filter(
                              (p) => p.startupId?._id === startup._id,
                            ).length
                          }
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      <button
                        onClick={() => {
                          setSelectedStartup(startup);
                          setShowPitchModal(true);
                        }}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => navigate(`/startup/${startup._id}`)}
                        className="inline-flex items-center p-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                      >
                        <Edit3 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Pitches */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Pitches
            </h2>
          </div>

          {pitches.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No pitches sent yet
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {pitches.slice(0, 5).map((pitch) => (
                <div key={pitch._id} className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                        {pitch.investorId?.name || "Unknown Investor"}
                      </h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {pitch.startupId?.startupName} •{" "}
                        {new Date(pitch.createdAt).toLocaleDateString()}
                      </p>
                      {pitch.message && (
                        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                          {pitch.message}
                        </p>
                      )}
                    </div>
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(pitch.status)}`}
                    >
                      {pitch.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Startup Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Create New Startup
              </h3>
              <form onSubmit={handleCreateStartup} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Startup Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={newStartup.startupName}
                      onChange={(e) =>
                        setNewStartup({
                          ...newStartup,
                          startupName: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Domain *
                    </label>
                    <input
                      type="text"
                      required
                      value={newStartup.domain}
                      onChange={(e) =>
                        setNewStartup({ ...newStartup, domain: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      placeholder="e.g., FinTech, AI, Healthcare"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Stage *
                    </label>
                    <select
                      required
                      value={newStartup.stage}
                      onChange={(e) =>
                        setNewStartup({ ...newStartup, stage: e.target.value })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    >
                      <option value="idea">Idea</option>
                      <option value="MVP">MVP</option>
                      <option value="revenue">Revenue</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Location
                    </label>
                    <input
                      type="text"
                      value={newStartup.location}
                      onChange={(e) =>
                        setNewStartup({
                          ...newStartup,
                          location: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Target Raise ($)
                    </label>
                    <input
                      type="number"
                      value={newStartup.targetRaise}
                      onChange={(e) =>
                        setNewStartup({
                          ...newStartup,
                          targetRaise: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Equity Offered (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={newStartup.equityOffered}
                      onChange={(e) =>
                        setNewStartup({
                          ...newStartup,
                          equityOffered: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Summary
                  </label>
                  <textarea
                    rows="3"
                    value={newStartup.summary}
                    onChange={(e) =>
                      setNewStartup({ ...newStartup, summary: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Brief description of your startup..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Pitch Deck URL
                    </label>
                    <input
                      type="url"
                      value={newStartup.pitchDeck}
                      onChange={(e) =>
                        setNewStartup({
                          ...newStartup,
                          pitchDeck: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Video Pitch URL
                    </label>
                    <input
                      type="url"
                      value={newStartup.videoPitch}
                      onChange={(e) =>
                        setNewStartup({
                          ...newStartup,
                          videoPitch: e.target.value,
                        })
                      }
                      className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Create Startup
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Create Pitch Modal */}
      {showPitchModal && selectedStartup && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Send Pitch for {selectedStartup.startupName}
              </h3>
              <form onSubmit={handleCreatePitch} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Select Investor *
                  </label>
                  <select
                    required
                    value={newPitch.investorId}
                    onChange={(e) =>
                      setNewPitch({ ...newPitch, investorId: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  >
                    <option value="">Choose an investor...</option>
                    {investors.map((investor) => (
                      <option key={investor._id} value={investor._id}>
                        {investor.name} ({investor.email})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Message
                  </label>
                  <textarea
                    rows="4"
                    value={newPitch.message}
                    onChange={(e) =>
                      setNewPitch({ ...newPitch, message: e.target.value })
                    }
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 text-sm dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                    placeholder="Write a personalized message to the investor..."
                    maxLength="500"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {newPitch.message.length}/500 characters
                  </p>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowPitchModal(false);
                      setSelectedStartup(null);
                      setNewPitch({ investorId: "", message: "" });
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 dark:bg-gray-600 dark:text-gray-300 dark:hover:bg-gray-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Send Pitch
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default FounderDashboard;
