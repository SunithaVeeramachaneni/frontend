/*eslint-disable*/
import React, { Component } from "react";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// nodejs library that concatenates classes
import classnames from "classnames";

import Button from '@material-ui/core/Button';

import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

export default function FixedPlugin(props) {
  const [classes, setClasses] = React.useState("dropdown show");
  const [bg_checked, setBg_checked] = React.useState(true);
  const [bgImage, setBgImage] = React.useState(props.bgImage);
  const handleClick = () => {
    props.handleFixedClick();
  };
  return (
    <div
      className={classnames("fixed-plugin", {
        "rtl-fixed-plugin": props.rtlActive
      })}
    >
      <div id="fixedPluginClasses" className={props.fixedClasses}>
        <select onChange={e =>  props.handleColorClick(e.target.value)}>
          <option value="">Themes</option>
          <option className={
                    props.bgColor === "purple"
                      ? "badge filter badge-purple active"
                      : "badge filter badge-purple"
                  }
                  value="purple">Purple</option>
          <option className={
                    props.bgColor === "blue"
                      ? "badge filter badge-blue active"
                      : "badge filter badge-blue"
                  }
                  value="blue">Blue</option>
          <option className={
                    props.bgColor === "green"
                      ? "badge filter badge-green active"
                      : "badge filter badge-green"
                  }
                 value="green">Green</option>
          <option className={
                    props.bgColor === "red"
                      ? "badge filter badge-red active"
                      : "badge filter badge-red"
                  }
                  value="red">Red</option>
          <option className={
                    props.bgColor === "orange"
                      ? "badge filter badge-orange active"
                      : "badge filter badge-orange"
                  }
                  value="orange">Orange</option>
        </select>
        {/* <select onChange={e =>  props.handleColorClick(e.target.value)}>
          <option>Themes</option>
          <option className={
                    props.bgColor === "purple"
                      ? "badge filter badge-purple active"
                      : "badge filter badge-purple"
                  }
                  value="purple"> Purple</option>
          <option className={
                    props.bgColor === "blue"
                      ? "badge filter badge-blue active"
                      : "badge filter badge-blue"
                  }
                  value="blue">blue</option>
          <option className={
                    props.bgColor === "green"
                      ? "badge filter badge-green active"
                      : "badge filter badge-green"
                  }
                 value="green">green</option>
          <option className={
                    props.bgColor === "red"
                      ? "badge filter badge-red active"
                      : "badge filter badge-red"
                  }
                  data-color="red">red</option>
          <option className={
                    props.bgColor === "orange"
                      ? "badge filter badge-orange active"
                      : "badge filter badge-orange"
                  }
                  value="orange">orange</option>
        </select> */}
        {/* <ul className="dropdown-menu">
          <li className="header-title">SIDEBAR FILTERS</li>
          <li className="adjustments-line">
            <a className="switch-trigger">
              <div>
                <span
                  className={
                    props.bgColor === "purple"
                      ? "badge filter badge-purple active"
                      : "badge filter badge-purple"
                  }
                  data-color="purple"
                  onClick={() => {
                    props.handleColorClick("purple");
                  }}
                />
                <span
                  className={
                    props.bgColor === "blue"
                      ? "badge filter badge-blue active"
                      : "badge filter badge-blue"
                  }
                  data-color="blue"
                  onClick={() => {
                    props.handleColorClick("blue");
                  }}
                />
                <span
                  className={
                    props.bgColor === "green"
                      ? "badge filter badge-green active"
                      : "badge filter badge-green"
                  }
                  data-color="green"
                  onClick={() => {
                    props.handleColorClick("green");
                  }}
                />
                <span
                  className={
                    props.bgColor === "red"
                      ? "badge filter badge-red active"
                      : "badge filter badge-red"
                  }
                  data-color="red"
                  onClick={() => {
                    props.handleColorClick("red");
                  }}
                />
                <span
                  className={
                    props.bgColor === "orange"
                      ? "badge filter badge-orange active"
                      : "badge filter badge-orange"
                  }
                  data-color="orange"
                  onClick={() => {
                    props.handleColorClick("orange");
                  }}
                />
              </div>
            </a>
          </li>
        </ul>
       */}
      </div>
    </div>
  );
}

FixedPlugin.propTypes = {
  bgImage: PropTypes.string,
  handleFixedClick: PropTypes.func,
  rtlActive: PropTypes.bool,
  fixedClasses: PropTypes.string,
  bgColor: PropTypes.oneOf(["purple", "blue", "green", "orange", "red"]),
  handleColorClick: PropTypes.func,
  handleImageClick: PropTypes.func
};
