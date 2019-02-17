import React, { Component } from 'react';
import {Button,IconButton,Icon,Div,Input,List,ListItem,ListItemText,
  ListItemSecondaryAction,Dialog,DialogActions,DialogContent,DialogTitle,Slide} from "../components";
import Drawer from '@material-ui/core/Drawer';
import {guid} from "../functions";
import {photonEvent} from "../events";
import { withRouter } from 'react-router-dom';
import hoverstate from 'react-hoverstate';
function Transition(props) {
  return <Slide direction="up" {...props} />;
}
class SlideBar extends Component {
  constructor()
  {
    super();
    this.state={
      savelist:[],
      open : false,
      title:"",
      system:""
    }
  }
  componentDidMount(){
    let photon = JSON.parse(localStorage.getItem("photon"));
    if (photon===null) {
      photon = {save:[]};
      photon = JSON.stringify(photon);
      localStorage.setItem("photon",photon);
    }
    let savelist = JSON.parse(localStorage.getItem("photon")).save;
    this.setState({savelist});
  }
  refresh=()=>{
    let savelist = JSON.parse(localStorage.getItem("photon")).save;
    this.setState({savelist});
  }
  saveAs = () => {
    if (hoverstate.state.id) {
      let photon = JSON.parse(localStorage.getItem("photon"));
      for (let i = 0; i < photon.save.length; i++) {
        if (photon.save[i].id===hoverstate.state.id) {
          photon.save[i].data=hoverstate.state.data;
          photon.save[i].menu=hoverstate.state.menu;
        }
      }
      console.log(photon);
      photon = JSON.stringify(photon);
      localStorage.setItem("photon",photon);
    } else {
      this.handleClickOpen();
    }
  }
  saveNew = (title,system) => {
    let photon = JSON.parse(localStorage.getItem("photon"));
    let save = {};
    save.data=hoverstate.state.data;
    save.title=title;
    save.system=system;
    save.id = guid();
    save.menu = hoverstate.state.menu;
    photon.save.push(save);
    photon = JSON.stringify(photon);
    localStorage.setItem("photon",photon);
    this.refresh();
    this.handleClose();
  }
  handleClickOpen = () => {
    let open=true;
    this.setState({ open });
  }
  handleClose = () => {
    let open = false;
    this.setState({ open });
  }
  load = async (range) => {
    let save = JSON.parse(localStorage.getItem("photon")).save[range];
    // window.location.assign(window.location.origin);
    this.props.history.push('/');
    hoverstate.setState({id:save.id,data:save.data,menu:save.menu});
    // download(save);
    photonEvent.emit('loaddata');
    photonEvent.emit('loadmenu');
  }
  remove = (range) => {
    let savelist = JSON.parse(localStorage.getItem("photon"));
    savelist.save.splice(range,1);
    let photon = JSON.stringify(savelist)
    localStorage.setItem("photon",photon);
    this.refresh();
  }
  renderSaveList = () =>{
    return (
      this.state.savelist.map((save) =>
        <ListItem key={guid()} button margin="15px" width="200px" onClick={()=>this.load(this.state.savelist.indexOf(save))}>
          <Div width="100%"><ListItemText primary={save.title} secondary={save.system}/></Div>
          <ListItemSecondaryAction>
            <IconButton onClick={()=>this.remove(this.state.savelist.indexOf(save))}><Icon>delete</Icon></IconButton>
          </ListItemSecondaryAction>
        </ListItem>
      )
    );
  }
  render() {
    return (
      <Drawer open={hoverstate.state.drawer} onClose={()=>hoverstate.setState({drawer:false})}>
        <List>
          {this.renderSaveList()}
        </List>
        <Button width="100%" color="primary" onClick={()=>{this.saveAs()}}>Sauvegarder</Button>
        <Dialog
          open={this.state.open}
          TransitionComponent={Transition}
          keepMounted
          onClose={()=>this.handleClose()}
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>
            {"Nouvelle sauvegarde"}
          </DialogTitle>
          <DialogContent>

            <Div margin="15px 0 0 0"><Input
              label="Titre"
              value={this.state.title}
              onChange={(event)=>this.setState({title:event.target.value})}
              variant="filled"
            /></Div>
            <Div margin="15px 0 0 0"><Input
              label="System"
              value={this.state.system}
              onChange={(event)=>this.setState({system:event.target.value})}
              variant="filled"
            /></Div>
          </DialogContent>
          <DialogActions>
            <Button onClick={()=>this.handleClose()} color="secondary">
              Annuler
            </Button>
            <Button onClick={()=>this.saveNew(this.state.title,this.state.system)} color="primary">
              Valider
            </Button>
          </DialogActions>
        </Dialog>
      </Drawer>
    );
  }
}
export default withRouter(SlideBar);
