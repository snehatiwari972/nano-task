const mongoose = require('mongoose');
const Meeting = require('./models/Meeting');
const dotenv = require('dotenv');

dotenv.config();

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Meeting.deleteMany({});
    await Meeting.insertMany([
      { dateTime: '01 May, 2025 at 2pm', status: 'Completed', type: 'Online', buyerName: 'Mango Private Limited', brand: 'Mango', dept: 'Design', title: 'Costing Discussion with Zara', meetingDate: '01 May, 2025', participants: 'Mohd Saleem +2' },
      { dateTime: '02 May, 2025 at 3pm', status: 'Upcoming', type: 'Offline', buyerName: 'Cherry Innovations', brand: 'Cherry', dept: 'Development', title: 'UI/UX Review', meetingDate: '02 May, 2025', participants: 'Mohd Saleem +2' },
      // Add more from Figma screenshots...
    ]);
    console.log('Data seeded');
    process.exit();
  })
  .catch(err => console.log(err));