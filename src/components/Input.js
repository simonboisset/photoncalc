import styled from "styled-components";
import TextField from '@material-ui/core/TextField';

const Input = styled(TextField)`
  width: ${props => props.width ? props.width : '350px'};
`;


export {Input};
