Serialize/Deserialize forms to JSON
> Forked from [Syphon](https://github.com/marionettejs/syphon)

## Syphon

Working with form elements in a Backbone view can become very tedious very quickly. You will either end up writing a lot of repetitive code to read values from the form, or end up using a key-value-observer or data-binding solution that automatically populates your model for you. While these are valid options and I highly recommend understanding how they work, there are times when these options are not the best choice for your application.

Syphon aims to make it easy to serialize the form inputs of a view in to a simple JSON object that contains all of the values from the form.


## Install
### Direct Download
* Development: [syphon.js](https://raw.github.com/scalableminds/syphon/master/dist/syphon.js)
* Production: [syphon.min.js](https://raw.github.com/scalableminds/syphon/master/dist/syphon.min.js)

### Package managers
* Bower
* npm

### Module managers
* RequireJS modules (`define`)
* Node-style modules (`require`)
* Globals (`window.Syphon`)


## Dependencies
* [underscore](http://underscorejs.org/) or [lodash](http://lodash.com/)
* [jQuery](http://jquery.com/)


## Documentation

### Extensibility / API Documentation

If you need to modify the behaviors of Syphon, see the API documentation. It contains the documentation for the core APIs that Syphon exposes, with
examples on how to change the behaviors of Syphon.

##### [View The API Documentation](https://github.com/scalableminds/syphon/blob/master/apidoc.md)

## Basic Usage: Serialize

When the data from a form is needed, you can call the `serialize` method of `Syphon` to retrieve a JSON object that contains the data from your view's form.

```js
Backbone.View.extend({
  events: {
    "submit form": "formSubmitted"
  },

  formSubmitted: function(e){
    e.preventDefault();

    var data = Syphon.serialize(this);
    this.model.set(data);

    this.model.save();
  },

  render: function(){
    // build the view's form, here
  }
});
```

### Keys Retrieved By "name" Attribute

The default behavior for serializing fields is to use the field's "name"
attribute as the key in the serialized object.

```html
<form>
  <input name="a">
  <select name="b"></select>
  <textarea name="c"></textarea>
</form>
```

```js
Syphon.serialize(view);

// will produce => 

{
  a: "",
  b: "",
  c: ""
}
```

For information on how to change this behavior, see the Key Extractors 
section of the 
[API Documentation](https://github.com/scalableminds/syphon/blob/master/apidoc.md).

### Values Retrieved By jQuery `.val()` Call

The default behavior for serializing fields is to use jQuery's `.val()`
to get the value of the input element.

```html
<form>
  <input name="a" value="a-value">
  <textarea name="b">b-value</textarea>
</form>
```

```js
Syphon.serialize(form);

// will produce => 

{
  a: "a-value",
  b: "b-value",
}
```

For information on how to change this behavior, see the Input Readers
section of the 
[API Documentation](https://github.com/scalableminds/syphon/blob/master/apidoc.md).

### Checkboxes

By default, a checkbox will return a boolean value signifying whether or 
not it is checked.

```html
<form>
  <input type="checkbox" name="a">
  <input type="checkbox" name="b" checked>
</form>
```

```js
Syphon.serialize(form);

// will produce => 

{
  a: false,
  b: true
}
```

For information on how to change this behavior, see the Input Readers
section of the 
[API Documentation](https://github.com/scalableminds/syphon/blob/master/apidoc.md).

### Radio Button Groups

Radio button groups (grouped by the input element "name" attribute) will
produce a single value, from the selected radio button.

```html
<form>
  <input type="radio" name="a" value="1">
  <input type="radio" name="a" value="2" checked>
  <input type="radio" name="a" value="3">
  <input type="radio" name="a" value="4">
</form>
```

```js
Syphon.serialize(form);

// will produce => 

{
  a: "2"
}
```

This behavior can be changed by registering a different set of Key
Extractors, Input Readers, and Key Assignment Validators. See the full
[API Documentation](https://github.com/scalableminds/syphon/blob/master/apidoc.md).
for more information on these.

## Basic Usage : Deserialize

Syphon also allows you to deserialize an object's values back on to a
form. It uses the same conventions and configuration as the serialization
process, with the introduction of Input Writers to handle populating the
form fields with the values. See the full 
[API Documentation](https://github.com/scalableminds/syphon/blob/master/apidoc.md).
for more information on Input Writers.

```html
<form>
  <input type="text" name="a">
  <input type="text" name="b">
</form>
```

```js
var data = {
  a: "foo",
  b: "bar"
};

Syphon.deserialize(form, data);
```

This will populate the form input elements with the correct values from
the `data` parameter.

## Ignored Input Types

The following types of input are ignored, and not included in
the resulting JavaScript object:

* `<input type="submit">` buttons
* `<input type="reset"`> buttons
* standard `<button>` tags
* `<fieldset>` tags

If you need to get a value from the specific button that was
clicked, you can either include it specifically (see below) or use
a DOM event to listen for that element being manipulated (clicked, for
example) and manually grab the data you need.

### Ignoring Other Input Types

Syphon exposes the list of ignored input types as a raw array. You can
push, pop, and manipulate this array as any other array, to specify which
types of input fields you want to ignore.

This list is global to Syphon and there is no way to customize it for
a specific call to `serialize`.

```js
// ignore all <textarea> input elements
Syphon.ignoredTypes.push("textarea");
```

## Serializing Nested Attributes And Field Names

Syphon will parse nested attribute names and create a nested result object, using the Rails notation of `name="foo[bar][baz]"` by default.

```html
<form>
  <input type="text" name="foo[bar]" value="a value">
  <input type="text" name="foo[baz][quux]" value="another value">
</form>
```

will produce

```js
{
  foo: {
    bar: "a value",
    baz: {
      quux: "another value"
    }
  }
}
```

## Include / Exclude Specific Fields

You can include or exclude specific fields as needed. Inclusion is given priority and specifying fields to include will force Syphon to exclude all other fields. Including a field that is ignore by it's type will also force the field to be included. You can also include/exclude nested sub-trees.

### Examples

Given this HTML:

```html
<form>
  <input name="a" value="a-value">
  <input name="b" value="b-value">
  <input name="c[a]" value="c-a-value">
  <input name="c[b]" value="c-b-value">
  <button name="d" value="d-value">
</form>
```

The following will occur:

```js
// include a, c only
Syphon.serialize(view, {
  include: ["a", "c"]
});

// will produce =>

{
  a: "a-value",
  c: {
  	a: "c-a-value",
  	b: "c-b-value"  }
}
```

```js
// include the normally excluded (button) "d"
Syphon.serialize(view, {
  include: ["a", "d"]
});

// will produce =>

{
  a: "a-value",
  d: "d-value"
}
```

```js
// exclude a
Syphon.serialize(view, {
  exclude: ["c"]
});

// will produce =>

{
  a: "a-value",
  b: "b-value"
}
```

```js
// include a and b, exclude b and c
Syphon.serialize(view, {
  include: ["a", "b"],
  exclude: ["b", "c"]
});

// will produce =>

{
  a: "a-value",
  b: "b-value"
}
```

### Include / Exclude Based On Key Extractors

The include / exclude process uses the registered Key Extractors to determine which fields to include / exclude. 

This means if you are only using the default Key Extractor which uses 
the "name" attribute, all fields will be included or excluded based on 
the name of the field.

If you have registered other Key Extractors, they will be used when
determining which fields to include / exclude.

```html
<form>
  <input id="a">
  <input type="radio" name="b">

  <input id="c">
  <input type="radio" name="d">
</form>
```

```js
// By default, use the "id"
Syphon.KeyExtractors.registerDefault(function(el){
  return el.id;
});

// For radio buttons, use the "name"
Syphon.KeyExtractors.register("radio", function(el){
  return el.name;
});

// Serialize the form
Syphon.serialize(view, {
  exclude: ["a", "b"]
});

// This will produce =>
{
  c: "",
  d: ""
}
```


## Other Options

There are a few other options that can be specified when calling the
`Syphon.serialize` method, which allow the behavior of Syphon to be
altered for a single call instead of for all calls.

### Key Extractors

Key extractors are used to generate the "key" in the `{key: "value"}`
result. You can specify a `KeyExtractorSet` as part of the options:

```js
extractors = new Syphon.KeyExtractorSet();
// configure it ...

Syphon.serialize({
  keyExtractors: extractors
});
```

For more information on Key Extractors, see the full 
[API Documentation](https://github.com/scalableminds/syphon/blob/master/apidoc.md).

### Input Readers

Input Readers are used to generate the "value" in the `{key: "value"}`
result. You can specify a `InputReadetSet` as part of the options:

```js
readers = new Syphon.InputReaderSet();
// configure it ...

Syphon.serialize({
  inputReaders: readers
});
```

For more information on Input Readers, see the full 
[API Documentation](https://github.com/scalableminds/syphon/blob/master/apidoc.md).

### Input Writers

Input Writers are used to set the value of form elements to the 
"value" in the `{key: "value"}` data / object.  At this time, you cannot
specify input writers in the `deserialize` method. That will come
soon, hopefully.

For more information on Input Writers, see the full 
[API Documentation](https://github.com/scalableminds/syphon/blob/master/apidoc.md).

### Key Assignment Validators

Input Readers are used to validate the assignment of a key to a value,
in the context of an element. You can specify a `InputReadetSet` as part 
of the options:

```js
validators = new Syphon.KeyAssignmentValidators();
// configure it ...

Syphon.serialize({
  keyAssignmentValidators: validators
});
```

For more information on Key Assignment Validators, see the full 
[API Documentation](https://github.com/scalableminds/syphon/blob/master/apidoc.md).

## Current Limitations

There some known limitations in Syphon, partially by design and
partially implemented as default behaivors. 

* You must have a `<form>` or a `<fieldset>` within your view's `el`
* An input of type `checkbox` will return a boolean value. This can be
overriden by replacing the Input Reader for checkboxes.

## Build and Test


1. Be sure you have NodeJS and NPM installed on your system.
2. Run `npm install -g grunt` to install the grunt build system.
3. Run `npm install -d` to install the local dependencies.
4. From the project folder, run `grunt` to produce a build and run the tests.


## Release Notes

See the [changelog.md](https://github.com/scalableminds/syphon/blob/master/changelog.md) file.

## Legal Mumbo Jumbo (MIT License)

Copyright (c) 2014 Norman Rzepka, scalable minds  
Copyright (c) 2012 Derick Bailey, Muted Solutions, LLC

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
