import {
  drawerWidth,
  transition,
  boxShadow,
  defaultFont,
  primaryColor,
  primaryBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  whiteColor,
  grayColor,
  blackColor,
  hexToRgb
} from "../../material-dashboard-react.js";

const sidebarStyle = theme => ({
  drawerPaper: {
    border: "none",
    position: "fixed",
    top: "0",
    bottom: "0",
    left: "0",
    zIndex: "1",
    width: drawerWidth,
    background:"white",
    [theme.breakpoints.up("md")]: {
      width: drawerWidth,
      position: "fixed",
      height: "100%"
    },
    [theme.breakpoints.down("sm")]: {
      width: drawerWidth,
      ...boxShadow,
      position: "fixed",
      display: "block",
      top: "0",
      height: "100vh",
      right: "auto",
      left: "auto",
      zIndex: "1032",
      visibility: "visible",
      overflowY: "visible",
      borderTop: "none",
      textAlign: "left",
      paddingRight: "0px",
      paddingLeft: "0",
      transform: "none !important",
      transition:"none !important"
    }
  },
  drawerPaperRTL: {
    [theme.breakpoints.up("md")]: {
      left: "auto !important",
      right: "auto !important"
    },
    [theme.breakpoints.down("sm")]: {
      left: "0  !important",
      right: "auto !important"
    }
  },
  logo: {
    position: "relative",
    padding: "15px 15px",
    zIndex: "4",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: "0",

      height: "1px",
      right: "0px",
      width: "100%",
      backgroundColor: "rgba(" + hexToRgb(grayColor[6]) + ", 0.3)"
    }
  },
  logoLink: {
    ...defaultFont,
    textTransform: "uppercase",
    padding: "5px 0",
    display: "block",
    fontSize: "18px",
    textAlign: "left",
    fontWeight: "400",
    lineHeight: "30px",
    textDecoration: "none",
    backgroundColor: "transparent",
    "&,&:hover": {
      color: whiteColor
    }
  },
  logoLinkRTL: {
    textAlign: "right"
  },
  logoImage: {
    width: "30px",
    display: "inline-block",
    maxHeight: "30px",
    marginLeft: "10px",
    marginRight: "15px"
  },
  img: {
    top: "17px",
    position: "absolute",
    verticalAlign: "middle",
    border: "0"
  },
  background: {
    position: "absolute",
    zIndex: "1",
    height: "100%",
    width: "100%",
    display: "block",
    top: "0",
    left: "0",
    backgroundSize: "cover",
    backgroundPosition: "center center",
    "&:after": {
      position: "absolute",
      zIndex: "3",
      width: "100%",
      height: "100%",
      content: '""',
      display: "block",
      background: blackColor,
      opacity: ".8"
    }
  },
  list: {
    marginTop: "10px",
    paddingLeft: "0",
    paddingTop: "0",
    paddingBottom: "0",
    marginBottom: "0",
    listStyle: "none",
    position: "unset",
    overflowY:"scroll",
    height:"475px"
  },
  item: {
    position: "relative",
    display: "block",
    textDecoration: "none",
    "&:hover,&:focus,&:visited,&": {
      color: whiteColor
    }
  },
  itemLink: {
    width: "auto",
    transition: "all 300ms linear",
    marginLeft: "5px",
    position: "relative",
    display: "block",
    padding: "4px",
    backgroundColor: "transparent",
    fontFamily: "Poppins",
    fontWeight: "500",
    fontSize: "12px",
    lineHeight: "27px",
    color: "#9B9B9B"
  },
  itemIcon: {
    width: "20px",
    height: "25px",
    float: "left",
    margin: "4px 10px 0px 10px",
    textAlign: "center",
    verticalAlign: "middle",
    // color: "rgba(" + hexToRgb(whiteColor) + ", 0.8)"
  },
  itemIconRTL: {
    marginRight: "3px",
    marginLeft: "15px",
    float: "right"
  },
  itemText: {
    fontFamily: "Poppins",
  },
  itemTextRTL: {
    textAlign: "right"
  },
  // whiteFont: {
  //   color: whiteColor
  // },
  purple: {
    borderColor: primaryColor[0],
    color: primaryColor[0],
    borderLeft: "5px solid",
    margin: 0,
    fontWeight: "600",
    fontSize: "12px",
    lineHeight: "27px",
    "&:hover,&:focus": {
      cursor: "pointer"
    }
  },
  blue: {
    borderColor: infoColor[0],
    color:infoColor[0],
    borderLeft: "5px solid",
    margin: 0,
    fontWeight: "600",
    fontSize: "12px",
    lineHeight: "27px",
    "&:hover,&:focus": {
      cursor: "pointer"
    }
  },
  green: {
    borderColor: successColor[0],
    color: successColor[0],
    borderLeft: "5px solid",
    margin: 0,
    fontWeight: "600",
    fontSize: "12px",
    lineHeight: "27px",
    "&:hover,&:focus": {
      cursor: "pointer"
    }
  },
  orange: {
    borderColor: warningColor[0],
    color: warningColor[0],
    borderLeft: "5px solid",
    margin: 0,
    fontWeight: "600",
    fontSize: "12px",
    lineHeight: "27px",
    "&:hover,&:focus": {
      cursor: "pointer"
    }
  },
  red: {
    borderColor: dangerColor[0],
    color: dangerColor[0],
    borderLeft: "5px solid",
    margin: 0,
    fontWeight: "600",
    fontSize: "12px",
    lineHeight: "27px",
    "&:hover,&:focus": {
      cursor: "pointer"
    }
  },
  sidebarWrapper: {
    position: "relative",
    height: "calc(100vh - 75px)",
    overflow: "auto",
    width: "260px",
    zIndex: "4",
    overflowScrolling: "touch"
  },
  activePro: {
    [theme.breakpoints.up("md")]: {
      position: "absolute",
      width: "100%",
      bottom: "13px"
    }
  }
});

export default sidebarStyle;
