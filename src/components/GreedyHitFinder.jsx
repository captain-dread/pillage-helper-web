import { useState } from "react";
import { Box, Button, Typography, Divider, IconButton } from "@mui/material";
import { processLogContent } from "../assets/greedy";

import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import TextField from "@mui/material/TextField";
import ResultsModal from "./ResultsModal";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

export default function GreedyHitFinder({ setResults }) {
  const [file, setFile] = useState(null);
  const [fileText, setFileText] = useState("");
  const [state, setState] = useState({
    checked: false,
    inputValue: 500,
  });
  const [showResultsModal, setShowResultsModal] = useState({
    show: false,
    summary: "",
    hitCommands: [],
  });

  const handleCheckboxChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      checked: event.target.checked,
    }));
  };

  const handleInputChange = (event) => {
    setState((prevState) => ({
      ...prevState,
      inputValue: event.target.value === "" ? "" : Number(event.target.value),
    }));
  };

  const handleHelpClick = () => {
    window.open(
      "https://github.com/captain-dread/pillage-helper-web",
      "_blank"
    );
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target.result;
        setFileText(text);
      };

      reader.readAsText(selectedFile);
      setFile(selectedFile);
    } else {
      alert("Not File Selected");
    }
    event.target.value = "";
  };

  const isFileLoaded = file !== null;

  const handleFindGreedyHits = () => {
    if (!fileText) {
      return;
    }

    const res = processLogContent(
      fileText,
      state.inputValue > 0 ? state.inputValue : 500
    );
    setShowResultsModal({
      show: true,
      summary: res.result,
      payCommands: state.checked ? res.payCommands : [],
    });
  };

  const handleAddBattleResults = () => {
    if (!fileText) {
      return;
    }
    const res = processLogContent(
      fileText,
      state.inputValue > 0 ? state.inputValue : 500
    );

    setResults((R) => {
      return {
        ...R,
        lavishLockers: R.lavishLockers + res.totalHits,
      };
    });
    setFile(null);
  };

  return (
    <>
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Divider variant="middle" sx={{ width: 100 }} />
      </Box>
      <Box
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography
            textAlign="center"
            fontSize={16}
            style={{ fontFamily: '"Orbitron", sans-serif' }}
          >
            Booty Manager
          </Typography>
          <IconButton onClick={handleHelpClick} aria-label="help" size="small">
            <HelpOutlineIcon size="small" fontSize="11" />
          </IconButton>
        </div>

        <FormControlLabel
          control={
            <Checkbox
              checked={state.checked}
              onChange={handleCheckboxChange}
              name="payCommands"
              size="small"
            />
          }
          label={
            <Typography variant="body2" style={{ fontSize: "12px" }}>
              Show Greedy Pay
            </Typography>
          }
          sx={{ mt: 0.5, mb: 0.2 }}
        />
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <label htmlFor="file-input">
            <input
              id="file-input"
              type="file"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
            <Button
              size="small"
              variant="outlined"
              onClick={() => document.getElementById("file-input").click()}
            >
              Load File
            </Button>
          </label>

          <TextField
            type="number"
            value={state.inputValue}
            onChange={handleInputChange}
            disabled={!state.checked}
            label="Pay"
            size="small"
            style={{ width: "65px" }}
            InputProps={{
              sx: {
                input: {
                  padding: "4px",
                },
              },
            }}
          />
          <Button
            size="small"
            variant="outlined"
            disabled={!isFileLoaded}
            onClick={handleFindGreedyHits}
          >
            Find Greedies
          </Button>
        </Box>
        <Button
          size="small"
          variant="outlined"
          disabled={!isFileLoaded}
          onClick={handleAddBattleResults}
          sx={{ mt: 1 }}
        >
          Add battle results
        </Button>
      </Box>
      {showResultsModal.show ? (
        <ResultsModal
          hitSummary={showResultsModal.summary}
          payCommands={showResultsModal.payCommands}
          close={() => {
            setFile(null);
            setShowResultsModal((SRM) => {
              return {
                ...SRM,
                show: !SRM.show,
              };
            });
          }}
        />
      ) : null}
    </>
  );
}
