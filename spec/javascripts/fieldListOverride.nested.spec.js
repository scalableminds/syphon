describe('override the list of nested fields to include or ignore', function(){
  var View = Backbone.View.extend({
    render: function(){
      this.$el.html('<form><input name="a[a]"><input name="a[b]"><input name="a[c]"><input name="b[a]"><input name="b[b]"></form>');
    }
  });

  describe('when specifying a top-level field to include', function(){
    var result;

    beforeEach(function(){
      var view = new View();
      view.render();

      result = Backbone.Syphon.serialize(view, {
        include: ['a']
      });
    });

    it('should include the specified fields', function(){
      expect(result).to.have.ownProperty('a');
      expect(result.a).to.have.ownProperty('a');
      expect(result.a).to.have.ownProperty('b');
      expect(result.a).to.have.ownProperty('c');
    });

    it('should not include other fields', function(){
      expect(result).to.not.have.ownProperty('b');
    });
  });

  describe('when specifying a sub-level field to include', function(){
    var result;

    beforeEach(function(){
      var view = new View();
      view.render();

      result = Backbone.Syphon.serialize(view, {
        include: ['a[b]']
      });
    });

    it('should include the specified fields', function(){
      expect(result).to.have.ownProperty('a');
      expect(result.a).to.have.ownProperty('b');
    });

    it('should not include other fields', function(){
      expect(result).not.to.have.ownProperty('b');
      expect(result.a).not.to.have.ownProperty('a');
      expect(result.a).not.to.have.ownProperty('c');
    });
  });


  describe('when specifying top-level fields to exclude', function(){
    var result;

    beforeEach(function(){
      var view = new View();
      view.render();

      result = Backbone.Syphon.serialize(view, {
        exclude: ['b']
      });
    });

    it('should ignore the specified fields', function(){
      expect(result).not.to.have.ownProperty('b');
    });

    it('should include all other fields', function(){
      expect(result).to.have.ownProperty('a');
      expect(result.a).to.have.ownProperty('a');
      expect(result.a).to.have.ownProperty('b');
      expect(result.a).to.have.ownProperty('c');
    });
  });

  describe('when specifying sub-level fields to exclude', function(){
    var result;

    beforeEach(function(){
      var view = new View();
      view.render();

      result = Backbone.Syphon.serialize(view, {
        exclude: ['b[a]']
      });
    });

    it('should ignore the specified fields', function(){
      expect(result.b).not.to.have.ownProperty('a');
    });

    it('should include all other fields', function(){
      expect(result).to.have.ownProperty('a');
      expect(result.a).to.have.ownProperty('a');
      expect(result.a).to.have.ownProperty('b');
      expect(result.a).to.have.ownProperty('c');
      expect(result).to.have.ownProperty('b');
      expect(result.b).to.have.ownProperty('b');
    });
  });

  describe('when specifying fields to include that have also been excluded', function(){
    var result;

    beforeEach(function(){
      var view = new View();
      view.render();

      result = Backbone.Syphon.serialize(view, {
        include: ['a'],
        exclude: ['a']
      });
    });

    it('should include the specified fields', function(){
      expect(result).to.have.ownProperty('a');
    });
  });
});