import styled from "styled-components";
import React, { Component } from 'react';
import {theme} from "./theme";
const SearchContainer = styled.div`
  color: white;
`;
const InputSearch = styled.input`
  color: white;
  font-size:17px;
  cursor: pointer;
  display:flex;
  justify-content:center;
  align-items:center;
  padding-left:15px;
  width:${props => props.width ? props.width : '300px'};
  height:30px;
  border:none;
  outline:none;
  background-color: ${theme.color.primaryDark};
  transition: all 1s cubic-bezier(.25,.8,.25,1);
  border-radius:${(props) => {
    if (props.rounded){
      return "15px";
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
  &::placeholder{
    color:white;
  }
  &:hover{
    &::placeholder{
      color:${theme.color.primary};
    }
    color:${theme.color.primary};
    background-color: white;
  }
  &:focus{
    &::placeholder{
      color:${theme.color.primary};
    }
    color:${theme.color.primary};
    background-color: white;
  }
`;
export default class SearchBar extends Component {
  render() {
    return (

      <SearchContainer
        {...this.props}
        innerRef={el => this.rippleContainer = el}
        onMouseDown={this.createRipple}
      >
        <form>
          <InputSearch {...this.props} type="text"
          placeholder={this.props.placeholder}/>
        </form>
      </SearchContainer>

    )
  }
}
