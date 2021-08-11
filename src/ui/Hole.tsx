import React, { useState } from "react";
import { useEffect } from "react";
import styled from "styled-components";
import Stone from "./Stone";

const Container = styled.div`
  height: 60%;
  width: 14%;
  border-radius: 100%;
  background-color: #5e43255e;
  box-shadow: inset 0px 9px 3px #5e4325;
`;

interface HoleProps {
  className?: string;
  stones?: number;
}

const colors: string[] = ["#e6475c", "#ffbe40", "#738ab0", "#5c9f56"];

function Hole({ className, stones }: HoleProps) {
  const [x, setX] = useState<number>(0);
  const [y, setY] = useState<number>(0);
  // reference to the board image
  let holeRef: HTMLDivElement;

  useEffect(() => {
    //console.log(holeRef.getBoundingClientRect());
    setX(holeRef.getBoundingClientRect().x);
    setY(holeRef.getBoundingClientRect().y);
  });

  return (
    <Container
      className={className}
      ref={(ref) => {
        if (ref != null) holeRef = ref;
      }}
    >
      <Stone color={colors[0]} position={{ top: y, left: x }} />
      <Stone color={colors[1]} position={{ top: y, left: x + 10 }} />
      <Stone color={colors[2]} position={{ top: y, left: x + 20 }} />
      <Stone color={colors[3]} position={{ top: y, left: x + 30 }} />
    </Container>
  );
}

export default Hole;
