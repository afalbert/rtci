'use strict';

import angular from 'angular';
// import ngAnimate from 'angular-animate';
import ngCookies from 'angular-cookies';
import ngResource from 'angular-resource';
import ngSanitize from 'angular-sanitize';


import uiRouter from 'angular-ui-router';

import 'angular-validation-match';
import smartTable from 'angular-smart-table';
// import uiGrid from 'angular-ui-grid';

import {
    routeConfig
} from './app.config';

import _Auth from '../components/auth/auth.module';
import account from './account';
import admin from './admin';
import navbar from '../components/navbar/navbar.component';
import footer from '../components/footer/footer.component';
import main from './main/main.component';
import feedback from './feedback/feedback.component';
import about from './about/about.component';
import contact from './contact/contact.component';
import dashboard from './account/dashboard/dashboard.component';
import inventory from './account/inventory/inventory.component';
import myaccount from './account/myaccount/myaccount.component';
import targets from './account/targets/targets.component';
import ulb from './account/ulb/ulb.component';
import reports from './account/reports/reports.component';
import constants from './app.constants';
import util from '../components/util/util.module';
// import ngMask from './../assets/js/ngMask-min';

import './app.scss';

angular.module('rtciApp', [ngCookies, ngResource, ngSanitize, uiRouter, _Auth, account, admin,
        'validation.match', navbar, footer, main, feedback,about, contact, dashboard, inventory, myaccount,targets,ulb, reports, smartTable, constants, util
    ])
    .config(routeConfig)
    .run(function($rootScope, $location, Auth) {
        'ngInject';
        // Redirect to login if route requires auth and you're not logged in

        $rootScope.$on('$stateChangeStart', function(event, next) {
            Auth.isLoggedIn(function(loggedIn) {
                if (next.authenticate && !loggedIn) {
                    $location.path('/login');
                }
            });
        });
    });

angular.element(document)
    .ready(() => {
        angular.bootstrap(document, ['rtciApp'], {
            strictDi: true
        });
    });