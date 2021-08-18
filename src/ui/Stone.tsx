import React, { useRef, useState, useEffect } from "react";
import styled from "styled-components";

const Container = styled.div`
  position: absolute;
  border-radius: 100%;
  box-shadow: inset 0px -6px 1px #00000040;
  z-index: 1;
  width: 2.8vw;
  height: 2.8vw;

  @media (orientation: portrait) {
    width: 2.8vh;
    height: 2.8vh;
  }
`;

interface Position {
  top: number;
  left: number;
}

interface Size {
  width: number;
  height: number;
}

interface StoneProps {
  color: string;
  className?: string;
  position: Position;
  isClickable?: boolean;
  animationDelay?: number;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Stone = React.forwardRef<HTMLDivElement, StoneProps>((props, ref) => {
  const windowSize = useRef<Size>({ width: window.innerWidth, height: window.innerHeight });
  const [scale, setScale] = useState(1);
  const enableAnimation = useRef(true);

  useEffect(() => {
    window.addEventListener("resize", resize);
  }, [props.position]);

  useEffect(() => {
    setScaleWithoutAnimation(1);
    windowSize.current = { width: window.innerWidth, height: window.innerHeight };
  }, [props.position]);

  function setScaleWithoutAnimation(value: number) {
    enableAnimation.current = false;
    setScale(value);
    enableAnimation.current = true;
  }

  const resize = () => {
    if (windowSize.current) {
      let _scale = 1;

      if (window.innerWidth > window.innerHeight) {
        _scale = window.innerWidth / windowSize.current.width;
      } else {
        _scale = window.innerHeight / windowSize.current.height;
      }

      // disable animations before resizing
      setScaleWithoutAnimation(_scale);
    }
  };

  return (
    <Container
      ref={ref}
      className={props.className}
      style={{
        backgroundColor: props.color,
        transition: enableAnimation.current
          ? `all 700ms ease-out ${props.animationDelay ? props.animationDelay : 250}ms`
          : "none",
        top: props.position.top * scale,
        left: props.position.left * scale,
        cursor: props.isClickable ? "pointer" : "auto",
      }}
      onClick={props.onClick}
    ></Container>
  );
});

export default React.memo(Stone);
