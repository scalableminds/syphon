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
