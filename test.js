const semver = require('semver');
console.log(semver.clean('1.0.7.tgz'))
console.log(semver.clean('1.0.7.ggg'))
console.log(semver.clean('1.0.7-alpha.9.tgz'))
console.log(semver.clean('1.0.7-alpha.9'))
console.log(semver.clean('1.0.7'))