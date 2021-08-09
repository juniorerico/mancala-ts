import React, { useState } from "react";
import styled from "styled-components";
import Board from "./Board";

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: block;
  background-image: url(assets/background.png);
`;

function Game() {
  return (
    <Container>
      <Board />
    </Container>
  );
}

export default Game;
