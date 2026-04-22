const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const Deal = require('../models/Deal');

// Spread across last 6 months so the chart has data in every bar
const samples = [
  // November 2024
  {
    title: 'Studio Apartment Noida',
    client: 'Meera Joshi',
    dealValue: 3200000,
    stage: 'Closed',
    commission: 2,
    property: 'Residential',
    assignedAgent: 'Ravi Kumar',
    notes: 'Closed smoothly',
    closedAt: new Date('2024-11-12'),
    createdAt: new Date('2024-11-05'),
  },
  // December 2024
  {
    title: 'Commercial Plot Faridabad',
    client: 'Arjun Bose',
    dealValue: 9800000,
    stage: 'Closed',
    commission: 1.5,
    property: 'Plot',
    assignedAgent: 'Amit Joshi',
    notes: 'Registry done',
    closedAt: new Date('2024-12-18'),
    createdAt: new Date('2024-12-01'),
  },
  // January 2025
  {
    title: '2BHK Near Metro Dwarka',
    client: 'Suresh Nair',
    dealValue: 5500000,
    stage: 'Closed',
    commission: 2,
    property: 'Residential',
    assignedAgent: 'Amit Joshi',
    notes: 'Deal closed successfully',
    closedAt: new Date('2025-01-20'),
    createdAt: new Date('2025-01-10'),
  },
  {
    title: 'Penthouse in Noida Sector 62',
    client: 'Kavita Rao',
    dealValue: 18000000,
    stage: 'Lost',
    commission: 2,
    property: 'Residential',
    assignedAgent: 'Ravi Kumar',
    notes: 'Client chose a different property',
    createdAt: new Date('2025-01-15'),
  },
  // February 2025
  {
    title: 'Retail Shop in Ambience Mall',
    client: 'Deepak Gupta',
    dealValue: 7500000,
    stage: 'Closed',
    commission: 1.5,
    property: 'Commercial',
    assignedAgent: 'Soni Verma',
    notes: 'Handover completed',
    closedAt: new Date('2025-02-14'),
    createdAt: new Date('2025-02-01'),
  },
  {
    title: 'Villa in Faridabad',
    client: 'Nisha Patel',
    dealValue: 22000000,
    stage: 'Closed',
    commission: 2,
    property: 'Villa',
    assignedAgent: 'Soni Verma',
    notes: 'Premium client, smooth deal',
    closedAt: new Date('2025-02-25'),
    createdAt: new Date('2025-02-10'),
  },
  // March 2025
  {
    title: '3BHK Flat in Delhi',
    client: 'Rahul Sharma',
    dealValue: 8500000,
    stage: 'Negotiation',
    commission: 2,
    property: 'Residential',
    assignedAgent: 'Soni Verma',
    notes: 'Client wants possession by June 2025',
    createdAt: new Date('2025-03-15'),
  },
  {
    title: 'Commercial Office Space',
    client: 'Priya Mehta',
    dealValue: 25000000,
    stage: 'Negotiation',
    commission: 1.5,
    property: 'Commercial',
    assignedAgent: 'Amit Joshi',
    notes: 'Awaiting bank loan approval',
    createdAt: new Date('2025-03-20'),
  },
  // April 2025
  {
    title: 'Luxury Villa in Gurgaon',
    client: 'Vikram Singh',
    dealValue: 45000000,
    stage: 'Agreement',
    commission: 2,
    property: 'Villa',
    assignedAgent: 'Soni Verma',
    notes: 'Agreement signing scheduled for 28 Apr',
    createdAt: new Date('2025-04-01'),
  },
  {
    title: 'Residential Plot Sector 45',
    client: 'Anita Kapoor',
    dealValue: 12000000,
    stage: 'Agreement',
    commission: 1,
    property: 'Plot',
    assignedAgent: 'Ravi Kumar',
    notes: 'Registry paperwork in progress',
    createdAt: new Date('2025-04-05'),
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Deal.deleteMany({});
    console.log('Cleared existing deals');

    const inserted = await Deal.insertMany(samples);
    console.log(`Seeded ${inserted.length} deals successfully`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
