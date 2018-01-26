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
        this.$http.get('/api/things')
            .then(response => {
                this.awesomeThings = response.data;
            });

            // Load Tableau
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