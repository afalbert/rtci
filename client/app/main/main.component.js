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
                text: ''
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
                data: [11.75, 31.68, 41.07, 61.44, 62.99]
            }, {
                name: 'Within Useful Life',
                data: [88.25, 68.32, 58.93, 38.56, 37.01]
            }]
        });

        // Pie Chart


        // Make monochrome colors
        // var pieColors = (function () {
        //   var colors = [],
        //     base = '#00738C',
        //     i;

        //   for (i = 0; i < 10; i += 1) {
        //     // Start out with a darkened base color (negative brighten), and end
        //     // up with a much brighter color
        //     colors.push(Highcharts.Color(base).brighten((i - 3) / 12).get());
        //   }
        //   return colors;
        // }());

        // Build the chart
        Highcharts.chart('pieChartContainer', {
            chart: {
                plotBackgroundColor: null,
                plotBorderWidth: null,
                plotShadow: false,
                type: 'pie'
            },
            title: {
                text: ''
            },
            exporting: {
                enabled: false
            },
            tooltip: {
                pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
            },
            plotOptions: {
                pie: {
                    allowPointSelect: true,
                    cursor: 'pointer',
                    colors: ['#00738C', '#FF6347', '#24CBE5', '#DDDF00', '#FFF263', '#FF9655', '#FFF263', '#6AF9C4'],
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
                name: 'Category',
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
                text: ''
            },
            exporting: {
                enabled: false
            },
            colors: ['#7CFC00', '#629632', '#4682B4', '#910000', '#1aadce',
                '#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a'
            ],
            xAxis: {
                categories: ['AC Transit', 'CCCTA', 'Delta Breeze', 'Dixon Readi-Ride', 'ECCTA', 'FAST', 'Golden Gate Transit', 'LAVTA', 'Marin Transit', 'NVTA', 'Petaluma Transit', 'SamTrans', 'Santa Rosa Transit', 'SCT', 'SF Muni', 'Solano County Transit', 'UCT', 'Vacaville', 'VTA', 'WestCAT']
            },
            yAxis: {
                min: 0,
                max: 100,
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
                    pointWidth: 25
                }
            },
            series: [{
                name: 'Zero Emissions',
                data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 7.08, 0, 0, 0, 0, 21.94, 0, 0, 0, 0, 0]
            }, {
                name: 'Hybrid',
                data: [1.33, 2.07, 0, 0, 0, 5.93, 2.39, 29.84, 15.23, 0, 13.04, 3.66, 19.30, 0, 49.92, 9.5, 0, 0, 0, 0]
            }, {
                name: 'Diesel/Combustion Fuel',
                data: [98.6, 97.93, 100, 100, 100, 94.07, 97.61, 70.16, 84.77, 92.92, 86.96, 96.34, 80.70, 100, 28.14, 90.05, 100, 100, 100, 100]
            }]
        });



        // Load Tableau
        function initViz1() {
            var containerDiv = document.getElementById("viz1"),
                url = "https://public.tableau.com/views/RTCIDraft/Dashboard1?:embed=y&:display_count=yes&publish=yes";

            var viz = new tableau.Viz(containerDiv, url);
        }

        function initViz2() {
            var containerDiv = document.getElementById("viz2"),
                url = "https://public.tableau.com/views/RTCIDraft/Dashboard2?:embed=y&:display_count=yes&publish=yes";

            var viz = new tableau.Viz(containerDiv, url);
        }

        function initViz3() {
            var containerDiv = document.getElementById("viz3"),
                url = "https://public.tableau.com/views/RTCIDraft/Sheet6?:embed=y&:display_count=yes&publish=yes";

            var viz = new tableau.Viz(containerDiv, url);
        }


        function initViz4() {
            var containerDiv = document.getElementById("viz4"),
                url = "https://public.tableau.com/views/RTCIDraft/Dashboard4?:embed=y&:display_count=yes&publish=yes";

            var viz = new tableau.Viz(containerDiv, url);
        }

        // initViz1();
        // initViz2();
        // initViz3();
        initViz4();

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