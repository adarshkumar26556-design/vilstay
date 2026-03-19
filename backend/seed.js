const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config();

const User = require('./models/User');
const Resort = require('./models/Resort');
const Room = require('./models/Room');

const connectDB = require('./config/db');

const resorts = [
  {
    name: 'Manikarnika Boutique Resort',
    description: 'A premium heritage resort nestled in lush tropical surroundings with traditional laterite stone villas, authentic cuisine, and curated experiences. Every corner breathes history and natural beauty.',
    shortDescription: 'Heritage resort with laterite stone villas in tropical Karnataka.',
    location: { address: 'Vilstay Estate', city: 'Udupi', state: 'Karnataka', country: 'India', lat: 13.3409, lng: 74.7421 },
    images: [
      { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800', public_id: 'resort1_1' },
      { url: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800', public_id: 'resort1_2' },
      { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', public_id: 'resort1_3' },
    ],
    amenities: ['Free WiFi', 'Swimming Pool', 'Free Parking', 'Restaurant', 'Room Service', 'Nature Walks', 'Campfire', 'Children Play Area', 'Air Conditioning', 'Breakfast Included'],
    category: 'heritage',
    rating: 4.8,
    reviewCount: 124,
    featured: true,
    contactEmail: 'stay@manikarnika.in',
    contactPhone: '+91 98765 43210',
    policies: { checkIn: '2:00 PM', checkOut: '11:00 AM', cancellation: 'Free cancellation up to 24 hours before check-in.' },
  },
  {
    name: 'Vilstay Forest Retreat',
    description: 'An eco-friendly forest retreat surrounded by ancient trees, flowing streams, and diverse wildlife. Experience the ultimate nature immersion with sustainable luxury amenities.',
    shortDescription: 'Eco-luxury retreat deep in the Western Ghats forest.',
    location: { address: 'Forest Road', city: 'Coorg', state: 'Karnataka', country: 'India', lat: 12.3375, lng: 75.8069 },
    images: [
      { url: 'https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800', public_id: 'resort2_1' },
      { url: 'https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800', public_id: 'resort2_2' },
      { url: 'https://images.unsplash.com/photo-1540541338537-1220059af4dc?w=800', public_id: 'resort2_3' },
    ],
    amenities: ['Free WiFi', 'Organic Farm', 'Trekking', 'Bonfire', 'Yoga Deck', 'Free Parking', 'Restaurant', 'Bird Watching', 'Eco-Friendly'],
    category: 'eco',
    rating: 4.6,
    reviewCount: 89,
    featured: true,
    contactEmail: 'stay@vilstay.in',
    contactPhone: '+91 98765 43211',
    policies: { checkIn: '1:00 PM', checkOut: '10:00 AM', cancellation: 'Free cancellation up to 48 hours before check-in.' },
  },
  {
    name: 'Coastal Palm Villas',
    description: 'Luxurious beachfront villas with private pools, panoramic ocean views, and world-class dining. The perfect blend of relaxation and coastal adventure.',
    shortDescription: 'Beachfront luxury villas with private pools in Goa.',
    location: { address: 'Beach Road', city: 'North Goa', state: 'Goa', country: 'India', lat: 15.5135, lng: 73.8469 },
    images: [
      { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800', public_id: 'resort3_1' },
      { url: 'https://images.unsplash.com/photo-1615880484746-a134be9a6ecf?w=800', public_id: 'resort3_2' },
      { url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800', public_id: 'resort3_3' },
    ],
    amenities: ['Private Pool', 'Beach Access', 'Free WiFi', 'Restaurant', 'Bar', 'Spa', 'Water Sports', 'Room Service', 'Free Parking'],
    category: 'luxury',
    rating: 4.9,
    reviewCount: 201,
    featured: true,
    contactEmail: 'stay@coastalpalm.in',
    contactPhone: '+91 98765 43212',
    policies: { checkIn: '3:00 PM', checkOut: '12:00 PM', cancellation: 'No refund within 72 hours of check-in.' },
  },
  {
    name: 'Hilltop Heritage Haveli',
    description: 'A magnificent 18th-century haveli perched on a hilltop, fully restored with royal Rajasthani architecture. Experience the grandeur of royalty with modern comforts.',
    shortDescription: 'Restored 18th-century haveli with panoramic Rajasthan views.',
    location: { address: 'Palace Road', city: 'Jaipur', state: 'Rajasthan', country: 'India', lat: 26.9124, lng: 75.7873 },
    images: [
      { url: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28f8e?w=800', public_id: 'resort4_1' },
      { url: 'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=800', public_id: 'resort4_2' },
      { url: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800', public_id: 'resort4_3' },
    ],
    amenities: ['Heritage Tours', 'Rooftop Restaurant', 'Folk Music', 'Free WiFi', 'Swimming Pool', 'Ayurveda Spa', 'Camel Rides', 'Cooking Classes', 'Free Parking'],
    category: 'heritage',
    rating: 4.7,
    reviewCount: 156,
    featured: true,
    contactEmail: 'stay@hilltophaveli.in',
    contactPhone: '+91 98765 43213',
    policies: { checkIn: '2:00 PM', checkOut: '11:00 AM', cancellation: 'Free cancellation up to 48 hours before check-in.' },
  },
];

const seedData = async () => {
  try {
    await connectDB();
    await User.deleteMany();
    await Resort.deleteMany();
    await Room.deleteMany();

    // Create admin user
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@resort.com',
      password: 'admin123',
      role: 'admin',
    });
    console.log('Admin created:', admin.email);

    // Create test user
    const user = await User.create({
      name: 'Test User',
      email: 'user@resort.com',
      password: 'user123',
      role: 'user',
    });
    console.log('Test user created:', user.email);

    // Create resorts
    const createdResorts = await Resort.insertMany(resorts);
    console.log(`${createdResorts.length} resorts created`);

    // Create rooms for each resort
    const roomTypes = [
      { name: 'Deluxe Room', type: 'Deluxe', pricePerNight: 4500, capacity: { adults: 2, children: 1 }, amenities: ['AC', 'TV', 'WiFi', 'Hot Water', 'King Bed'] },
      { name: 'AC Room', type: 'AC', pricePerNight: 3000, capacity: { adults: 2, children: 0 }, amenities: ['AC', 'TV', 'WiFi', 'Hot Water'] },
      { name: 'Non-AC Room', type: 'Non-AC', pricePerNight: 1800, capacity: { adults: 2, children: 0 }, amenities: ['WiFi', 'Hot Water', 'Fan'] },
      { name: 'Heritage Suite', type: 'Suite', pricePerNight: 8500, capacity: { adults: 2, children: 2 }, amenities: ['AC', 'TV', 'WiFi', 'Jacuzzi', 'Living Room', 'Mini Bar'] },
      { name: 'Forest Villa', type: 'Villa', pricePerNight: 14000, capacity: { adults: 4, children: 2 }, amenities: ['AC', 'TV', 'WiFi', 'Private Pool', 'Kitchen', 'Garden'] },
      { name: 'Cozy Cottage', type: 'Cottage', pricePerNight: 6500, capacity: { adults: 2, children: 1 }, amenities: ['AC', 'WiFi', 'Balcony', 'Forest View'] },
    ];

    const roomImages = [
      [{ url: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=800', public_id: 'r1' }],
      [{ url: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?w=800', public_id: 'r2' }],
      [{ url: 'https://images.unsplash.com/photo-1595576508898-0ad5c879a061?w=800', public_id: 'r3' }],
      [{ url: 'https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800', public_id: 'r4' }],
      [{ url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800', public_id: 'r5' }],
      [{ url: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800', public_id: 'r6' }],
    ];

    for (const resort of createdResorts) {
      for (let i = 0; i < roomTypes.length; i++) {
        await Room.create({
          resort: resort._id,
          ...roomTypes[i],
          images: roomImages[i],
          totalRooms: Math.floor(Math.random() * 5) + 1,
          description: `Enjoy the finest comfort in our ${roomTypes[i].name} at ${resort.name}.`,
        });
      }
    }
    console.log('Rooms created for all resorts');
    console.log('\n✅ Database seeded successfully!');
    console.log('Admin login: admin@resort.com / admin123');
    console.log('User login: user@resort.com / user123');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error.message);
    process.exit(1);
  }
};

seedData();
