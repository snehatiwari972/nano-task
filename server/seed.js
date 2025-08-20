const mongoose = require('mongoose');
const Meeting = require('./models/Meeting');
const Notification = require('./models/Notification');
const Chat = require('./models/Chat');
const dotenv = require('dotenv');

dotenv.config({ path: __dirname + '/.env' });

mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    await Meeting.deleteMany({});
    await Notification.deleteMany({});
    await Chat.deleteMany({});

    await Meeting.insertMany([
      // Upcoming
      {
        dateTime: new Date('2025-08-20T12:01:00.000Z'),
        status: 'Upcoming',
        type: 'Online',
        buyerName: 'Mango Private Limited',
        brand: 'Mango',
        dept: 'Design',
        title: 'Costing Discussion with Zara',
        meetingDate: new Date('2025-08-20')
      },
      {
        dateTime: new Date('2025-08-22T09:00:00.000Z'),
        status: 'Upcoming',
        type: 'Offline',
        buyerName: 'Apple Corp',
        brand: 'Apple',
        dept: 'Sales',
        title: 'Sales Strategy Meeting',
        meetingDate: new Date('2025-08-22')
      },
      {
        dateTime: new Date('2025-08-23T10:30:00.000Z'),
        status: 'Archive',
        type: 'Online',
        buyerName: 'Banana Ltd',
        brand: 'Banana',
        dept: 'Marketing',
        title: 'Marketing Plan Review',
        meetingDate: new Date('2025-08-23')
      },
      // Completed
      {
        dateTime: new Date('2025-08-21T15:30:00.000Z'),
        status: 'Completed',
        type: 'Offline',
        buyerName: 'Cherry Innovations',
        brand: 'Cherry',
        dept: 'Development',
        title: 'UI/UX Review',
        meetingDate: new Date('2025-08-21')
      },
      {
        dateTime: new Date('2025-08-19T14:00:00.000Z'),
        status: 'Archive',
        type: 'Online',
        buyerName: 'Grape Solutions',
        brand: 'Grape',
        dept: 'Support',
        title: 'Support Feedback',
        meetingDate: new Date('2025-08-19')
      },
      {
        dateTime: new Date('2025-08-18T11:00:00.000Z'),
        status: 'Completed',
        type: 'Offline',
        buyerName: 'Orange Pvt',
        brand: 'Orange',
        dept: 'HR',
        title: 'HR Policy Update',
        meetingDate: new Date('2025-08-18')
      },
      // Overdue
      {
        dateTime: new Date('2025-08-17T09:00:00.000Z'),
        status: 'Overdue',
        type: 'Online',
        buyerName: 'Pear Inc',
        brand: 'Pear',
        dept: 'Finance',
        title: 'Budget Meeting',
        meetingDate: new Date('2025-08-17')
      },
      {
        dateTime: new Date('2025-08-16T16:00:00.000Z'),
        status: 'Overdue',
        type: 'Offline',
        buyerName: 'Plum Tech',
        brand: 'Plum',
        dept: 'IT',
        title: 'System Upgrade',
        meetingDate: new Date('2025-08-16')
      },
      {
        dateTime: new Date('2025-08-15T13:00:00.000Z'),
        status: 'Overdue',
        type: 'Online',
        buyerName: 'Kiwi Works',
        brand: 'Kiwi',
        dept: 'Operations',
        title: 'Ops Review',
        meetingDate: new Date('2025-08-15')
      },
      // Draft
      {
        dateTime: new Date('2025-08-24T08:00:00.000Z'),
        status: 'Draft',
        type: 'Online',
        buyerName: 'Fig Ltd',
        brand: 'Fig',
        dept: 'Design',
        title: 'Draft Design Meeting',
        meetingDate: new Date('2025-08-24')
      },
      {
        dateTime: new Date('2025-08-25T10:00:00.000Z'),
        status: 'Draft',
        type: 'Offline',
        buyerName: 'Date Corp',
        brand: 'Date',
        dept: 'Sales',
        title: 'Draft Sales Meeting',
        meetingDate: new Date('2025-08-25')
      },
      {
        dateTime: new Date('2025-08-26T14:00:00.000Z'),
        status: 'Draft',
        type: 'Online',
        buyerName: 'Lemon Pvt',
        brand: 'Lemon',
        dept: 'Marketing',
        title: 'Draft Marketing Meeting',
        meetingDate: new Date('2025-08-26')
      },
      // Archive
      {
        dateTime: new Date('2025-08-10T09:00:00.000Z'),
        status: 'Archive',
        type: 'Offline',
        buyerName: 'Peach Innovations',
        brand: 'Peach',
        dept: 'Development',
        title: 'Archived Dev Meeting',
        meetingDate: new Date('2025-08-10')
      },
      {
        dateTime: new Date('2025-08-09T11:00:00.000Z'),
        status: 'Archive',
        type: 'Online',
        buyerName: 'Apricot Solutions',
        brand: 'Apricot',
        dept: 'Support',
        title: 'Archived Support Meeting',
        meetingDate: new Date('2025-08-09')
      },
      {
        dateTime: new Date('2025-08-08T15:00:00.000Z'),
        status: 'Archive',
        type: 'Offline',
        buyerName: 'Melon Pvt',
        brand: 'Melon',
        dept: 'HR',
        title: 'Archived HR Meeting',
        meetingDate: new Date('2025-08-08')
      }
    ]);

    await Notification.insertMany([
      { message: 'Meeting with Mango Private Limited completed.', time: new Date(), read: false },
      { message: 'Upcoming meeting with Cherry Innovations.', time: new Date(), read: false },
      { message: 'Draft meeting scheduled with Fig Ltd.', time: new Date(), read: false },
      { message: 'Archived meeting with Peach Innovations.', time: new Date(), read: false }
    ]);

    await Chat.insertMany([
      { message: 'Hello, is the costing discussion ready?', time: new Date(), sender: 'Mohd Saleem' },
      { message: 'Yes, will share the details soon.', time: new Date(), sender: 'Zara Team' },
      { message: 'Draft meeting details?', time: new Date(), sender: 'Fig Team' },
      { message: 'Archived meeting notes uploaded.', time: new Date(), sender: 'Peach Team' }
    ]);

    console.log('Data seeded');
    process.exit();
  })
  .catch(err => console.log(err));