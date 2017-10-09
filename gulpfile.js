var gulp = require("gulp");

var uglify = require("gulp-uglify"); //压缩模块

var babel = require("gulp-babel"); //es6的转译

var sass = require("gulp-sass"); //sass

var connect = require("gulp-connect"); //热部署

gulp.task("JS",function(){
	gulp.src("./js/*.js").pipe(babel({
		presets:["env"]
	})).pipe(uglify()).pipe(gulp.dest("./minjs"));
})

gulp.task("sass",function(){
	return gulp.src('./scss/**/*.scss')
		   .pipe(sass().on('error',sass.logError))
		   .pipe(gulp.dest('./css/'));		
})

gulp.task('loadhtml',function(){
	gulp.src('./*.html').pipe(connect.reload());
})

gulp.task('listen',function(){
	 connect.server({
	 	  port:8001,
          livereload:true
    });
	gulp.watch('./scss/**/*.scss',["sass"]);
	gulp.watch('./scss/**/*.scss',["loadhtml"]);
	gulp.watch('./*.html',["loadhtml"]);
	gulp.watch('./js/*.js',["JS"])
})

gulp.task('default',['listen'],function(){
	console.log("init")
})
