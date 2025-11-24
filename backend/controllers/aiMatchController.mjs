import { Startup, InvestorPreference } from '../Schema.mjs'; 

// Weights for the AI Scoring Algorithm
const WEIGHTS = {
  INDUSTRY: 45, 
  STAGE: 25,    
  LOCATION: 20, 
  KEYWORD: 10   
};

// Helper: Clean and normalize strings
const normalize = (str) => str ? str.toLowerCase().trim() : "";

// Helper: Calculate Match Score
const calculateScore = (source, candidate, type, isDemoMode = false) => {
  let score = 0;
  let reasons = [];

  // --- PREPARE DATA ---
  let sourceIndustries, candidateIndustries;
  let sourceStage, candidateStage;
  let sourceLocations, candidateLocation;
  let sourceText, candidateText;

  if (type === 'investor-view') {
    // Source = Investor, Candidate = Startup
    sourceIndustries = source.areasOfInterest 
      ? source.areasOfInterest.split(',').map(s => normalize(s)) 
      : (source.preferredDomains || []);
      
    candidateIndustries = [normalize(candidate.domain)];
    sourceStage = normalize(source.investmentAmount || source.stage); 
    candidateStage = normalize(candidate.stage);
    sourceLocations = source.locationInterest ? source.locationInterest.map(l => normalize(l)) : [];
    candidateLocation = normalize(candidate.location);
    sourceText = normalize(source.notes);
    candidateText = normalize(candidate.summary);

  } else {
    // Source = Startup, Candidate = Investor
    sourceIndustries = [normalize(source.domain)];
    candidateIndustries = candidate.areasOfInterest 
      ? candidate.areasOfInterest.split(',').map(s => normalize(s))
      : (candidate.preferredDomains || []);

    sourceStage = normalize(source.stage);
    candidateStage = normalize(candidate.investmentAmount || candidate.stage);
    
    // For founders, check if investor covers startup's location
    sourceLocations = candidate.locationInterest ? candidate.locationInterest.map(l => normalize(l)) : [];
    candidateLocation = normalize(source.location); 
  }

  // --- SCORING ---
  const industryMatch = sourceIndustries.some(srcInd => 
    candidateIndustries.some(candInd => candInd.includes(srcInd) || srcInd.includes(candInd))
  );
  const isTechBroad = sourceIndustries.includes('technology') || candidateIndustries.includes('technology');

  if (industryMatch) {
    score += WEIGHTS.INDUSTRY;
    reasons.push("High industry relevance");
  } else if (isTechBroad) {
    score += 15;
    reasons.push("Aligned with tech sector");
  }

  if (sourceStage && candidateStage && (sourceStage.includes(candidateStage) || candidateStage.includes(sourceStage))) {
    score += WEIGHTS.STAGE;
    reasons.push(`Matches stage: ${candidate.stage || candidate.investmentAmount || "Target"}`);
  }

  const locationMatch = sourceLocations.some(l => l.includes(candidateLocation) || candidateLocation.includes(l));
  if (locationMatch) {
    score += WEIGHTS.LOCATION;
    reasons.push(`Location match (${candidate.location || "Region"})`);
  }

  if (sourceText && candidateText) {
    const keywords = sourceText.split(" ").filter(w => w.length > 4); 
    if (keywords.some(word => candidateText.includes(word))) {
      score += WEIGHTS.KEYWORD;
      reasons.push("Profile keywords align");
    }
  }

  if (isDemoMode) {
    const variance = Math.floor(Math.random() * 15);
    score += variance;
    if (score < 30) { score += 20; reasons.push("Potential emerging match"); }
  }

  return {
    score: Math.min(score, 100),
    reasons: reasons.length > 0 ? reasons : ["General sector fit"]
  };
};

// --- CONTROLLERS ---

// For INVESTORS looking for STARTUPS
export const getStartupMatches = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id; 
    let isDemo = false;
    
    let investorPref = await InvestorPreference.findOne({ investorId: userId });

    if (!investorPref) {
        // console.log("⚠️ DEV MODE: Using Dummy Investor Profile.");
        isDemo = true;
        investorPref = {
            areasOfInterest: "Technology, AI, SaaS, Health, Finance",
            investmentAmount: "Seed", 
            locationInterest: ["Remote", "India", "USA", "UK"],
            notes: "Looking for high growth startups"
        };
    }

    // ✅ Populate 'founderId' to get Startup Founder's Name if needed
    const allStartups = await Startup.find({}).populate('founderId', 'name email');
    
    const matches = allStartups.map(startup => {
      const analysis = calculateScore(investorPref, startup, 'investor-view', isDemo);
      return {
        ...startup.toObject(),
        founderName: startup.founderId ? startup.founderId.name : "Founder", // Extract name
        matchScore: analysis.score,
        matchReasons: analysis.reasons
      };
    })
    .filter(m => m.matchScore > 0) 
    .sort((a, b) => b.matchScore - a.matchScore);

    res.json(matches);
  } catch (error) {
    console.error("Error in getStartupMatches:", error);
    res.status(500).json({ message: error.message });
  }
};

// For FOUNDERS looking for INVESTORS
export const getInvestorMatches = async (req, res) => {
  try {
    const userId = req.user._id || req.user.id;
    let isDemo = false;
    
    let startup = await Startup.findOne({ founderId: userId }); 

    if (!startup) {
        isDemo = true;
        startup = {
            domain: "Technology",
            stage: "Seed",
            location: "India",
            summary: "AI Platform"
        };
    }

    // ✅ THE FIX: Populate 'investorId' to get the Real User Name
    const allInvestors = await InvestorPreference.find({}).populate('investorId', 'name email profilePic');

    const matches = allInvestors.map(investor => {
      const analysis = calculateScore(startup, investor, 'founder-view', isDemo);
      
      // Extract User Name from the populated field
      const userName = investor.investorId ? investor.investorId.name : "Verified Investor";

      return {
        ...investor.toObject(),
        name: userName, // Overwrite/Set the 'name' property directly
        matchScore: analysis.score,
        matchReasons: analysis.reasons
      };
    })
    .filter(m => m.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore);

    res.json(matches);
  } catch (error) {
    console.error("Error in getInvestorMatches:", error);
    res.status(500).json({ message: error.message });
  }
};