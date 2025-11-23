import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Edit3,
  Save,
  X,
  Plus,
  Eye,
  Users,
  TrendingUp,
  Calendar,
  ExternalLink,
  ArrowLeft,
} from "lucide-react";
import { toast } from "react-toastify";
import { API_BASE_URL } from "../../config";

const StartupDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [startup, setStartup] = useState(null);
  const [pitches, setPitches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showPitchModal, setShowPitchModal] = useState(false);
  const [investors, setInvestors] = useState([]);

  const [editForm, setEditForm] = useState({
    startupName: "",
    domain: "",
    stage: "",
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
    fetchStartupData();
    fetchInvestors();
  }, [id]);

  const fetchStartupData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");

      // Fetch startup details
      const startupRes = await fetch(`${API_BASE_URL}/api/startups/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (startupRes.ok) {
        const startupData = await startupRes.json();
        setStartup(startupData.data);
        setEditForm({
          startupName: startupData.data.startupName || "",
          domain: startupData.data.domain || "",
          stage: startupData.data.stage || "",
          summary: startupData.data.summary || "",
          location: startupData.data.location || "",
          targetRaise: startupData.data.targetRaise || "",
          equityOffered: startupData.data.equityOffered || "",
          pitchDeck: startupData.data.pitchDeck || "",
          videoPitch: startupData.data.videoPitch || "",
        });
      } else {
        toast.error("Failed to load startup details");
      }

      // Fetch pitches for this startup
      const pitchesRes = await fetch(
        `${API_BASE_URL}/api/pitches/startup/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      if (pitchesRes.ok) {
        const pitchesData = await pitchesRes.json();
        setPitches(pitchesData.data);
      }
    } catch (error) {
      console.error("Error fetching startup data:", error);
      toast.error("Failed to load startup data");
    } finally {
      setLoading(false);
    }
  };

  const fetchInvestors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/users?role=investor`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.ok) {
        const data = await response.json();
        setInvestors(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching investors:", error);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_BASE_URL}/api/startups/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(editForm),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success("Startup updated successfully!");
        setStartup(data.data);
        setEditing(false);
      } else {
        toast.error(data.message || "Failed to update startup");
      }
    } catch (error) {
      console.error("Error updating startup:", error);
      toast.error("Network error. Please try again.");
    }
  };

  const handleCreatePitch = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${API_BASE_URL}/api/pitches/startup/${id}`,
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
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!startup) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="text-center px-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Startup not found
          </h1>
          <button
            onClick={() => navigate("/founder-dashboard")}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate("/founder-dashboard")}
            className="inline-flex items-center text-sm font-medium text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Dashboard
          </button>

          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {editing ? (
                  <input
                    type="text"
                    value={editForm.startupName}
                    onChange={(e) =>
                      setEditForm({ ...editForm, startupName: e.target.value })
                    }
                    className="text-3xl font-bold bg-transparent border-b-2 border-blue-600 focus:outline-none text-gray-900 dark:text-white"
                  />
                ) : (
                  startup.startupName
                )}
              </h1>
              <p className="mt-2 text-gray-600 dark:text-gray-400">
                {editing ? (
                  <input
                    type="text"
                    value={editForm.domain}
                    onChange={(e) =>
                      setEditForm({ ...editForm, domain: e.target.value })
                    }
                    className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-600"
                    placeholder="Domain"
                  />
                ) : (
                  startup.domain
                )}
                {startup.location && (
                  <>
                    {" • "}
                    {editing ? (
                      <input
                        type="text"
                        value={editForm.location}
                        onChange={(e) =>
                          setEditForm({ ...editForm, location: e.target.value })
                        }
                        className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-600"
                        placeholder="Location"
                      />
                    ) : (
                      startup.location
                    )}
                  </>
                )}
              </p>
            </div>

            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {editing ? (
                <>
                  <button
                    onClick={handleSave}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </button>
                  <button
                    onClick={() => {
                      setEditing(false);
                      setEditForm({
                        startupName: startup.startupName || "",
                        domain: startup.domain || "",
                        stage: startup.stage || "",
                        summary: startup.summary || "",
                        location: startup.location || "",
                        targetRaise: startup.targetRaise || "",
                        equityOffered: startup.equityOffered || "",
                        pitchDeck: startup.pitchDeck || "",
                        videoPitch: startup.videoPitch || "",
                      });
                    }}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                  >
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => setEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={() => setShowPitchModal(true)}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Send Pitch
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Startup Details */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Startup Details
                </h2>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-center space-x-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStageColor(startup.stage)}`}
                  >
                    {editing ? (
                      <select
                        value={editForm.stage}
                        onChange={(e) =>
                          setEditForm({ ...editForm, stage: e.target.value })
                        }
                        className="bg-transparent border-none focus:outline-none text-xs"
                      >
                        <option value="idea">Idea</option>
                        <option value="MVP">MVP</option>
                        <option value="revenue">Revenue</option>
                      </select>
                    ) : (
                      startup.stage
                    )}
                  </span>
                  {startup.targetRaise && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Target:{" "}
                      {editing ? (
                        <input
                          type="number"
                          value={editForm.targetRaise}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              targetRaise: e.target.value,
                            })
                          }
                          className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-600 w-20"
                        />
                      ) : (
                        `$${Number(startup.targetRaise).toLocaleString()}`
                      )}
                    </span>
                  )}
                  {startup.equityOffered && (
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      Equity:{" "}
                      {editing ? (
                        <input
                          type="number"
                          value={editForm.equityOffered}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              equityOffered: e.target.value,
                            })
                          }
                          className="bg-transparent border-b border-gray-300 focus:outline-none focus:border-blue-600 w-12"
                        />
                      ) : (
                        startup.equityOffered
                      )}
                      %
                    </span>
                  )}
                </div>

                {startup.summary && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                      Summary
                    </h3>
                    {editing ? (
                      <textarea
                        rows="4"
                        value={editForm.summary}
                        onChange={(e) =>
                          setEditForm({ ...editForm, summary: e.target.value })
                        }
                        className="w-full p-3 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                      />
                    ) : (
                      <p className="text-gray-600 dark:text-gray-300">
                        {startup.summary}
                      </p>
                    )}
                  </div>
                )}

                {/* Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(startup.pitchDeck || editing) && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Pitch Deck
                      </h3>
                      {editing ? (
                        <input
                          type="url"
                          value={editForm.pitchDeck}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              pitchDeck: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Pitch deck URL"
                        />
                      ) : (
                        <a
                          href={startup.pitchDeck}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          View Pitch Deck
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      )}
                    </div>
                  )}

                  {(startup.videoPitch || editing) && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                        Video Pitch
                      </h3>
                      {editing ? (
                        <input
                          type="url"
                          value={editForm.videoPitch}
                          onChange={(e) =>
                            setEditForm({
                              ...editForm,
                              videoPitch: e.target.value,
                            })
                          }
                          className="w-full p-2 border border-gray-300 rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                          placeholder="Video pitch URL"
                        />
                      ) : (
                        <a
                          href={startup.videoPitch}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400"
                        >
                          Watch Video
                          <ExternalLink className="h-4 w-4 ml-1" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Pitches */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Pitches Sent ({pitches.length})
                </h2>
              </div>

              {pitches.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                    No pitches sent
                  </h3>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    Start by sending your first pitch to investors.
                  </p>
                  <div className="mt-6">
                    <button
                      onClick={() => setShowPitchModal(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Send Pitch
                    </button>
                  </div>
                </div>
              ) : (
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {pitches.map((pitch) => (
                    <div key={pitch._id} className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                            {pitch.investorId?.name || "Unknown Investor"}
                          </h3>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {pitch.investorId?.email}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            Sent on{" "}
                            {new Date(pitch.createdAt).toLocaleDateString()}
                          </p>
                          {pitch.message && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
                              "{pitch.message}"
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

          {/* Sidebar - Stats */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Statistics
              </h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900 mr-3">
                    <Users className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Total Pitches
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {pitches.length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900 mr-3">
                    <TrendingUp className="h-4 w-4 text-green-600 dark:text-green-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Interested
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {pitches.filter((p) => p.status === "interested").length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900 mr-3">
                    <Eye className="h-4 w-4 text-yellow-600 dark:text-yellow-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Viewed
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {pitches.filter((p) => p.status === "viewed").length}
                    </p>
                  </div>
                </div>

                <div className="flex items-center">
                  <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-900 mr-3">
                    <Calendar className="h-4 w-4 text-purple-600 dark:text-purple-300" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Pending
                    </p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">
                      {pitches.filter((p) => p.status === "pending").length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Pitch Modal */}
      {showPitchModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-1/2 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                Send Pitch for {startup.startupName}
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
    </div>
  );
};

export default StartupDetail;
