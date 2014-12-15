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

## Running

* clone repo
* npm install

## Building

* type `grunt` from the project folder
* grunt --help for all options


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

