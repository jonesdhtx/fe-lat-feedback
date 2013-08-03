require.config({
  paths: {
    "jquery": "../components/jquery/jquery",
    "lodash": "../components/lodash/lodash",
    "tpl": "../components/requirejs-text/index",
    "unit": "../test/unit",
    "dist": "../dist",
    "feedback": "../src",
    "components": "../components",
    "fe-lat-nav": "../components/fe-lat-nav/dist"
  }
});

if(typeof(QUnit) != 'undefined') {
  require(['unit/index'], function() {
    QUnit.start();
  });
}
else {
  require(['fe-lat-nav/nav'], function(nav) {
    nav.render();
  });
}





