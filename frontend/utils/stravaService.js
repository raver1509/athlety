// /src/services/stravaService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/strava'; // Twój backend

// Funkcja do autoryzacji
export const getStravaAuthUrl = () => {
  return `${API_URL}/auth`; // Backendowy endpoint do autoryzacji
};

// Funkcja do uzyskiwania danych użytkownika z API Stravy
export const getUserData = async (accessToken) => {
  try {
    const response = await axios.get('https://www.strava.com/api/v3/athlete', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error('Unable to fetch user data');
  }
};
