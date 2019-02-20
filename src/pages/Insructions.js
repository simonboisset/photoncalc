import React from 'react';
import {Legend,LineChart,Line,XAxis,YAxis,CartesianAxis} from 'recharts';
import {save2png} from '../functions';
import InputAdornment from '@material-ui/core/InputAdornment';
import {Input,Div,Button} from "../components";
import { connect } from 'react-redux';
import {setReducer} from '../redux/actions';
import {bindActionCreators} from 'redux';
import {photonEvent} from "../events";
import regression from 'regression';
class Instructions extends React.Component {

  render() {
    return(
    <Div justify="space-around" row margin="25px" width="100%">
    
    </Div>
    );
  }
}
function  mapStateToProps(state) {return {data:state.data}};
function mapDispatchToProps(dispatch){return bindActionCreators({setReducer:setReducer},dispatch)};
export default connect(mapStateToProps,mapDispatchToProps)(Instructions);
