CREATE DATABASE IF NOT EXISTS laundry_db;
USE laundry_db;

CREATE TABLE students (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  roll_no VARCHAR(20) NOT NULL UNIQUE,
  room_no VARCHAR(10) NOT NULL,
  phone VARCHAR(15)
);

CREATE TABLE machines (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  floor INT NOT NULL,
  status ENUM('working', 'repair') DEFAULT 'working'
);

CREATE TABLE bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  machine_id INT NOT NULL,
  booking_date DATE NOT NULL,
  slot VARCHAR(20) NOT NULL,
  status ENUM('booked', 'done', 'cancelled') DEFAULT 'booked',
  FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
  FOREIGN KEY (machine_id) REFERENCES machines(id) ON DELETE CASCADE,
  UNIQUE KEY unique_slot (machine_id, booking_date, slot)
);

INSERT INTO students (name, roll_no, room_no, phone) VALUES
('Rahul Sharma', '23CS101', 'A-101', '9876543210'),
('Priya Verma', '23CS102', 'B-204', '9876543211'),
('Amit Kumar', '23EC115', 'A-108', '9876543212'),
('Sneha Gupta', '23ME120', 'B-110', '9876543213');

INSERT INTO machines (name, floor, status) VALUES
('Machine 1', 0, 'working'),
('Machine 2', 1, 'working'),
('Machine 3', 2, 'repair');

INSERT INTO bookings (student_id, machine_id, booking_date, slot, status) VALUES
(1, 1, CURDATE(), '08:00-10:00', 'booked'),
(2, 2, CURDATE(), '18:00-20:00', 'booked'),
(3, 1, CURDATE() + INTERVAL 1 DAY, '06:00-08:00', 'booked');
