import React from 'react';
import {Legend,Area,XAxis,YAxis,CartesianAxis,Line,ComposedChart} from 'recharts';
import {save2png} from '../functions';
import InputAdornment from '@material-ui/core/InputAdornment';
import {Input,Div,Button} from "../components";
import hoverstate from 'react-hoverstate';
import {photonEvent} from "../events";
import moment from 'moment';
class Puissance extends React.Component {
  constructor()
  {
    super();
    this.state={
      data:null,
      start:1020,
      end:1040,
      Ymax:1,
      Ymin:0
    }
  }
  componentDidMount(){
    this.propsToState();
    photonEvent.on('loaddata', ()=>{
        this.propsToState();
    });
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
      this.setState({data:data.data,start:data.start,end:data.end,Ymax:data.Ymax,Ymin:data.Ymin});
    }
    else {
      this.setProps({
        data:null,
        niveau:2,
        start:1020,
        end:1040,
        Ymax:1,
        Ymin:0
      });
    }
  }
  stateToProps = () =>{
    let data = hoverstate.state.data;
    data[this.props.match.params.id]= {
      data:this.state.data,
      start:this.state.start,
      end:this.state.end,
      Ymax:this.state.Ymax,
      Ymin:this.state.Ymin
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
    let domain = {};
    domain.x = [this.state.start,this.state.end];
    domain.y1 = [Math.round((this.state.Ymin-(this.state.Ymin/50))*100)/100,Math.round((this.state.Ymax+(this.state.Ymax/50))*100)/100];
    domain.y2 = [20,55];
    return domain;
  }
  readFile = (inputFile) => {
    let file = new FileReader();
    file.onload = () => {this.file2array(file.result,"	  ")};
    file.readAsText(inputFile);
  }
  readFileTemp = (inputFile) => {
    let file = new FileReader();
    file.onload = () => {this.fileTemp2array(file.result,",")};
    file.readAsText(inputFile);
  }
  fileTemp2array = (file,spliter) =>{
    let input = file;
    let Ymax=0,Ymin=null;
    input = input.split(['\n']);
    input.splice(0,1);
    let data=[];
    for (let i = 0; i < input.length-1; i++) {
      data[i]=input[i].split([spliter]);
      // data[i].splice(0,1);
      data[i][1] = moment(data[i][1],"DD-MM-YYYY HH:mm:ss");
      if (i === 0) {
        data[i][0]=0;
      } else {
        data[i][0] = data[i-1][0] + data[i][1].diff(data[i-1][1])/1000;
      }
      data[i][2]=Number(data[i][2]);
      data[i][3]=Number(data[i][3]);
      data[i][4]=Number(data[i][4]);
      if(data[i][1]>Ymax){
        Ymax=data[i][1];
      }
      if(data[i][1]<Ymin||Ymin===null){
        Ymin=data[i][1];
      }
      if (isNaN(data[i][0]) || isNaN(data[i][1])) {
        console.log("Parameter is not a number!");
      }
    }
    data[0].splice(5,1);
    let temp = this.state.data;
    for (let i = 0; i < data.length; i++) {
      data[i]={name:data[i][0]/3600,temp:data[i][2],humidity:data[i][3]};
      for (let ii = 0; ii < temp.length-1; ii++) {
        if (temp[ii].name<=data[i].name && temp[ii+1].name>data[i].name) {
          temp[ii].temp=data[i].temp;
          temp[ii].humidity=data[i].humidity;
        }
      }
    }
    let start = data[0].name;
    let end = data[data.length-1].name;
    this.setState({data:temp,start,end});
    this.setProps({data:temp,start,end});
  }
  file2array = (file,spliter) =>{
    let input = file;
    let Ymax=0,Ymin=null;
    input = input.split(['\n']);
    input.splice(0,17);
    let data=[];
    for (let i = 0; i < input.length-1; i++) {
      while (input[i][0]===" ") {
        input[i]=input[i].slice(1);
      }
      data[i]=input[i].split([spliter]);
      data[i][0]=Number(data[i][0]);
      data[i][1]=Number(data[i][1]);
      if(data[i][1]>Ymax){
        Ymax=data[i][1];
      }
      if(data[i][1]<Ymin||Ymin===null){
        Ymin=data[i][1];
      }
      if (isNaN(data[i][0]) || isNaN(data[i][1])) {
        console.log("Parameter is not a number!");
      }
    }
    for (let i = 0; i < data.length; i++) {
      data[i]={name:data[i][0]/3600,puissance:data[i][1]};
    }
    let start = data[0].name;
    let end = data[data.length-1].name;
    this.setState({data,Ymax,Ymin,start,end});
    this.setProps({data,Ymax,Ymin,start,end});
  }
  analyse = () =>{
    let data = this.state.data;
    if (data===null) {
      return {mean:0,rms:0};
    }
    else {
      // calcul moyenne
      let mean = 0;
      for (let i = 0; i < data.length; i++) {
        mean = mean + data[i].puissance;
      }
      mean = mean/data.length;
      // calcul écart-type
      let ecartType = 0;
      for (let i = 0; i < data.length; i++) {
        ecartType = ecartType + Math.pow(data[i].puissance - mean,2);
      }
      ecartType = Math.sqrt(ecartType/data.length);
      let rms = (ecartType/mean)*100;
      mean = Math.round(mean*100)/100;
      rms = Math.round(rms*100)/100;
      return {rms,mean};
    }
  }
  renderpuissance=()=>{
    return(
      <div ref="targetimg" id="targetimg">
      <ComposedChart  width={550} height={400} data={this.state.data}
        margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
        <XAxis padding={{ left: 0, right: 0 }} allowDataOverflow={true} type="number" dataKey="name" domain={this.domain().x}
          label={{ value: 'Time (h)', offset: -5, position: 'insideBottom' }} ticks={this.ticks()} scale="linear"/>
        <YAxis padding={{ top: 20, bottom: 0 }} orientation="left" yAxisId="left" hide={false} allowDataOverflow={true} type="number" domain={this.domain().y1}
          label={{dx:-15, value: 'Power (W)', angle: -90, position: 'center', stroke:"red"}}/>
        <YAxis padding={{ top: 20, bottom: 0 }} orientation="right" yAxisId="right" hide={false} allowDataOverflow={true} type="number" domain={this.domain().y2}
          label={{dx:15, value: 'Temperature (°C) / Humidity (%)', angle: 90, position: 'center' , stroke:"green"}} stroke="green"/>
        <CartesianAxis/>
        <Legend
          layout='vertical'
          payload={[
            { value: `Mean Power : ${this.analyse().mean}W`, type: 'line', id: 'ID01' },
            { value: `RMS : ${this.analyse().rms}%`, type: 'line', id: 'ID02' }
          ]}
          wrapperStyle={{
            top:10,
            left: 100,
            float: 'left'
          }}/>
        <Area yAxisId="left" connectNulls={true} dot={false} type="linear" dataKey="puissance" stroke='none' fill='red'  />
        <Line yAxisId="right" connectNulls={true} dot={false} type="linear" dataKey="temp" stroke="green" />
        <Line yAxisId="right" connectNulls={true} dot={false} type="linear" dataKey="humidity" stroke="blue" />
      </ComposedChart>

    </div>
    );
  }
  render() {
    return(
    <Div justify="space-around" row margin="25px" width="100%">
    <Div margin="25px" align="center">
      <input style={{display: 'none'}}type="file" id="input-file-puissance" onChange={(event)=>{this.readFile(event.target.files[0])}}/>
      <input style={{display: 'none'}}type="file" id="input-file-temp" onChange={(event)=>{this.readFileTemp(event.target.files[0])}}/>
      <Button variant="outlined" onClick={(e) => document.getElementById("input-file-puissance").click()}>Charger puissance</Button>
      <Button variant="outlined" onClick={(e) => document.getElementById("input-file-temp").click()}>Ajouter fichier température</Button>
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
    <Div margin="25px">{this.renderpuissance()}<div id="loadImg"></div></Div>
    </Div>
    );
  }
}
export default Puissance;
