const mongoose = require('mongoose');
const Property = require('../models/Property');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../.env') });

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const props = await Property.find();
    const result = {
      count: props.length,
      samples: props.slice(0, 5).map(p => ({
        title: p.title,
        images: p.images
      }))
    };
    fs.writeFileSync(path.join(__dirname, 'db_output.json'), JSON.stringify(result, null, 2));
    console.log('Checked DB');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
