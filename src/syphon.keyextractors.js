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
