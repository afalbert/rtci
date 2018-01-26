'use strict';

describe('Component: FeedbackComponent', function() {
  // load the controller's module
  beforeEach(module('rtciApp.feedback'));

  var FeedbackComponent;

  // Initialize the controller and a mock scope
  beforeEach(inject(function($componentController) {
    FeedbackComponent = $componentController('feedback', {});
  }));

  it('should ...', function() {
    expect(1).to.equal(1);
  });
});
