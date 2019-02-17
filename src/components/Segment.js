import styled from "styled-components";
import {theme} from "./theme";
export const Segment = styled.div`
  height:25px;
  color: white;
  cursor: pointer;
  width:${props => props.width ? props.width : 'auto'};
  margin:${props => props.rounded ? '5px' : '0px'};
  padding:5px;
  border-radius:${(props) => {
    if (props.rounded){
      return "50%";
    }
    else {
      if (props.start) {
        if (props.end) {
          return "3px";
        }
        else {
          return "3px 0px 0px 3px";
        }
      }
      else {
        if (props.end) {
          return "0px 3px 3px 0px";
        }
        else {
          return "0px";
        }
      }
    }
  }};
  display:flex;
  justify-content:center;
  align-items:center;
  background-color: ${theme.color.primary};
  transition: all 1s cubic-bezier(.25,.8,.25,1);
  &:hover{
    background-color: ${theme.color.primaryDark};
  }
  &:active{
    background-color: ${theme.color.primary};
  }
`;
