import React, { Suspense, lazy } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import Loading from "./Loading";

const Home = lazy(() => import("./pages/Home"));
const Register = lazy(() => import("./pages/Register"));
const Login = lazy(() => import("./pages/Login"));
const Bye = lazy(() => import("./pages/Bye"));

const Routes: React.FC = () => {
  return (
    <BrowserRouter>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/test">Bye</Link>
        <Link to="/">Home</Link>
      </div>
      <Suspense fallback={<Loading />}>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route exact path="/test" component={Bye} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/login" component={Login} />
        </Switch>
      </Suspense>
    </BrowserRouter>
  );
};

export default Routes;
