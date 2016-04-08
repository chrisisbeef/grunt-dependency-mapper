# grunt-dependency-mapper

> Parse package.json for Custom Dependency Routing based on environment

## Getting Started
This plugin requires Grunt `~0.4.5`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-dependency-mapper --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-dependency-mapper');
```

## The "dependency_mapper" task

### Overview
In your project's Gruntfile, add a section named `dependency_mapper` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  dependency_mapper: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
});
```

### Options

#### options.env
Type: `String`
Default value: `global`

The environment to use for the rewritten package.json

#### options.base_element
Type: `String`
Default value: `dependency_map`

The base element in `package.json` that contains dependency mappings

#### options.files
Type: `Array`
Default value: `[ 'package.json' ]`

A list of package.json files to update dependency mappings on. Defaults to the package.json file in the same directory 
where Gruntfile.js exists on the filesystem.

#### options.outputDir
Type: `String`

If present, will write out the new (rewritten) package.json file to the specified directory. By default any path specified
in the `options.files` element will be carried over. If `options.outputDir` is set to `tmp` and files contains `[ 'submodule/package.json' ]`
the file will be written to `tmp/submodule/package.json`.

#### options.outputDirDeep
Type: `Boolean`
Default Value: true

If `options.outputDir` is specified and this option is set to false, the pathname relative to Gruntfile.js will be stripped
from the output directory where the new file is written. 

### Usage Examples

#### Use the specified environment repository

In this example, the value of a dependency named `custom.dependency` will be replaced with the repository specified in
`dependency_map['custom.dependency']['development']`.

##### package.json
```js
{
  "name": "test",
  "version": "0.1.0",
  "dependencies": {
    "custom.dependency": ""
  },
  "dependency_map": {
    "custom.dependency": {
      "development": "git+ssh://github.com/custom.dependency#develop",
      "ci": "git+ssh://github.com/custom.dependency#ci",
      "production": "git+ssh://github.com/custom.dependency#master"
    }
  }
}
```

##### Gruntfile.js
```js
grunt.initConfig({
  dependency_mapper: {
    options: {
      env: 'development'
    },
  },
});
```

##### New package.json
```js
{
  "name": "test",
  "version": "0.1.0",
  "dependencies": {
    "custom.dependency": "git+ssh://github.com/custom.dependency#develop"
  },
  "dependency_map": {
    "custom.dependency": {
      "development": "git+ssh://github.com/custom.dependency#develop",
      "ci": "git+ssh://github.com/custom.dependency#ci",
      "production": "git+ssh://github.com/custom.dependency#master"
    }
  }
}
```

#### Versioning using tags (or branches)

In this example, we'll specify our dependency version using a static version (no semver yet) so your package.json will 
look like you would normally expect it to, and the mapping will append the specified version (or branch/tag name) to the 
repository during rewriting - this allows you to use specific versions of a private dependency from your repository.

##### Original package.json
```js
{
  "name": "test",
  "version": "0.1.0",
  "dependencies": {
    "custom.dependency": "0.0.1"
  },
  "dependency_map": {
    "custom.dependency": {
      "global": "git+ssh://github.com/custom.dependency"
    }
  }
}
```

##### Gruntfile.js
```js
grunt.initConfig({
  dependency_mapper: {
    options: {
      env: 'global'
    },
  },
});
```

##### New package.json
```js
{
  "name": "test",
  "version": "0.1.0",
  "dependencies": {
    "custom.dependency": "git+ssh://github.com/custom.dependency#0.0.1"
  },
  "dependency_map": {
    "custom.dependency": {
      "global": "git+ssh://github.com/custom.dependency"
    }
  }
}
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History

### v0.1.0 - 08 April 2016

* Initial Release