(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['underscore', 'jquery'], factory);
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    var $ = require('jquery');
    module.exports = factory(_, $);
  } else {
    root.Syphon = factory(_, jQuery);
  }

}(this, function (_, $) {
  var Syphon =
  (function(_){
    var Syphon = {};
  
    // Ignore Element Types
    // --------------------
  
    // Tell Syphon to ignore all elements of these types. You can
    // push new types to ignore directly in to this array.
    Syphon.ignoredTypes = ["button", "submit", "reset", "fieldset"];
  
    // Syphon
    // ------
  
    // Get a JSON object that represents
    // all of the form inputs, in this view.
    // Alternately, pass a form element directly
    // in place of the view.
    Syphon.serialize = function(view, options){
      var data = {};
  
      // Build the configuration
      var config = buildConfig(options);
  
      // Get all of the elements to process
      var elements = getInputElements(view, config);
  
      // Process all of the elements
      _.each(elements, function(el){
        var type = getElementType(el);
  
        // Get the key for the input
        var keyExtractor = config.keyExtractors.get(type);
        var key = keyExtractor(el);
  
        // Get the value for the input
        var inputReader = config.inputReaders.get(type);
        var value = inputReader(el);
  
        // Get the key assignment validator and make sure
        // it's valid before assigning the value to the key
        var validKeyAssignment = config.keyAssignmentValidators.get(type);
        if (validKeyAssignment(el, key, value)){
          var keychain = config.keySplitter(key);
          data = assignKeyValue(data, keychain, value);
        }
      });
  
      // Done; send back the results.
      return data;
    };
  
    // Use the given JSON object to populate
    // all of the form inputs, in this view.
    // Alternately, pass a form element directly
    // in place of the view.
    Syphon.deserialize = function(view, data, options){
      // Build the configuration
      var config = buildConfig(options);
  
      // Get all of the elements to process
      var elements = getInputElements(view, config);
  
      // Flatten the data structure that we are deserializing
      var flattenedData = flattenData(config, data);
  
      // Process all of the elements
      _.each(elements, function(el){
        var type = getElementType(el);
  
        // Get the key for the input
        var keyExtractor = config.keyExtractors.get(type);
        var key = keyExtractor(el);
  
        // Get the input writer and the value to write
        var inputWriter = config.inputWriters.get(type);
        var value = flattenedData[key];
  
        // Write the value to the input
        inputWriter(el, value);
      });
    };
  
    // Helpers
    // -------
  
    // Retrieve all of the form inputs
    // from the form
    var getInputElements = function(view, config){
      var form = getForm(view);
      var elements = form.elements;
  
      elements = _.filter(elements, function(el){
        var type = getElementType(el);
        var extractor = config.keyExtractors.get(type);
        var identifier = extractor(el);
  
        if (identifier === "") {
          return false;
        }
  
        var foundInIgnored = _.include(config.ignoredTypes, type);
  
        var keychain = config.keySplitter(identifier);
        var keychainPermutations =
          keychain.map(function (keychainItem, i) {
            return keychain.slice(0, i + 1).reduce(config.keyJoiner);
          });
  
        var foundInInclude =
          _.intersection(config.include, keychainPermutations).length !== 0;
        var foundInExclude =
          _.intersection(config.exclude, keychainPermutations).length !== 0;
  
        if (foundInInclude){
          return true;
        } else if (config.include) {
          return false;
        } else {
          return !(foundInExclude || foundInIgnored);
        }
      });
  
      return elements;
    };
  
    // Determine what type of element this is. It
    // will either return the `type` attribute of
    // an `<input>` element, or the `tagName` of
    // the element when the element is not an `<input>`.
    var getElementType = function(el){
      var typeAttr;
      var tagName = el.tagName;
      var type = tagName;
  
      if (tagName.toLowerCase() === "input"){
        typeAttr = el.getAttribute("type");
        if (typeAttr){
          type = typeAttr;
        } else {
          type = "text";
        }
      }
  
      // Always return the type as lowercase
      // so it can be matched to lowercase
      // type registrations.
      return type.toLowerCase();
    };
  
    // If a form element is given, just return it.
    // Otherwise, get the form element from the view.
    var getForm = function(viewOrForm){
      var el = viewOrForm.el || viewOrForm;
      if (el.tagName.toLowerCase() === 'form' || el.tagName.toLowerCase() === 'fieldset') {
        return el;
      } else {
        return el.querySelector("form,fieldset");
      }
    };
  
    // Build a configuration object and initialize
    // default values.
    var buildConfig = function(options){
      var config = _.clone(options) || {};
  
      config.ignoredTypes = _.clone(Syphon.ignoredTypes);
      config.inputReaders = config.inputReaders || Syphon.InputReaders;
      config.inputWriters = config.inputWriters || Syphon.InputWriters;
      config.keyExtractors = config.keyExtractors || Syphon.KeyExtractors;
      config.keySplitter = config.keySplitter || Syphon.KeySplitter;
      config.keyJoiner = config.keyJoiner || Syphon.KeyJoiner;
      config.keyAssignmentValidators = config.keyAssignmentValidators || Syphon.KeyAssignmentValidators;
  
      return config;
    };
  
    // Assigns `value` to a parsed JSON key.
    //
    // The first parameter is the object which will be
    // modified to store the key/value pair.
    //
    // The second parameter accepts an array of keys as a
    // string with an option array containing a
    // single string as the last option.
    //
    // The third parameter is the value to be assigned.
    //
    // Examples:
    //
    // `["foo", "bar", "baz"] => {foo: {bar: {baz: "value"}}}`
    //
    // `["foo", "bar", ["baz"]] => {foo: {bar: {baz: ["value"]}}}`
    //
    // When the final value is an array with a string, the key
    // becomes an array, and values are pushed in to the array,
    // allowing multiple fields with the same name to be
    // assigned to the array.
    var assignKeyValue = function(obj, keychain, value) {
      if (!keychain){ return obj; }
  
      var key = keychain.shift();
  
      // build the current object we need to store data
      if (!obj[key]){
        obj[key] = _.isArray(key) ? [] : {};
      }
  
      // if it's the last key in the chain, assign the value directly
      if (keychain.length === 0){
        if (_.isArray(obj[key])){
          obj[key].push(value);
        } else {
          obj[key] = value;
        }
      }
  
      // recursive parsing of the array, depth-first
      if (keychain.length > 0){
        assignKeyValue(obj[key], keychain, value);
      }
  
      return obj;
    };
  
    // Flatten the data structure in to nested strings, using the
    // provided `KeyJoiner` function.
    //
    // Example:
    //
    // This input:
    //
    // ```js
    // {
    //   widget: "wombat",
    //   foo: {
    //     bar: "baz",
    //     baz: {
    //       quux: "qux"
    //     },
    //     quux: ["foo", "bar"]
    //   }
    // }
    // ```
    //
    // With a KeyJoiner that uses [ ] square brackets,
    // should produce this output:
    //
    // ```js
    // {
    //  "widget": "wombat",
    //  "foo[bar]": "baz",
    //  "foo[baz][quux]": "qux",
    //  "foo[quux]": ["foo", "bar"]
    // }
    // ```
    var flattenData = function(config, data, parentKey){
      var flatData = {};
  
      _.each(data, function(value, keyName){
        var hash = {};
  
        // If there is a parent key, join it with
        // the current, child key.
        if (parentKey){
          keyName = config.keyJoiner(parentKey, keyName);
        }
  
        if (_.isArray(value)){
          keyName += "[]";
          hash[keyName] = value;
        } else if (_.isObject(value)){
          hash = flattenData(config, value, keyName);
        } else {
          hash[keyName] = value;
        }
  
        // Store the resulting key/value pairs in the
        // final flattened data object
        _.extend(flatData, hash);
      });
  
      return flatData;
    };
  
    return Syphon;
  })(_);
  
  // Type Registry
  // -------------
  
  // Type Registries allow you to register something to
  // an input type, and retrieve either the item registered
  // for a specific type or the default registration
  Syphon.TypeRegistry = function(){
    this.registeredTypes = {};
  };
  
  _.extend(Syphon.TypeRegistry.prototype, {
  
    // Get the registered item by type. If nothing is
    // found for the specified type, the default is
    // returned.
    get: function(type){
      var item = this.registeredTypes[type];
  
      if (!item){
        item = this.registeredTypes["default"];
      }
  
      return item;
    },
  
    // Register a new item for a specified type
    register: function(type, item){
      this.registeredTypes[type] = item;
    },
  
    // Register a default item to be used when no
    // item for a specified type is found
    registerDefault: function(item){
      this.registeredTypes["default"] = item;
    },
  
    // Remove an item from a given type registration
    unregister: function(type){
      if (this.registeredTypes[type]){
        delete this.registeredTypes[type];
      }
    }
  });
  
  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;
  
    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }
  
    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);
  
    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;
  
    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);
  
    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;
  
    return child;
  };
  
  Syphon.TypeRegistry.extend = extend;
  
  // Key Extractors
  // --------------
  
  // Key extractors produce the "key" in `{key: "value"}`
  // pairs, when serializing.
  Syphon.KeyExtractorSet = Syphon.TypeRegistry.extend();
  
  // Built-in Key Extractors
  Syphon.KeyExtractors = new Syphon.KeyExtractorSet();
  
  // The default key extractor, which uses the
  // input element's "id" attribute
  Syphon.KeyExtractors.registerDefault(function(el){
    return el.name;
  });
  
  // Input Readers
  // -------------
  
  // Input Readers are used to extract the value from
  // an input element, for the serialized object result
  Syphon.InputReaderSet = Syphon.TypeRegistry.extend();
  
  // Built-in Input Readers
  Syphon.InputReaders = new Syphon.InputReaderSet();
  
  // The default input reader, which uses an input
  // element's "value"
  Syphon.InputReaders.registerDefault(function(el){
    return $(el).val();
  });
  
  // Checkbox reader, returning a boolean value for
  // whether or not the checkbox is checked.
  Syphon.InputReaders.register("checkbox", function(el){
    var checked = el.checked;
    return checked;
  });
  
  // Input Writers
  // -------------
  
  // Input Writers are used to insert a value from an
  // object into an input element.
  Syphon.InputWriterSet = Syphon.TypeRegistry.extend();
  
  // Built-in Input Writers
  Syphon.InputWriters = new Syphon.InputWriterSet();
  
  // The default input writer, which sets an input
  // element's "value"
  Syphon.InputWriters.registerDefault(function(el, value){
    $(el).val(value);
  });
  
  // Checkbox writer, set whether or not the checkbox is checked
  // depending on the boolean value.
  Syphon.InputWriters.register("checkbox", function(el, value){
    el.checked = value;
  });
  
  // Radio button writer, set whether or not the radio button is
  // checked.  The button should only be checked if it's value
  // equals the given value.
  Syphon.InputWriters.register("radio", function(el, value){
    el.checked = $(el).val() === value.toString();
  });
  
  // Key Assignment Validators
  // -------------------------
  
  // Key Assignment Validators are used to determine whether or not a
  // key should be assigned to a value, after the key and value have been
  // extracted from the element. This is the last opportunity to prevent
  // bad data from getting serialized to your object.
  
  Syphon.KeyAssignmentValidatorSet = Syphon.TypeRegistry.extend();
  
  // Build-in Key Assignment Validators
  Syphon.KeyAssignmentValidators = new Syphon.KeyAssignmentValidatorSet();
  
  // Everything is valid by default
  Syphon.KeyAssignmentValidators.registerDefault(function(){ return true; });
  
  // But only the "checked" radio button for a given
  // radio button group is valid
  Syphon.KeyAssignmentValidators.register("radio", function(el, key, value){
    return el.checked;
  });
  
  // Syphon.KeySplitter
  // ---------------------------
  
  // This function is used to split DOM element keys in to an array
  // of parts, which are then used to create a nested result structure.
  // returning `["foo", "bar"]` results in `{foo: { bar: "value" }}`.
  //
  // Override this method to use a custom key splitter, such as:
  // `<input name="foo.bar.baz">`, `return key.split(".")`
  Syphon.KeySplitter = function(key){
    var matches = key.match(/[^\[\]]+/g);
    var lastKey;
  
    if (key.indexOf("[]") === key.length - 2){
      lastKey = matches.pop();
      matches.push([lastKey]);
    }
  
    return matches || [];
  };
  
  // Syphon.KeyJoiner
  // -------------------------
  
  // Take two segments of a key and join them together, to create the
  // de-normalized key name, when deserializing a data structure back
  // in to a form.
  //
  // Example:
  //
  // With this data strucutre `{foo: { bar: {baz: "value", quux: "another"} } }`,
  // the key joiner will be called with these parameters, and assuming the
  // join happens with "[ ]" square brackets, the specified output:
  //
  // `KeyJoiner("foo", "bar")` //=> "foo[bar]"
  // `KeyJoiner("foo[bar]", "baz")` //=> "foo[bar][baz]"
  // `KeyJoiner("foo[bar]", "quux")` //=> "foo[bar][quux]"
  
  Syphon.KeyJoiner = function(parentKey, childKey){
    return parentKey + "[" + childKey + "]";
  };
  return Syphon;
}));