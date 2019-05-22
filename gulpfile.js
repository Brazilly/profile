"use strict";

var gulp = require("gulp");
var scss = require("gulp-sass");
var pug = require("gulp-pug");
var sourcemap = require("gulp-sourcemaps");
var htmlmin = require("gulp-htmlmin");
var postcss = require("gulp-postcss");
var uglify = require("gulp-uglify");
var pipeline = require("readable-stream").pipeline;
var plumber = require("gulp-plumber");
var autoprefixer = require("autoprefixer");
var csso = require("gulp-csso");
var rename = require("gulp-rename");
var imagemin = require("gulp-imagemin");
var del = require("del");
var server = require("browser-sync").create();

gulp.task("css", function () {
  return gulp.src("app/scss/style.scss")
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(scss())
    .pipe(postcss([
      autoprefixer()
    ]))
    .pipe(gulp.dest("dist/css"))
    .pipe(csso())
    .pipe(rename("style.min.css"))
    .pipe(sourcemap.write("."))
    .pipe(gulp.dest("dist/css"))
    .pipe(server.stream());
});

gulp.task("pug", function () {
  return gulp.src("app/*.pug")
    .pipe(pug({
      pretty: true
    }))
    .on("error", function (err) {
      process.stderr.write(err.message + "\n");
      this.emit("end");
    })
    .pipe(gulp.dest("dist"));
});

gulp.task("html", function () {
  return gulp.src("dist/*.html")
    .pipe(htmlmin({collapseWhitespace: true}))
    .pipe(gulp.dest("dist"));
});

gulp.task("js", function () {
  return pipeline(
    gulp.src("app/js/*.js"),
    gulp.dest("dist/js")
  );
});

gulp.task("jsmin", function () {
  return pipeline(
    gulp.src("app/js/*.js"),
    uglify(),
    (rename(function (path) {
      path.basename += "-min";
    })),
    gulp.dest("dist/js")
  );
});

gulp.task("images", function () {
  return gulp.src("app/img/**/*.{png,jpg,svg}*")
    .pipe(imagemin([
      imagemin.optipng({optimizationLevel: 3}),
      imagemin.jpegtran({progressive: true}),
      imagemin.svgo(),
    ]))
    .pipe(gulp.dest("app/img"))
});

gulp.task("clean", function () {
  return del("dist");
});

gulp.task("copy", function () {
  return gulp.src([
    "app/fonts/**/*.{woff,woff2}",
    "app/img/**"
  ], {
    base: "app"
  })
    .pipe(gulp.dest("dist"));
});

gulp.task("server", function () {
  server.init({
    server: "dist/",
    notify: false,
    open: true,
    cors: true,
    ui: false
  });

  gulp.watch("app/scss/**/*.scss", gulp.series("css"));
  gulp.watch("app/*.pug", gulp.series("pug", "refresh"));
  gulp.watch("app/*.html", gulp.series("html", "refresh"));
  gulp.watch("app/js/*.js", gulp.series("js", "jsmin", "refresh"));
});

gulp.task("refresh", function (done) {
  server.reload();
  done();
});

gulp.task("build", gulp.series("clean", "copy", "css", "js", "jsmin", "pug", "html"));
gulp.task("start", gulp.series("build", "server"));
