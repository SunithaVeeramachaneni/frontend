import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import PerfectScrollbar from "perfect-scrollbar";
import "perfect-scrollbar/css/perfect-scrollbar.css";

import { makeStyles } from "@material-ui/core/styles";

import Navbar from "../components/Navbars/Navbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";
import FixedPlugin from "../components/FixedPlugin/FixedPlugin.js";

import routes from "../routes.js";

import styles from "../assets/jss/material-dashboard-react/layouts/adminStyle.js";


import logo from "../assets/img/innovapptive-logo.svg";

let ps;

const switchRoutes = (
  <Switch>
    {routes.map((prop, key) => {
      if (prop.layout === "/admin") {
        return (
          <Route
            path={prop.layout + prop.path}
            component={prop.component}
            key={key}
          />
        );
      }
      return null;
    })}
    <Redirect from="/admin" to="/admin/dashboard" />
  </Switch>
);

const useStyles = makeStyles(styles);

export default function Admin({ ...rest }) {
  const classes = useStyles();
  const mainPanel = React.createRef();
  const [color, setColor] = React.useState("blue");
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const handleColorClick = color => {
    setColor(color);
  };
  const handleFixedClick = () => {
    if (fixedClasses === "dropdown") {
      setFixedClasses("dropdown show");
    } else {
      setFixedClasses("dropdown");
    }
  };
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  const getRoute = () => {
    return window.location.pathname !== "/admin/maps";
  };
  const resizeFunction = () => {
    if (window.innerWidth >= 960) {
      setMobileOpen(false);
    }
  };
  React.useEffect(() => {
    if (navigator.platform.indexOf("Win") > -1) {
      ps = new PerfectScrollbar(mainPanel.current, {
        suppressScrollX: true,
        suppressScrollY: false
      });
      document.body.style.overflow = "hidden";
    }
    window.addEventListener("resize", resizeFunction);
    return function cleanup() {
      if (navigator.platform.indexOf("Win") > -1) {
        ps.destroy();
      }
      window.removeEventListener("resize", resizeFunction);
    };
  }, [mainPanel]);
  return (
    <div className={classes.wrapper}>
      <Sidebar
        routes={routes}
        logo={logo}
        handleDrawerToggle={handleDrawerToggle}
        open={mobileOpen}
        color={color}
        {...rest}
      />
          <div className={classes.mainPanel} ref={mainPanel}>
         <Navbar
           routes={routes}
           handleDrawerToggle={handleDrawerToggle}
           {...rest}
       />
         {getRoute() ? (
           <div className={classes.content}>
             <div className={classes.container}>{switchRoutes}</div>
           </div>
         ) : (
           <div className={classes.map}>{switchRoutes}</div>
         )}
         <FixedPlugin
           handleColorClick={handleColorClick}
          bgColor={color}
          handleFixedClick={handleFixedClick}
          fixedClasses={fixedClasses}
        />
      </div>
    </div>
  );
}
