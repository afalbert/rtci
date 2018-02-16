'use strict';
const angular = require('angular');

const uiRouter = require('angular-ui-router');

import routes from './dashboard.routes';

export class DashboardComponent {
    /*@ngInject*/
    constructor($http, $state) {
        this.message = 'Hello';
        this.$http = $http;
        this.$state = $state;
    }

    $onInit() {

        this.$http.get('/api/users/getAssets/assetSummary')
            .then(result => {
                console.log(result);
                this.assetsSummary = result.data;
                console.log(this.assetsSummary);

                var test = _.map(this.assetsSummary, 'ModeCode');
                loadHighCharts(test);
                console.log(test);
            })
            .catch(err => {
                console.log(err);
            })


        // High Charts

        function loadHighCharts(data) {
            Highcharts.chart('highchartsContainer', {
                chart: {
                    type: 'bar'
                },
                title: {
                    text: 'Stacked bar chart'
                },
                colors: ['#6D9D46', '#8D569B', '#307189', '#910000', '#1aadce',
                    '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'
                ],
                xAxis: {
                    categories: ['Apples', 'Oranges', 'Pears', 'Grapes', 'Bananas']
                },
                yAxis: {
                    min: 0,
                    title: {
                        text: 'Total fruit consumption'
                    }
                },
                legend: {
                    reversed: true
                },
                plotOptions: {
                    series: {
                        stacking: 'normal'
                    }
                },
                series: [{
                    name: 'John',
                    data: [5, 3, 4, 7, 2]
                }, {
                    name: 'Jane',
                    data: [2, 2, 3, 2, 1]
                }, {
                    name: 'Joe',
                    data: [3, 4, 4, 2, 5]
                }]
            });
        }
        // End High Charts

        var vizList = ["http://public.tableau.com/views/RegionalSampleWorkbook/Flights",
            "http://public.tableau.com/views/RegionalSampleWorkbook/Obesity",
            "http://public.tableau.com/views/RegionalSampleWorkbook/College",
            "http://public.tableau.com/views/RegionalSampleWorkbook/Stocks",
            "http://public.tableau.com/views/RegionalSampleWorkbook/Storms"
        ];

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

        // this.$http.get('/api/users/getAssets/Total')
        //     .then(result => {
        //         console.log(result);
        //         this.assetsTotal = result.data[0].count;
        //         console.log(this.assetsTotal);
        //     })
        //     .catch(err => {
        //         console.log(err);
        //     })
        this.assetsTotal = 6283;
    }

    viewInventory() {
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