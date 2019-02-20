import React from 'react';
import {ReferenceLine,AreaChart,Area,XAxis,YAxis,CartesianAxis} from 'recharts';
import InputAdornment from '@material-ui/core/InputAdornment';
import {Input,Div,Button} from "../components";
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import MenuItem from '@material-ui/core/MenuItem';
import hoverstate from 'react-hoverstate';
import {photonEvent} from "../events";
function Transition(props) {
  return <Slide direction="up" {...props} />;
}

class Propagation extends React.Component {
  constructor()
  {
    super();
    this.state={
      wavelength:1030,
      w0:0.006,
      numberOfPoints:100,
      optics:[],
      open:[false],
      temp:{
        type : "lens",
        name : "Name",
        value : 0
      }
    }
  }
  componentDidMount(){
    this.propsToState();
    photonEvent.on('loaddata', ()=>{
        this.propsToState();
    });
  }
  componentWillUnmount(){
    this.stateToProps();
  }
  setProps=(object)=>{
    let data = hoverstate.state.data;
    hoverstate.setState({data});
    for (let variable in object) {
      if (data[this.props.match.params.id]) {
        data[this.props.match.params.id][variable]=object[variable];
      }
      else {
      data[this.props.match.params.id]={[variable]:object[variable]};
      }
    }
  }
  propsToState = () => {
    if (hoverstate.state.data[this.props.match.params.id]) {
      let data = hoverstate.state.data[this.props.match.params.id];
      this.setState({
        wavelength:data.wavelength,
        w0:data.w0,
        numberOfPoints:data.numberOfPoints,
        optics:data.optics
      });
    }
    else {
      this.setProps({
        wavelength:1030,
        w0:0.006,
        numberOfPoints:100,
        optics:[]
      });
    }
  }
  stateToProps = () =>{
    let data = hoverstate.state.data;
    data[this.props.match.params.id]= {
      wavelength:this.state.wavelength,
      w0:this.state.w0,
      numberOfPoints:this.state.numberOfPoints,
      optics:this.state.optics
    };
    hoverstate.setState({data});
  }
  handleClickOpen = (index) => {
    let open = this.state.open;
    open[index]=true;
    this.setState({ open });
  }
  handleClose = (index) => {
    let open = this.state.open;
    open[index]=false;
    this.setState({ open });
  }
  domain = () => {
    let ticks=[];
    let start = 0;
    let end = this.passageTotal().distance;
    let interval = (end-start)/7;
    let i = 0;
    let y = 0;
    while (start + y < end) {
      ticks[i]=Math.round(start+y);
      i++;
      y = y + interval;
    }
    ticks[i]=Math.round(end);
    let domain=[Math.round((start)/5)*5,Math.round((end)/5)*5]
    return ({domain,ticks});
  }
  dataMax = () => {
    let max = 0
    for (let i = 0; i < this.propagationData().length; i++) {
      if (this.propagationData()[i].radius>max) {
        max = Math.round(this.propagationData()[i].radius*100)/100;
      }
    }
    return max;
  }
  renderOpticList=()=>{
    return(
      this.state.optics.map((optic) =>
        <Div key={`${optic.name} ${optic.range}`} margin="0 0 15px 0">
          <Input
            label={optic.name}
            type="number"
            value={optic.value}
            onChange={(event)=>this.changeOptic(event,optic.range)}
            variant="filled"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  mm
                </InputAdornment>
              ),
            }}
          />
        </Div>
      )
    );
  }
  addOptic=(type,name,value,range=null)=>{
    this.handleClose(0);
    let optics = this.state.optics;
    if (range===null) {
      let newOptic = {type,name,value,range:optics.length}
      optics[optics.length] = newOptic;
    }
    else {
      let temp=[];
      for (let i = 0; i < range-1; i++) {
        temp[i]=optics[i];
      }
      temp.push({type,name,value,range:temp.length});
      for (let i = range+1; i < optics.length; i++) {
        temp[i]=optics[i-1];
      }
    }
    this.setState({optics,temp:{type : "lens",name : "Name",value : 0}});
    this.setProps({optics});
  }
  rmOptic=(type,name,value,range=null)=>{
    let optics = this.state.optics;
    if (range===null) {
      optics.push({type,name,value});
    }
    else {
      let temp=[];
      for (let i = 0; i < range-1; i++) {
        temp[i]=optics[i];
      }
      temp.push({type,name,value});
      for (let i = range+1; i < optics.length; i++) {
        temp[i]=optics[i-1];
      }
    }
    this.setState({optics});
    this.setProps({optics});
  }
  changeOptic=(event,range)=>{
    let value = Number(event.target.value);
    let optics = this.state.optics;
    optics[range].value=value;
    this.setState({optics});
    this.setProps({optics});
  }
  passageTotal = () => {
    let distance=0;
    let w0 = [{z:0,y:this.state.w0}];
    let ii =0;
    let l = [];
    let Zr = [];
    Zr[0] = Math.PI * Math.pow(w0[0].y/1000,2) / (this.state.wavelength/1000000000);
    let li=0;
    for (let i = 0; i < this.state.optics.length; i++) {
      if (this.state.optics[i].type==="distance") {
        distance = distance + this.state.optics[i].value;
        l[li]=distance;
        li++;
      } else {
        let z = distance - w0[ii].z;
        let w0_1 = w0[ii].y;
        let f = this.state.optics[i].value;
        let z_2 = f*(Math.pow(Zr[ii],2)-z*(f-z)/1000000)/(Math.pow(f-z,2)/1000000+Math.pow(Zr[ii],2));
        let w0_2 = w0_1*Math.abs(f)/1000/Math.sqrt(Math.pow(f-z,2)/1000000+Math.pow(Zr[ii],2));
        let w0_i = {z:z_2+distance,y:w0_2};
        ii++;
        Zr[ii] = Math.PI * Math.pow(w0_2/1000,2) / (this.state.wavelength/1000000000);
        w0[ii]=w0_i;
      }
    }
    return {distance,w0,l,Zr};
  }
  propagationData = () => {
    let data = [];
    let passageTotal = this.passageTotal();
    let distance = passageTotal.distance;
    let w0 = passageTotal.w0;
    let l = passageTotal.l;
    let Zr = passageTotal.Zr;
    if (distance>0) {
      let z = 0;
      let y = 0;
      let interval = distance/this.state.numberOfPoints;
      let ii = 0;
      for (let i = 0; i < l.length; i++) {
        while (z <= l[i]) {
          y = w0[i].y * Math.sqrt(1 + Math.pow((z-w0[i].z)/Zr[i]/1000,2));
          data[ii]={distance:z,radius:y};
          z = z + interval;
          ii++;
        }
      }

    }
    return data;
  }
  changeTemp = (input) => {
    let temp = this.state.temp;
    for (let property in temp) {
      if (input[property]) {
        temp[property]=input[property];
      }
    }
    this.setState({temp});
  }
  renderReferenceLines = () => {
    let l = this.passageTotal().l;
    l=l.slice(0,l.length-1);
    return(
      l.map((lens) =>
        <ReferenceLine key={"lens"+lens} x={lens} stroke="red" strokeDasharray="3 3"/>
      )
    );
  }
  renderChart=()=>{
    return(
      <div ref="targetimg" id="targetimg">
      <AreaChart  width={550} height={400} data={this.propagationData()}
        margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
        <XAxis allowDataOverflow={true} type="number" dataKey="distance" domain={this.domain().domain}
          label={{ value: 'Distance (mm)', offset: -5, position: 'insideBottom' }} ticks={this.domain().ticks} scale="linear"/>
        <YAxis hide={false} allowDataOverflow={true} type="number" domain={[0, this.dataMax()]}
          label={{ value: 'Beam diameter (mm)', angle: -90, position: 'insideLeft' }}/>
        <CartesianAxis/>
        {this.renderReferenceLines()}
        <Area dot={false} type="linear" dataKey="radius" stroke='none' fill='blue'  />
      </AreaChart>

    </div>
    );
  }
  render() {
    return(
    <Div justify="space-around" row margin="25px" width="100%">
    <Div margin="25px" align="center">
      <Div margin="0 0 0 0"><Input
        label="Nombre de points"
        type="number"
        value={this.state.numberOfPoints}
        onChange={(event)=>{
          this.setState({numberOfPoints:Number(event.target.value)});
          this.setProps({numberOfPoints:Number(event.target.value)});
        }}
        variant="filled"
      /></Div>
      <Div margin="15px 0 0 0"><Input
        label="Longueur d'onde"
        value={this.state.wavelength}
        onChange={(event)=>{
          this.setState({wavelength:Number(event.target.value)});
          this.setProps({wavelength:Number(event.target.value)});
        }}
        variant="filled"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              nm
            </InputAdornment>
          ),
        }}
      /></Div>
      <Div margin="15px 0 15px 0"><Input
        label="Waist"
        type="number"
        value={this.state.w0}
        onChange={(event)=>{
          this.setState({w0:Number(event.target.value)});
          this.setProps({w0:Number(event.target.value)});
        }}
        variant="filled"
        InputProps={{
          endAdornment: (
            <InputAdornment position="start">
              mm
            </InputAdornment>
          ),
        }}
      /></Div>
      {this.renderOpticList()}
      <Button width="100%" variant="contained" onClick={()=>{this.handleClickOpen(0)}}>Ajouter</Button>
    </Div>
    <Div margin="25px">{this.renderChart()}<div id="loadImg"></div></Div>
    <Dialog
      open={this.state.open[0]}
      TransitionComponent={Transition}
      keepMounted
      onClose={()=>this.handleClose(0)}
      aria-labelledby="alert-dialog-slide-title"
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        {"Nouvel élement"}
      </DialogTitle>
      <DialogContent>
        <Input
          id="filled-select-currency"
          select
          label="Type d'élement"
          value={this.state.temp.type}
          onChange={(event)=>this.changeTemp({type:event.target.value})}
          margin="normal"
          variant="filled"
        >
            <MenuItem key={"lens"} value={"lens"}>
              Lentille
            </MenuItem>
            <MenuItem key={"distance"} value={"distance"}>
              Distance
            </MenuItem>
        </Input>
        <Div margin="15px 0 0 0"><Input
          label="Name"
          value={this.state.temp.name}
          onChange={(event)=>this.changeTemp({name:event.target.value})}
          variant="filled"
        /></Div>
        <Div margin="15px 0 0 0"><Input
          label={this.state.temp.type==="lens" ? 'Focale (mm)' : 'Longueur (mm)'}
          type="number"
          value={this.state.temp.value}
          onChange={(event)=>this.changeTemp({value:Number(event.target.value)})}
          variant="filled"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                mm
              </InputAdornment>
            ),
          }}
        /></Div>
      </DialogContent>
      <DialogActions>
        <Button onClick={()=>this.handleClose(0)} color="secondary">
          Annuler
        </Button>
        <Button onClick={()=>{this.addOptic(this.state.temp.type,this.state.temp.name,this.state.temp.value)}} color="primary">
          Valider
        </Button>
      </DialogActions>
    </Dialog>
    </Div>
    );
  }
}
export default Propagation;
