'use strict';
const angular = require('angular');

/*@ngInject*/
export function phoneNumberFilter() {
    return function(number) {
        if (!number) { return ''; }
        number = String(number);
        number = number.replace(/[^0-9]*/g, '');
        var formattedNumber = number;

        var c = (number[0] == '1') ? '1' : '';
        number = number[0] == '1' ? number.slice(1) : number;

        var area = number.substring(0, 3);
        var front = number.substring(3, 6);
        var end = number.substring(6, 10);

        if (front) {
            formattedNumber = (c + "(" + area + ") " + front);
        }
        if (end) {
            formattedNumber += ("-" + end);
        }
        return formattedNumber;
    };
}


export default angular.module('rtciApp.phoneNumber', [])
    .filter('phoneNumber', phoneNumberFilter)
    .name;