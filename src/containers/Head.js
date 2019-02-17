import React, { Component } from 'react';
import {Button,Header,Div,Title,Icon,Link,Menu,MenuItem,IconButton,Dialog,
  DialogTitle,DialogActions,DialogContent,Slide,Input} from "../components";
import {photonEvent} from "../events";
import hoverstate from 'react-hoverstate';
import { withRouter } from 'react-router-dom';
import {guid} from "../functions";
function Transition(props) {
  return <Slide direction="up" {...props} />;
}
class Head extends Component {
  constructor(){
    super();
    this.state = {
      menu:[],
      toogle:[],
      anchorEl:null,
      customize:false,
      dialog:[false,false],
      rangemenu:0,
      type:"propagation",
      title:""
    }
  }
  componentDidMount(){
    if (hoverstate.state.menu) {
      this.setState({menu:hoverstate.state.menu});
    }
    photonEvent.on('loadmenu', ()=>{
      this.setState({menu:hoverstate.state.menu});
    });
    hoverstate.setState({data:{}});
  }
  addMenu = async () =>{
    let menu = this.state.menu;
    let object = {
      label : this.state.title,
      id : guid(),
      items : []
    };
    menu.push(object);
    this.setState({menu});
    this.handleCloseDialog();
    hoverstate.setState({menu});
  }
  addItem = async () =>{
    let menu = this.state.menu;
    let range = this.state.rangemenu;
    let items = menu[range].items;
    const object = {label : this.state.title, link : `/${this.state.type}`, id:guid()};
    items.push(object);
    menu[range].items = items;
    this.setState({menu});
    this.handleCloseDialog();
    let data = hoverstate.state.data;
    data[object.id]={};
    hoverstate.setState({menu,data});
  }
  removeMenu = async (range) =>{
    let menu = this.state.menu;
    menu.splice(range,1);
    this.setState({menu});
    this.handleClose();
    hoverstate.setState({menu});
  }
  removeItem = async (rangemenu,rangeitem) =>{
    let menu = this.state.menu;
    let items = menu[rangemenu].items;
    items.splice(rangeitem,1);
    menu[rangemenu].items = items;
    this.setState({menu});
    hoverstate.setState({menu});
  }
  handleClick = (id,anchorEl) => {
    this.setState({ anchorEl });
    let toogle =this.state.toogle;
    toogle[id]=true;
    this.setState({toogle});
  };

  handleClose = () => {
    let toogle = {};
    for (let i = 0; i < this.state.menu.length; i++) {
      toogle[i]=false;
    }
    this.setState({toogle});
  };
  clicItem = (link) =>{
    if (!this.state.customize) {
      this.props.history.push(link);
      this.handleClose();
    }
  }
  renderItems = (rangemenu) =>{
    return (
      this.state.menu[rangemenu].items.map((item) =>
        <MenuItem key={item.id} onClick = {()=>this.clicItem(`${item.link}/${item.id}`)}>{item.label}{this.renderCustomizeItems(rangemenu,this.state.menu[rangemenu].items.indexOf(item))}</MenuItem>
      )
    );
  }
  renderHeadMenu = () => {
    return (
      this.state.menu.map((menu) =>
        <Div key={menu.id}>
          <Button onClick={(event)=>this.handleClick(this.state.menu.indexOf(menu),event.currentTarget)}>{menu.label}</Button>
          <Menu
            id={menu.id}
            margin="25px 0 0 0"
            anchorEl={this.state.anchorEl}
            open={Boolean(this.state.toogle[this.state.menu.indexOf(menu)])}
            onClose={this.handleClose}
          >
            {this.renderItems(this.state.menu.indexOf(menu))}
            {this.state.customize ? (<MenuItem onClick={()=>{
              this.handleClickOpen(1);
              this.setState({rangemenu:this.state.menu.indexOf(menu)});
            }}><Icon>add</Icon></MenuItem>) : null}
            {this.state.customize ? (<MenuItem onClick={()=>{this.removeMenu(this.state.menu.indexOf(menu))}}><Icon>delete</Icon></MenuItem>) : null}

          </Menu>
        </Div>
      )
    );
  }
  renderCustomizeItems =(rangemenu,rangeitem)=>{
    if (this.state.customize) {
      return(
        <Div row>
          <IconButton onClick={()=>hoverstate.setState({drawer:true})}><Icon>edit</Icon></IconButton>
          <IconButton onClick={()=>this.removeItem(rangemenu,rangeitem)}><Icon>delete</Icon></IconButton>
        </Div>
      );
    }
  }
  handleClickOpen = (range) => {
    let dialog=[false,false];
    dialog[range] = true;
    this.setState({ dialog });
  }
  handleCloseDialog = () => {
    let dialog = [false,false];
    this.setState({ dialog });
  }
  renderCustomize =()=>{
    if (this.state.customize) {
      return(
        <Div row>
          <IconButton onClick={()=>{this.handleClickOpen(0)}}><Icon>add</Icon></IconButton>
          <IconButton onClick={()=>this.setState({customize:false})}><Icon>done</Icon></IconButton>

        </Div>
      );
    }
    else {
      return(
        <Div>
          <IconButton onClick={()=>this.setState({customize:true})}><Icon>build</Icon></IconButton>
        </Div>
      );
    }
  }
  renderDialog = () => {
    return (
      <Div>
      <Dialog
        open={this.state.dialog[0]}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>this.handleCloseDialog()}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {"Nouvelle étape"}
        </DialogTitle>
        <DialogContent>
          <Div margin="15px 0 0 0"><Input
            label="Titre"
            value={this.state.title}
            onChange={(event)=>this.setState({title:event.target.value})}
            variant="filled"
          /></Div>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>this.handleCloseDialog()} color="secondary">
            Annuler
          </Button>
          <Button onClick={()=>this.addMenu()} color="primary">
            Valider
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={this.state.dialog[1]}
        TransitionComponent={Transition}
        keepMounted
        onClose={()=>this.handleCloseDialog()}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>
          {"Nouvelle mesure"}
        </DialogTitle>
        <DialogContent>
          <Div margin="15px 0 0 0"><Input
            label="Titre"
            value={this.state.title}
            onChange={(event)=>this.setState({title:event.target.value})}
            variant="filled"
          /></Div>
          <Input
            id="filled-select-currency"
            select
            label="Type de mesure"
            value={this.state.type}
            onChange={(event)=>this.setState({type:event.target.value})}
            margin="normal"
            variant="filled"
          >
            <MenuItem key={"propagation"} value={"propagation"}>
              Propagation
            </MenuItem>
            <MenuItem key={"mode"} value={"mode"}>
              Mode
            </MenuItem>
            <MenuItem key={"m2"} value={"m2"}>
              M2
            </MenuItem>
            <MenuItem key={"spectre"} value={"spectre"}>
              Spectre
            </MenuItem>
            <MenuItem key={"rapport"} value={"rapport"}>
              Comparaison Spectre
            </MenuItem>
            <MenuItem key={"autocorrelation"} value={"autocorrelation"}>
              Durée
            </MenuItem>
            <MenuItem key={"puissance"} value={"puissance"}>
              Endurance Puissance
            </MenuItem>
            <MenuItem key={"pointe"} value={"pointe"}>
              Endurance pointé
            </MenuItem>
          </Input>
        </DialogContent>
        <DialogActions>
          <Button onClick={()=>this.handleCloseDialog()} color="secondary">
            Annuler
          </Button>
          <Button onClick={()=>this.addItem()} color="primary">
            Valider
          </Button>
        </DialogActions>
      </Dialog>
      </Div>
    );
  }
  render() {
    return (
      <Header shadow position="fixed">
        <IconButton onClick={()=>hoverstate.setState({drawer:true})}><Icon>save</Icon></IconButton>
        <Link to="/"><Title>Tools</Title></Link>
        <Div/><Div/>
        <Div row align="center">

          {this.renderHeadMenu()}
          {this.renderCustomize()}
          {this.renderDialog()}
        </Div>
      </Header>
    );
  }
}
export default withRouter(Head);
