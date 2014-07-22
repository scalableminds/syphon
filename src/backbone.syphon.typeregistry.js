// Type Registry
// -------------

// Type Registries allow you to register something to
// an input type, and retrieve either the item registered
// for a specific type or the default registration
var TypeRegistry = Syphon.TypeRegistry = function() {
  this.registeredTypes = {};
};

_.extend(TypeRegistry.prototype, {

  // Get the registered item by type. If nothing is
  // found for the specified type, the default is
  // returned.
  get: function(type){
    return this.registeredTypes[type] || this.registeredTypes['default'];
  },

  // Register a new item for a specified type
  register: function(type, item) {
    this.registeredTypes[type] = item;
  },

  // Register a default item to be used when no
  // item for a specified type is found
  registerDefault: function(item) {
    this.registeredTypes['default'] = item;
  },

  // Remove an item from a given type registration
  unregister: function(type) {
    if (this.registeredTypes[type]) {
      delete this.registeredTypes[type];
    }
  }
});
