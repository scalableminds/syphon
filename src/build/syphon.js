(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery'], function(_, $) {
      return factory(_, $);
    });
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    var $ = require('jquery');
    module.exports = factory(_, $);
  } else {
    factory(root._, root.jQuery);
  }

}(this, function(_, $) {
  'use strict';

  var previousSyphon = Syphon;

  var Syphon = window.Syphon = {};

  Syphon.VERSION = '<%= version %>';

  Syphon.noConflict = function() {
    Syphon = previousSyphon;
    return this;
  };

  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    _.extend(child, parent, staticProps);

    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    if (protoProps) _.extend(child.prototype, protoProps);

    child.__super__ = parent.prototype;

    return child;
  };

  // @include ../backbone.syphon.js
  // @include ../backbone.syphon.typeregistry.js

  Syphon.TypeRegistry.extend = extend;

  // @include ../backbone.syphon.keyextractors.js
  // @include ../backbone.syphon.inputreaders.js
  // @include ../backbone.syphon.inputwriters.js
  // @include ../backbone.syphon.keyassignmentvalidators.js
  // @include ../backbone.syphon.keysplitter.js
  // @include ../backbone.syphon.keyjoiner.js


  return Syphon;
}));
