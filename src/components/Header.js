import styled from "styled-components";
import {theme} from "./theme";
export const Header = styled.header`
  display: flex;
  position:${props => theme.header.position ? theme.header.position : 'relative'};
  flex-direction: row;
  justify-content: space-between;
  align-items:center;
  height : 50px;
  width: 100%;
  z-index:999;
  background-color: ${theme.color.primary};
  box-shadow: ${props => props.shadow ? '0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)' : 'none'};
`;
