var chai = require('chai');
var chaiStats = require('chai-stats');
global.expect = chai.expect;

chai.use(chaiStats);

chai.config.includeStack = true;
