import React, { useState } from 'react';
import { IconButton, Menu, MenuItem, Divider, ListItemIcon, ListItemText } from '@mui/material';
import MoreVertRoundedIcon from '@mui/icons-material/MoreVertRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import { useAuth } from '../../auth/AuthProvider';
import ProfileModal from '../profile/ProfileModal';

export default function OptionsMenu() {
  const { logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState(null);
  const [openModal, setOpenModal] = useState(false); // Stan do otwierania modalu

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    await logout();
    handleClose();
  };

  const handleProfileClick = () => {
    setOpenModal(true); // Otwarcie modalu po kliknięciu "Profile"
    handleClose();
  };

  const handleCloseModal = () => {
    setOpenModal(false); // Zamknięcie modalu
  };

  return (
    <>
      <IconButton aria-label="Open menu" onClick={handleClick} sx={{ color: 'white', padding: '8px', right: '10px' }}>
        <MoreVertRoundedIcon />
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout}>
          <ListItemText>Logout</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>

      {/* Modal z profilem użytkownika */}
      <ProfileModal open={openModal} onClose={handleCloseModal} />
    </>
  );
}
