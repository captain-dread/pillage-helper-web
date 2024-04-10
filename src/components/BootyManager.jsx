import { useState } from "react";

import {
  Box,
  Button,
  Typography,
  Divider,
  IconButton,
  Checkbox,
  TextField,
  FormControlLabel,
} from "@mui/material";
import ResultsModal from "./atoms/ResultsModal";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import ExpandedBootyView from "./ExpandedBootyView";
import HoldCalculatorModal from "./HoldCalculator";

export default function BootyManager({
  addBattleResult,
  results,
  deleteBattle,
  updateKrakenShareToBattle,
}) {
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
      "https://github.com/captain-dread/pillage-helper-web?tab=readme-ov-file#guide-using-the-booty-manager",
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
    const res = addBattleResult(fileText, state.inputValue);

    setShowResultsModal({
      show: true,
      summary: res.greedyHitsSummary,
      payCommands: state.checked ? res.greedyHitPayCommands : [],
    });
  };

  const handleAddBattleResults = () => {
    if (!fileText) {
      return;
    }
    addBattleResult(fileText, state.inputValue);
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
            marginBottom: "4px",
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
        <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
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
          <Button
            size="small"
            variant="outlined"
            disabled={!isFileLoaded}
            onClick={handleAddBattleResults}
          >
            Add battle results
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            gap: 1,
            justifyContent: "center",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <Button
            size="small"
            variant="outlined"
            disabled={!isFileLoaded}
            onClick={handleFindGreedyHits}
          >
            Find Greedies
          </Button>
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
          />
        </Box>
        <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
          <ExpandedBootyView
            results={results}
            deleteBattle={deleteBattle}
            updateKrakenShareToBattle={updateKrakenShareToBattle}
          />
          <HoldCalculatorModal />
        </Box>
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
