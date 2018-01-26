'use strict';

describe('Component: MyaccountComponent', function() {
  // load the controller's module
  beforeEach(module('rtciApp.myaccount'));

  var MyaccountComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    MyaccountComponent = $componentController('myaccount', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
