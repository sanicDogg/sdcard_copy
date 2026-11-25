// Разбиение массива на чанки
const chunkArray = (arr, size) => {
    const chunks = [];
    for (let i = 0; i < arr.length; i += size) {
      chunks.push(arr.slice(i, i + size));
    }
    return chunks;
  };

// Функция для копирования файлов
const copyFile = (src, dest, callback) => {
    fs.copyFile(src, dest, (err) => {
        if (err) return callback(err);

        // Получаем stats исходного файла для установки timestamps
        fs.stat(src, (err, stats) => {
            if (err) return callback(err);

            // Устанавливаем время доступа и модификации на целевом файле
            fs.utimes(dest, stats.atime, stats.mtime, (err) => {
            if (err) return callback(err);
            callback(null); // Завершаем операцию
            });
        });
    });
};
  
const progressFile = './progress.json'; // Файл для сохранения прогресса

// Загрузка прогресса
const loadProgress = () => {
if (fs.existsSync(progressFile)) {
    const progress = JSON.parse(fs.readFileSync(progressFile));
    return new Map(Object.entries(progress.files)); // Преобразуем объект в Map
}
return new Map();
};

// Сохранение прогресса
const saveProgress = (progress) => {
    const progressData = {
        files: Object.fromEntries(progress) // Преобразуем Map обратно в объект
    };
    fs.writeFileSync(progressFile, JSON.stringify(progressData, null, 2));
};

module.exports = { chunkArray, copyFile, loadProgress, saveProgress }
