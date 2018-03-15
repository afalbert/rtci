'use strict';

describe('Component: TargetsComponent', function() {
  // load the controller's module
  beforeEach(module('rtciApp.targets'));

  var TargetsComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    TargetsComponent = $componentController('targets', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
