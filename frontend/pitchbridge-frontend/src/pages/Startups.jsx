import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { API_BASE_URL } from '../config';

// Import necessary Lucide icons
import { Search, SlidersHorizontal, XCircle, ChevronDown, X, Sparkles } from 'lucide-react';

const Startups = () => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStartups, setFilteredStartups] = useState([]);

    // AI Match States
    const [aiMatches, setAiMatches] = useState([]);
    const [showAiView, setShowAiView] = useState(false);
    const [loadingAi, setLoadingAi] = useState(false);

    // Filter related states
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({
        stage: '',
        industry: '',
        fundingRange: '',
        location: '',
        teamSize: ''
    });

    // Filter options
    const filterOptions = {
        stage: ['Idea', 'Prototype', 'MVP', 'Early Revenue', 'Growth', 'Scale'],
        industry: ['Technology', 'Healthcare', 'Finance', 'E-commerce', 'Education', 'Food & Beverage', 'Gaming', 'AI/ML', 'Blockchain'],
        fundingRange: ['Pre-Seed', '$0-50K', '$50K-250K', '$250K-1M', '$1M-5M', '$5M+'],
        location: ['USA', 'India', 'UK', 'Canada', 'Germany', 'Singapore', 'Australia', 'Remote'],
        teamSize: ['1-2', '3-5', '6-10', '11-25', '26-50', '50+']
    };

    useEffect(() => {
        const fetchStartups = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${API_BASE_URL}/api/startups`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();

                if (Array.isArray(data.data)) {
                    setStartups(data.data);
                    setFilteredStartups(data.data);
                } else {
                    console.error("Unexpected API response format.", data);
                    setStartups([]);
                    setFilteredStartups([]);
                    setError('Failed to load startups due to unexpected data format.');
                }
            } catch (err) {
                console.error("Failed to load startups:", err);
                setError(err.message || 'Failed to load startups. Please try again later.');
                setStartups([]);
                setFilteredStartups([]);
            } finally {
                setLoading(false);
            }
        };

        fetchStartups();
    }, []);

    // AI Match Function
    const handleAIMatch = async () => {
        setLoadingAi(true);
        try {
            const token = localStorage.getItem('token');
            
            // Ensure we have a token
            if (!token) {
                alert("Please log in to use AI Match.");
                setLoadingAi(false);
                return;
            }

            const res = await fetch(`${API_BASE_URL}/api/ai-match/startups`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            if (!res.ok) throw new Error("Failed to fetch AI matches");
            
            const data = await res.json();
            setAiMatches(data);
            setShowAiView(true);
        } catch (err) {
            console.error("AI Match Failed", err);
        } finally {
            setLoadingAi(false);
        }
    };

    const applyFilters = useCallback(() => {
        let results = startups;

        if (searchTerm) {
            const lowerCaseSearchTerm = searchTerm.toLowerCase();
            results = results.filter(startup =>
                (startup.startupName && startup.startupName.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (startup.summary && startup.summary.toLowerCase().includes(lowerCaseSearchTerm)) ||
                (startup.tags && startup.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm)))
            );
        }

        if (filters.stage) {
            results = results.filter(startup =>
                startup.stage && startup.stage.toLowerCase() === filters.stage.toLowerCase()
            );
        }

        if (filters.industry) {
            results = results.filter(startup =>
                (startup.industry && startup.industry.toLowerCase().includes(filters.industry.toLowerCase())) ||
                (startup.tags && startup.tags.some(tag => tag.toLowerCase().includes(filters.industry.toLowerCase())))
            );
        }

        if (filters.fundingRange) {
            results = results.filter(startup => {
                const fundingAmount = startup.fundingAmount || startup.funding || 0;
                const range = filters.fundingRange;

                if (range === 'Pre-Seed') return fundingAmount === 0 || !fundingAmount;
                if (range === '$0-50K') return fundingAmount >= 0 && fundingAmount <= 50000;
                if (range === '$50K-250K') return fundingAmount > 50000 && fundingAmount <= 250000;
                if (range === '$250K-1M') return fundingAmount > 250000 && fundingAmount <= 1000000;
                if (range === '$1M-5M') return fundingAmount > 1000000 && fundingAmount <= 5000000;
                if (range === '$5M+') return fundingAmount > 5000000;
                return true;
            });
        }

        if (filters.location) {
            results = results.filter(startup =>
                startup.location && startup.location.toLowerCase().includes(filters.location.toLowerCase())
            );
        }

        if (filters.teamSize) {
            results = results.filter(startup => {
                const teamSize = startup.teamSize || startup.team_size || 0;
                const range = filters.teamSize;

                if (range === '1-2') return teamSize >= 1 && teamSize <= 2;
                if (range === '3-5') return teamSize >= 3 && teamSize <= 5;
                if (range === '6-10') return teamSize >= 6 && teamSize <= 10;
                if (range === '11-25') return teamSize >= 11 && teamSize <= 25;
                if (range === '26-50') return teamSize >= 26 && teamSize <= 50;
                if (range === '50+') return teamSize > 50;
                return true;
            });
        }
        return results;
    }, [searchTerm, startups, filters]);

    useEffect(() => {
        setFilteredStartups(applyFilters());
    }, [searchTerm, startups, filters, applyFilters]);

    const handleFilterChange = (filterType, value) => {
        setFilters(prev => ({
            ...prev,
            [filterType]: prev[filterType] === value ? '' : value
        }));
    };

    const clearAllFilters = () => {
        setFilters({
            stage: '',
            industry: '',
            fundingRange: '',
            location: '',
            teamSize: ''
        });
    };

    const getActiveFiltersCount = () => {
        return Object.values(filters).filter(value => value !== '').length;
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <main className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 pt-20 pb-16">
                {/* Background Gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 z-0 opacity-70">
                    <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                    <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pink-300 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-purple-300 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="text-5xl font-extrabold text-center text-gray-800 dark:text-white mb-6 leading-tight"
                    >
                        Discover Innovative Startups
                    </motion.h1>
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                        className="text-xl text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
                    >
                        Explore groundbreaking ideas from passionate founders.
                    </motion.p>

                    {/* Search & Filter Bar */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        className="flex justify-center mb-12"
                    >
                        <div className="flex items-center gap-4 w-full max-w-4xl">
                            {/* Search Input */}
                            <div className="relative flex-1 max-w-lg">
                                <input
                                    type="text"
                                    placeholder="Search by name, idea, or tags..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full px-6 py-3 pl-12 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-500/50 shadow-md"
                                />
                                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-6 w-6" />
                            </div>

                            {/* Filter Button */}
                            <div className="relative">
                                <button
                                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                                    className="flex items-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-full text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-3 focus:ring-blue-500/50 shadow-md transition-all duration-200"
                                >
                                    <SlidersHorizontal className="h-5 w-5" />
                                    <span className="font-medium">Filter</span>
                                    {getActiveFiltersCount() > 0 && (
                                        <span className="bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                                            {getActiveFiltersCount()}
                                        </span>
                                    )}
                                    <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isFilterOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Filter Modal */}
                                <AnimatePresence>
                                    {isFilterOpen && (
                                        <motion.div
                                            initial={{ opacity: 0, scale: 0.95 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.95 }}
                                            transition={{ duration: 0.2 }}
                                            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
                                        >
                                            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsFilterOpen(false)}></div>
                                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] flex flex-col relative z-10 overflow-hidden">
                                                {/* Filter Header */}
                                                <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700 flex-shrink-0">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Filters</h3>
                                                    <div className="flex items-center gap-2">
                                                        <button onClick={clearAllFilters} className="text-sm text-blue-600 dark:text-blue-400 hover:underline">Clear All</button>
                                                        <button onClick={() => setIsFilterOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"><X className="h-5 w-5" /></button>
                                                    </div>
                                                </div>
                                                {/* Filter Content */}
                                                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                                                    <div className="space-y-6">
                                                        {Object.keys(filterOptions).map((filterType) => (
                                                            <div key={filterType}>
                                                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 capitalize">{filterType.replace(/([A-Z])/g, ' $1').trim()}</label>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {filterOptions[filterType].map((option) => (
                                                                        <button
                                                                            key={option}
                                                                            onClick={() => handleFilterChange(filterType, option)}
                                                                            className={`px-3 py-2 text-sm rounded-full border transition-all duration-200 ${filters[filterType] === option ? 'bg-blue-500 text-white border-blue-500 shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
                                                                        >
                                                                            {option}
                                                                        </button>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* Filter Apply */}
                                                <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0">
                                                    <button onClick={() => setIsFilterOpen(false)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-xl transition-colors duration-200">
                                                        Apply Filters ({filteredStartups.length} results)
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* AI Match Button */}
                            <button
                                onClick={handleAIMatch}
                                disabled={loadingAi}
                                className={`flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white font-medium rounded-full shadow-md hover:shadow-lg focus:outline-none focus:ring-3 focus:ring-purple-500/50 transition-all duration-200 ${loadingAi ? 'opacity-75 cursor-not-allowed' : ''}`}
                            >
                                <Sparkles className={`h-5 w-5 ${loadingAi ? 'animate-spin' : ''}`} />
                                <span>{loadingAi ? "Analyzing..." : "AI Match"}</span>
                            </button>
                        </div>
                    </motion.div>

                    {/* AI Results Section */}
                    <AnimatePresence>
                        {showAiView && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mb-12 overflow-hidden"
                            >
                                <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-3xl p-8 relative">
                                    <div className="flex justify-between items-center mb-6">
                                        <div>
                                            <h2 className="text-2xl font-bold text-purple-900 dark:text-purple-100 flex items-center gap-2">
                                                <Sparkles className="text-purple-600 dark:text-purple-400" />
                                                AI-Curated Picks
                                            </h2>
                                            <p className="text-purple-700 dark:text-purple-300 text-sm">Based on your profile preferences</p>
                                        </div>
                                        <button 
                                            onClick={() => setShowAiView(false)}
                                            className="p-2 hover:bg-purple-100 dark:hover:bg-purple-800 rounded-full text-purple-600 dark:text-purple-300 transition-colors"
                                        >
                                            <X className="h-6 w-6" />
                                        </button>
                                    </div>

                                    {aiMatches.length > 0 ? (
                                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                            {aiMatches.map((startup) => (
                                                <div key={startup._id} className="bg-white dark:bg-gray-800 p-5 rounded-xl shadow-lg border-2 border-purple-100 dark:border-purple-800 relative overflow-hidden hover:scale-105 transition-transform duration-200">
                                                    <div className="absolute top-0 right-0 bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-bl-xl shadow-sm">
                                                        {startup.matchScore}% Match
                                                    </div>
                                                    
                                                    <Link to={`/startups/${startup._id}`}>
                                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 pr-16">{startup.startupName}</h3>
                                                    </Link>
                                                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{startup.summary}</p>
                                                    
                                                    <div className="bg-purple-50 dark:bg-purple-900/40 p-3 rounded-lg mb-3">
                                                        <p className="text-xs font-bold text-purple-700 dark:text-purple-300 mb-1 uppercase tracking-wide">Why it fits:</p>
                                                        <ul className="space-y-1">
                                                            {startup.matchReasons && startup.matchReasons.map((reason, i) => (
                                                                <li key={i} className="text-xs text-gray-600 dark:text-gray-300 flex items-start gap-1.5">
                                                                    <span className="text-purple-500 mt-0.5">•</span>
                                                                    {reason}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                    
                                                    <div className="flex gap-2 text-xs text-gray-500 dark:text-gray-400 mt-auto border-t border-gray-100 dark:border-gray-700 pt-3">
                                                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{startup.industry}</span>
                                                        <span className="bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">{startup.location}</span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-purple-800 dark:text-purple-200">
                                            <p>No high-confidence matches found yet.</p>
                                            <p className="text-sm opacity-75">Try updating your profile with more specific interests!</p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Loading & Error States */}
                    {loading && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="flex flex-col items-center justify-center min-h-[40vh] text-blue-600 dark:text-blue-400"
                        >
                            <svg className="animate-spin h-12 w-12 text-current" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <p className="mt-4 text-xl font-medium">Loading innovative startups...</p>
                        </motion.div>
                    )}

                    {error && !loading && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex items-center justify-center bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 py-4 px-6 rounded-lg mb-6 text-lg font-medium border border-red-200 dark:border-red-700 max-w-xl mx-auto"
                        >
                            <XCircle className="h-5 w-5 mr-3" />
                            <p>{error}</p>
                        </motion.div>
                    )}

                    {!loading && !error && filteredStartups.length > 0 ? (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        >
                            {filteredStartups.map((startup) => (
                                <motion.div
                                    key={startup._id}
                                    variants={itemVariants}
                                    whileHover={{ scale: 1.03, zIndex: 10 }}
                                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                                    className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-xl rounded-3xl p-6 border border-white/30 dark:border-gray-700/50 cursor-pointer overflow-hidden group"
                                >
                                    <Link to={`/startups/${startup._id}`} className="block">
                                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition duration-200">
                                            {startup.startupName || "Unnamed Startup"}
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-300 text-base mb-4 line-clamp-3">
                                            {startup.summary || "No summary available for this startup."}
                                        </p>
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {startup.tags && startup.tags.map((tag, index) => (
                                                <span key={index} className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                                            {startup.stage && (
                                                <span className="flex items-center">
                                                    <svg className="h-4 w-4 mr-1" fill="currentColor" viewBox="0 0 20 20"><path d="M11 3a1 1 0 100 2h3a1 1 0 100-2h-3zM10.843 14.167a1.999 1.999 0 01-2.905-.184l-2.839-4.257a1 1 0 00-1.635.088l-2 3a1 1 0 00.901 1.587h12a1 1 0 00.901-1.587l-2-3a1 1 0 00-1.635-.088l-2.839 4.257zM10 18a1 1 0 100-2h3a1 1 0 100 2h-3zM4 12a1 1 0 100-2h3a1 1 0 100 2H4z" /></svg>
                                                    {startup.stage}
                                                </span>
                                            )}
                                            <span className="text-blue-600 dark:text-blue-400 font-semibold group-hover:underline transition duration-200">
                                                View Details →
                                            </span>
                                        </div>
                                    </Link>
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        !loading && !error && filteredStartups.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center mt-20 p-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md rounded-2xl shadow-xl border border-white/30 dark:border-gray-700/50 max-w-2xl mx-auto"
                            >
                                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                                    No Startups Found!
                                </h3>
                                <p className="text-lg text-gray-600 dark:text-gray-300">
                                    It looks like there are no startups to display right now, or your search didn't match any.
                                </p>
                                <p className="text-md text-gray-500 dark:text-gray-400 mt-2">
                                    Check back later, or try a different search term.
                                </p>
                            </motion.div>
                        )
                    )}
                </div>
            </main>
        </div>
    );
};

export default Startups;