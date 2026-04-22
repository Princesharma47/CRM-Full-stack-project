const mongoose = require('mongoose');
const Property = require('./models/Property');
const dotenv = require('dotenv');

dotenv.config();

const check = async () => {
  await mongoose.connect(process.env.MONGO_URI);
  const props = await Property.find().limit(5);
  console.log('Sample properties:', JSON.stringify(props, null, 2));
  process.exit();
};

check();
