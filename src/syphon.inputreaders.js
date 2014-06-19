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
