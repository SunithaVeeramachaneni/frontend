import {
  defaultFont,
  dangerColor,
  whiteColor
} from "../../material-dashboard-react.js";

import dropdownStyle from "../../material-dashboard-react/dropdownStyle.js";

const headerLinksStyle = theme => ({
  ...dropdownStyle(theme),
  search: {    "& > div": {
      marginTop: "0"
    },
    [theme.breakpoints.down("sm")]: {
      margin: "10px 15px !important",
      float: "none !important",
      paddingTop: "1px",
      paddingBottom: "1px",
      padding: "0!important",
      width: "60%",
      marginTop: "40px",
      "& input": {
        color: whiteColor
      }
    }
  },
  linkText: {
    zIndex: "4",
    ...defaultFont,
    fontSize: "14px",
    margin: "0px"
  },
  buttonLink: {
    [theme.breakpoints.down("sm")]: {
      display: "flex",
      margin:"0",
      padding:"0",
      width: "60px",
      "& svg": {
        width: "24px",
        height: "30px",
      },
      "& .fab,& .fas,& .far,& .fal,& .material-icons": {
        fontSize: "24px",
        lineHeight: "30px",
        width: "24px",
        height: "30px"
      },
      "& > span": {
        justifyContent: "flex-start",
        width: "100%"
      }
    }
  },
  searchButton: {
    [theme.breakpoints.down("sm")]: {
      top: "-50px !important",
      marginRight: "22px",
      float: "right"
    }
  },
  margin: {
    zIndex: "4",
    margin: "0"
  },
  searchIcon: {
    width: "17px",
    zIndex: "4"
  },
  notifications: {
    zIndex: "4",
    [theme.breakpoints.up("md")]: {
      position: "absolute",
      top: "2px",
      border: "1px solid " + whiteColor,
      right: "4px",
      fontSize: "9px",
      background: dangerColor[0],
      color: whiteColor,
      minWidth: "16px",
      height: "16px",
      borderRadius: "10px",
      textAlign: "center",
      lineHeight: "16px",
      verticalAlign: "middle",
      display: "block"
    },
    [theme.breakpoints.down("sm")]: {
      ...defaultFont,
      fontSize: "14px",
      marginRight: "8px"
    }
  },
  manager: {
    [theme.breakpoints.down("sm")]: {
      width: "auto !important"
    },
    display: "inline-flex",
    float:"right",
    marginBottom:"4px"
  },
  searchWrapper: {
    [theme.breakpoints.down("sm")]: {
      width: "250px",
    },
    display: "inline-block",
  },
  searchInput: {
    borderRadius:"35px",
    height:"42px"
  },
  signedUser : {
    whiteSpace: "nowrap",
    marginBottom: "-7px",
    marginTop: "5px",
    fontFamily: "Poppins",
    fontWeight: "600",
    fontSize: "12px",
    textAlign: "right",
    color: "#000000"
  },
  signedUserDesignation : {
    fontFamily: "Poppins",
    fontWeight: "600",
    fontSize: "10px",
    textAlign: "right",
    whiteSpace: "nowrap",
    color: "#8F8F8F"
  },
  usericon : {
    width: "40px"
  },
  languageDropdown: {
    width: "115px",
    height: "40px",
    border: "1px solid #C4C4C4",
    borderRadius: "10px",
    margin: "2px 10px 0 10px",
    paddingLeft: "10px"
  }

});

export default headerLinksStyle;
