'use strict';
var CreateFaviconsPartialPlugin = (function () {
  const write = require('write');
  const path = require('path');
  const fs = require('fs');

  function CreateFaviconsPartialPlugin(options){
    if (options === void 0) {
      throw new Error(`Please provide 'options' for the CreateFaviconsPartialPlugin config`);
    }

    if (options.path == null) {
      throw new Error(`Please provide 'options.path' in the CreateFaviconsPartialPlugin config`);
    }

    if (options.fileName == null) {
      throw new Error(`Please provide 'options.fileName' in the CreateFaviconsPartialPlugin config`);
    }

    if (options.inputFilePath == null) {
      throw new Error(`Please provide 'options.inputFilePath' in the CreateFaviconsPartialPlugin config`);
    }

    this.options = options;
  }

  function _createFile(filePath, fileName, inputFilePath) {
    return () => {
      const fullPath = path.join(filePath, fileName);
      console.log(inputFilePath);
      const fsInputFile = fs.readFile(inputFilePath, 'utf8', (err, data) => {
        if (err) throw err;
        const json = JSON.parse(data);
        const icons = json.result.html;
        let processed = '';
        icons.forEach((icon) => {
          processed = processed + unescape(icon) + '\n';
        });
        write.sync(fullPath, processed);
      });
    }
  }

  CreateFaviconsPartialPlugin.prototype.apply = function (compiler) {
    const createFile = () => _createFile(this.options.path, this.options.fileName, this.options.inputFilePath);

    if (!!compiler.hooks) {
      compiler.hooks.done.tap('CreateFileWebpack', createFile());
    } else {
      compiler.plugin('done', createFile());
    }
  };

  return CreateFaviconsPartialPlugin;
})();

module.exports = CreateFaviconsPartialPlugin;
