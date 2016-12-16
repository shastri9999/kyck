'use strict';

import blockChainDirective from './blockchain.directive';
import './blockchain.scss';
import './blockchain.responsive.scss';

const blockChainModule = angular.module('blockchain-module', []);
blockChainModule.directive('blockChain', blockChainDirective);

export default blockChainModule;