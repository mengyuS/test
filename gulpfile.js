//gulp插件


//http插件；(服务器插件)

const gulp = require("gulp");
// gulp 服务器插件;
const connect = require("gulp-connect");
//合并插件
const concat = require("gulp-concat");
//压缩插件
const uglify = require("gulp-uglify");
// babel 插件;
var babel = require("gulp-babel");
// css 插件;
var cleanCss = require("gulp-clean-css");
// sass 编译插件;
var sass = require("gulp-sass-china");




gulp.task('connect',function(){
    connect.server({
        //设置端口
        port:8888,
        // 访问localhost:8888 是工作区的index.html，要访问转存区的index.html必须改变根路径
        //根路径   相对地址
        root:"dist/",
        //livereload  是否同步刷新
        livereload:true,
        // 中间件;   反向代理
        middleware:function(connect , opt){
            var Proxy = require('gulp-connect-proxy');
            opt.route = '/proxy';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    })
})


//不存在dist文件夹，会报错，所以先转存
gulp.task("html",()=>{
    return gulp.src("*.html").pipe(gulp.dest("dist/")).pipe(connect.reload());
})

gulp.task("watch",()=>{
    gulp.watch("*.html",["html"]);
    gulp.watch("sass/*.scss",["html","sass"]);
    gulp.watch("js/*.js",["html","sass","js"]);
    gulp.watch("*.js",["html","sass","js"])
})


//watch  connect 都会让光标卡着，所以放在default里一块执行
gulp.task("default",["watch","connect"])

gulp.task("script",()=>{
    return gulp.src(["script/app/*.js","script/module/*.js","script/libs/*.js"])
    .pipe(concat("main.js"))
    .pipe(uglify())
    .pipe(gulp.dest("dist/"));
})

// gulp.task("es6",()=>{
//     return gulp.src("script/es2015/es6.js")
//     .pipe(babel())
//     .pipe(gulp.dest("dist/script"));
// })
gulp.task("es6",()=>{
    return gulp.src("script/es2015/es6.js")
    .pipe(babel({
        presets: ['@babel/env']
    }))
    .pipe(gulp.dest("dist/script"));
})

gulp.task("sass", () =>{
    return gulp.src(["sass/*.scss"])
           .pipe(sass().on("error",sass.logError))
           .pipe(gulp.dest("dist/css"))
})
gulp.task("js",()=>{
    return gulp.src(["js/*.js"])
    .pipe(gulp.dest("dist/js"))
})