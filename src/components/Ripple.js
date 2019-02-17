import React, { Component } from 'react';
import styled, { keyframes} from "styled-components";
const rippleAnimation = keyframes`
  100% {
    transform: scale(2);
    opacity: 0;
  }
`;

const RippleContainer = styled.button`
  display: inline-block;
  position: relative;
  overflow: hidden;
  margin:0;
  padding:0;
  width:100%;
  height:100%;
  border:none;
  background-color:rgba(0, 0, 0, 0);
  outline:none;
`;

const RippleItem = styled.div`
  position: absolute;
  left: ${props => `${props.position.x}px`};
  top: ${props => `${props.position.y}px`};
  width: ${props => `${props.size}px`};
  height: ${props => `${props.size}px`};
  background: ${props => props.color || 'black'};
  border-radius: 50%;
  user-select: none;
  pointer-events: none;
  transform: scale(0);
  opacity: .3;
  animation: ${rippleAnimation} .7s linear;
`;

export default class Ripple extends Component {
  state = {
    ripples: []
  };

  createRipple = (event) => {
    const { width, height, left, top } = this.rippleContainer.getBoundingClientRect();

    const size = Math.max(width, height);
    const position = {
      x: event.clientX - left - (size / 2),
      y: event.clientY - top - (size / 2),
    }

    this.setState(prevState => prevState.ripples.push({ size, position }))
  };

  render() {
    const { color, children, ...props } = this.props;
    const { ripples } = this.state;

    return (
      <RippleContainer
        {...props}
        innerRef={el => this.rippleContainer = el}
        onMouseDown={this.createRipple}
      >
        {children}
        { ripples.map(r => (
          <RippleItem
            {...r}
            color={color}
          />
        ))}
      </RippleContainer>
    )
  }
}
