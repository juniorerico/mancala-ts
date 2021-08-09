import React from "react";
import ReactDOM from "react-dom";
import { createGlobalStyle } from "styled-components";
import Game from "./ui/Game";

const GlobalStyle = createGlobalStyle`
  html, 
  body {
      height: 100%;
      margin: 0px;
  } 
`;

ReactDOM.render(
  <React.StrictMode>
    <GlobalStyle />
    <Game />
  </React.StrictMode>,
  document.getElementById("root")
);
