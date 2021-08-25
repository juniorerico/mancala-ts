import styled from "styled-components";
import { useWindowResize } from "beautiful-react-hooks";
import Board from "./Board";
import { Snackbar } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useState } from "react";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(assets/background.png);
  overflow: hidden;

  @media (orientation: landscape) {
    display: flex;
    align-items: flex-end;
    justify-content: center;
  }
`;

function Game() {
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  useWindowResize(() => {
    update();
  });

  function update() {
    // create the --vh variable in css for calculating the right height fo mobile phone
    // This should move to another place, for sure.
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  return (
    <Container>
      <Board
        className="board"
        onError={(message) => {
          setShowAlert(true);
          setAlertMessage(message);
        }}
      />
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={showAlert}
        autoHideDuration={2000}
        onClose={() => {
          setShowAlert(false);
        }}
      >
        <Alert onClose={() => setShowAlert(false)} severity="info">
          {alertMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Game;
