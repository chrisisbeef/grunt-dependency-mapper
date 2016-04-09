/*
 * grunt-dependency-mapper
 * https://github.com/chrisisbeef/grunt-dependency-mapper.git
 *
 * Copyright (c) 2016 cschmidt
 * Licensed under the MIT license.
 */

'use strict';

const path = require('path');

module.exports = function (grunt) {
    grunt.registerMultiTask('dependency_mapper', 'Parse package.json for Custom Dependency Routing based on environment', function () {
        // Merge task-specific and/or target-specific options with these defaults.
        var options = this.options({
            env: 'global',
            base_element: 'dependency_map',
            files: ['package.json']
        });

        options.files.forEach(function (f) {
            grunt.log.writeln("Loading package.json (" + path.resolve(f) + ")");
            var package_json;
            try {
                package_json = grunt.file.readJSON(path.resolve(f));
            } catch (err) {
                grunt.log.warn("No file found: " + path.resolve(f) + ", skipping");
                return;
            }

            grunt.log.writeln("Checking for base_element '" + options.base_element + "'");
            if (!package_json[options.base_element]) {
                grunt.log.error("Missing " + options.base_element + " in package.json");
                return false;
            }

            var mapped_dependencies = package_json[options.base_element];

            var dependency_collection = false;

            for (var dependency_name in mapped_dependencies) {
                if (mapped_dependencies.hasOwnProperty(dependency_name)) {
                    grunt.log.writeln("Looking for Dependency Named '" + dependency_name + "'");
                    if (package_json['dependencies'].hasOwnProperty(dependency_name)) {
                        dependency_collection = 'dependencies';
                    } else if (package_json['devDependencies'].hasOwnProperty(dependency_name)) {
                        dependency_collection = 'devDependencies';
                    }

                    if (dependency_collection) {
                        grunt.log.writeln("Found in " + dependency_collection);
                        var environments = mapped_dependencies[dependency_name];
                        if (environments.hasOwnProperty(options.env)) {
                            grunt.log.writeln("Found environment: " + options.env + " (" + environments[options.env] + ")");
                            var target_value = environments[options.env];
                            var current_value = package_json[dependency_collection][dependency_name];

                            var current_value_contains_branch = true;
                            for (var e in environments) {
                                if (environments.hasOwnProperty(e)) {
                                    grunt.log.writeln("Checking if " + current_value + " contains " + environments[e]);
                                    if (current_value.indexOf(environments[e]) > -1) {

                                        current_value_contains_branch = false;
                                    }
                                }
                            }

                            if (current_value_contains_branch) {
                                if (current_value.length > 0 && target_value.indexOf('#') > 0) {
                                    grunt.log.warn("Branch/Tag Specified in Target Repository (" + target_value.substr(target_value.indexOf('#') + 1) + ") will be overridden by (" + current_value + ")")
                                    package_json[dependency_collection][dependency_name] = target_value.substr(0, target_value.indexOf('#') + 1) + current_value;
                                } else {
                                    package_json[dependency_collection][dependency_name] = target_value + (current_value.length > 0 ? "#" + current_value : "");
                                }
                            } else {
                                package_json[dependency_collection][dependency_name] = target_value;
                            }

                            grunt.log.writeln("Set '" + dependency_name + "' to pull from '" + package_json[dependency_collection][dependency_name]);

                            var outputFile = path.resolve(f);

                            if (options.outputDir) {
                                outputFile = path.join(path.resolve(options.outputDir), (options.outputDirDeep ? f : path.parse(f).base));
                            }

                            grunt.log.writeln("Writing new package.json to " + outputFile);
                            grunt.file.write(outputFile, JSON.stringify(package_json, false, 2));
                        } else {
                            grunt.log.warn("No Environment Specified for Dependency '" + dependency_name + "' for Environment '" + options.env + "', skipping");
                        }
                    } else {
                        grunt.log.warn("No dependency named '" + dependency_name + "', skipping");
                    }
                }

            }
        });


    });

};
