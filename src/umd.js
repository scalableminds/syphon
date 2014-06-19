(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['underscore', 'jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    var $ = require('jquery');
    module.exports = factory(_, $);
  } else {
    root.Syphon = factory(root._, root.jQuery);
  }

}(this, function (_, $) {
  var Syphon =
  //= syphon.js
  return Syphon;
}));
