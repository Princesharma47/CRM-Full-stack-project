const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const Lead = require('../models/Lead');

const samples = [
  {
    name: 'Prince Sharma',
    email: 'prince@gmail.com',
    phone: '9876543210',
    budget: 700000,
    source: 'Website',
    status: 'Contacted',
    followUpDate: new Date('2025-04-20'),
  },
  {
    name: 'Rahul Verma',
    email: 'rahul@gmail.com',
    phone: '9123456780',
    budget: 1500000,
    source: 'Facebook',
    status: 'New',
    followUpDate: new Date('2025-04-18'),
  },
  {
    name: 'Anita Kapoor',
    email: 'anita.kapoor@gmail.com',
    phone: '9988776655',
    budget: 8500000,
    source: 'Referral',
    status: 'Qualified',
    followUpDate: new Date('2025-04-22'),
  },
  {
    name: 'Vikram Singh',
    email: 'vikram.singh@outlook.com',
    phone: '9871234560',
    budget: 25000000,
    source: 'Website',
    status: 'Negotiation',
    followUpDate: new Date('2025-04-25'),
  },
  {
    name: 'Priya Mehta',
    email: 'priya.mehta@gmail.com',
    phone: '9765432100',
    budget: 5500000,
    source: 'Facebook',
    status: 'New',
    followUpDate: new Date('2025-04-19'),
  },
  {
    name: 'Suresh Nair',
    email: 'suresh.nair@yahoo.com',
    phone: '9654321098',
    budget: 12000000,
    source: 'Ad',
    status: 'Closed',
    followUpDate: new Date('2025-03-30'),
  },
  {
    name: 'Deepak Gupta',
    email: 'deepak.g@gmail.com',
    phone: '9543210987',
    budget: 3500000,
    source: 'Call',
    status: 'Lost',
    followUpDate: new Date('2025-03-15'),
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Lead.deleteMany({});
    console.log('Cleared existing leads');

    const inserted = await Lead.insertMany(samples);
    console.log(`Seeded ${inserted.length} leads successfully`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
