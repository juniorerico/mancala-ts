import React from "react";
import styled from "styled-components";

const Container = styled.div`
  height: 80%;
  width: 17%;
  display: flex;
  z-index: 1;
  justify-content: center;
`;

const StoreHole = styled.div`
  height: 85%;
  width: 55%;
  display: flex;
  flex-direction: column;
  border-bottom-right-radius: 300px;
  border-bottom-left-radius: 300px;
  border-top-right-radius: 300px;
  border-top-left-radius: 300px;
  background-color: #5e43255e;
  box-shadow: inset 0px 9px 3px #5e4325;
`;

const Counter = styled.div`
  font-size: 2.6vw;
  font-family: "Roboto", "Verdana", sans-serif;
  font-weight: 500;
  text-align: center;
  color: #dbbb94;

  @media (orientation: portrait) {
    font-size: 4vh;
  }
`;

interface StoreProps {
  className?: string;
  stones: number;
  isTop: boolean;
}

const Store = React.forwardRef<HTMLDivElement, StoreProps>((props, ref) => {
  return (
    <Container style={{ alignItems: props.isTop ? "flex-start" : "flex-end" }} className={props.className}>
      <StoreHole
        ref={ref}
        style={{
          justifyContent: props.isTop ? "flex-start" : "flex-end",
        }}
      >
        <Counter
          style={{
            marginTop: props.isTop ? "25%" : "0",
            marginBottom: props.isTop ? "0" : "25%",
          }}
        >
          {props.stones}
        </Counter>
      </StoreHole>
    </Container>
  );
});

export default React.memo(Store);
