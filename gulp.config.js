// STYLES_LIBS: ["node_modules/normalize.css/normalize.css"],
// JS_LIBS: ["node_modules/jquery/dist/jquery.js"],
module.exports = {
  PATH: {
    dist: {
      //Тут мы укажем куда складывать готовые после сборки файлы
      root: "dist/",
      html: "dist/",
      js: "dist/js/",
      css: "dist/css/",
      //   img: "build/img/",
      fonts: "build/fonts/",
    },
    src: {
      root: "src",
      //Пути откуда брать исходники
      html: "src/index.html", //Синтаксис src/*.html говорит gulp что мы хотим взять все файлы с расширением .html
      js: "src/js/**/*.js", //В стилях и скриптах нам понадобятся только main файлы
      style: "src/styles/**/*.scss",
      //   img: "src/img/**/*.*", //Синтаксис img/**/*.* означает - взять все файлы всех расширений из папки и из вложенных каталогов
      fonts: "src/fonts/**/*.*",
    },
    watch: {
      //Тут мы укажем, за изменением каких файлов мы хотим наблюдать
      html: "src/**/*.html",
      js: "src/js/**/*.js",
      style: "src/style/**/*.scss",
      img: "src/img/**/*.*",
      fonts: "src/fonts/**/*.*",
    },
    clean: "./dist",
  },
};
