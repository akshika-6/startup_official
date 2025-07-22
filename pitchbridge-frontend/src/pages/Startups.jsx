import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion'; // Import motion for animations
import { API_BASE_URL } from '../config';

// Import any necessary Lucide icons if you want to use them (e.g., Search, Filter)
// import { Search, SlidersHorizontal } from 'lucide-react'; // Example Lucide icons

import Navbar from '../components/Navbar'; // Assuming Navbar is needed here too

const Startups = () => {
    const [startups, setStartups] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); // New state for API errors
    const [searchTerm, setSearchTerm] = useState(''); // For search functionality
    const [filteredStartups, setFilteredStartups] = useState([]); // For search results

    useEffect(() => {
        const fetchStartups = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/startups`);
                if (!res.ok) {
                    throw new Error(`HTTP error! status: ${res.status}`);
                }
                const data = await res.json();

                if (Array.isArray(data.data)) {
                    setStartups(data.data);
                    setFilteredStartups(data.data); // Initialize filtered list with all startups
                } else {
                    console.error("Unexpected API response format. Expected data.data to be an array.", data);
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

    // Effect for filtering startups based on search term
    useEffect(() => {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const results = startups.filter(startup =>
            (startup.startupName && startup.startupName.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (startup.summary && startup.summary.toLowerCase().includes(lowerCaseSearchTerm)) ||
            (startup.tags && startup.tags.some(tag => tag.toLowerCase().includes(lowerCaseSearchTerm))) // Assuming startups might have tags
        );
        setFilteredStartups(results);
    }, [searchTerm, startups]);

    // Framer Motion variants for staggered list animations
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1 // Each child animates with a slight delay
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="relative min-h-screen flex flex-col items-center overflow-hidden">
            {/* Background Gradient & Animated Shapes (Consistent with Login/Register) */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 dark:from-gray-950 dark:via-purple-950 dark:to-blue-950 z-0">
                <div className="absolute -top-1/4 -left-1/4 w-1/2 h-1/2 bg-blue-300 dark:bg-blue-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute -bottom-1/4 -right-1/4 w-1/2 h-1/2 bg-pink-300 dark:bg-purple-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/3 h-1/3 bg-purple-300 dark:bg-pink-800 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <Navbar className="absolute top-0 w-full z-20" /> {/* Z-index for Navbar */}

            <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24"> {/* Added padding top for navbar clear and overall section padding */}
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

                {/* Search Bar (Optional but recommended for lists) */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="flex justify-center mb-12"
                >
                    <div className="relative w-full max-w-lg">
                        <input
                            type="text"
                            placeholder="Search by name, idea, or tags..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full px-6 py-3 pl-12 border border-gray-300 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 text-lg text-gray-800 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-3 focus:ring-blue-500/50 shadow-md"
                        />
                        {/* <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400 h-6 w-6" /> */}
                        {/* If you want to use the Lucide Search icon, uncomment the line above and import Search */}
                    </div>
                </motion.div>


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
                                {/* Overlay for hover effect */}
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none"></div>
                            </motion.div>
                        ))}
                    </motion.div>
                ) : (
                    !loading && !error && (
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
        </div>
    );
};

export default Startups;