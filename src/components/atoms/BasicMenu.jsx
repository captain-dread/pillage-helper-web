import * as React from "react";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { Typography, Box } from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";

export default function BasicMenu({
  toggleDarkMode,
  setShowBootyCounter,
  resetResults,
  updateCopyScoreConfig,
  results,
  loadSampleData,
}) {
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

  const handleShowPercentageChange = (event) => {
    updateCopyScoreConfig({ showPercentage: event.target.checked });
  };

  const handleShowFractionChange = (event) => {
    updateCopyScoreConfig({ showAsFraction: event.target.checked });
  };

  const handleReverseOrderChange = (event) => {
    updateCopyScoreConfig({ reverseOrder: event.target.checked });
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
        <MenuItem
          onClick={() => {
            resetResults();
            handleClose();
          }}
        >
          Reset All Battle Data
        </MenuItem>
        <MenuItem
          onClick={() => {
            loadSampleData();
            handleClose();
          }}
        >
          Add Sample Data
        </MenuItem>
        <Box sx={{ p: 1 }}>
          <FormGroup>
            <Typography>Copy Score Configuration</Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={results.copyScoreConfig.showPercentage}
                  onChange={handleShowPercentageChange}
                  size="small"
                />
              }
              label="Show Percentage"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={results.copyScoreConfig.showAsFraction}
                  onChange={handleShowFractionChange}
                  size="small"
                />
              }
              label="Show Fraction"
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={results.copyScoreConfig.reverseOrder}
                  onChange={handleReverseOrderChange}
                  size="small"
                />
              }
              label="Reverse Order"
            />
          </FormGroup>
        </Box>
      </Menu>
    </div>
  );
}
