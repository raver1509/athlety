import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import HomePage from '../pages/HomePage';
import EventPage from '../pages/EventPage';
import FriendsPage from '../pages/FriendsPage';
import StatisticsPage from '../pages/StatisticsPage';
import ChatPage from '../pages/ChatPage';
import RegisterPage from '../pages/RegisterPage';

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/" element={<HomePage />} />
      <Route path="/events" element={<EventPage />} />
      <Route path="/messages" element={<ChatPage />} />
      <Route path="/statistics" element={<StatisticsPage />} />
      <Route path="/friends" element={<FriendsPage />} />
    </Routes>
  )
}

export default App;