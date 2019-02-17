import styled from "styled-components"
export const ToolBar = styled.div`
  box-sizing: border-box;
  width: 100%;
  height:50px;
  background-color: white;
  box-shadow: 0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23);
  border-radius : 5px;
  padding-left:10px;
  padding-right:10px;
  display:${props => props.display ? props.display : 'flex'};
`;
