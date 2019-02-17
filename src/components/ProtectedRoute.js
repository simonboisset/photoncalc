import { Route,Redirect } from "react-router-dom";
import React, { Component } from 'react';
import { connect } from 'react-redux';
class ProtectedRoute extends Component {
  render() {
    return (
      <Route path={this.props.path}
      render={() => (this.props.session ? (this.props.component) :(<Redirect to="/login"/>))}/>
    );
  }
}

function  mapStateToProps(state) {return {session:state.session}};
export default connect(mapStateToProps)(ProtectedRoute);
