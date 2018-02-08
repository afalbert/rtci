'use strict';

describe('Directive: pageSelect', function() {
  // load the directive's module
  beforeEach(module('rtciApp.pageSelect'));

  var element,
    scope;

  beforeEach(inject(function($rootScope) {
    scope = $rootScope.$new();
  }));

  it('should make hidden element visible', inject(function($compile) {
    element = angular.element('<page-select></page-select>');
    element = $compile(element)(scope);
    expect(element.text()).to.equal('this is the pageSelect directive');
  }));
});