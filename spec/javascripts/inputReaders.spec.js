describe("input readers", function(){

  describe("when registering an input reader for an input with a type attribute", function(){
    var reader = function(){};

    beforeEach(function(){
      Syphon.InputReaders.register("foo", reader);
    });

    afterEach(function(){
      Syphon.InputReaders.register("foo");
    });

    it("should be able to retrieve the input reader for that type", function(){
      var found = Syphon.InputReaders.get("foo");
      expect(found).toBe(reader);
    });
  });

  describe("when retrieving a reader for an input with no type attribute", function(){
    var reader = function(){};

    beforeEach(function(){
      Syphon.InputReaders.register("text", reader);
    });

    afterEach(function(){
      Syphon.InputReaders.register("text");
    });

    it("should retrieve the registered 'text' reader", function(){
      var found = Syphon.InputReaders.get("text");
      expect(found).toBe(reader);
    });
  });

  describe("when registering an input reader for an input element that does not have a 'type' attribute", function(){
    var reader = function(){};

    beforeEach(function(){
      Syphon.InputReaders.register("textarea", reader);
    });

    afterEach(function(){
      Syphon.InputReaders.register("textarea");
    });

    it("should be able to retrieve the input reader for that type", function(){
      var found = Syphon.InputReaders.get("textarea");
      expect(found).toBe(reader);
    });
  });

  describe("when unregistering an input reader", function(){
    var reader = function(){};

    beforeEach(function(){
      Syphon.InputReaders.register("foo", reader);

      Syphon.InputReaders.unregister("foo");
    });

    it("should no longer find the input reader for that type", function(){
      var found = Syphon.InputReaders.get("foo");
      expect(found).not.toBe(reader);
    });
  });

  describe("when specifying input readers in the options for serialize", function(){
    var View = Backbone.View.extend({
      render: function(){
        this.$el.html("<form><input name='foo' data-stuff='bar'></form>");
      }
    });

    var result;
    beforeEach(function(){
      var readers = new Syphon.InputReaderSet();
      readers.registerDefault(function(el){
        return $(el).data("stuff");
      });

      var view = new View();
      view.render();

      result = Syphon.serialize(view, {
        inputReaders: readers
      });
    });

    it("should use the specified input reader", function(){
      expect(result.foo).toBe("bar");
    });
  });

});
