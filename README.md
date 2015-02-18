# gulp-angular-architecture-graph
[![Dependency Status][depstat-image]][depstat-url] [![devdependencies][devdepstat-image]][devdepstat-url] [![Build status][build-image]][build-url] [![NPM version][npm-image]][npm-url] [![Coverage Status][coverage-image]][coverage-url] [![Codacy Badge][codacy-image]][codacy-url]

[depstat-url]: https://david-dm.org/vogloblinsky/gulp-angular-architecture-graph
[depstat-image]: https://david-dm.org/vogloblinsky/gulp-angular-architecture-graph.svg
[devdepstat-url]: https://david-dm.org/vogloblinsky/gulp-angular-architecture-graph#info=devDependencies
[devdepstat-image]: https://david-dm.org/vogloblinsky/gulp-angular-architecture-graph/dev-status.png
[build-url]: https://travis-ci.org/vogloblinsky/gulp-angular-architecture-graph
[build-image]: https://travis-ci.org/vogloblinsky/gulp-angular-architecture-graph.svg?branch=master
[npm-url]: http://badge.fury.io/js/gulp-angular-architecture-graph
[npm-image]: https://badge.fury.io/js/gulp-angular-architecture-graph.svg
[coverage-url]: https://coveralls.io/r/vogloblinsky/gulp-angular-architecture-graph?branch=master
[coverage-image]: https://coveralls.io/repos/vogloblinsky/gulp-angular-architecture-graph/badge.svg?branch=master
[codacy-url]: https://www.codacy.com/public/vincentogloblinsky/gulp-angular-architecture-graph
[codacy-image]: https://www.codacy.com/project/badge/8d00b4d7b46a465fbf8a79dea9013d39

Generate modules dependencies graph. 
Port of https://github.com/lucalanca/grunt-angular-architecture-graph

## Getting Started

This plugin requires Gulp `~3.8.7`

If you haven't used [Gulp](http://gulpjs.com/) before, be sure to check out the [Getting Started](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md) guide, as it explains how to create a [Gulpfile](https://github.com/gulpjs/gulp#sample-gulpfilejs) as well as install and use Gulp plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install --save-dev gulp-angular-architecture-graph
```

Once the plugin has been installed, it may be injected inside your Gulpfile with this line of JavaScript:

```js
var ngGraph = require('gulp-angular-architecture-graph');

gulp.task('default', function(){
    gulp.src('src/js/*.js', '!src/js/external/*')
        .pipe(ngGraph({
            dest: 'architecture'
        }));
});
```

execute the task and the diagrams will be in the output folder, in this example it is in the folder ```architecture```.

## The task

#### OS X

***Requirements***

- [**graphviz**](http://www.graphviz.org/)

if running OS X and using homebrew, simply execute:

```
 brew install graphviz
```

#### Windows 7

***Requirements***

The windows installer of graphviz: [graphviz-X.XX.msi](http://www.graphviz.org/Download..php), remember to set the Path and point it to your bin directory. e.g. ```C:\Program Files (x86)\GraphvizX.XX\bin```.

#### Manjaro 0.8.11 (arch linux)

***Requirements***

Install via `yaourt` the graphviz package e.g.: `yaourt graphviz`.

## Demos

![legend](https://raw.githubusercontent.com/vogloblinsky/gulp-angular-architecture-graph/master/docs/images/legend.png "Generated Graph Legend")

- ui-router overview diagram
![angular-ui/ui-router overview](https://raw.githubusercontent.com/vogloblinsky/gulp-angular-architecture-graph/master/docs/images/all.ui-router.png "angular-ui/ui-router Dependencies graph")

- ui-router ui.router.state module
![angular-ui/ui-router state module](https://raw.githubusercontent.com/vogloblinsky/gulp-angular-architecture-graph/master/docs/images/ui.router.state.png "angular-ui/ui-router Dependencies graph")

- ui-bootstrap
![angular-ui/bootstrap ](https://raw.githubusercontent.com/vogloblinsky/gulp-angular-architecture-graph/master/docs/images/all.ui-bootstrap.png "angular-ui/bootstrap Dependencies graph")

- ui-bootstrap ui.bootstrap.tooltip module
![angular-ui/bootstrap tooltip module ](https://raw.githubusercontent.com/vogloblinsky/gulp-angular-architecture-graph/master/docs/images/ui.bootstrap.tooltip.png "angular-ui/bootstrap Dependencies graph")


## Options

### options.dest
Type: `String`
Default value: `architecture`

A string value that define the output directory.

```js
architecture: 'out'
```

### options.hideAngularServices
Type: `Boolean`
Default value: `true`

A boolean value that shows angular services (e.g. $http, $q) as dependencies when set to false.

```js
hideAngularServices: false
```

### options.shapeModules
Type: `String`
Default value: `component`

A string value that allows you to change the default shape used for

 * module

nodes.

```js
shapeModules: 'triangle'
```

### options.shapeFactories
Type: `String`
Default value: `ellipse`

A string value that allows you to change the default shape used for

 * Provider
 * Controller
 * Service
 * Factory
 * Injected Service

nodes.

```js
shapeFactories: 'house'
```

### options.shapeDirectives
Type: `String`
Default value: `cds`

A string value that allows you to change the default shape used for

 * Filter
 * Directive

nodes.

```js
shapeDirectives: 'trapezium'
```

Available graphviz shapes are shown [here](http://www.graphviz.org/doc/info/shapes.html)

### options.colorScheme
Type: `String`
Default value: `paired12`

A string value that allows you to change the  graph colour scheme. You currently need to choose a scheme with at least 9 colours to ensure that all nodes
are coloured. Colour schemes which include white or very pale colours will cause some nodes to be hard to see or appear invisible against the white background

```js
colorScheme: 'set19'
```

Available graphviz colour schemes are shown [here](http://www.graphviz.org/doc/info/colors.html)

## List of Contributors

- vogloblinsky     (current maintainer)
- lucalanca (initial creator of grunt version)
- carlo-colombo (initial creator of the project)
- manekinekko

## Release History

### 0.0.1

- initial release