const { src, dest, task, series, watch, parallel } = require("gulp"),
  // { PATH, STYLES_LIBS, JS_LIBS } = require("./gulp.config"),
  { PATH } = require("./gulp.config"),
  rm = require("gulp-rm"),
  sass = require("gulp-sass"),
  concat = require("gulp-concat"),
  browserSync = require("browser-sync").create(),
  reload = browserSync.reload,
  sassGlob = require("gulp-sass-glob"),
  autoprefixer = require("gulp-autoprefixer"),
  cleanCSS = require("gulp-clean-css"),
  sourcemaps = require("gulp-sourcemaps"),
  babel = require("gulp-babel"),
  uglify = require("gulp-uglify"),
  svgo = require("gulp-svgo"),
  //   svgSprite = require("gulp-svg-sprite"),
  gulpif = require("gulp-if"),
  fileinclude = require("gulp-file-include"),
  env = process.env.NODE_ENV;

sass.compiler = require("node-sass");

task("clean", () => {
  console.log(env);
  return src(`${PATH.clean}/**/*`, { read: false }).pipe(rm());
});

task("copy:html", () => {
  return src(PATH.src.html)
    .pipe(
      fileinclude({
        prefix: "@@",
        basepath: "@file",
      })
    )
    .pipe(dest(PATH.dist.html))
    .pipe(reload({ stream: true }));
});

task("styles", () => {
  // return src([...STYLES_LIBS, `${PATH.src.style}`])
  return src([`${PATH.src.style}`])
    .pipe(gulpif(env === "dev", sourcemaps.init()))
    .pipe(concat("main.min.scss"))
    .pipe(sassGlob()) //чтобы можно было импортировать .scss с помощью import *.scss
    .pipe(sass().on("error", sass.logError))
    .pipe(
      gulpif(
        env === "dev",
        autoprefixer({
          cascade: false,
        })
      )
    )
    .pipe(
      gulpif(
        env === "prod",
        cleanCSS({
          level: 2,
        })
      )
    )
    .pipe(gulpif(env === "dev", sourcemaps.write()))
    .pipe(dest(PATH.dist.css))
    .pipe(reload({ stream: true }));
});

task("scripts", () => {
  // return src([...JS_LIBS, PATH.src.js])
  return src([PATH.src.js])
    .pipe(gulpif(env === "dev", sourcemaps.init()))
    .pipe(concat("main.min.js", { newLine: ";" })) //проставляет ; перед каждым новым файлом
    .pipe(
      gulpif(
        env === "prod",
        babel({
          presets: ["@babel/env"],
        })
      )
    )
    .pipe(gulpif(env === "prod", uglify()))
    .pipe(gulpif(env === "dev", sourcemaps.write()))
    .pipe(dest(PATH.dist.js))
    .pipe(reload({ stream: true }));
});

// task("icons", () => {
//   return src("src/images/icons/*.svg")
//     .pipe(
//       svgo({
//         plugins: [
//           {
//             removeAttrs: {
//               attrs: "(fill|stroke|style|width|data.*)",
//             },
//           },
//         ],
//       })
//     )
//     .pipe(
//       svgSprite({
//         mode: {
//           symbol: {
//             sprite: "../sprite.svg",
//           },
//         },
//       })
//     )
//     .pipe(dest(`${}/images/icons`));
// });

task("server", () => {
  browserSync.init({
    server: {
      baseDir: "./dist",
    },
  });
});

task("watch", () => {
  watch(PATH.src.style, series("styles"));
  watch(PATH.src.html, series("copy:html"));
  watch(PATH.src.js, series("scripts"));
});

task(
  "default",
  series(
    "clean",
    parallel("copy:html", "styles", "scripts"),
    parallel("watch", "server")
  )
);

task(
  "build",
  series(
    "clean",
    parallel("copy:html", "styles", "scripts"),
    parallel("watch", "server")
  )
);

// exports.copy = copy
//чтобы могли отдельно вызывать этот таск, первое copy - название которое мы захотим
