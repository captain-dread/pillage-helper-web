import { Box, Button, Typography, Modal } from "@mui/material";

export default function ResultsModal({ hitSummary, payCommands, close }) {
  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div>
      <Modal
        open={true}
        onClose={close}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            sx={{
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Only run after "The victors plundered.." message to get the most
            recent battle.
          </Typography>
          <Box sx={entryStyle}>
            <Typography>{hitSummary}</Typography>
            <Button onClick={() => copyToClipboard(hitSummary)}>Copy</Button>
          </Box>
          {payCommands.map((command, index) => (
            <Box key={index} sx={entryStyle}>
              <Typography variant="body1">{command}</Typography>
              <Button onClick={() => copyToClipboard(command)}>Copy</Button>
            </Box>
          ))}
          <Button onClick={close}>Close</Button>
        </Box>
      </Modal>
    </div>
  );
}

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  py: 1,
  px: 2,
  display: "flex",
  flexDirection: "column",
  gap: 1,
  maxHeight: "100vh",
  overflow: "scroll",
  borderRadius: "4px",
};

const entryStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "1px solid #ddd",
  px: 1,
  borderRadius: "4px",
};
