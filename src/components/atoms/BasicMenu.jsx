import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";

import MenuIcon from "@mui/icons-material/Menu";

export default function BasicMenu({ toggleDarkMode, setShowBootyCounter }) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
    handleClose();
  };

  const handleToggleBootyCounter = () => {
    setShowBootyCounter((SBC) => {
      return !SBC;
    });
    handleClose();
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        sx={{ p: 0, minWidth: 40 }}
      >
        <MenuIcon sx={{ p: 0 }} />
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <MenuItem onClick={handleDarkModeToggle} sx={{ py: 0.5 }}>
          Toggle Theme
        </MenuItem>
        <MenuItem onClick={handleToggleBootyCounter}>
          Toggle Booty View
        </MenuItem>
      </Menu>
    </div>
  );
}
