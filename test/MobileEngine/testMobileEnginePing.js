const { MobileEngine } = require("../../../tineye-services");
var config = require("../testConfig.js");

var mobileengine = new MobileEngine(
  config.MobileEngine.user,
  config.MobileEngine.pass,
  "",
  config.MobileEngine.url
);

describe("MobileEngine Ping:", function() {
  // Set timeout to 5s
  this.timeout(5000);

  describe("Check Server Ping", function() {
    it('Should return a call with status "ok"', function(done) {
      mobileengine.ping(function(err, data) {
        if (err) {
          done();
        } else if (data.status === "ok") {
          done(err);
        } else {
          done(new Error("Server failed to return ping response"));
        }
      });
    });
  });
});
