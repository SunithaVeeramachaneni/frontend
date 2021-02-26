import {
  defaultFont,
  container,
  primaryColor,
  grayColor
} from "../../material-dashboard-react.js";

const footerStyle = {
  block: {
    color: "inherit",
    padding: "15px",
    textTransform: "uppercase",
    borderRadius: "3px",
    textDecoration: "none",
    position: "relative",
    display: "block",
    ...defaultFont,
    fontWeight: "500",
    fontSize: "12px"
  },
  left: {
    float: "left!important",
    display: "block"
  },
  right: {
    padding: "0",
    margin: "0",
    fontSize: "14px",
    float: "right!important"
  },
  footerText:{
    fontFamily: "Poppins",
    fontWeight: "600",
    fontSize: "10px",
    lineHeight: "24px",
    color: "#9B9B9B",
    marginBottom:"-5px"
  },
  footerlogo : {
    width: "140px",
    position: "relative",
    top: "10px",
    left: "10px",
    marginTop:"-5px"
  },
  footer: {
    bottom: "0",
    borderTop: "1px solid " + grayColor[11],
    padding: "0",
    ...defaultFont
  },
  container,
  a: {
    color: primaryColor,
    textDecoration: "none",
    backgroundColor: "transparent"
  },
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0"
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0px",
    width: "auto"
  },
  poweredby : {
    position:"relative",
    top:"7px"
  }
};
export default footerStyle;
