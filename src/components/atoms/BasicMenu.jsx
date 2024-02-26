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
  resetResults,
  updateCopyScoreConfig,
  results,
  loadSampleData,
  setResults,
}) {
  const [data, setData] = React.useState(null);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  React.useEffect(() => {
    if (data) {
      setResults(data);
      setData(null);
    }
  }, [data]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const json = JSON.parse(e.target.result);
          setData(json);
        } catch (error) {
          console.error("Error parsing JSON:", error);
        }
      };

      reader.onerror = (e) => {
        console.error("Error reading file:", e.target.error);
      };

      reader.readAsText(selectedFile);
    }

    handleClose();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDarkModeToggle = () => {
    toggleDarkMode();
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

  const downloadJson = () => {
    const jsonString = JSON.stringify(results);
    const blob = new Blob([jsonString], { type: "application/json" });

    const today = new Date().toISOString().split("T")[0];
    const randomId = Math.floor(1000 + Math.random() * 9000);

    const fileName = `${today}_${randomId}.json`;

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

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
        <MenuItem
          onClick={() => {
            loadSampleData();
            handleClose();
          }}
        >
          Add Sample Data
        </MenuItem>
        <MenuItem onClick={downloadJson}>Export Pillage Data</MenuItem>
        <MenuItem>
          <label htmlFor="data-input">
            <input
              id="data-input"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Typography size="small" variant="outlined">
              Import Pillage Data
            </Typography>
          </label>
        </MenuItem>
        <MenuItem
          onClick={() => {
            resetResults();
            handleClose();
          }}
        >
          Reset Pillage Data
        </MenuItem>
        <Box sx={{ p: 1 }}>
          <FormGroup>
            <Typography>Copy Score Settings</Typography>
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
