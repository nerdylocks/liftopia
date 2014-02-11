Liftopia Technical Excercise
=============================

## Overview
For this excercise, I've created a simple AngularJS application that retrieves data from 3 public API's. The interface displays some key information that might help skiers about Sierra at Tahoe. The endpoints are Yelp for ski stores information, worldweatheronline.com for weather / snowfall info and elevation data from geonames.org.

I've utilized yeoman to generate the app's scaffolding, firebase for data storage and karma-jasmine for unit testing.

Once user clicks on "Get Tahoe Status", the app makes 3 ajax calls, maps and stores the returned data into an angular model, then persists data to firebase. Since view and model are already binded via angulars "$scope", the view will automatically update.

## Installation

      $ git clone https://github.com/nerdylocks/liftopia abiy-excercise
      $ cd liftopia
      $ bower install
      
## Usage

      $ gtunt server
      
To see unit test results in action, you need to have karma installed globally.
      
      $ npm install -g karma
      $ karma start karma.conf.js
      
## Thanks!      
      
      
      
