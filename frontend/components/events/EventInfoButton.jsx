import { useState } from "react";
import { getCsrfToken } from "../../utils/getCsrfToken";
import TransitionModal from "./TransitionModal";
import Button from '@mui/joy/Button';

async function getEventInfo(id) {
    const csrfToken = getCsrfToken();
    try {
        console.log(id);
        const response = await fetch(`http://localhost:8000/api/events/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
            },
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            console.log(data)
            return data;
        } else {
            const errorData = await response.json();
            throw new Error(errorData.detail || 'Download event info error');
        }
    } catch (error) {
        console.error('Download event info error:', error);
    }
}

async function getUserInfo(userId) {
    const csrfToken = getCsrfToken();
    try {
      const response = await fetch(`http://localhost:8000/api/users/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
        },
        credentials: 'include',
      });
  
      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error('User info fetch error');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  }

  function EventInfoButton({ id }) {
    const [openModal, setOpenModal] = useState(false);
    const [eventData, setEventData] = useState(null);
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleClick = async () => {
        setIsLoading(true);
        const eventInfo = await getEventInfo(id);
        setEventData(eventInfo);

        if (eventInfo.created_by) {
            const userInfo = await getUserInfo(eventInfo.created_by);
            setUserData(userInfo);
        }

        setIsLoading(false);
        setOpenModal(true);
    };

    return (
        <div>
            <Button
                variant="solid"
                size="md"
                color="primary"
                aria-label="Learn more!"
                sx={{
                    ml: 'auto', 
                    fontWeight: 600, 
                    marginLeft: 'none', 
                    backgroundColor: 'white', 
                    color: 'black', 
                    border: '1px solid', 
                    borderColor: '#ddd', 
                    width: '160px'
                }}
                onClick={handleClick}
            >
                Learn more!
            </Button>
            
            <TransitionModal 
                open={openModal} 
                onClose={() => setOpenModal(false)} 
                eventData={eventData} 
                userData={userData} 
                isLoading={isLoading} 
            />
        </div>
    );
}

export default EventInfoButton;
