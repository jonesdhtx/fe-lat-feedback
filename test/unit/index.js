define([
  'jquery',
  'lodash',
  'fe-lat-nav/nav'
],function($, _, nav) {

  module('feedback');

  test('Rendering', 1, function() {
    nav.render('#qunit-fixture');
    equal($('.nav').length, 1, 'Should render nav');
  });

});
