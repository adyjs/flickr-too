var gulp = require("gulp");
var less = require("gulp-less");
var rename = require("gulp-rename");
var plumber = require("gulp-plumber");
var connect = require("gulp-connect");


/* for minify build*/
var uglify = require('gulp-uglify');
var mini_css = require('gulp-mini-css');



/* for regular watch */
gulp.task("connect" , function(){
	connect.server({
		livereload:true
	});
});

gulp.task("less" , function(){
	gulp.src("less/*.less")
		.pipe(plumber())
		.pipe(less())
		.pipe(rename(function(path){
			path.basename = path.basename;
			path.extname = ".css";
		}))
		.pipe(gulp.dest("css/"))
		.pipe(connect.reload());
});

gulp.task("html" , function(){
	gulp.src("*.html")
		.pipe(plumber())
		.pipe(connect.reload());
		
});

gulp.task("js" , function(){
	gulp.src("js/*.js")
		.pipe(plumber())
		.pipe(connect.reload());
});


gulp.task("watch" , function(){
	gulp.watch("*.html" , ["html"]);
	gulp.watch("js/*.js" , ["js"]);
	gulp.watch("less/*.less" , ["less"]);
});


gulp.task("default" , ["html" , "js" , "less" , "watch" , "connect"]);


/* for minify building  */
gulp.task("js-minify" , function(){
	gulp.src("js/*.js")
		.pipe(plumber())
		.pipe(uglify())
		.pipe(rename(function(path){
			path.basename = path.basename + ".min";
			path.extname = ".js";
		}))
		.pipe(gulp.dest("min_src/js/"));
});

gulp.task("css-minify" , function(){
	gulp.src("css/*.css")
		.pipe(plumber())
		.pipe(mini_css())
		.pipe(rename(function(path){
			path.basename = path.basename + ".min";
			path.extname = ".css";
		}))
		.pipe(gulp.dest("min_src/css/"));
});

gulp.task("move-html" , function(){
	gulp.src("*.html")
		.pipe(plumber())
		.pipe(gulp.dest("min_src/"));
})

gulp.task("minify" , ["js-minify" , "css-minify" , "move-html"] );