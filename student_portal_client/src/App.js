import React from "react";
import PropTypes from "prop-types";
import { Route } from "react-router-dom";
import { connect } from "react-redux";

import HomePage from "./components/pages/HomePage";
import ConfirmationPage from "./components/pages/ConfirmationPage";
import LoginPage from "./components/pages/LoginPage";
import ForgotPasswordPage from "./components/pages/ForgotPasswordPage";
import ResetPasswordPage from "./components/pages/ResetPasswordPage";
import UserCardParent from "./components/pages/UserCardParent";
import Dashboard from "./components/pages/Dashboard";
import UserRoutes from "./components/routes/UserRoutes";
import GuestRoutes from "./components/routes/GuestRoutes";
import Footer from "./components/navigation/Footer";

const App = ({ location, isAdmin }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      width: "100vw",
      justifyContent: "space-between"
    }}
  >
    <div>
      <Route location={location} path="/" exact component={HomePage} />
      <Route
        location={location}
        path="/user-card"
        exact
        component={UserCardParent}
      />
      <Route
        location={location}
        path="/confirmation/:token"
        exact
        component={ConfirmationPage}
      />
      <GuestRoutes
        location={location}
        path="/login"
        exact
        component={LoginPage}
      />
      <GuestRoutes
        location={location}
        path="/forgot_password"
        exact
        component={ForgotPasswordPage}
      />
      <GuestRoutes
        location={location}
        path="/reset_password/:token"
        exact
        component={ResetPasswordPage}
      />
      <UserRoutes
        path="/dashboard"
        exact
        component={props => (
          <Dashboard
            timestamp={new Date().toString()}
            {...props}
            location={location}
          />
        )}
      />
    </div>
    {!isAdmin ? <Footer /> : null}
  </div>
);

App.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired,
  isAuthenticated: PropTypes.bool.isRequired,
  isAdmin: PropTypes.bool.isRequired
};

function mapStateToProps(state) {
  //console.log("state from App", state.user.isAdmin);
  return {
    isAdmin: !!state.user.isAdmin,
    isAuthenticated: !!state.user.email
  };
}

export default connect(mapStateToProps)(App);
