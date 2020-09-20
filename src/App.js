import React from "react";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";
import { Route, Switch, Redirect, withRouter } from "react-router-dom";

import Historical from "./container/Historical/Historical";
import Live from "./container/Live/Live";

const App = (props) => {
  const { history } = props;
  return (
    <>
      <AppBar position="sticky" color="primary">
        <Toolbar>
          <Typography variant="h6" onClick={() => history.push("/")}>
            Stocks
          </Typography>
          <Button color="inherit" onClick={() => history.push("/live")}>
            Live
          </Button>
        </Toolbar>
      </AppBar>
      <Switch>
        <Route path="/live" component={Live} />
        <Route path="/" excat component={Historical} />
        <Redirect to="/" />
      </Switch>
    </>
  );
};

export default withRouter(App);
