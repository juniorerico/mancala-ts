import styled from "styled-components";
import { useWindowResize } from "beautiful-react-hooks";
import Board from "./Board";

const Container = styled.div`
  width: 100%;
  height: 100%;
  background-image: url(assets/background.png);
  overflow: hidden;
`;

function Game() {
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
      <Board className="board" />
    </Container>
  );
}

export default Game;
