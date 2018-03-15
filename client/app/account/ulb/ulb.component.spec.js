'use strict';

describe('Component: UlbComponent', function() {
  // load the controller's module
  beforeEach(module('rtciApp.ulb'));

  var UlbComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    UlbComponent = $componentController('ulb', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
