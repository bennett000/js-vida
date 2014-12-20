Vida
====

Vida is some JavaScript fun that's inspired by Conway's life.

* "Zero Player" game
* There is a small flat world
* There are cells that reproduce

Currently there is a three dimensional universe that consists of a small plane.

So far there is one creature that inhabits the universe and that is the
procomyte (PRoof Of Concept - myte).

* Population cap 1000
* Population seed 15
* Turn interval: 250ms
* Target lifespan: 50 turns
* (one) breeds with > 0 hits per turn
* Dies if y < -512 (falls off)
* Dies if hits per turn > 2 (over population)
* Dies if it's within 25% of its life span, and it fails a D2 (old age)
* Roams in a random directions

For more details just look in the code, (src/js/org-procomyte.js) there's not
much to it.

Obviously this is not currently usable by normal people.  There is no build, and
there are no controls.  Being able to tweak the organism is going to be an
upcoming feature.  Tweaks meaning changing some of the numbers from the above
list.

Right now the procomytes can sometimes fail to start a colony, and die off
quickly.  Other times they reach a critical density and populate up to the  cap.
Usually when the population cap is hit the procomyte colony slowly drifts off
the edge of the map.


## Supported Platforms

* The client _should_ run on any WebGL enabled browser
* The dev environment is geared to GNU/Linux, UNIX, MacOS, etc however it's
mostly just node dependencies, and could theoretically be run on Windows.
** This includes local services

## Running Locally

* clone repo
* npm install
* run `tools/serve-release`
* navigate a browser to http://localhost:8080
** local service is in no way intended for production use

### Debugging

This will setup a local server that runs code straight from the `src` folder,
this service is even _less_ suited to production service than the release
service.

* run `tools/serve-debug`
* navigate a browser to http://localhost:8082

## Testing

* type `grunt test` from the project folder, to run the test suite
* type `grunt test-unit` from the project folder, to run only the unit tests
* type `grunt test-e2e` from the project folder, to run only the e2e tests

## Building

* type `grunt build` from the project folder, to build the client
* type `grunt build-no-test` from the project folder, to build the client, and
skip the _mandatory_ testing
* `grunt --help` for all options


## Contributing

Currently I have pretty specific plans for what I want to do with this.  I am
going to try and spell out those things in the `TODO.md` file.  If you plan on
implementing anything comparable to what's in the `TODO.md` you should message
me so we can coordinate.

If you want to implement anything not in the `TODO.md` file, naturally go ahead,
this is FLOSS.  If I really like it, I will pull it in.  That being said, if
people want me to pull code they're going to have to put up with my love of
semi-colons, and other peculiarities that are in the style guide.

## Style Guide

This is still very much in progress.

### Formatting

Formatting is strict, but not militant.  The 'spec' is currently stored in the
form of WebStorm settings that are included in the source.  These settings
_loosely_ follow two of Google's style guides, fused with sprinklings of
Crockford.

* Google's [Angular For Closure Users](http://google-styleguide.googlecode.com/svn/trunk/angularjs-google-style.html)
* Google's [JavaScript Style Guide](http://google-styleguide.googlecode.com/svn/trunk/javascriptguide.xml)
* [Crockford](http://javascript.crockford.com/code.html)

### Macro Composition

Currently the project uses a hard coded angular module chain.  This is ugly, and
inefficient.  Currently a flatter structure that uses Google's closure tools is
being explored.

### Micro Composition

* Functions should prefer one, or zero arguments
* Functions should use at most five arguments

## License

    Vida - Conway inspired life game
    Copyright © 2014 Michael Bennett

    This file is part of Vida.

    Vida is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    Vida is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with Vida.  If not, see <http://www.gnu.org/licenses/>.

