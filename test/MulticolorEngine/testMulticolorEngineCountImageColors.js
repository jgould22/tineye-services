const async = require("async");
const config = require("../testConfig.js");
const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");
const { MulticolorEngine } = require("../../../tineye-services");

var multicolorengine = new MulticolorEngine(
  config.MulticolorEngine.user,
  config.MulticolorEngine.pass,
  "",
  config.MulticolorEngine.url
);

describe("MulticolorEngine CountImageColors:", function() {
  // Set timeout to 15s
  this.timeout(15000);

  var colorsPath = __dirname + "/../colors.png";
  var bluePath = __dirname + "/../blue.png";
  var purplePath = __dirname + "/../purple.png";
  var greensPath = __dirname + "/../greens.png";
  var url = "http://tineye.com/images/meloncat.jpg";
  var url2 =
    "https://services.tineye.com/developers/matchengine/_images/364069_a1.jpg";

  var images = {
    colorsPath: {
      imagePath: colorsPath,
      filePath: "multicolorEngineCountImageTestColors.jpg"
    },
    bluePath: {
      imagePath: bluePath,
      filePath: "multicolorEngineCountImageTestBlue.jpg"
    },
    greensPath: {
      imagePath: bluePath,
      filePath: "multicolorEngineCountImageTestGreens.jpg"
    },
    purplePath: {
      imagePath: purplePath,
      filePath: "multicolorEngineCountImageTestPurple.jpg"
    }
  };

  // Post an image to the collection manually
  before(function(done) {
    async.forEachOfSeries(
      images,
      function(value, key, callback) {
        var form = new FormData();
        form.append("image", fs.createReadStream(value.imagePath));
        form.append("filepath", value.filePath);

        axios
          .post(config.MulticolorEngine.url + "add", form, {
            auth: {
              username: config.MulticolorEngine.user,
              password: config.MulticolorEngine.pass
            },
            headers: form.getHeaders()
          })
          .then(response => {
            if (response.data.status === "ok") {
              callback();
            } else {
              callback(
                new Error("Before hook failed to add image: " + response.data)
              );
            }
          })
          .catch(error => {
            callback(error);
          });
      },
      function(err, results) {
        if (err) {
          done(err);
        } else {
          done();
        }
      }
    );
  });

  // Make call to delete images after tests
  after(function(done) {
    async.forEachOfSeries(
      images,
      function(value, key, callback) {
        axios
          .delete(config.MulticolorEngine.url + "delete", {
            auth: {
              username: config.MulticolorEngine.user,
              password: config.MulticolorEngine.pass
            },
            params: { filepath: value.filePath }
          })
          .then(response => {
            if (response.data.status === "ok") {
              callback();
            } else {
              callback(
                new Error("After hook failed to delete image: " + response.data)
              );
            }
          })
          .catch(error => {
            callback(error);
          });
      },
      function(err, results) {
        if (err) {
          done(err);
        } else {
          done();
        }
      }
    );
  });

  // Search with file
  describe("Count colors by image file", function() {
    it('Should return a call with status "ok" and 2 results', function(done) {
      var params = {
        images: [colorsPath, bluePath],
        count_colors: ["#f1c40f", "#e74c3c"]
      };

      multicolorengine.countImageColors(params, function(err, data) {
        if (err) {
          done(new Error(JSON.stringify(data.err, null, 4)));
        } else if (data.result.length === 2) {
          done();
        } else {
          done(
            new Error("Result returned:" + JSON.stringify(data.result, null, 4))
          );
        }
      });
    });
  });

  // Search with url
  describe("Count colors by image url", function() {
    it('Should return a call with status "ok" and 2 results', function(done) {
      var params = {
        urls: [url],
        count_colors: ["#f1c40f", "#e74c3c"]
      };

      multicolorengine.countImageColors(params, function(err, data) {
        if (err) {
          done(new Error(JSON.stringify(data.err, null, 4)));
        } else if (data.result.length === 2) {
          done();
        } else {
          done(
            new Error("Result returned:" + JSON.stringify(data.result, null, 4))
          );
        }
      });
    });
  });

  // Search with urls
  describe("Count colors by image urls", function() {
    it('Should return a call with status "ok" and 2 results', function(done) {
      var params = {
        urls: [url, url2],
        count_colors: ["#f1c40f", "#e74c3c"]
      };

      multicolorengine.countImageColors(params, function(err, data) {
        if (err) {
          done(new Error(JSON.stringify(data.err, null, 4)));
        } else if (data.result.length === 2) {
          done();
        } else {
          done(
            new Error("Result returned:" + JSON.stringify(data.result, null, 4))
          );
        }
      });
    });
  });
});
