DROP TABLE IF EXISTS bookings, machines, students;

CREATE TABLE students (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  roll_no VARCHAR(20) NOT NULL UNIQUE,
  room_no VARCHAR(10) NOT NULL,
  phone VARCHAR(15),
  password VARCHAR(100) NOT NULL,
  role VARCHAR(10) DEFAULT 'student' CHECK (role IN ('student', 'admin'))
);

CREATE TABLE machines (
  id SERIAL PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  floor INT NOT NULL,
  status VARCHAR(10) DEFAULT 'working' CHECK (status IN ('working', 'repair'))
);

CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  student_id INT NOT NULL REFERENCES students(id) ON DELETE CASCADE,
  machine_id INT NOT NULL REFERENCES machines(id) ON DELETE CASCADE,
  booking_date DATE NOT NULL,
  slot VARCHAR(20) NOT NULL,
  status VARCHAR(10) DEFAULT 'booked' CHECK (status IN ('booked', 'done', 'cancelled')),
  UNIQUE (machine_id, booking_date, slot)
);

INSERT INTO machines (name, floor, status) VALUES
('Machine 1', 0, 'working'),
('Machine 2', 1, 'working'),
('Machine 3', 2, 'repair');
