import React, { Component } from 'react';
import {Div,Body,Footer,Router, Route} from "./components";
import {Head,SlideBar} from "./containers";
import {Home,Autocorrelation,M2,Mode,Propagation,Puissance,RapportSpectre,Spectre,Pointe} from "./pages";
import hoverstate from 'react-hoverstate';
class App extends Component {
  componentDidMount() {
    hoverstate.sync(this);
  }
  render() {
    return (
      <Router onUnload><Div>
        <Head/>
        <SlideBar/>
          <Body>
            <Route exact path="/" component={Home} />
            <Route path="/spectre/:id" component={Spectre} />
            <Route path="/rapport/:id" component={RapportSpectre} />
            <Route path="/propagation/:id" component={Propagation} />
            <Route path="/M2/:id" component={M2} />
            <Route path="/mode/:id" component={Mode} />
            <Route path="/puissance/:id" component={Puissance} />
            <Route path="/pointe/:id" component={Pointe} />
            <Route path="/autocorrelation/:id" component={Autocorrelation} />
          </Body>
        <Footer></Footer>
      </Div></Router>
    );
  }
}
export default App;
