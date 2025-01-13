import { useState } from "react";
import { getCsrfToken } from "../../utils/getCsrfToken";
import TransitionModal from "./TransitionModal";

async function getEventInfo(id){
    const csrfToken = getCsrfToken();
    try {
        console.log(id)
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
        // setEventInfo(data.key);
        console.log(data);
        return data;
      } else {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Download event info error');
      }
    } catch (error) {
      console.error('Download event info error:', error);
    }
};

async function eventInfo(id){
    const eventInfo = await getEventInfo(id);

    return (
        <TransitionModal />
    )
}

export default eventInfo;