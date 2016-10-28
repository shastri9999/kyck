'use strict';

import * as components from './index.components';
import config from './index.config';
import run from './index.run';
import uiRouter from 'angular-ui-router';
import CoreModules from './core/core.module';
import Components from './index.components';

const App = angular.module(
  "kyck", [
    uiRouter,
    "ngAnimate", 
	"ngCookies", 
	"ngTouch", 
	"ngSanitize", 
	"ngMessages", 
	"ngAria", 
	"oc.lazyLoad",
  CoreModules.name,
  Components.name,
  require("./index.routes").name,

    // pages
    require("./pages/main/main.module").name

  ]
);

App
  .config(config)
  .run(run);



export default App;
