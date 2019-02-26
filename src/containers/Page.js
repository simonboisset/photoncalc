import React from 'react';
import {save2png,getData,setData,undefinedRoute,readFile} from 'src/functions';
import {InputAdornment} from '@material-ui/core';
import {Input,Div,Button} from "src/components";
import { withRouter } from 'react-router-dom';
import {Chart} from "src/components";
class Page extends React.Component {
    constructor()
    {
        super();
        this.state={}
    }
    static getDerivedStateFromProps(props, state){
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
        
    }
    componentDidMount(){
        undefinedRoute(this);
    }
    load = (input,Ymin,Ymax)=>{
        let object = this.props.traitement(input,Ymin,Ymax);
        setData(this.props.match.params.id,object);
    }
    saveChange = (object) =>{
        this.setState(object);
        // setData(this.props.match.params.id,object);
    }
    renderInput = () =>{
        return (
            this.props.inputs.map((input) =>
            <Div key={input.value} margin="15px 0 0 0"><Input
                label={input.label}
                type={input.type ? input.type : 'number'}
                value={this.state[input.value]}
                onChange={(e)=>this.setState({[input.value]:e.target.value})}
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
  render() {
    return(
        <Div justify="space-around" row margin="25px" width="100%">
            <Div margin="25px" align="center">
                <input style={{display: 'none'}}type="file" id="input-file-pulse" onChange={(event)=>{readFile(event.target.files[0],this.load,this.props.param)}}/>
                <Button variant="outlined" onClick={(e) => document.getElementById("input-file-pulse").click()}>Charger pulse</Button>
                {this.renderInput()}
                <Button width="100%" variant="contained" onClick={()=>{save2png(this.refs.targetimg)}}>Screenshot</Button>
            </Div>
            <Div margin="25px" ref="targetimg" id="targetimg">
                <Chart 
                    data={this.state} area={[{name: "pulse",color:"blue"},{name: "fit",color:"red"}]}
                    referenceline={[
                    {value:this.state.X_FWHM_min},
                    {value:this.state.X_FWHM_max},
                    {type:"y",value:1/this.state.level},
                    ]}
                    legend={[`Quality : ${this.state.quality}%`,`\u0394t : ${this.state.deltaWL}fs`]}
                    xlabel='Wavelength (nm)' ylabel='Intensity (a.u)'
                />
                <div id="loadImg"></div>
            </Div>
        </Div>
    );
  }
}
export default withRouter(Page);
