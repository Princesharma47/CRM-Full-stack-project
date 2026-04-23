const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const Lead = require('./models/Lead');
const Deal = require('./models/Deal');
const Property = require('./models/Property');

const leads = [
  { name: 'Prince Sharma', email: 'prince@gmail.com', phone: '9876543210', budget: 700000, source: 'Website', status: 'Contacted', followUpDate: new Date('2025-04-20') },
  { name: 'Rahul Verma', email: 'rahul@gmail.com', phone: '9123456780', budget: 1500000, source: 'Facebook', status: 'New', followUpDate: new Date('2025-04-18') },
  { name: 'Anita Kapoor', email: 'anita.kapoor@gmail.com', phone: '9988776655', budget: 8500000, source: 'Referral', status: 'Qualified', followUpDate: new Date('2025-04-22') },
  { name: 'Vikram Singh', email: 'vikram.singh@outlook.com', phone: '9871234560', budget: 25000000, source: 'Website', status: 'Negotiation', followUpDate: new Date('2025-04-25') },
  { name: 'Priya Mehta', email: 'priya.mehta@gmail.com', phone: '9765432100', budget: 5500000, source: 'Facebook', status: 'New', followUpDate: new Date('2025-04-19') },
  { name: 'Suresh Nair', email: 'suresh.nair@yahoo.com', phone: '9654321098', budget: 12000000, source: 'Ad', status: 'Closed', followUpDate: new Date('2025-03-30') },
  { name: 'Deepak Gupta', email: 'deepak.g@gmail.com', phone: '9543210987', budget: 3500000, source: 'Call', status: 'Lost', followUpDate: new Date('2025-03-15') },
];

const deals = [
  { title: 'Studio Apartment Noida', client: 'Meera Joshi', dealValue: 3200000, stage: 'Closed', commission: 2, property: 'Residential', assignedAgent: 'Ravi Kumar', notes: 'Closed smoothly', closedAt: new Date('2024-11-12'), createdAt: new Date('2024-11-05') },
  { title: 'Commercial Plot Faridabad', client: 'Arjun Bose', dealValue: 9800000, stage: 'Closed', commission: 1.5, property: 'Plot', assignedAgent: 'Amit Joshi', notes: 'Registry done', closedAt: new Date('2024-12-18'), createdAt: new Date('2024-12-01') },
  { title: '2BHK Near Metro Dwarka', client: 'Suresh Nair', dealValue: 5500000, stage: 'Closed', commission: 2, property: 'Residential', assignedAgent: 'Amit Joshi', notes: 'Deal closed successfully', closedAt: new Date('2025-01-20'), createdAt: new Date('2025-01-10') },
  { title: 'Penthouse in Noida Sector 62', client: 'Kavita Rao', dealValue: 18000000, stage: 'Lost', commission: 2, property: 'Residential', assignedAgent: 'Ravi Kumar', notes: 'Client chose a different property', createdAt: new Date('2025-01-15') },
  { title: 'Retail Shop in Ambience Mall', client: 'Deepak Gupta', dealValue: 7500000, stage: 'Closed', commission: 1.5, property: 'Commercial', assignedAgent: 'Soni Verma', notes: 'Handover completed', closedAt: new Date('2025-02-14'), createdAt: new Date('2025-02-01') },
  { title: 'Villa in Faridabad', client: 'Nisha Patel', dealValue: 22000000, stage: 'Closed', commission: 2, property: 'Villa', assignedAgent: 'Soni Verma', notes: 'Premium client, smooth deal', closedAt: new Date('2025-02-25'), createdAt: new Date('2025-02-10') },
  { title: '3BHK Flat in Delhi', client: 'Rahul Sharma', dealValue: 8500000, stage: 'Negotiation', commission: 2, property: 'Residential', assignedAgent: 'Soni Verma', notes: 'Client wants possession by June 2025', createdAt: new Date('2025-03-15') },
  { title: 'Commercial Office Space', client: 'Priya Mehta', dealValue: 25000000, stage: 'Negotiation', commission: 1.5, property: 'Commercial', assignedAgent: 'Amit Joshi', notes: 'Awaiting bank loan approval', createdAt: new Date('2025-03-20') },
  { title: 'Luxury Villa in Gurgaon', client: 'Vikram Singh', dealValue: 45000000, stage: 'Agreement', commission: 2, property: 'Villa', assignedAgent: 'Soni Verma', notes: 'Agreement signing scheduled for 28 Apr', createdAt: new Date('2025-04-01') },
  { title: 'Residential Plot Sector 45', client: 'Anita Kapoor', dealValue: 12000000, stage: 'Agreement', commission: 1, property: 'Plot', assignedAgent: 'Ravi Kumar', notes: 'Registry paperwork in progress', createdAt: new Date('2025-04-05') },
];

const properties = [
  {
    title: '3BHK Luxury Apartment in Sector 62', location: 'Sector 62, Noida', price: 8500000, size: '1450 sq.ft', type: 'Residential', status: 'Available',
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Lift'],
    description: 'Spacious 3BHK apartment with modern amenities in a prime location.',
    images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80', 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'],
  },
  {
    title: 'Commercial Office Space', location: 'Connaught Place, New Delhi', price: 25000000, size: '3200 sq.ft', type: 'Commercial', status: 'Available',
    amenities: ['Parking', 'Power Backup', 'Security', 'Lift'],
    description: 'Premium office space in the heart of Delhi with excellent connectivity.',
    images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80', 'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80'],
  },
  {
    title: 'Residential Plot in Gurgaon', location: 'Sector 45, Gurgaon', price: 12000000, size: '200 sq.yd', type: 'Plot', status: 'Available',
    amenities: ['Corner Plot', 'Park Facing', 'Wide Road'],
    description: 'Prime residential plot in a well-developed sector.',
    images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80', 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80'],
  },
  {
    title: 'Luxury Villa with Pool', location: 'DLF Phase 1, Gurgaon', price: 45000000, size: '5000 sq.ft', type: 'Villa', status: 'Available',
    amenities: ['Private Pool', 'Garden', 'Parking', 'Security', 'Gym'],
    description: 'Stunning independent villa with private pool and landscaped garden.',
    images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80', 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
  },
  {
    title: '2BHK Apartment Near Metro', location: 'Dwarka Sector 10, New Delhi', price: 5500000, size: '950 sq.ft', type: 'Residential', status: 'Sold',
    amenities: ['Parking', 'Lift', 'Security'],
    description: 'Well-maintained 2BHK apartment just 5 minutes from metro station.',
    images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80', 'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80'],
  },
  {
    title: 'Commercial Shop in Mall', location: 'Ambience Mall, Gurgaon', price: 7500000, size: '450 sq.ft', type: 'Commercial', status: 'Reserved',
    amenities: ['High Footfall', 'Parking', 'Power Backup'],
    description: 'Prime retail space inside a premium mall with high footfall.',
    images: ['https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80', 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80'],
  },
];

/**
 * Seeds a collection only if it is empty.
 * Safe to call on every server start.
 */
const seedIfEmpty = async (Model, data, label) => {
  const count = await Model.countDocuments();
  if (count === 0) {
    await Model.insertMany(data);
    console.log(`[seed] Inserted ${data.length} ${label}`);
  } else {
    console.log(`[seed] ${label} already has ${count} records — skipping`);
  }
};

const runSeed = async () => {
  try {
    await seedIfEmpty(Lead, leads, 'leads');
    await seedIfEmpty(Deal, deals, 'deals');
    await seedIfEmpty(Property, properties, 'properties');
  } catch (err) {
    console.error('[seed] Error:', err.message);
  }
};

// Allow running directly: node seed.js
if (require.main === module) {
  const MONGO_URI = process.env.MONGO_URI || process.env.MONGO_URL;
  mongoose.connect(MONGO_URI).then(async () => {
    console.log('[seed] Connected to MongoDB');
    await runSeed();
    process.exit(0);
  }).catch(err => {
    console.error('[seed] Connection error:', err.message);
    process.exit(1);
  });
}

module.exports = runSeed;
