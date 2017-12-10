let mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.js('resources/assets/js/app.js', 'public/js').extract(['bootstrap-table'])
   .sass('resources/assets/sass/app.scss', 'public/css');
mix.styles([
    'node_modules/bootstrap-table/src/bootstrap-table.css'
], 'public/css/all.css');
// mix.scripts([
//     'node_modules/bootstrap-table/src/bootstrap-table.js',
// ], 'public/js/all.js');
