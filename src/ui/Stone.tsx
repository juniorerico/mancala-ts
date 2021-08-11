import React, { useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  height: 2.8vw;
  width: 2.8vw;
  border-radius: 100%;
  box-shadow: inset 0px -6px 1px #00000040;
`;

const colors: string[] = ["#e6475c", "#ffbe40", "#738ab0", "#5c9f56"];

interface Position {
  top: number;
  left: number;
}

interface StoneProps {
  color?: string;
  position: Position;
}

function Stone({ color, position }: StoneProps) {
  // OnMount (This will run only once)
  /* useEffect(() => {
    if (color == undefined) {
      color = colors[0];
    }
  }, []); */

  return (
    <Container
      style={{
        backgroundColor: color,
        top: position.top,
        left: position.left,
      }}
    ></Container>
  );
}

export default Stone;
