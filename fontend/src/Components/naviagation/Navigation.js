


import React from 'react'
import Login from '../login/Login'
import Signup from '../signup/SignUp'
import Dashboard from '../dashboard/Dashboard'
import Home from "../home/Home";
import AddShopCard from '../admin/AddShopCard'
import AppRoute from '../routes/AppRouting'
import Allorders from '../admin/Allorders'
import { UseGlobalState, UseGlobalStateUpdate } from "../../context/context"


import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";


function Navigation() {

  const globalState = UseGlobalState();
  const setGlobalState = UseGlobalStateUpdate()




  return (
    <>
      <Router>
        <AppRoute />
        {globalState.role === null ?
          <>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </>
          : null}
        {globalState.role === "user" ?
          <>
            <Route exact path="/">
              <Dashboard />
            </Route>
            <Route  path="*">
              <Redirect to="/" />
            </Route>
          </>
          : null}
        {globalState.role === "admin" ?
          <>
            <Route path="/AddShopCard">
              <AddShopCard />
            </Route>
            <Route exact path="/">
              <Allorders />
            </Route>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </>

          : null}
      </Router>
    </>
  )
}


export default Navigation;

