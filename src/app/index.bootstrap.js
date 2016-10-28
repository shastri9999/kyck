'use strict';
import "angular";
import "angular-ui-router";
import "oclazyload";
import "angular-animate";
import "angular-cookies";
import "angular-touch";
import "angular-sanitize";
import "angular-messages";
import "angular-aria";
import '!!file-loader?name=[name].[ext]!../favicon.ico';
import "./index.module";
import "../assets/styles/sass/index.scss";

angular.element(document).ready(function () {
	angular.bootstrap(document, ['kyck'], {
		strictDi: true
	});
});
