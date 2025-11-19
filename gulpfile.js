const gulp = require('gulp')
const sass = require('gulp-sass')(require('sass'))
const cleanCSS = require('gulp-clean-css')
const terser = require('gulp-terser')
const babel = require('gulp-babel')
const ts = require('gulp-typescript')
const sourcemaps = require('gulp-sourcemaps')
const rename = require('gulp-rename')
const gulpIf = require('gulp-if')

const paths = {
	styles: {
		src: 'src/styles/**/*.scss',
		dest: 'build/styles/'
	},
	scripts: {
		src: ['src/scripts/**/*.js', 'src/scripts/**/*.ts'],
		dest: 'build/scripts/'
	}
}

function isTypeScript(file) {
	return file.extname === '.ts'
}

function styles() {
	return gulp
		.src(paths.styles.src)
		.pipe(sourcemaps.init())
		.pipe(sass().on('error', sass.logError))
		.pipe(cleanCSS())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.styles.dest))
}

function scripts() {
	return gulp
		.src(paths.scripts.src)
		.pipe(sourcemaps.init())
		.pipe(gulpIf(isTypeScript, ts.createProject('tsconfig.json')()))
		.pipe(
			babel({
				presets: [
					['@babel/preset-env', { targets: '> 0.25%, not dead' }],
					'@babel/preset-typescript'
				]
			})
		)
		.pipe(terser())
		.pipe(rename({ suffix: '.min' }))
		.pipe(sourcemaps.write('.'))
		.pipe(gulp.dest(paths.scripts.dest))
}

function watchFiles() {
	gulp.watch(paths.styles.src, styles)
	gulp.watch(paths.scripts.src, scripts)
}

exports.styles = styles
exports.scripts = scripts
exports.watch = watchFiles
exports.default = gulp.parallel(styles, scripts)
