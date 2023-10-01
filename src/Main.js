const express = require('express');
const app = express();
const PORT = process.env.PORT || 3600;

app.use(express.json());

// In-memory data store for doctors and appointments
let doctors = [
  {
    id: 1,
    name: 'Dr. Pritesh',
    specialty: 'Physician',
    location: 'Bhopal',
    availability: [
      { day: 'Monday', slots: ['6:00 PM', '7:00 PM'] },
      { day: 'Tuesday', slots: ['6:00 PM', '7:00 PM'] },
      { day: 'Wednesday', slots: ['6:00 PM', '7:00 PM'] },
      { day: 'Thrusday', slots: ['6:00 PM', '7:00 PM'] },
      { day: 'Friday', slots: ['6:00 PM', '7:00 PM'] },
      { day: 'Saturday', slots: ['6:00 PM', '7:00 PM'] },
      
    ],
  },
  {
    id: 2,
    name: 'Dr. Raju',
    specialty: 'HeartSpecialist',
    location: 'Bhopal',
    availability: [
      { day: 'Monday', slots: ['7:00 PM', '8:00 PM'] },
      { day: 'Tuesday', slots: ['7:00 PM', '8:00 PM'] },
      { day: 'Wednesday', slots: ['7:00 PM', '8:00 PM'] },
      { day: 'Thrusday', slots: ['7:00 PM', '8:00 PM'] },
      { day: 'Friday', slots: ['7:00 PM', '8:00 PM'] },
      { day: 'Saturday', slots: ['7:00 PM', '8:00 PM'] },
      
    ],
  },
  
];

let appointments = [];

// List Doctors
app.get('/api/doctors', (req, res) => {
  res.json(doctors);
});

// Doctor Detail Page
app.get('/api/doctors/:id', (req, res) => {
  const doctorId = parseInt(req.params.id);
  const doctor = doctors.find((doc) => doc.id === doctorId);

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  res.json(doctor);
});

// Book Appointment
app.post('/api/appointments', (req, res) => {
  const { doctorId, patientName, appointmentDate, appointmentTime } = req.body;
  const doctor = doctors.find((doc) => doc.id === doctorId);

  if (!doctor) {
    return res.status(404).json({ message: 'Doctor not found' });
  }

  // Check if the appointment slot is available
  const dayAvailability = doctor.availability.find(
    (day) => day.day === appointmentDate
  );

  if (!dayAvailability || !dayAvailability.slots.includes(appointmentTime)) {
    return res.status(400).json({ message: 'Appointment slot not available' });
  }

  // Check if the doctor has reached the maximum number of appointments for the day (X)
  const existingAppointments = appointments.filter(
    (appt) =>
      appt.doctorId === doctorId &&
      appt.appointmentDate === appointmentDate
  );

  if (existingAppointments.length >= 10) {
    return res
      .status(400)
      .json({ message: `Doctor is fully booked for ${appointmentDate}` });
  }

  // Create a new appointment
  const newAppointment = {
    id: appointments.length + 1,
    doctorId,
    patientName,
    appointmentDate,
    appointmentTime,
  };

  appointments.push(newAppointment);
  res.status(201).json(newAppointment);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
