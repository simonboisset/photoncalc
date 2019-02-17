import styled from "styled-components";
import MuiPaper from '@material-ui/core/Paper';
export const Paper = styled(MuiPaper)`
  width: ${props => props.width ? props.width : 'auto'};
  height: ${props => props.height ? props.height : 'auto'};
  display:flex;
  flex-direction: ${props => props.row ? 'row' : 'column'};
  justify-content:${props => props.justify ? props.justify : 'flex-start'};
  align-items:${props => props.align ? props.align : 'flex-start'};
`;
