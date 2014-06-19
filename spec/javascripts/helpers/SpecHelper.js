beforeEach(function () {

  jasmine.addMatchers({
    toHaveOwnProperty: function () {
      return {
        compare: function (actual, propertyName) {
          return { pass: actual.hasOwnProperty(propertyName) };
        }
      };
    }
  });

});