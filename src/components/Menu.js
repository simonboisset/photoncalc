import styled from "styled-components";
// import React, { Component } from 'react';
// import {theme} from "./theme";
// import Button from '@material-ui/core/Button';
import MuiMenu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import IconButton from '@material-ui/core/IconButton';
// import Icon from "./Icon";
const Menu = styled(MuiMenu)`
  margin: ${props => props.margin ? props.margin : '0'};
`;

export {Menu,MenuItem,IconButton}

// export default class Menu extends Component {
//   constructor(){
//     super();
//     this.state = {
//       display:null
//     }
//   }
//   handleClick = event => {
//     this.setState({ display: event.currentTarget });
//   };
//
//   handleClose = () => {
//     this.setState({ display: null });
//   };
//   renderMenuList = () => {
//     return (this.props.items.map((item) =>
//       <MenuItem onClick = {item.clic}>{item.name}</MenuItem>
//     ));
//   }
//   render() {
//     return (
//       <div>
//         <IconButton
//           aria-owns={this.state.display ? 'simple-menu' : null}
//           aria-haspopup="true"
//           onClick={this.handleClick}
//         >
//           <Icon>{this.props.icon}</Icon>
//         </IconButton>
//         <MenuUI
//           id={this.props.id}
//           anchorEl={this.state.display}
//           open={Boolean(this.state.display)}
//           onClose={this.handleClose}
//         >
//           {this.renderMenuList()}
//         </MenuUI>
//       </div>
//     )
//   }
// }
