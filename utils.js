const fs = require('fs');
const config = require('./config.js');

const utils = {
    readDirectory: function () {
        var path = config.inputFolder;
        return new Promise(function (resolve, reject) {
            fs.readdir(path, function (err, items) {
                let filesList = JSON.stringify(items);
                var response = utils.prepareResponse(items);
                resolve(response);
            });
        });
    },
    readFile: function (file) {
        return new Promise(function (resolve, reject) {
            fs.readFile(file, 'utf8', function read(err, data) {
                let filesList = JSON.parse(data);
                resolve(data);
            });
        });
    },
    saveFile: function (file, content) {
        var path = config.outputFolder;
        if (content.errors) {
            path = config.outputFolder + '/errors';
            if (fs.existsSync(config.outputFolder) && fs.existsSync(config.outputFolder + '/' + file)) {
                fs.unlink(config.outputFolder + '/' + file);
            }
        } else {
            var existing_error_path = config.outputFolder + '/errors';
            if (fs.existsSync(existing_error_path) && fs.existsSync(existing_error_path + '/' + file)) {
                fs.unlink(existing_error_path + '/' + file);
            }
        }
        if (!fs.existsSync(path)) {
            fs.mkdirSync(path);
        }

        path = path + '/' + file;

        return new Promise(function (resolve, reject) {
            fs.writeFile(path, JSON.stringify(content, null, 2), function read(err) {
                if (!err) {
                    resolve({ status: "success" });
                } else {
                    resolve({ status: "fail", message: err.message });
                }
            });
        });
    },
    prepareResponse: function(items){
        var response = {_links:{item:[]}};
        items.forEach(item =>{
            response._links.item.push({href:'metamodels/'+item});
        });
        return response;
    }
};

module.exports = utils;