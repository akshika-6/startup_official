import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs'; // ✅ added
dotenv.config();

import {
  User,
  Startup,
  InvestorPreference,
  Pitch,
  Meeting,
  Notification,
  Message,
  Rating,
  Comment
} from './Schema.mjs'; // Adjust path if needed

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.log('❌ Connection error:', err));

async function seedData() {
  try {
    await User.deleteMany({});
    await Startup.deleteMany({});
    await InvestorPreference.deleteMany({});
    await Pitch.deleteMany({});
    await Meeting.deleteMany({});
    await Notification.deleteMany({});
    await Message.deleteMany({});
    await Rating.deleteMany({});
    await Comment.deleteMany({});

    // ✅ Hash passwords
    const hashedFounderPassword = await bcrypt.hash('securepass123', 10);
    const hashedInvestorPassword = await bcrypt.hash('investpass456', 10);

    // 1 founder
    const founder = await User.create({
      name: 'Akshika Gupta',
      email: 'akshika@example.com',
      password: hashedFounderPassword,
      role: 'founder',
      location: 'Prayagraj',
      verified: true
    });

    // 1 basic investor
    const investor = await User.create({
      name: 'Rohit Mehta',
      email: 'rohit@example.com',
      password: hashedInvestorPassword,
      role: 'investor',
      location: 'Delhi',
      verified: true
    });

    // 5 more investors
    const investors = await User.insertMany([
      {
        name: 'Aarav Ventures',
        email: 'aarav@example.com',
        password: await bcrypt.hash('aaravpass', 10),
        role: 'investor',
        location: 'Mumbai',
        verified: true,
        bio: 'Investing in HealthTech across India.',
        region: 'India',
        sector: 'HealthTech',
        stage: 'Seed',
        ticketSize: '$50K–$200K',
        tags: ['Top Investor', 'Active Deal']
      },
      {
        name: 'Zenith Capital',
        email: 'zenith@example.com',
        password: await bcrypt.hash('zenithpass', 10),
        role: 'investor',
        location: 'New York',
        verified: true,
        region: 'USA',
        sector: 'AI',
        stage: 'Series A',
        ticketSize: '$1M+',
        tags: ['Recently Funded']
      },
      {
        name: 'FutureSeed',
        email: 'futureseed@example.com',
        password: await bcrypt.hash('futurepass', 10),
        role: 'investor',
        location: 'Berlin',
        verified: true,
        region: 'Europe',
        sector: 'Green Energy',
        stage: 'Pre-Seed',
        ticketSize: '<$50K',
        tags: ['Active Deal']
      },
      {
        name: 'BridgeStone VC',
        email: 'bridgestone@example.com',
        password: await bcrypt.hash('bridgepass', 10),
        role: 'investor',
        location: 'Singapore',
        verified: true,
        region: 'Singapore',
        sector: 'EdTech',
        stage: 'Seed',
        ticketSize: '$200K–$1M',
        tags: ['Top Investor', 'Recently Funded']
      },
      {
        name: 'NovaX Capital',
        email: 'novax@example.com',
        password: await bcrypt.hash('novaxpass', 10),
        role: 'investor',
        location: 'Bangalore',
        verified: true,
        region: 'India',
        sector: 'FinTech',
        stage: 'Series B',
        ticketSize: '$500K–$2M',
        tags: ['Active Deal']
      }
    ]);

    // 10 startups
    const startupNames = [
      'PitchBridge', 'GreenCore', 'HealthX', 'AI Genie', 'EdurekaNext',
      'FinSpark', 'UrbanFarmers', 'JobBuddy', 'LogiChain', 'CryptoNest'
    ];

    const startupDocs = await Promise.all(startupNames.map((name, i) =>
      Startup.create({
        founderId: founder._id,
        startupName: name,
        domain: ['Health', 'Tech', 'Green', 'Logistics', 'Crypto'][i % 5],
        stage: ['Idea', 'MVP', 'Launched', 'Scaling'][i % 4],
        summary: `A startup working on ${name} solutions.`,
        location: ['India', 'USA', 'Europe', 'Singapore'][i % 4],
        targetRaise: 100000 + (i * 50000),
        equityOffered: 5 + (i % 6)
      })
    ));

    // Create investor preference for `investor`
    await InvestorPreference.create({
      investorId: investor._id,
      preferredDomains: ['Networking', 'Tech'],
      fundingRange: { min: 100000, max: 500000 },
      locationInterest: ['India'],
      equityRange: { min: 5, max: 20 }
    });

    // Create pitch and related records for the first startup
    const pitch = await Pitch.create({
      startupId: startupDocs[0]._id,
      investorId: investor._id,
      message: 'Please review our startup.',
      status: 'pending'
    });

    await Meeting.create({
      pitchId: pitch._id,
      scheduledAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      meetingLink: 'https://zoom.us/meeting',
      notes: 'Discuss equity structure'
    });

    await Notification.create({
      userId: investor._id,
      message: 'You received a new pitch from PitchBridge.'
    });

    await Message.create({
      senderId: founder._id,
      receiverId: investor._id,
      message: 'Hello! Looking forward to connecting.',
      type: 'text',
      pitchId: pitch._id
    });

    await Rating.create({
      ratedBy: investor._id,
      ratedUserId: founder._id,
      startupId: startupDocs[0]._id,
      score: 5,
      review: 'Promising startup with clear vision.'
    });

    await Comment.create({
      userId: investor._id,
      targetType: 'startup',
      targetId: startupDocs[0]._id,
      comment: 'Looking forward to your next update!',
      replies: [
        {
          userId: founder._id,
          replyText: 'Thanks! We will keep you posted.'
        }
      ]
    });

    console.log('✅ All dummy data inserted successfully');
  } catch (err) {
    console.error('❌ Seeding failed:', err);
  } finally {
    mongoose.disconnect();
  }
}

seedData();
