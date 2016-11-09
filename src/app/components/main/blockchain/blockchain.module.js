'use strict';

import directive from './blockchain.directive';
import './blockchain.scss';

const blockChainModule = angular.module('block-chain-module', []);
blockChainModule.directive('blockChain', directive);

export default blockChainModule;