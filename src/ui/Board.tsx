import React, { useState } from "react";
import Hole from "./Hole";
import styled from "styled-components";

const Container = styled.div``;

const BoardImg = styled.img`
  height: auto;
  width: 100%;
`;

function Board() {
  return (
    <Container>
      <BoardImg src="assets/board.png"></BoardImg>
      <Hole />
    </Container>
  );
}

export default Board;
