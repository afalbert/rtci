'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './dashboard.routes';

export class DashboardComponent {
  /*@ngInject*/
  constructor($http,$state) {
    this.message = 'Hello';
    this.$http = $http;
    this.$state = $state;
  }

  $onInit(){
    var vizList = ["http://public.tableau.com/views/RegionalSampleWorkbook/Flights",
            "http://public.tableau.com/views/RegionalSampleWorkbook/Obesity",
            "http://public.tableau.com/views/RegionalSampleWorkbook/College",
            "http://public.tableau.com/views/RegionalSampleWorkbook/Stocks",
            "http://public.tableau.com/views/RegionalSampleWorkbook/Storms"];
        
        var viz,
            vizLen = vizList.length,
            vizCount = 0;
        
        function createViz(vizPlusMinus) {
            var vizDiv = document.getElementById("vizContainer"),
                options = {
                    hideTabs: true
                };

            vizCount = vizCount + vizPlusMinus;
            
            if (vizCount >= vizLen) { 
            // Keep the vizCount in the bounds of the array index.
                vizCount = 0;
            } else if (vizCount < 0) {
                vizCount = vizLen - 1;
            }
            
            if (viz) { // If a viz object exists, delete it.
                viz.dispose();
            }

            var vizURL = vizList[vizCount];
            viz = new tableau.Viz(vizDiv, vizURL, options); 
        }

        createViz(3);

        this.$http.get('/api/users/getAssets/Total')
        .then(result => {
            console.log(result);
            this.assetsTotal = result.data[0].count;
            console.log(this.assetsTotal);
        })
        .catch(err => {
            console.log(err);
        })
  }

  viewInventory(){
      this.$state.go('inventory');
  }
}

export default angular.module('rtciApp.dashboard', [uiRouter])
  .config(routes)
  .component('dashboard', {
    template: require('./dashboard.html'),
    controller: DashboardComponent,
    controllerAs: 'dashboardCtrl'
  })
  .name;
