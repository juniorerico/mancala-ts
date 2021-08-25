import React from "react";
import { useState } from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  padding-bottom: env(safe-area-inset-bottom);
  font-family: "Roboto", "Verdana", sans-serif;
`;

const Container = styled.div<DialogProps>`
  align-items: center;
  display: ${(props) => (props.isActive ? "flex" : "none")};
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  position: fixed;
  z-index: 10;
  height: 100%;
  width: 100%;
`;

const Background = styled.div`
  background-color: rgba(0, 0, 0, 0.8);
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
`;

const Content = styled.div`
  max-height: calc(100% - 3rem);
  max-width: calc(100% - 3rem);
  background-color: #3f3f3f;
  -ms-scroll-chaining: none;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
  border-radius: 8px;
  z-index: 0;
  overflow: auto;
  position: relative;
  margin: 0 auto;

  @media screen and (min-width: 769px) {
    width: 400px;
  }
`;

const Header = styled.div`
  background-color: #444444 !important;
  padding: 1.5rem 1.5rem;
  display: flex;

  align-items: center;
`;

const Text = styled.div`
  flex-grow: 1;
  overflow: auto;
`;

const Title = styled.div`
  font-size: 1.5rem;
  color: #fff;
  font-weight: 400 !important;
`;

const ButtonsSection = styled.div`
  padding: 1.5rem 1.5rem;
`;

const Control = styled.div`
  box-sizing: border-box;
  clear: both;
  font-size: 1rem;
  position: relative;
  text-align: left;
`;

const SelectWrapper = styled.div`
  width: 100%;
  height: 2.25em;
  display: inline-block;
  max-width: 100%;
  position: relative;
  vertical-align: top;

  &:after {
    border: 3px solid transparent;
    border-radius: 2px;
    border-right: 0;
    border-top: 0;
    content: " ";
    display: block;
    height: 0.625em;
    margin-top: -0.4375em;
    pointer-events: none;
    position: absolute;
    top: 50%;
    -webkit-transform: rotate(-45deg);
    transform: rotate(-45deg);
    -webkit-transform-origin: center;
    transform-origin: center;
    width: 0.625em;
    border-color: #fff;
    right: 1.125em;
    z-index: 4;
  }
`;

const Dropdown = styled.select`
  color: #fff;
  border-color: #d15030;
  background-color: #d15030;
  width: 100%;
  padding-right: 2.5em;
  cursor: pointer;
  display: block;
  font-size: 1em;
  max-width: 100%;
  outline: none;
  padding-top: calc(0.375em - 1px);
  position: relative;
  vertical-align: top;
  height: 2.25em;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  line-height: 1.5;
  padding-bottom: calc(0.375em - 1px);
  padding-left: calc(0.625em - 1px);
  -webkit-appearance: none;
  -webkit-box-align: center;
  -ms-flex-align: center;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 0.4em;
  -webkit-box-shadow: none;
  box-shadow: none;
  display: -webkit-inline-box;
  display: -ms-inline-flexbox;
  display: inline-flex;
  font-size: 1rem;
  height: 2.25em;
  -webkit-box-pack: start;
  -ms-flex-pack: start;
  justify-content: flex-start;
  line-height: 1.5;
  padding-bottom: calc(0.375em - 1px);
  padding-left: calc(0.625em - 1px);
  padding-right: calc(0.625em - 1px);
  padding-top: calc(0.375em - 1px);
  position: relative;
  vertical-align: top;
`;

const ButtonContainer = styled.p`
  flex-grow: 1;
  flex-shrink: 1;
  box-sizing: border-box;
  clear: both;
  font-size: 1rem;
  position: relative;
  text-align: left;
  margin: 0;
  padding: 0;
  margin-top: 2em;
`;

const Button = styled.a`
  justify-content: center;
  padding-bottom: calc(0.375em - 1px);
  padding-left: 0.75em;
  padding-right: 0.75em;
  padding-top: calc(0.375em - 1px);
  text-align: center;
  white-space: nowrap;
  background-color: #d15030;
  border-color: transparent;
  color: #fff;
  display: flex;
  align-items: center;
  border: 1px solid transparent;
  border-radius: 0.4em;
  font-size: 1rem;
  cursor: pointer;
`;

interface DialogProps {
  isActive: boolean;
  title: string;
  onClick?: (level: number) => void;
}

const Store = (props: DialogProps) => {
  const [level, setLevel] = useState(1);

  return (
    <Wrapper>
      <Container isActive={props.isActive} title={props.title}>
        <Background />
        <Content>
          <Header>
            <Text>
              <Title>{props.title}</Title>
            </Text>
          </Header>
          <ButtonsSection>
            <div style={{ marginBottom: "0.75rem" }}>
              <Control>
                <SelectWrapper>
                  <Dropdown
                    value={level}
                    onChange={(e) => {
                      setLevel(parseInt(e.target.value));
                    }}
                  >
                    <option value="1">Easy Bot</option>
                    <option value="3">Medium Bot</option>
                    <option value="6">Hard Bot</option>
                  </Dropdown>
                </SelectWrapper>
              </Control>
            </div>
            <ButtonContainer>
              <Button onClick={() => props.onClick!(level)}>Play!</Button>
            </ButtonContainer>
          </ButtonsSection>
        </Content>
      </Container>
    </Wrapper>
  );
};

export default React.memo(Store);
