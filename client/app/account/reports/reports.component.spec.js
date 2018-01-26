'use strict';

describe('Component: ReportsComponent', function() {
  // load the controller's module
  beforeEach(module('rtciApp.reports'));

  var ReportsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    ReportsComponent = $componentController('reports', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
