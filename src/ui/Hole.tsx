import React from "react";
import styled from "styled-components";

const Container = styled.div`
  width: 14%;
  height: 100%;
  display: flex;
`;

const Pit = styled.div`
  height: 60%;
  border-radius: 100%;
  display: flex;
  flex-direction: column;
  background-color: #5e43255e;
  box-shadow: inset 0px 9px 3px #5e4325;
`;

const Counter = styled.div`
  text-align: center;
  font-size: 2.4vw;
  font-family: "Roboto", "Verdana", sans-serif;
  font-weight: 500;
  color: #694e32;

  @media (orientation: portrait) {
    font-size: 3vh;
  }
`;

interface HoleProps {
  className?: string;
  row?: number;
  col?: number;
  isClickable?: boolean;
  stones: number;
  counterOnTop: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Hole = React.forwardRef<HTMLDivElement, HoleProps>((props, ref) => {
  console.log("render hole...");
  return (
    <Container style={{ flexDirection: props.counterOnTop ? "column-reverse" : "column" }}>
      <Pit
        style={{ cursor: props.isClickable ? "pointer" : "auto" }}
        data-row={props.row}
        data-col={props.col}
        className={props.className}
        ref={ref}
        onClick={props.onClick}
      />
      <Counter style={{ marginTop: props.counterOnTop ? "0" : "10%", marginBottom: props.counterOnTop ? "10%" : "0" }}>
        {props.stones}
      </Counter>
    </Container>
  );
});

export default React.memo(Hole);
