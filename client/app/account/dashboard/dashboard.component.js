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
    var paoul = [];
    var assetCategories = [];
    var assetReplacementCost = [];

    this.$http.get('/api/users/dashboard/totalAssets')
      .then(response => {
        console.log(response.data);
        this.assetsTotal = response.data[0].numvehicles;
      })
      .catch(err => {
        console.log(err);
      })

    this.$http.get('/api/users/dashboard/paoul')
      .then(response => {
        // console.log(response);
        paoul = response.data;
        paoulChart(paoul);

      })
      .catch(err => {
        console.log(err);
      })

    this.$http.get('/api/users/dashboard/assetCategories')
      .then(response => {
        assetCategories = response.data;
        // console.log(assetCategories);
        assetCategoriesChart(assetCategories);
      })
      .catch(err => {
        console.log(err);
      })

      this.$http.get('/api/users/dashboard/assetReplacementCost')
      .then(response => {
        assetReplacementCost = response.data;
        console.log(assetReplacementCost);
        replacementCostChart(assetReplacementCost);
      })
      .catch(err => {
        console.log(err);
      })

    this.$http.get('/api/users/getAssets/assetSummary')
      .then(result => {
        // console.log(result);
        this.assetsSummary = result.data;
        // console.log(this.assetsSummary);

        var test = _.map(this.assetsSummary, 'ModeCode');
        // loadHighCharts(test);
        // console.log(test);
      })
      .catch(err => {
        console.log(err);
      })


    // High Charts

    function paoulChart(data) {
      var categories = [];
      var aboveUsefulLife = [];
      var withinUsefulLife = [];

      console.log(data);

      for (let index = 0; index < data.length; index++) {
        categories.push(data[index].AssetElementDesc);

        aboveUsefulLife.push(data[index].Quantity - data[index].QuantityAboveULB);
        withinUsefulLife.push(data[index].QuantityAboveULB);

      }
      console.log(categories);
      Highcharts.chart('container', {
        chart: {
          type: 'column'
        },
        title: {
          text: ''
        },
        colors: ['#db2929', '#00738C', '#307189', '#910000', '#1aadce',
          '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'
        ],
        xAxis: {
          categories: categories
        },
        yAxis: {
          min: 0,
          title: {
            text: 'Total Percentage (%)'
          }
        },
        tooltip: {
          pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.percentage:.0f}%)<br/>',
          shared: true
        },
        plotOptions: {
          column: {
            stacking: 'percent'
          }
        },
        series: [{
          name: 'Above Useful Life',
          data: withinUsefulLife
        }, {
          name: 'Within Useful Life',
          data: aboveUsefulLife
        }]
      });
    }

    // Pie Chart


    function assetCategoriesChart(data) {
      var assetCategoryData = [];
      console.log(data);

      for (let index = 0; index < data.length; index++) {
        assetCategoryData.push({
          name: data[index].AssetElementDesc,
          y: data[index].Quantity
        })

      }

      // Make monochrome colors


      // Build the chart
      Highcharts.chart('pieChartContainer', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        exporting: {
          enabled: false
        },
        title: {
          text: ''
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            colors: ['#00738C', '#FF6347', '#5993E5', '#DDDF00', '#FFF263', '#FF9655', '#FFF263', '#6AF9C4'],
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
              // distance: -50,
              filter: {
                property: 'total',
                operator: '>',
                value: 4
              }
            }
            // showInLegend: true
          }
        },
        series: [{
          name: 'Asset Categories',
          data: assetCategoryData
        }]
      });
    }

    function replacementCostChart(data) {
      var replacementCost = [];
      console.log('replacement cost', data);

      for (let index = 0; index < data.length; index++) {
        replacementCost.push({
          name: data[index].AssetElementDesc,
          y: data[index].TotalCost
        })

      }

      // Make monochrome colors


      // Build the chart
      Highcharts.chart('pieChart2Container', {
        chart: {
          plotBackgroundColor: null,
          plotBorderWidth: null,
          plotShadow: false,
          type: 'pie'
        },
        exporting: {
          enabled: false
        },
        title: {
          text: ''
        },
        tooltip: {
          pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
        },
        plotOptions: {
          pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            colors: ['#00738C', '#FF6347', '#5993E5', '#DDDF00', '#FFF263', '#FF9655', '#FFF263', '#6AF9C4'],
            dataLabels: {
              enabled: true,
              format: '<b>{point.name}</b><br>{point.percentage:.1f} %',
              // distance: -50,
              filter: {
                property: 'total',
                operator: '>',
                value: 4
              }
            }
            // showInLegend: true
          }
        },
        series: [{
          name: 'Asset Categories',
          data: replacementCost
        }]
      });
    }

    //Electric Vehicles

    //   Highcharts.chart('electricVehiclesContainer', {
    //       chart: {
    //           type: 'bar'
    //       },
    //       title: {
    //           text: 'Fleet Breakdown by Fuel Type'
    //       },
    //       colors: ['#7CFC00', '#629632', '#00738C', '#910000', '#1aadce',
    //       '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'
    //   ],
    //       xAxis: {
    //           categories: ['AC Transit', 'CCCTA', 'Delta Breeze', 'Dixon Readi-Ride', 'ECCTA','FAST','Golden Gate Transit','LAVTA','Marin Transit','NVTA','Petaluma Transit','SamTrans','Santa Rosa Transit','SCT','SF Muni','Solano County Transit','UCT','Vacaville','VTA','WestCAT']
    //       },
    //       yAxis: {
    //           min: 0,
    //           max:100,
    //           title: {
    //               text: 'Fuel Type Percent of Total'
    //           }
    //       },
    //       legend: {
    //           reversed: true
    //       },
    //       plotOptions: {
    //           series: {
    //               stacking: 'normal',
    //               pointWidth:25
    //           }
    //       },
    //       series: [ {
    //           name: 'Zero Emissions',
    //           data: [5, 5, 5, 5, 5,5, 5, 5, 5, 5,5, 5, 5, 5, 5,5, 5, 5, 5, 5]
    //       },{
    //           name: 'Hybrid',
    //           data: [5, 5, 5, 5, 5,5, 5, 5, 5, 5,5, 5, 5, 5, 5,5, 5, 5, 5, 5]
    //       },{
    //           name: 'Diesel/Combustion Fuel',
    //           data: [90, 90, 90, 90, 90,90, 90, 90, 90, 90,90, 90, 90, 90, 90,90, 90, 90, 90, 90]
    //       }]
    //   });

    // End High Charts

    // var vizList = ["http://public.tableau.com/views/RegionalSampleWorkbook/Flights",
    //     "http://public.tableau.com/views/RegionalSampleWorkbook/Obesity",
    //     "http://public.tableau.com/views/RegionalSampleWorkbook/College",
    //     "http://public.tableau.com/views/RegionalSampleWorkbook/Stocks",
    //     "http://public.tableau.com/views/RegionalSampleWorkbook/Storms"
    // ];

    // var viz,
    //     vizLen = vizList.length,
    //     vizCount = 0;

    // function createViz(vizPlusMinus) {
    //     var vizDiv = document.getElementById("vizContainer"),
    //         options = {
    //             hideTabs: true
    //         };

    //     vizCount = vizCount + vizPlusMinus;

    //     if (vizCount >= vizLen) {
    //         // Keep the vizCount in the bounds of the array index.
    //         vizCount = 0;
    //     } else if (vizCount < 0) {
    //         vizCount = vizLen - 1;
    //     }

    //     if (viz) { // If a viz object exists, delete it.
    //         viz.dispose();
    //     }

    //     var vizURL = vizList[vizCount];
    //     viz = new tableau.Viz(vizDiv, vizURL, options);
    // }

    // createViz(3);

    // this.$http.get('/api/users/getAssets/Total')
    //     .then(result => {
    //         console.log(result);
    //         this.assetsTotal = result.data[0].count;
    //         console.log(this.assetsTotal);
    //     })
    //     .catch(err => {
    //         console.log(err);
    //     })
    // this.assetsTotal = 6283;
  }

  viewInventory() {
    this.$state.go('inventory');
  }

  viewTargets() {
    this.$state.go('targets');
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

