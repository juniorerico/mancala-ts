import React, { useState, useEffect, useCallback, useContext } from "react";
import styled from "styled-components";
import { Constants } from "../common/Constants";
import { GameContext } from "../state/context";
import { Index, Position } from "../state/state";

interface StyleProps {
  animationDelay?: number;
  isClickable: boolean;
}

const Container = styled.div<StyleProps>`
  position: absolute;
  border-radius: 100%;
  box-shadow: inset 0px -6px 1px #00000040;
  z-index: 1;
  width: 2.8vw;
  height: 2.8vw;
  transition: top ${Constants.ANIMATION_DURATION}ms ease-out
      ${(props) => (props.animationDelay ? props.animationDelay : Constants.ANIMATION_DELAY)}ms,
    left ${Constants.ANIMATION_DURATION}ms ease-out
      ${(props) => (props.animationDelay ? props.animationDelay : Constants.ANIMATION_DELAY)}ms;
  cursor: ${(props) => (props.isClickable ? "pointer" : "auto")};

  @media (orientation: portrait) {
    width: 2.8vh;
    height: 2.8vh;
  }
`;

interface StoneProps {
  index: number;
  color: string;
  className?: string;
  holeIndex: Index;
  isClickable: boolean;
  animationDelay?: number;
  isInStore: boolean;
  store: -1 | 0 | 1;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

const Stone = React.forwardRef<HTMLDivElement, StoneProps>((props, ref) => {
  const { state } = useContext(GameContext);
  const [position, setPosition] = useState<Position>({ top: 0, left: 0 });

  useEffect(() => {
    function update() {
      if (props.isInStore && props.store !== -1) {
        const store = state.stores[props.store].ref;
        if (store) {
          console.log("going to store: " + props.store);
          setPosition(getRandomPositionInStore(store.getBoundingClientRect(), props.store));
        } else {
          console.log("no store");
        }
      } else if (props.holeIndex.row !== -1) {
        const hole = state.holes[props.holeIndex.row][props.holeIndex.col].ref;
        if (hole) {
          setPosition(getRandomPositionInHole(hole.getBoundingClientRect()));
        }
      }
    }

    window.addEventListener("resize", update);

    update();

    return () => {
      window.removeEventListener("resize", update);
    };
  }, [props.holeIndex, props.store, state.stones[props.index]]);

  /**
   * Get a random position inside a hole that fits a stone
   *
   * @param holeRect HTMLElement.getBoundingClientRect()
   * @returns
   */
  function getRandomPositionInHole(holeRect: DOMRect): Position {
    // get a smaller radius because of the piece size;
    let radius = holeRect.width / 3.5;

    // estimated stone size (would be good to have the stone reference to get this info)
    let stoneSize = window.innerWidth * Constants.STONE_SIZE;

    // Limited just for 3 quadrands of the circle (-1.5)
    let angle = Math.random() * -1.5 * Math.PI;
    let hyp = Math.sqrt(Math.random()) * radius;
    let adj = Math.cos(angle) * hyp;
    let opp = Math.sin(angle) * hyp;

    let xCenter = holeRect.width / 2 + holeRect.left - stoneSize / 2;
    let yCenter = holeRect.width / 2 + holeRect.top - stoneSize / 2;

    return { left: xCenter + adj, top: yCenter + opp };
  }

  /**
   * Get a random position inside a store that fits a stone
   *
   * @param storeRect HTMLElement.getBoundingClientRect()
   * @returns
   */
  function getRandomPositionInStore(storeRect: DOMRect, index: number): Position {
    let topMin = 0;
    let topMax = 0;
    let leftMin = 0;
    let leftMax = 0;

    // estimated stone size (would be good to have the stone reference to get this info)
    // stone size is increased a bit to avoid touching edges
    let stoneSize = window.innerWidth * Constants.STONE_SIZE * 1.1;

    if (window.innerWidth > window.innerHeight) {
      topMin = index === 0 ? storeRect.top + storeRect.height * 0.2 : storeRect.top * 1.2;
      topMax =
        index === 0
          ? storeRect.top + storeRect.height - storeRect.height * 0.2
          : storeRect.top + storeRect.height * 0.7;

      // increase a bit to avoid touching the edges
      leftMin = storeRect.left * 1.05;
      leftMax = storeRect.left + storeRect.width - stoneSize;
    } else {
      topMin = storeRect.top * 1.05;
      topMax = storeRect.top + storeRect.height * 0.9 - stoneSize;

      // increase a bit to avoid touching the edges
      leftMin = index === 0 ? storeRect.left * 1.2 : storeRect.left + storeRect.width * 0.2;
      leftMax =
        index === 0
          ? storeRect.left + storeRect.width * 0.7 - stoneSize
          : storeRect.left + storeRect.width * 0.9 - stoneSize;
    }

    return { left: Math.random() * (leftMax - leftMin) + leftMin, top: Math.random() * (topMax - topMin) + topMin };
  }

  return (
    <Container
      ref={ref}
      className={props.className}
      style={{
        backgroundColor: props.color,
        top: position.top,
        left: position.left,
      }}
      isClickable={props.isClickable}
      animationDelay={props.animationDelay}
      onClick={props.onClick}
    ></Container>
  );
});

export default React.memo(Stone);
