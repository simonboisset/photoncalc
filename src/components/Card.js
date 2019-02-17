import CardUI from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContentUI from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import CardHeader from '@material-ui/core/CardHeader';

import styled from "styled-components";

const Card = styled(CardUI)`
  width: ${props => props.width ? props.width : 'auto'};
  height: ${props => props.height ? props.height : 'auto'};
  margin:${props => props.margin ? props.margin : '0'};
  display:flex;
  flex-direction: ${props => props.row ? 'row' : 'column'};
  justify-content:${props => props.justify ? props.justify : 'flex-start'};
  align-items:${props => props.align ? props.align : 'flex-start'};
`;

const CardContent = styled(CardContentUI)`
  width: ${props => props.width ? props.width : '100%'};
  background-color:${props => props.background ? props.background : 'none'};
`;
export {Card,CardActions,CardContent,CardMedia,CardHeader}
