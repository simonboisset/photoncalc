import ListUI from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import styled from "styled-components";

const List = styled(ListUI)`
  width: ${props => props.width ? props.width : 'auto'};
  height: ${props => props.height ? props.height : 'auto'};
  margin:${props => props.margin ? props.margin : '0'};
`;

export {List,ListItem,ListItemIcon,ListItemText,Divider,ListItemSecondaryAction}
