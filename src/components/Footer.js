import styled from "styled-components";

import {theme} from "./theme";
export const Footer = styled.footer`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items:center;
  height : 50px;
  bottom: 100%;
  width: 100%;
  background-color: ${theme.color.secondary};
`;
