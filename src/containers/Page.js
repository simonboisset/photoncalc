import React from 'react';
import {save2png,getData,setData,readFile} from 'src/functions';
import {ReferenceLine,Legend,AreaChart,Area,XAxis,YAxis,CartesianAxis} from 'recharts';
import {InputAdornment} from '@material-ui/core';
import {Input,Div,Button} from "src/components";
import { withRouter } from 'react-router-dom';
class Page extends React.Component {
    constructor()
    {
        super();
        this.state={}
    }
    static getDerivedStateFromProps(props, state){
        if (getData(props.match.params.id)) {
            if (state.data) {
                let data =state;
                let analyse = props.analyse(data);
                for (const key in analyse) {
                    if (analyse.hasOwnProperty(key)) {
                        data[key] = analyse[key];
                    }
                }
                return data;
            }else{
                let data = getData(props.match.params.id);
                if(!data.data){
                    setData(props.match.params.id,props.init);
                    return props.init;
                }else {
                    let analyse = props.analyse(data)
                    for (const key in analyse) {
                        if (analyse.hasOwnProperty(key)) {
                            data[key] = analyse[key];
                        }
                    }
                    return data;
                }
            }
            
        }else{
            props.history.push('/');
            return null;
        }
    }
    load = (input,Ymin,Ymax)=>{
        let object = this.props.traitement(input,Ymin,Ymax);
        setData(this.props.match.params.id,object);
    }
    saveChange = (object) =>{
        this.setState(object);
        setData(this.props.match.params.id,object);
    }
    renderInput = () =>{
        return (
            this.props.inputs.map((input) =>
            <Div key={input.value} margin="15px 0 0 0"><Input
                label={input.label}
                type={input.type ? input.type : 'number'}
                value={this.state[input.value]}
                onChange={(e)=>this.saveChange({[input.value]:e.target.value})}
                variant="filled"
                InputProps={{
                [input.add.position+"Adornment"]: (
                    <InputAdornment position="start">
                    {input.add.value}
                    </InputAdornment>
                ),
                }}
            /></Div>)
        );
    }
    ticks=()=>{
        let interval = (this.state.end-this.state.start)/7;
        let ticks=[], i = 0, y = 0;
        while (this.state.start+y <= this.state.end) {
          ticks[i]=Math.round((this.state.start+y)/5)*5;
          i++;
          y = y + interval;
        }
        return ticks;
    }
    domain=()=>{
        return [Math.round((this.state.start)/5)*5,Math.round((this.state.end)/5)*5];
    }
      
    renderReferenceLine = () => {
        if (this.props.referenceline) {
            if(this.props.referenceline[0].value){ 
                return (
                    this.props.referenceline.map((line) =>
                        line.type==="y" ? (
                            <ReferenceLine key={`y${line.value}`} y={line.value} stroke="red" strokeDasharray="3 3"/>
                        ) : (
                            <ReferenceLine key={`x${line.value}`} x={line.value} stroke="red" strokeDasharray="3 3"/>
                        )
                    )
                );
            }
        }
        return null;
    }
    renderArea = () => {
        if(this.props.area){
            return (
                this.props.area.map((line) =>
                    <Area key={line.name} dot={false} type="linear" dataKey={line.name} stroke='none' fill={line.color}/>
                )
            );
        }
    }
    renderLegend=()=>{
        if(this.props.legend){
            return (
                <Legend
                    layout='vertical'
                    payload={this.legend()}
                    wrapperStyle={{
                        top:50,
                        left: 100,
                        float: 'left'
                    }}
                />
            );
        }
    }
    legend=()=>{
        return this.props.legend.map((label) => ({value: label, type: 'line'}));
    }
    render() {return(
        <Div justify="space-around" row margin="25px" width="100%">
            <Div margin="25px" align="center">
                <input style={{display: 'none'}}type="file" id="input-file-pulse" onChange={(event)=>{readFile(event.target.files[0],this.load,this.props.param)}}/>
                <Button variant="outlined" onClick={(e) => document.getElementById("input-file-pulse").click()}>Charger pulse</Button>
                {this.renderInput()}
                <Button width="100%" variant="contained" onClick={()=>{save2png(this.refs.targetimg)}}>Screenshot</Button>
            </Div>
            <Div margin="25px" ref="targetimg" id="targetimg">
                <AreaChart  width={550} height={400} data={this.state.data}
                    margin={{ top: 0, right: 0, left: 0, bottom: 20 }}>
                    <XAxis allowDataOverflow={true} type="number" dataKey="name" domain={this.domain()}
                    label={{ value: this.props.xlabel, offset: -5, position: 'insideBottom' }} ticks={this.ticks()} scale="linear"/>
                    <YAxis hide={false} allowDataOverflow={true} type="number" domain={[0, 1]}
                    label={{ value: this.props.ylabel, angle: -90, position: 'insideLeft' }}/>
                    <CartesianAxis/>
                    {this.renderLegend()}
                    {this.renderReferenceLine()}
                    {this.renderArea()}
                </AreaChart>
            </Div>
        </Div>
    );}
}
export default withRouter(Page);
