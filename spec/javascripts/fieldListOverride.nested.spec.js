describe("override the list of nested fields to include or ignore", function(){
  var View = Backbone.View.extend({
    render: function(){
      this.$el.html("<form><input name='a[a]'><input name='a[b]'><input name='a[c]'><input name='b[a]'><input name='b[b]'></form>");
    }
  });

  describe("when specifying a top-level field to include", function(){
    var result;

    beforeEach(function(){
      var view = new View();
      view.render();

      result = Syphon.serialize(view, {
        include: ["a"]
      });
    });

    it("should include the specified fields", function(){
      expect(result).toHaveOwnProperty("a");
      expect(result.a).toHaveOwnProperty("a");
      expect(result.a).toHaveOwnProperty("b");
      expect(result.a).toHaveOwnProperty("c");
    });

    it("should not include other fields", function(){
      expect(result).not.toHaveOwnProperty("b");
    });
  });

  describe("when specifying a sub-level field to include", function(){
    var result;

    beforeEach(function(){
      var view = new View();
      view.render();

      result = Syphon.serialize(view, {
        include: ["a[b]"]
      });
    });

    it("should include the specified fields", function(){
      expect(result).toHaveOwnProperty("a");
      expect(result.a).toHaveOwnProperty("b");
    });

    it("should not include other fields", function(){
      expect(result).not.toHaveOwnProperty("b");
      expect(result.a).not.toHaveOwnProperty("a");
      expect(result.a).not.toHaveOwnProperty("c");
    });
  });


  describe("when specifying top-level fields to exclude", function(){
    var result;

    beforeEach(function(){
      var view = new View();
      view.render();

      result = Syphon.serialize(view, {
        exclude: ["b"]
      });
    });

    it("should ignore the specified fields", function(){
      expect(result).not.toHaveOwnProperty("b");
    });

    it("should include all other fields", function(){
      expect(result).toHaveOwnProperty("a");
      expect(result.a).toHaveOwnProperty("a");
      expect(result.a).toHaveOwnProperty("b");
      expect(result.a).toHaveOwnProperty("c");
    });
  });

  describe("when specifying sub-level fields to exclude", function(){
    var result;

    beforeEach(function(){
      var view = new View();
      view.render();

      result = Syphon.serialize(view, {
        exclude: ["b[a]"]
      });
    });

    it("should ignore the specified fields", function(){
      expect(result.b).not.toHaveOwnProperty("a");
    });

    it("should include all other fields", function(){
      expect(result).toHaveOwnProperty("a");
      expect(result.a).toHaveOwnProperty("a");
      expect(result.a).toHaveOwnProperty("b");
      expect(result.a).toHaveOwnProperty("c");
      expect(result).toHaveOwnProperty("b");
      expect(result.b).toHaveOwnProperty("b");
    });
  });

  describe("when specifying fields to include that have also been excluded", function(){
    var result;

    beforeEach(function(){
      var view = new View();
      view.render();

      result = Syphon.serialize(view, {
        include: ["a"],
        exclude: ["a"]
      });
    });

    it("should include the specified fields", function(){
      expect(result).toHaveOwnProperty("a");
    });
  });
});
