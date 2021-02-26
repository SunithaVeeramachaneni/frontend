import {
  container,
  defaultFont,
  primaryColor,
  defaultBoxShadow,
  infoColor,
  successColor,
  warningColor,
  dangerColor,
  whiteColor,
  grayColor
} from "../../material-dashboard-react.js";

const headerStyle = () => ({
  appBar: {
    backgroundColor: "white",
    boxShadow: "none",
    borderBottom: "0",
    marginBottom: "0",
    position: "relative",
    width: "100%",
    paddingTop: "10px",
    zIndex: "1029",
    color: grayColor[7],
    border: "0",
    borderRadius: "3px",
    padding: "3px 0",
    transition: "all 150ms ease 0s",
    minHeight: "50px",
    display: "flex"
  },
  container: {
    ...container,
    minHeight: "50px"
  },
  flex: {
    flex: 1
  },
  title: {
    fontFamily: "Poppins",
    fontWeight: "600",
    fontSize: "20px",
    color: "#000000",
    position:"relative",
    bottom:"5px",
  },
  appResponsive: {
    top: "8px"
  },
  primary: {
    backgroundColor: primaryColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  },
  info: {
    backgroundColor: infoColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  },
  success: {
    backgroundColor: successColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  },
  warning: {
    backgroundColor: warningColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  },
  danger: {
    backgroundColor: dangerColor[0],
    color: whiteColor,
    ...defaultBoxShadow
  }
  
});

export default headerStyle;
