describe('input readers', function() {
  describe('when registering an input reader for an input with a type attribute', function() {
    beforeEach(function() {
      this.reader = function() {};
      Syphon.InputReaders.register('foo', this.reader);
      this.found = Syphon.InputReaders.get('foo');
    });

    afterEach(function() {
      Syphon.InputReaders.register('foo');
    });

    it('should be able to retrieve the input reader for that type', function() {
      expect(this.found).to.equal(this.reader);
    });
  });

  describe('when retrieving a reader for an input with no type attribute', function() {
    beforeEach(function() {
      this.reader = function() {};
      Syphon.InputReaders.register('text', this.reader);
      this.found = Syphon.InputReaders.get('text');
    });

    afterEach(function() {
      Syphon.InputReaders.register('text');
    });

    it('should retrieve the registered "text" reader', function() {
      expect(this.found).to.equal(this.reader);
    });
  });

  describe('when registering an input reader for an input element that does not have a "type" attribute', function() {
    beforeEach(function() {
      this.reader = function() {};
      Syphon.InputReaders.register('textarea', this.reader);
      this.found = Syphon.InputReaders.get('textarea');
    });

    afterEach(function() {
      Syphon.InputReaders.register('textarea');
    });

    it('should be able to retrieve the input reader for that type', function() {
      expect(this.found).to.equal(this.reader);
    });
  });

  describe('when unregistering an input reader', function() {
    beforeEach(function() {
      this.reader = function() {};
      Syphon.InputReaders.register('foo', this.reader);

      Syphon.InputReaders.unregister('foo');
      this.found = Syphon.InputReaders.get('foo');
    });

    it('should no longer find the input reader for that type', function() {
      expect(this.found).not.to.equal(this.reader);
    });
  });

  describe('when specifying input readers in the options for serialize', function() {
    beforeEach(function() {
      this.View = Backbone.View.extend({
        render: function() {
          this.$el.html('<form><input name="foo" data-stuff="bar"></form>');
        }
      });

      this.readers = new Syphon.InputReaderSet();
      this.readers.registerDefault(function($el) {
        return $el.data('stuff');
      });

      this.view = new this.View();
      this.view.render();

      this.result = Syphon.serialize(this.view, {
        inputReaders: this.readers
      });
    });

    it('should use the specified input reader', function() {
      expect(this.result.foo).to.equal('bar');
    });
  });
});
