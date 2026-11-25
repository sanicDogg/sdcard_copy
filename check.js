const fs = require('fs');
const path = require('path');
const async = require('async');

const sourceDir = '/Volumes/Untitled/DCIM/Camera'; // Папка-источник
const destDir = '/Users/alexander/Downloads/platform-tools/sdcard/DCIM/Camera'; // Папка-назначение

const checkFiles = () => {
  // Получаем список файлов в папке
  fs.readdir(sourceDir, (err, files) => {
    if (err) throw err;

    async.eachSeries(files, (file, cb) => {
        const dst = path.join(destDir, file);
        fs.stat(dst, (err, stats) => {
            if (err) throw new Error(err);
            console.log('File exist:', dst);
            cb();
        });
    });

    }, (err) => {
      if (err) {
        console.error('Ошибка при чтении:', err);
      } else {
        console.log('Чтение завершено!');
      }
    });
};

checkFiles();