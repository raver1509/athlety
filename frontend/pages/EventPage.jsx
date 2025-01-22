import { useState, useEffect } from 'react';
import BasicCard from '../components/events/BasicCard';
import axios from 'axios';
import Navbar from '../components/layout/Navbar';
import EventCreateForm from '../components/events/EventCreateForm';
import { Box, Snackbar, Typography } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import Button from '@mui/joy/Button';
import DeleteEventButton from '../components/events/DeleteEventButton';
import EditEventButton from '../components/events/EditEventButton';
import EditEventModal from '../components/events/EditEventModal'; // Zaimportuj modal edycji

export default function Events() {
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [eventCreated, setEventCreated] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [selectedEvent, setSelectedEvent] = useState(null); // Nowy stan dla edytowanego wydarzenia
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleEventCreated = (createdEvent) => {
    setEventCreated(true);
    setSnackbarMessage('Event created successfully!');
    setOpenSnackbar(true);
  };

  const toggleFormVisibility = () => {
    setShowForm((prev) => !prev);
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  const fetchEventData = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/events/');
      setEventData(response.data);
    } catch (err) {
      setError(err.message || 'Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventData();
  }, []);

  const handleEditEventClick = (eventId) => {
    const eventToEdit = eventData.find((event) => event.id === eventId);
    setSelectedEvent(eventToEdit);
    setOpenEditModal(true); // Otwórz modal edycji
  };

  const handleEventUpdated = (updatedEvent) => {
    setEventData((prevEvents) =>
      prevEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
    setSnackbarMessage('Event updated successfully!'); // Dodaj powiadomienie
    setOpenSnackbar(true); // Otwórz snackbar
  };

  const handleEventDeleted = (deletedEventId) => {
    setEventData((prevEvents) => prevEvents.filter((event) => event.id !== deletedEventId));
  };

  if (loading) return <p>Loading event details...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Navbar />
      <div className="global">
        <div style={{ display: 'flex', gap: '50px' }}>
          <Typography variant="h4" sx={{padding: 1}}>
            Events
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={toggleFormVisibility}
              sx={{
                padding: '10px 20px',
                borderRadius: '8px',
                border: '2px solid #000',
                fontWeight: '600',
                textTransform: 'none',
                backgroundColor: 'black',
                color: 'white',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  backgroundColor: '#333',
                  color: 'white',
                  borderColor: '#333',
                  boxShadow: '0 6px 10px rgba(0, 0, 0, 0.2)',
                },
                '&:active': {
                  backgroundColor: '#222',
                  borderColor: '#222',
                },
              }}
            >
              Add Event
            </Button>
          </Box>
        </div>
        {showForm && <EventCreateForm onEventCreated={handleEventCreated} />}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={6000}
          onClose={handleCloseSnackbar}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <MuiAlert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
        <div className="card">
          {eventData ? (
            eventData.map((event) => (
              <div key={event.id} style={{ position: 'relative' }}>
                <BasicCard
                  src={'https://assets.clevelandclinic.org/transform/7b87e4a3-49bf-4b3d-936c-9abbcc61dbf7/fasterRunner-656983165-770x533-1_jpg'}
                  name={event.name}
                  date={event.event_date}
                  desc={event.description}
                  id={event.id}
                />
                <DeleteEventButton eventId={event.id} onEventDeleted={handleEventDeleted} />
                <EditEventButton eventId={event.id} onEditClick={handleEditEventClick} />
              </div>
            ))
          ) : (
            <p>No event data available.</p>
          )}
        </div>
      </div>
      <EditEventModal
        open={openEditModal}
        handleClose={() => setOpenEditModal(false)}
        eventData={selectedEvent}
        onEventUpdated={handleEventUpdated}
      />
    </>
  );
}
