const fs = require('fs-extra');
const path = require('path');
const fm = require('front-matter');

var walk = function(dir, done) {
  var results = [];
  fs.readdir(dir, function(err, list) {
    if (err) return done(err);
    var i = 0;
    (function next() {
      var file = list[i++];
      if (!file) {
       return done(null, results);
      }
      file = dir + '/' + file;
      fs.stat(file, function(err, stat) {
        if (stat && stat.isDirectory()) {
          walk(file, function(err, res) {
            results = results.concat(res);
            next();
          });
        } else {
          results.push(file);
          next();
        }
      });
    })();
  });
};
walk(path.join(process.cwd() + '/netlify_cms'), (err, res) => {
 res.map(file => {
  fs.readFile(file, 'utf8', function(err, data){
    if (err) throw err
    var fileName = path.basename(file);
    var content = fm(data);
    var contentPath = content.attributes.path;
    if (contentPath) {
     let newPath = `${path.resolve(process.cwd() + '/src/documentation/' + contentPath)}/${fileName}`;
     fs.copy(file, newPath)
    }
  })
 })
})