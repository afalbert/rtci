import angular from 'angular';
import uiRouter from 'angular-ui-router';
import routing from './main.routes';

export class MainController {
  $http;

  awesomeThings = [];
  newThing = '';

  /*@ngInject*/
  constructor($http) {
    this.$http = $http;
  }

  $onInit() {
    // JQUERY Functions

    Highcharts.chart('container', {
      chart: {
        type: 'column'
      },
      title: {
        text: 'Percent of Revenue Vehicles Above Useful Life'
      },
      colors: ['#db2929', '#00738C', '#307189', '#910000', '#1aadce',
        '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'
      ],
      xAxis: {
        categories: ['Light Rail/Trolley/Cable Car', 'Ferry', 'Bus', 'Heavy Rail', 'Cutaway/Van/Paratransit']
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
        data: [2, 2, 3, 2, 1]
      }, {
        name: 'Within Useful Life',
        data: [5, 3, 4, 7, 2]
      }]
    });

    // Pie Chart


    // Make monochrome colors
    var pieColors = (function () {
      var colors = [],
        base = '#00738C',
        i;

      for (i = 0; i < 10; i += 1) {
        // Start out with a darkened base color (negative brighten), and end
        // up with a much brighter color
        colors.push(Highcharts.Color(base).brighten((i - 3) / 12).get());
      }
      return colors;
    }());

    // Build the chart
    Highcharts.chart('pieChartContainer', {
      chart: {
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
      },
      title: {
        text: 'Breakdown of Regional Revenue Vehicles by Mode'
      },
      tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
      },
      plotOptions: {
        pie: {
          allowPointSelect: true,
          cursor: 'pointer',
          colors: pieColors,
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
        name: 'Brands',
        data: [{
            name: 'Bus',
            y: 5963
          },
          {
            name: 'Cutaway/Van/Paratransit',
            y: 1374
          },
          {
            name: 'Ferry',
            y: 101
          },
          {
            name: 'Heavy Rail',
            y: 1110
          },
          {
            name: 'Light Rail/Trolley/Cable Car',
            y: 604
          }

        ]
      }]
    });

    //Electric Vehicles

Highcharts.chart('electricVehiclesContainer', {
    chart: {
        type: 'bar'
    },
    title: {
        text: 'Fleet Breakdown by Fuel Type'
    },
    colors: ['#7CFC00', '#629632', '#00738C', '#910000', '#1aadce',
    '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'
],
    xAxis: {
        categories: ['AC Transit', 'CCCTA', 'Delta Breeze', 'Dixon Readi-Ride', 'ECCTA','FAST','Golden Gate Transit','LAVTA','Marin Transit','NVTA','Petaluma Transit','SamTrans','Santa Rosa Transit','SCT','SF Muni','Solano County Transit','UCT','Vacaville','VTA','WestCAT']
    },
    yAxis: {
        min: 0,
        max:100,
        title: {
            text: 'Fuel Type Percent of Total'
        }
    },
    legend: {
        reversed: true
    },
    plotOptions: {
        series: {
            stacking: 'normal',
            pointWidth:25
        }
    },
    series: [ {
        name: 'Zero Emissions',
        data: [5, 5, 5, 5, 5,5, 5, 5, 5, 5,5, 5, 5, 5, 5,5, 5, 5, 5, 5]
    },{
        name: 'Hybrid',
        data: [5, 5, 5, 5, 5,5, 5, 5, 5, 5,5, 5, 5, 5, 5,5, 5, 5, 5, 5]
    },{
        name: 'Diesel/Combustion Fuel',
        data: [90, 90, 90, 90, 90,90, 90, 90, 90, 90,90, 90, 90, 90, 90,90, 90, 90, 90, 90]
    }]
});

    this.$http.get('/api/things')
      .then(response => {
        this.awesomeThings = response.data;
      });

    // Load Tableau
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
    // createViz(3);
  }

  addThing() {
    if (this.newThing) {
      this.$http.post('/api/things', {
        name: this.newThing
      });
      this.newThing = '';
    }
  }

  deleteThing(thing) {
    this.$http.delete(`/api/things/${thing._id}`);
  }
}

export default angular.module('rtciApp.main', [uiRouter])
  .config(routing)
  .component('main', {
    template: require('./main.html'),
    controller: MainController
  })
  .name;
