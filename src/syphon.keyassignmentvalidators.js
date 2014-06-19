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
