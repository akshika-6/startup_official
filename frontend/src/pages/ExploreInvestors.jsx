import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion'; 
import { API_BASE_URL } from "../config";

// Lucide icons
import {
  Search, XCircle, User, Mail, MapPin, Briefcase, Filter, X, ChevronDown, Sparkles
} from 'lucide-react';

const ExploreInvestors = () => {
  const [investors, setInvestors] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // --- AI Match States ---
  const [aiMatches, setAiMatches] = useState([]);
  const [showAiView, setShowAiView] = useState(false);
  const [loadingAi, setLoadingAi] = useState(false);

  // Filter states
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [availableRegions, setAvailableRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(''); 
  const [availableRoles, setAvailableRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState(''); 
  const [availableStages, setAvailableStages] = useState([]);
  const [selectedStage, setSelectedStage] = useState('');
  const [availableIndustries, setAvailableIndustries] = useState([]);
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [availableDealSizes, setAvailableDealSizes] = useState([]);
  const [selectedDealSize, setSelectedDealSize] = useState('');

  // Dummy data for filter options 
  const dummyFilterOptions = {
    stages: ['Seed', 'Series A', 'Series B', 'Series C', 'Growth', 'Public'],
    industries: ['SaaS', 'FinTech', 'HealthTech', 'AI/ML', 'E-commerce', 'Biotech', 'Clean Energy', 'EdTech', 'Consumer Goods'],
    dealSizes: ['< $500K', '$500K - $1M', '$1M - $5M', '$5M - $20M', '> $20M'],
    regions: ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'],
    roles: ['Angel Investor', 'Venture Capitalist', 'Private Equity', 'Corporate VC', 'Family Office'],
  };

  useEffect(() => {
    const fetchInvestors = async () => {
      setLoading(true); 
      setError(null);
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication token not found. Please log in.');
          setLoading(false);
          return;
        }

        const response = await axios.get(
          `${API_BASE_URL}/api/investors`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (response.data && Array.isArray(response.data.data)) {
          let fetchedInvestors = response.data.data;

          // --- START: DUMMY DATA AUGMENTATION ---
          const stages = dummyFilterOptions.stages;
          const industries = dummyFilterOptions.industries;
          const dealSizes = dummyFilterOptions.dealSizes;

          fetchedInvestors = fetchedInvestors.map(inv => ({
            ...inv,
            investmentStage: inv.investmentStage || stages[Math.floor(Math.random() * stages.length)],
            industry: inv.industry || industries[Math.floor(Math.random() * industries.length)],
            preferredDealSize: inv.preferredDealSize || dealSizes[Math.floor(Math.random() * dealSizes.length)],
            location: inv.location || dummyFilterOptions.regions[Math.floor(Math.random() * dummyFilterOptions.regions.length)],
            role: inv.role || dummyFilterOptions.roles[Math.floor(Math.random() * dummyFilterOptions.roles.length)],
          }));
          // --- END: DUMMY DATA ---

          setInvestors(fetchedInvestors);

          const uniqueRegions = [...new Set(fetchedInvestors.map(inv => inv.location).filter(Boolean))].sort();
          const uniqueRoles = [...new Set(fetchedInvestors.map(inv => inv.role).filter(Boolean))].sort();
          const uniqueStages = [...new Set(fetchedInvestors.map(inv => inv.investmentStage).filter(Boolean))].sort();
          const uniqueIndustries = [...new Set(fetchedInvestors.map(inv => inv.industry).filter(Boolean))].sort();
          const uniqueDealSizes = [...new Set(fetchedInvestors.map(inv => inv.preferredDealSize).filter(Boolean))].sort();

          setAvailableRegions(['', ...uniqueRegions]); 
          setAvailableRoles(['', ...uniqueRoles]);
          setAvailableStages(['', ...uniqueStages]);
          setAvailableIndustries(['', ...uniqueIndustries]);
          setAvailableDealSizes(['', ...uniqueDealSizes]);

        } else if (Array.isArray(response.data)) {
           // Fallback if structure is different
           let fetchedInvestors = response.data;
           setInvestors(fetchedInvestors);
        } 
      } catch (err) {
        console.error('Error fetching investors:', err);
        setError('Error fetching investors.');
      } finally {
        setLoading(false);
      }
    };

    fetchInvestors();
  }, []);

  // --- AI MATCH FUNCTION ---
  const handleAIMatch = async () => {
    setLoadingAi(true);
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            alert("Please log in to use AI Match.");
            setLoadingAi(false);
            return;
        }
        // Call the backend API
        const res = await axios.get(`${API_BASE_URL}/api/ai-match/investors`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        setAiMatches(res.data);
        setShowAiView(true);
    } catch (err) {
        console.error("AI Match Failed", err);
        alert(`AI Match Failed: ${err.response?.data?.message || err.message}`);
    } finally {
        setLoadingAi(false);
    }
  };

  const handleRegionChange = (e) => setSelectedRegion(e.target.value);
  const handleRoleChange = (e) => setSelectedRole(e.target.value);
  const handleStageChange = (e) => setSelectedStage(e.target.value);
  const handleIndustryChange = (e) => setSelectedIndustry(e.target.value);
  const handleDealSizeChange = (e) => setSelectedDealSize(e.target.value);

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedRegion('');
    setSelectedRole('');
    setSelectedStage('');
    setSelectedIndustry('');
    setSelectedDealSize('');
  };

  const filteredInvestors = investors.filter((inv) => {
    const lowerCaseSearchQuery = searchQuery.toLowerCase();
    const matchesSearch =
      inv.name?.toLowerCase().includes(lowerCaseSearchQuery) ||
      inv.email?.toLowerCase().includes(lowerCaseSearchQuery) ||
      inv.location?.toLowerCase().includes(lowerCaseSearchQuery) ||
      inv.role?.toLowerCase().includes(lowerCaseSearchQuery) ||
      inv.investmentStage?.toLowerCase().includes(lowerCaseSearchQuery) ||
      inv.industry?.toLowerCase().includes(lowerCaseSearchQuery);

    const matchesRegion = selectedRegion === '' || inv.location === selectedRegion;
    const matchesRole = selectedRole === '' || inv.role === selectedRole;
    const matchesStage = selectedStage === '' || inv.investmentStage === selectedStage;
    const matchesIndustry = selectedIndustry === '' || inv.industry === selectedIndustry;
    const matchesDealSize = selectedDealSize === '' || inv.preferredDealSize === selectedDealSize;

    return matchesSearch && matchesRegion && matchesRole && matchesStage && matchesIndustry && matchesDealSize;
  });

  const containerVariants = { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.1 } } };
  const itemVariants = { hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } };
  const modalVariants = { hidden: { opacity: 0, scale: 0.9, y: 50 }, visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.3 } }, exit: { opacity: 0, scale: 0.9, y: 50, transition: { duration: 0.2 } } };

  return (
    <div className="relative min-h-screen flex"> 
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 z-0">
        {/* Abstract blobs can go here */}
      </div>

      <main className="relative z-10 flex-1 px-4 sm:px-6 lg:px-8 py-24 pt-20 pb-16 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="text-5xl font-extrabold text-center text-gray-800 dark:text-white mb-6 leading-tight"
          >
            Connect with Key Investors
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
          >
            Discover and engage with a curated list of investors looking for the next big idea.
          </motion.p>

          {/* Search Bar & Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4 mb-12"
          >
            <div className="relative w-full max-w-lg sm:max-w-md flex-1">
              <input
                type="text" placeholder="Search investors..." value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-3 pl-12 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-lg text-gray-800 dark:text-white focus:outline-none focus:ring-3 focus:ring-blue-500/50 shadow-md"
              />
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-6 w-6" />
            </div>
            
            <button
              onClick={() => setShowFilterModal(true)}
              className="px-6 py-3 bg-gray-700 dark:bg-gray-800 text-gray-200 dark:text-gray-300 rounded-full font-medium hover:bg-gray-600 dark:hover:bg-gray-700 transition duration-200 flex items-center justify-center shadow-md w-full sm:w-auto border border-gray-600 dark:border-gray-700"
            >
              <Filter className="mr-2 h-4 w-4" /> Filter <ChevronDown className="ml-2 h-4 w-4" />
            </button>

            {/* --- UPDATED AI MATCH BUTTON --- */}
            <button
              onClick={handleAIMatch}
              disabled={loadingAi}
              className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-full font-medium hover:from-purple-700 hover:to-blue-700 transition duration-200 flex items-center justify-center shadow-md w-full sm:w-auto ${loadingAi ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              <Sparkles className={`mr-2 h-5 w-5 ${loadingAi ? 'animate-spin' : ''}`} /> 
              {loadingAi ? "Analyzing..." : "AI Match"}
            </button>
          </motion.div>

          {/* --- AI RESULTS SECTION --- */}
          <AnimatePresence>
            {showAiView && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-10 overflow-hidden">
                    <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-3xl p-6 relative">
                        <div className="flex justify-between items-center mb-4">
                             <h2 className="text-xl font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                                <Sparkles className="text-purple-600 dark:text-purple-400" /> 
                                AI Recommended Investors
                             </h2>
                             <button onClick={() => setShowAiView(false)} className="p-2 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-full text-purple-600 dark:text-purple-300 transition-colors"><X className="h-5 w-5" /></button>
                        </div>
                        {aiMatches.length > 0 ? (
                            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {aiMatches.map((investor) => (
                                    <div key={investor._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border-2 border-purple-100 dark:border-purple-800 relative overflow-hidden hover:scale-105 transition-transform duration-200">
                                        <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm">{investor.matchScore}% Match</div>
                                        <Link to={`/investors/${investor._id}`}>
                                          <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                                              {investor.investorName || investor.name || "Verified Investor"}
                                          </h3>
                                        </Link>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">{investor.role || "Investor"}</p>
                                        <div className="bg-purple-50 dark:bg-purple-900/40 p-3 rounded-lg text-xs">
                                            <p className="font-bold text-purple-700 dark:text-purple-300 mb-1 uppercase tracking-wide">Why:</p>
                                            <ul className="space-y-1">
                                                {investor.matchReasons && investor.matchReasons.map((r, i) => (
                                                    <li key={i} className="text-gray-600 dark:text-gray-300 flex items-start gap-1.5"><span className="text-purple-500 mt-0.5">•</span>{r}</li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-purple-800 dark:text-purple-200">
                                <p>No high-confidence matches found yet. Try filling out your startup details completely!</p>
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
          </AnimatePresence>

          {/* Loading & Results */}
          {loading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center min-h-[40vh] text-blue-600 dark:text-blue-400">
              <svg className="animate-spin h-12 w-12 text-current" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
              <p className="mt-4 text-xl font-medium">Fetching potential investors...</p>
            </motion.div>
          )}

          {error && !loading && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 py-4 px-6 rounded-lg mb-6 text-lg font-medium border border-red-200 dark:border-red-700 max-w-xl mx-auto">
              <XCircle className="h-5 w-5 mr-3" />
              <p>{error}</p>
            </motion.div>
          )}

          {!loading && !error && filteredInvestors.length > 0 && (
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredInvestors.map((investor) => (
                <motion.div key={investor._id} variants={itemVariants} whileHover={{ scale: 1.03, zIndex: 10 }} className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl p-6 border border-white/30 dark:border-gray-700/50 cursor-pointer overflow-hidden group">
                  <Link to={`/investors/${investor._id}`} className="block">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-200">
                      <User className="inline-block mr-2 h-6 w-6 text-blue-500 dark:text-blue-400" />
                      {investor.name || "Unnamed Investor"}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-base mb-4 line-clamp-2">
                      <Mail className="inline-block mr-2 h-4 w-4 text-gray-500 dark:text-gray-400" />
                      {investor.email || "No email available."}
                    </p>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4 space-y-1">
                      <p><strong>Region:</strong> {investor.location || 'N/A'}</p>
                      <p><strong>Role:</strong> {investor.role || 'N/A'}</p>
                      <p><strong>Stage:</strong> {investor.investmentStage}</p>
                    </div>
                  </Link>
                  <div className="flex flex-col mt-4 space-y-3">
                    <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition duration-200 text-sm">View Profile</button>
                    <button className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-gray-600 transition duration-200 text-sm">Message</button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </main>

      {/* Filter Modal - Kept as is */}
      <AnimatePresence>
        {showFilterModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 dark:bg-black/80 z-50 flex items-start justify-center pt-20 p-4" onClick={() => setShowFilterModal(false)}>
            <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit" className="bg-white dark:bg-gray-900 rounded-lg shadow-2xl p-6 md:p-8 w-full max-w-md max-h-[80vh] overflow-y-auto relative" onClick={(e) => e.stopPropagation()}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Filters</h2>
                <button onClick={clearFilters} className="text-blue-600 dark:text-blue-400 hover:underline text-sm">Clear All</button>
              </div>
              {/* Reusing Dummy Options for UI consistency */}
              <div className="space-y-6">
                {/* Stage */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Stage</h3>
                    <div className="flex flex-wrap gap-2">
                        {dummyFilterOptions.stages.map(s => (
                            <button key={s} onClick={() => setSelectedStage(selectedStage === s ? '' : s)} className={`px-3 py-1 rounded-full text-sm border ${selectedStage === s ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>{s}</button>
                        ))}
                    </div>
                </div>
                {/* Industry */}
                <div>
                    <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">Industry</h3>
                    <div className="flex flex-wrap gap-2">
                        {dummyFilterOptions.industries.map(s => (
                            <button key={s} onClick={() => setSelectedIndustry(selectedIndustry === s ? '' : s)} className={`px-3 py-1 rounded-full text-sm border ${selectedIndustry === s ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-700'}`}>{s}</button>
                        ))}
                    </div>
                </div>
              </div>
              <div className="mt-8">
                <button onClick={() => setShowFilterModal(false)} className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition duration-200">Apply Filters</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ExploreInvestors;