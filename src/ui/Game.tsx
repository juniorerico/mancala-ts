import styled from "styled-components";
import { useWindowResize } from "beautiful-react-hooks";
import Board from "./Board";
import { Snackbar, withStyles } from "@material-ui/core";
import { Alert } from "@material-ui/lab";
import { useState, useReducer } from "react";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import { gameReducer } from "../state/reducer";
import { initialState } from "../state/state";
import { ActionType } from "../state/actions";
import { GameContext } from "../state/context";
import Dialog from "./Dialog";

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

const StyledMenu = withStyles({
  paper: {
    border: "px solid #d3d4d5",
    backgroundColor: "#515151",
    height: "8rem",
    width: "10rem",
  },
})(Menu);

const StyledMenuItem = withStyles((theme) => ({
  root: {
    color: "white",
    "&:focus": {
      backgroundColor: "#595959",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: "white",
      },
    },
  },
}))(MenuItem);

function Game() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  useWindowResize(() => {
    update();
  });

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleReset = () => {
    dispatch({ type: ActionType.Game_Reset });
    setAnchorEl(null);
  };

  function update() {
    // create the --vh variable in css for calculating the right height fo mobile phone
    // This should move to another place, for sure.
    let vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty("--vh", `${vh}px`);
  }

  return (
    <GameContext.Provider value={{ state, dispatch }}>
      <Container>
        <IconButton
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            margin: "1rem",
            padding: 0,
            color: "white",
          }}
          onClick={handleClick}
        >
          <MenuIcon fontSize="large" />
        </IconButton>

        <StyledMenu
          getContentAnchorEl={null}
          anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
          transformOrigin={{ vertical: "top", horizontal: "right" }}
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
        >
          <StyledMenuItem onClick={handleReset}>{"Reset Game"}</StyledMenuItem>
        </StyledMenu>

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
          <Alert onClose={() => setShowAlert(false)} severity="warning">
            {alertMessage}
          </Alert>
        </Snackbar>
      </Container>
      <Dialog
        isActive={state.showNewGameDialog}
        title={"Play Mancala!"}
        onClick={(level) => dispatch({ type: ActionType.Game_Start, payload: { currentPlayer: 0, botLevel: level } })}
      />
    </GameContext.Provider>
  );
}

export default Game;
