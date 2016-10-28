'use strict';

import '!!file-loader?name=[name].[ext]!../favicon.ico';
import "./index.module";
import "../assets/styles/sass/index.scss";

angular.element(document).ready(function () {
	angular.bootstrap(document, ['kyck'], {
		strictDi: true
	});
});
