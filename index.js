const fs = require('fs');
const path = require('path');
const async = require('async');

const {chunkArray, copyFile, loadProgress, saveProgress} = require('./utils.js');

// Параметры
const sourceDir = '/Volumes/Untitled/DCIM/Camera'; // Папка-источник
const destDir = '/Users/alexander/Downloads/platform-tools/sdcard'; // Папка-назначение
const chunkSize = 500; // Размер чанка (количество файлов в одном чанке)

// Основная функция для копирования файлов с прогрессом
const copyFilesWithProgress = () => {
  // Получаем список файлов в папке
  fs.readdir(sourceDir, (err, files) => {
    if (err) throw err;

    // Загружаем прогресс
    const progress = loadProgress();

    // Отбираем только те файлы, которые ещё не скопированы
    const filesToCopy = files.filter(file => !progress.has(file) || progress.get(file) !== 'copied');

    // Разбиваем файлы на чанки
    const fileChunks = chunkArray(filesToCopy, chunkSize);
    const firstChunk = fileChunks[0];

    // Обработка каждого чанка
    // async.eachSeries(fileChunks, (chunk, callback) => {
    //   async.eachSeries(chunk, (file, cb) => {
    async.eachSeries(firstChunk, (file, cb) => {
        const srcPath = path.join(sourceDir, file);
        const destPath = path.join(destDir, file);

        // Копируем файл
        copyFile(srcPath, destPath, (err) => {
          if (err) return cb(err);
          
          // Обновляем прогресс после копирования
          progress.set(file, 'copied');
          console.log(`Файл скопирован: ${file}`);
          
          // Сохраняем прогресс
          saveProgress(progress);
          
          cb();
        });
      }, (err) => {
        if (err) return callback(err);
        callback();
      });
    }, (err) => {
      if (err) {
        console.error('Ошибка при копировании:', err);
      } else {
        console.log('Копирование завершено!');
      }
    });
//   });
};

// Запускаем копирование
copyFilesWithProgress();
