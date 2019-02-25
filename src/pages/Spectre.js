import React from 'react';
import {ReferenceLine,Legend,AreaChart,Area,XAxis,YAxis,CartesianAxis} from 'recharts';
import {save2png} from '../functions';
import InputAdornment from '@material-ui/core/InputAdornment';
import {Input,Div,Button} from "../components";
import {photonEvent} from "../events";
import hoverstate from 'react-hoverstate';
class Spectre extends React.Component {
  constructor()
  {
    super();
    this.state={
      spectreData:null,
      niveau:2,
      start:1020,
      end:1040
    }
  }
  componentDidMount(){
    this.propsToState();
    photonEvent.on('loaddata', ()=>{
        this.propsToState();
    });
  }
  // componentWillUnmount(){
  //   // this.stateToProps();
  // }
  setProps=(object)=>{
    let data = hoverstate.state.data;
    
    for (let variable in object) {
      if (data[this.props.match.params.id]) {
        data[this.props.match.params.id][variable]=object[variable];
      }
      else {
      data[this.props.match.params.id]={[variable]:object[variable]};
      }
    }
    hoverstate.setState({data});
  }
  propsToState = () => {
    if (hoverstate.state.data[this.props.match.params.id]) {
      let data = hoverstate.state.data[this.props.match.params.id];
      this.setState({spectreData:data.spectreData,niveau:data.niveau,start:data.start,end:data.end});
    }
    else {
      this.setProps({
        spectreData:null,
        niveau:2,
        start:1020,
        end:1040
      });
    }
  }
  stateToProps = () =>{
    let data = hoverstate.state.data;
    data[this.props.match.params.id]= {
      spectreData:this.state.spectreData,
      niveau:this.state.niveau,
      start:this.state.start,
      end:this.state.end
    };
    hoverstate.setState({data});
  }
  ticks = () =>{
    let interval = (this.state.end-this.state.start)/7;
    let ticks=[], i = 0, y = 0;
    while (this.state.start+y <= this.state.end) {
      ticks[i]=Math.round((this.state.start+y)/5)*5;
      i++;
      y = y + interval;
    }
    return ticks;
  }
  domain = () => {
    return [Math.round((this.state.start)/5)*5,Math.round((this.state.end)/5)*5];
  }
  readSpectre = (inputFile,niveau) => {
    let file = new FileReader();
    file.onload = () => {this.file2array(file.result,";")};
    file.readAsText(inputFile);
  }
  file2array = (file,spliter) =>{
    let input = file;
    let Ymax=0;
    input = input.split(['\n']);
    let spectreData=[];
    for (let i = 0; i < input.length-1; i++) {
      spectreData[i]=input[i].split([spliter]);
      spectreData[i][0]=spectreData[i][0].replace(',','.');
      spectreData[i][0]=Number(spectreData[i][0]);
      spectreData[i][1]=spectreData[i][1].replace(',','.');
      spectreData[i][1]=Number(spectreData[i][1]);
      if(spectreData[i][1]>Ymax){
        Ymax=spectreData[i][1];
      }
      if (isNaN(spectreData[i][0]) || isNaN(spectreData[i][1])) {
        console.log("Parameter is not a number!");
      }
    }
    for (let i = 0; i < spectreData.length; i++) {
      spectreData[i]={name:spectreData[i][0],spectre:spectreData[i][1]/Ymax};
    }
    this.setState({spectreData});
    this.setProps({spectreData});
  }
  wavelength = () =>{
    if (this.state.spectreData===null || this.state.niveau===0) {
      return {deltaWL:0,centralWL:0,X_FWHM_max:0,X_FWHM_min:0};
    }
    else {
      let X_FWHM_max =this.state.spectreData[0].name;
      let X_FWHM_min = this.state.spectreData[this.state.spectreData.length-2].name;
      for (let i = 0; i < this.state.spectreData.length-1; i++) {
        if ((this.state.spectreData[i].spectre<=1/this.state.niveau && 1/this.state.niveau<=this.state.spectreData[i+1].spectre)||(this.state.spectreData[i].spectre>=1/this.state.niveau && 1/this.state.niveau>=this.state.spectreData[i+1].spectre)){
          if(X_FWHM_max<this.state.spectreData[i].name){
            X_FWHM_max = this.state.spectreData[i].name;
          }
          if(X_FWHM_min>this.state.spectreData[i].name){
            X_FWHM_min = this.state.spectreData[i].name;
          }
        }
      }
      let deltaWL = X_FWHM_max - X_FWHM_min;
      let centralWL = (X_FWHM_max + X_FWHM_min)/2;
      centralWL = Math.round(centralWL*100)/100;
      deltaWL = Math.round(deltaWL*100)/100;
      return {deltaWL,centralWL,X_FWHM_max,X_FWHM_min};
      // let start = Math.round((X_FWHM_min - deltaWL-1)/5)*5;
      // let end = Math.round((X_FWHM_max + deltaWL-1)/5)*5;
    }
  }
  renderSpectre=()=>{
    return(
      <div ref="targetimg" id="targetimg">
      <AreaChart  width={550} height={400} data={this.state.spectreData}
        margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
        <XAxis allowDataOverflow={true} type="number" dataKey="name" domain={this.domain()}
          label={{ value: 'Wavelength (nm)', offset: -5, position: 'insideBottom' }} ticks={this.ticks()} scale="linear"/>
        <YAxis hide={false} allowDataOverflow={true} type="number" domain={[0, 1]}
          label={{ value: 'Intensity (a.u)', angle: -90, position: 'insideLeft' }}/>

        <CartesianAxis/>
        <Legend
          layout='vertical'
          payload={[
            { value: `\u03BBc : ${this.wavelength().centralWL}nm`, type: 'line', id: 'ID01' },
            { value: `\u0394\u03BB : ${this.wavelength().deltaWL}nm`, type: 'line', id: 'ID02' }
          ]}
          wrapperStyle={{
            top:50,
            left: 100,
            float: 'left'
          }}/>
        <ReferenceLine x={this.wavelength().X_FWHM_min} stroke="red" strokeDasharray="3 3"/>
        <ReferenceLine x={this.wavelength().X_FWHM_max} stroke="red" strokeDasharray="3 3"/>
        <ReferenceLine x={this.wavelength().centralWL} stroke="red"/>
        <ReferenceLine y={1/this.state.niveau} stroke="red" strokeDasharray="3 3"/>
        <Area dot={false} type="linear" dataKey="spectre" stroke='none' fill='blue'  />
      </AreaChart>

    </div>
    );
  }
  render() {
    return(
    <Div justify="space-around" row margin="25px" width="100%">
    <Div margin="25px" align="center">
      <input style={{display: 'none'}}type="file" id="input-file-spectre" onChange={(event)=>{this.readSpectre(event.target.files[0],this.state.niveau)}}/>
      <Button variant="outlined" onClick={(e) => document.getElementById("input-file-spectre").click()}>Charger Spectre</Button>
      <Div margin="15px 0 0 0"><Input
        label="Niveau de la largeur"
        type="number"
        value={this.state.niveau}
        onChange={(e)=>{
            this.setState({niveau:e.target.value});
            this.setProps({niveau:e.target.value});
          }}
        variant="filled"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              1/
            </InputAdornment>
          ),
        }}
      /></Div>
      <Div margin="15px 0 0 0"><Input
        label="Start"
        type="number"
        value={this.state.start}
        onChange={(event)=>{
          this.setState({start:Number(event.target.value)});
          this.setProps({start:Number(event.target.value)});
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
        label="End"
        type="number"
        value={this.state.end}
        onChange={(event)=>{
          this.setState({end:Number(event.target.value)});
          this.setProps({end:Number(event.target.value)});
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
      <Button width="100%" variant="contained" onClick={()=>{save2png(this.refs.targetimg)}}>Screenshot</Button>
    </Div>
    <Div margin="25px">{this.renderSpectre()}<div id="loadImg"></div></Div>
    </Div>
    );
  }
}
export default Spectre;
