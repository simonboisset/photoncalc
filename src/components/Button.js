// import React, { Component } from 'react';
// import {theme} from "./theme";
import styled from "styled-components";

import ButtonUI from '@material-ui/core/Button';

const Button = styled(ButtonUI)`
  width: ${props => props.width ? props.width : 'auto'};
`;
// const ButtonContainer = styled.div`
//   width: ${props => props.width ? props.width : 'auto'};
//   margin: ${props => props.margin ? props.margin : '0'};
// `;
// const ButtonDiv = styled(ButtonUI)`
//   width: 100%;
//   height:100%;
// `;
// export default class Button extends Component {
//   render() {
//     return (
//
//       <ButtonContainer {...this.props}>
//         <ButtonDiv {...this.props}>
//           {this.props.children}
//         </ButtonDiv>
//       </ButtonContainer>
//     );
//   }
// }
export {Button};
