import React, { Component } from 'react';
import styled from "styled-components";
import {theme} from "./theme";
const BodyContainer = styled.div`
  min-height : ${window.innerHeight-theme.header.height-theme.footer.height}px;
  width: 100%;
  background-color: white;
  padding-top : ${(props) => {
    if (theme.header.position){
      if (theme.header.position==="fixed"){
        return "50px";
      }
      return "0";
    }
    return "0";
  }};
`;
const BodyChildren = styled.div`
  margin: 0px;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

export default class Body extends Component {
  render() {
    return (
      <BodyContainer
        {...this.props}
        innerRef={el => this.rippleContainer = el}
        onMouseDown={this.createRipple}
      >
      <BodyChildren>
        {this.props.children}
      </BodyChildren>
      </BodyContainer>
    )
  }
}
