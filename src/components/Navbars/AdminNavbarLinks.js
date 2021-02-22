import React from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import Grow from "@material-ui/core/Grow";
import Paper from "@material-ui/core/Paper";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Hidden from "@material-ui/core/Hidden";
import Poppers from "@material-ui/core/Popper";
import Divider from "@material-ui/core/Divider";
import Button from '@material-ui/core/Button';

// @material-ui/icons
import Person from "@material-ui/icons/Person";
import Notifications from "@material-ui/icons/Notifications";
import Dashboard from "@material-ui/icons/Dashboard";
import Search from "@material-ui/icons/Search";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
// core components
import styles from "../../assets/jss/material-dashboard-react/components/headerLinksStyle.js";

import {Home} from "../../pages/Home";
import FixedPlugin from "../FixedPlugin/FixedPlugin.js";
import { withTranslation, Trans } from "react-i18next";
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

const useStyles = makeStyles(styles);

function AdminNavbarLinks(props) {
  const classes = useStyles();
  const [openNotification, setOpenNotification] = React.useState(null);
  const [openProfile, setOpenProfile] = React.useState(null);
  const [color, setColor] = React.useState("blue");
  const [fixedClasses, setFixedClasses] = React.useState("dropdown");
  const handleClickNotification = event => {
    if (openNotification && openNotification.contains(event.target)) {
      setOpenNotification(null);
    } else {
      setOpenNotification(event.currentTarget);
    }
  };
  const handleCloseNotification = () => {
    setOpenNotification(null);
  };
  const handleClickProfile = event => {
    if (openProfile && openProfile.contains(event.target)) {
      setOpenProfile(null);
    } else {
      setOpenProfile(event.currentTarget);
    }
  };
  const handleCloseProfile = () => {
    setOpenProfile(null);
  };
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

  const logout = () => {
    localStorage.clear();
  }

  const { t } = props;
  const handleChange = event => {
      let newlang = event.target.value;
      props.i18n.changeLanguage(newlang);
    }
  return (
      <div className={classes.manager}>
        <FormControl variant="outlined" className={classes.formControl}>
            <InputLabel id="language-translator">Language</InputLabel>
            <Select labelId="language-translator" id="language-translator"
                    onChange={handleChange} label="Language">
              <MenuItem value="en">English</MenuItem>
              <MenuItem value="jap">Japnese</MenuItem>
              <MenuItem value="hin">Hindi</MenuItem>
              <MenuItem value="fre">French</MenuItem>
              <MenuItem value="ger">German</MenuItem>
            </Select>
        </FormControl>
        <Trans>
           <p>{t("title")}</p>
        </Trans>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={handleClickProfile}
          className={classes.buttonLink}
        >
          <Person className={classes.icons} />
          {/* <Hidden mdUp implementation="css">
            <p className={classes.linkText}>Profile</p>
          </Hidden> */}
        </Button>
        <Poppers
          open={Boolean(openProfile)}
          anchorEl={openProfile}
          transition
          disablePortal
          className={
            classNames({ [classes.popperClose]: !openProfile }) +
            " " +
            classes.popperNav
          }
        >
          {({ TransitionProps, placement }) => (
            <Grow
              {...TransitionProps}
              id="profile-menu-list-grow"
              style={{
                transformOrigin:
                  placement === "bottom" ? "center top" : "center bottom"
              }}
            >
              <Paper>
                <ClickAwayListener onClickAway={handleCloseProfile}>
                  <MenuList role="menu">
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      Profile
                    </MenuItem>
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      Settings
                    </MenuItem>
                    <Divider light />
                    <MenuItem
                      onClick={handleCloseProfile}
                      className={classes.dropdownItem}
                    >
                      Logout
                    </MenuItem>
                  </MenuList>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Poppers>
        <Button
          color={window.innerWidth > 959 ? "transparent" : "white"}
          justIcon={window.innerWidth > 959}
          simple={!(window.innerWidth > 959)}
          aria-owns={openProfile ? "profile-menu-list-grow" : null}
          aria-haspopup="true"
          onClick={logout}
          className={classes.buttonLink}
        >
          <ExitToAppIcon className={classes.icons} />
        </Button>
      </div>
  );
}

export default (withTranslation("translations")(AdminNavbarLinks));
