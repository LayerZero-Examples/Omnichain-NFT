task("deploy", require("./deploy"));
task("mint", require("./mint"));
task("setUa", require("./setUa")).addParam("targetNetwork", "the target network name, ie: fuji, or mumbai, etc (from hardhat.config.js)");
task("transfer", require("./transfer"))
    .addParam("targetNetwork", "the target network name, ie: fuji, or mumbai, etc (from hardhat.config.js)")
    .addParam("tokenId", "the token id of the token");