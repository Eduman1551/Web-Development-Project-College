# Hostel Laundry Slot Booking

A small website where hostel students book a washing machine for a date and a time slot.
A machine cannot be booked twice for the same date and slot, and machines under repair cannot be booked.
The dashboard shows the total students, machines and today's bookings.
Students and bookings are open to everyone. Adding, editing and deleting machines needs the admin password.
This is a practice project made for the Web Development lab.

## Stack

- Frontend: HTML, CSS, JavaScript
- Backend: Node.js, Express
- Database: MySQL (mysql2 package, dotenv for settings)

## How to run

1. Install Node.js and MySQL.
2. Run the commands in `schema.sql` in MySQL. It creates the `laundry_db` database, the tables and some sample data.
3. Copy `.env.example` to `.env` and fill in your MySQL password and an admin password.
4. Install the packages and start the server:

```
npm install
npm start
```

5. Open http://localhost:3000 in the browser.
