const mongoose = require('mongoose');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config({ path: path.join(__dirname, '../.env') });

const Property = require('../models/Property');

// Unsplash direct image URLs (free, no auth needed)
const samples = [
  {
    title: '3BHK Luxury Apartment in Sector 62',
    location: 'Sector 62, Noida',
    price: 8500000,
    size: '1450 sq.ft',
    type: 'Residential',
    status: 'Available',
    amenities: ['Parking', 'Gym', 'Swimming Pool', 'Lift'],
    description: 'Spacious 3BHK apartment with modern amenities in a prime location.',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80',
    ],
  },
  {
    title: 'Commercial Office Space',
    location: 'Connaught Place, New Delhi',
    price: 25000000,
    size: '3200 sq.ft',
    type: 'Commercial',
    status: 'Available',
    amenities: ['Parking', 'Power Backup', 'Security', 'Lift'],
    description: 'Premium office space in the heart of Delhi with excellent connectivity.',
    images: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
      'https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=800&q=80',
    ],
  },
  {
    title: 'Residential Plot in Gurgaon',
    location: 'Sector 45, Gurgaon',
    price: 12000000,
    size: '200 sq.yd',
    type: 'Plot',
    status: 'Available',
    amenities: ['Corner Plot', 'Park Facing', 'Wide Road'],
    description: 'Prime residential plot in a well-developed sector.',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=80',
    ],
  },
  {
    title: 'Luxury Villa with Pool',
    location: 'DLF Phase 1, Gurgaon',
    price: 45000000,
    size: '5000 sq.ft',
    type: 'Villa',
    status: 'Available',
    amenities: ['Private Pool', 'Garden', 'Parking', 'Security', 'Gym'],
    description: 'Stunning independent villa with private pool and landscaped garden.',
    images: [
      'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80',
    ],
  },
  {
    title: '2BHK Apartment Near Metro',
    location: 'Dwarka Sector 10, New Delhi',
    price: 5500000,
    size: '950 sq.ft',
    type: 'Residential',
    status: 'Sold',
    amenities: ['Parking', 'Lift', 'Security'],
    description: 'Well-maintained 2BHK apartment just 5 minutes from metro station.',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?w=800&q=80',
    ],
  },
  {
    title: 'Commercial Shop in Mall',
    location: 'Ambience Mall, Gurgaon',
    price: 7500000,
    size: '450 sq.ft',
    type: 'Commercial',
    status: 'Reserved',
    amenities: ['High Footfall', 'Parking', 'Power Backup'],
    description: 'Prime retail space inside a premium mall with high footfall.',
    images: [
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&q=80',
      'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=800&q=80',
    ],
  },
];

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    await Property.deleteMany({});
    console.log('Cleared existing properties');

    const inserted = await Property.insertMany(samples);
    console.log(`Seeded ${inserted.length} properties successfully`);

    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
};

seed();
