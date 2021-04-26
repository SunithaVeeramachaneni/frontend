(window["webpackJsonp"] = window["webpackJsonp"] || []).push([["components-usedcars-usedcars-module"],{

/***/ "erRE":
/*!****************************************************************!*\
  !*** ./src/app/components/usedcars/usedcars-routing.module.ts ***!
  \****************************************************************/
/*! exports provided: UsedcarsPageRoutingModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UsedcarsPageRoutingModule", function() { return UsedcarsPageRoutingModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_router__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/router */ "tyNb");
/* harmony import */ var _usedcars_page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./usedcars.page */ "udYL");




const routes = [
    {
        path: '',
        component: _usedcars_page__WEBPACK_IMPORTED_MODULE_3__["UsedcarsPage"]
    }
];
let UsedcarsPageRoutingModule = class UsedcarsPageRoutingModule {
};
UsedcarsPageRoutingModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"].forChild(routes)],
        exports: [_angular_router__WEBPACK_IMPORTED_MODULE_2__["RouterModule"]],
    })
], UsedcarsPageRoutingModule);



/***/ }),

/***/ "fswK":
/*!********************************************************!*\
  !*** ./src/app/components/usedcars/usedcars.module.ts ***!
  \********************************************************/
/*! exports provided: UsedcarsPageModule */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UsedcarsPageModule", function() { return UsedcarsPageModule; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @angular/common */ "ofXK");
/* harmony import */ var _angular_forms__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/forms */ "3Pt+");
/* harmony import */ var _ionic_angular__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @ionic/angular */ "TEn/");
/* harmony import */ var _usedcars_routing_module__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./usedcars-routing.module */ "erRE");
/* harmony import */ var _usedcars_page__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./usedcars.page */ "udYL");







let UsedcarsPageModule = class UsedcarsPageModule {
};
UsedcarsPageModule = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_1__["NgModule"])({
        imports: [
            _angular_common__WEBPACK_IMPORTED_MODULE_2__["CommonModule"],
            _angular_forms__WEBPACK_IMPORTED_MODULE_3__["FormsModule"],
            _ionic_angular__WEBPACK_IMPORTED_MODULE_4__["IonicModule"],
            _usedcars_routing_module__WEBPACK_IMPORTED_MODULE_5__["UsedcarsPageRoutingModule"]
        ],
        declarations: [_usedcars_page__WEBPACK_IMPORTED_MODULE_6__["UsedcarsPage"]]
    })
], UsedcarsPageModule);



/***/ }),

/***/ "hUBB":
/*!********************************************************!*\
  !*** ./src/app/components/usedcars/usedcars.page.scss ***!
  \********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".welcome-card img {\n  max-height: 35vh;\n  overflow: hidden;\n}\n\n.padding {\n  padding: 1em;\n}\n\n.user-icon {\n  width: 45px;\n  float: right;\n  margin-right: 15px;\n  cursor: pointer;\n}\n\n.nav-header {\n  display: flex;\n}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uXFwuLlxcLi5cXC4uXFx1c2VkY2Fycy5wYWdlLnNjc3MiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7RUFDRSxnQkFBQTtFQUNBLGdCQUFBO0FBQ0Y7O0FBQ0E7RUFDRSxZQUFBO0FBRUY7O0FBQUE7RUFDRSxXQUFBO0VBQ0EsWUFBQTtFQUNBLGtCQUFBO0VBQ0EsZUFBQTtBQUdGOztBQUFBO0VBQ0UsYUFBQTtBQUdGIiwiZmlsZSI6InVzZWRjYXJzLnBhZ2Uuc2NzcyIsInNvdXJjZXNDb250ZW50IjpbIi53ZWxjb21lLWNhcmQgaW1nIHtcclxuICBtYXgtaGVpZ2h0OiAzNXZoO1xyXG4gIG92ZXJmbG93OiBoaWRkZW47XHJcbn1cclxuLnBhZGRpbmcge1xyXG4gIHBhZGRpbmc6IDFlbTtcclxufVxyXG4udXNlci1pY29uIHtcclxuICB3aWR0aDogNDVweDtcclxuICBmbG9hdDogcmlnaHQ7XHJcbiAgbWFyZ2luLXJpZ2h0OiAxNXB4O1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxufVxyXG5cclxuLm5hdi1oZWFkZXJ7XHJcbiAgZGlzcGxheTogZmxleDtcclxufVxyXG4iXX0= */");

/***/ }),

/***/ "n4VB":
/*!**********************************************************************************************!*\
  !*** ./node_modules/raw-loader/dist/cjs.js!./src/app/components/usedcars/usedcars.page.html ***!
  \**********************************************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<ion-header className=\"nav-header\">\n  <ion-toolbar>\n    <ion-menu-button slot=\"start\"></ion-menu-button>\n    <ion-title>DASHBOARD</ion-title>\n    <ion-buttons slot=\"secondary\">\n      <ion-button fill=\"solid\">\n        <ion-icon slot=\"start\" name=\"person-circle\"></ion-icon>\n        Contact\n      </ion-button>\n    </ion-buttons>\n    <ion-buttons slot=\"primary\">\n      <ion-button fill=\"solid\" color=\"secondary\">\n        Help\n        <ion-icon slot=\"end\" name=\"help-circle\"></ion-icon>\n      </ion-button>\n    </ion-buttons>\n  </ion-toolbar>\n</ion-header>\n\n<ion-content [fullscreen]=\"true\">\n  <ion-button (click)=\"runHttp()\">run http</ion-button>\n  <table class=\"table\">\n    <thead>\n      <tr>\n        <th scope=\"col\">id</th>\n        <th scope=\"col\">vin</th>\n        <th scope=\"col\">body_type</th>\n        <th scope=\"col\">model</th>\n        <th scope=\"col\">make</th>\n      </tr>\n    </thead>\n    <tbody>\n      <tr *ngFor=\"let car of cars\">\n        <td>{{ car.vin }}</td>\n        <td>{{ car.make }}</td>\n        <td>{{ car.model }}</td>\n\n        <td style=\"display: flex\">\n          <ion-button color=\"warning\" size=\"small\" routerLink='/cars/{{car.id}}'>\n            <ion-icon name=\"create\"></ion-icon>\n          </ion-button>\n          <ion-button color=\"danger\" size=\"small\" >\n            <ion-icon name=\"trash\"></ion-icon>\n          </ion-button>\n        </td>\n      </tr>\n    </tbody>\n  </table>\n</ion-content>\n");

/***/ }),

/***/ "udYL":
/*!******************************************************!*\
  !*** ./src/app/components/usedcars/usedcars.page.ts ***!
  \******************************************************/
/*! exports provided: UsedcarsPage */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "UsedcarsPage", function() { return UsedcarsPage; });
/* harmony import */ var tslib__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! tslib */ "mrSG");
/* harmony import */ var _raw_loader_usedcars_page_html__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! raw-loader!./usedcars.page.html */ "n4VB");
/* harmony import */ var _usedcars_page_scss__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./usedcars.page.scss */ "hUBB");
/* harmony import */ var _angular_core__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @angular/core */ "fXoL");
/* harmony import */ var _angular_common_http__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @angular/common/http */ "tk/3");





let UsedcarsPage = class UsedcarsPage {
    constructor(http) {
        this.http = http;
    }
    runHttp() {
        this.http.get('https://invamdemo-dbapi.innovapptive.com/cars')
            .subscribe(response => {
            console.log(response);
            if (Object.keys(response).length) {
                this.cars = response.usedcars ? response.usedcars : [];
                console.log(this.cars);
            }
        });
    }
    ngOnInit() {
    }
};
UsedcarsPage.ctorParameters = () => [
    { type: _angular_common_http__WEBPACK_IMPORTED_MODULE_4__["HttpClient"] }
];
UsedcarsPage = Object(tslib__WEBPACK_IMPORTED_MODULE_0__["__decorate"])([
    Object(_angular_core__WEBPACK_IMPORTED_MODULE_3__["Component"])({
        selector: 'app-usedcars',
        template: _raw_loader_usedcars_page_html__WEBPACK_IMPORTED_MODULE_1__["default"],
        styles: [_usedcars_page_scss__WEBPACK_IMPORTED_MODULE_2__["default"]]
    })
], UsedcarsPage);



/***/ })

}]);
//# sourceMappingURL=components-usedcars-usedcars-module.js.map