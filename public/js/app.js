/*global angular */
/*jshint unused:false */
'use strict';

/**
 * @type {angular.Module}
 */
var bpd = angular.module('bpd', []);

bpd.controller('bpdCtrl', function bpdCtrl($scope, $rootScope, $location, bpdStorage, filterFilter, $http) {
	var programs = $scope.programs = bpdStorage.get();

  var zip = null;

	$scope.setZip = function (index) {
    console.log( $scope.zip );
    zip = $scope.zip;
	};

  $scope.programs = [];

  $scope.addProgram = function () {
		$scope.programs.push( { 
      facility_type : $scope.selection,
      sf : $scope.sf
    } );
    bpdStorage.put( $scope.programs );

    //make new vals
    //reset the vals
    $scope.selection = 0;
    $scope.sf = '';

    var results = [];

    angular.forEach($scope.cooling, function(value, key){

      //this.push(key + ': ' + value);
      var that = this;
      
      $http({
          method: 'POST', 
          headers:{ 'Authorization' : 'ApiKey akira1@awongh.com:aac01c1b80c40b4085209ef79d64c74f68d5cdf4'
          }, 
          url: '/hop',
          data: {
            filters: {
              facility_type: { "choices" : [ $scope.facility_types[ $scope.selection ] ]},
              cooling: { "choices" : [ that.value ] } 
              //heating: choices : [ that.value ] 
            } 
          }
        })
        .success(function(data, status, headers, config) {
          data["cooling"] = value;

          that.push( data );
          
          //make a chart
          //bpd3.draw( data );
          $scope.res[that.value] = data.eui_distribution.mean;

          if( key == ( $scope.cooling.length -1 ) ){
            //bpd3draw( $scope.res );
            bpd3draw( that );
          }
          
        }).
        error(function(data, status, headers, config) {
          console.log( "ERROR" );
          console.log( data );
          console.log( status );
          console.log( headers );
          console.log( config );
        });
    }, results);

  };

    $scope.res = {};

    $scope.cooling = [
      "Central Air Conditioning",
      "Chiller - Absorption",
      "Chiller - Engine Driven",
      "Chiller - Turbine Driven",
      "Chiller - Uncategorized",
      "Condenser",
      "Cooling Tower - Closed",
      "Cooling Tower - Open",
      "Cooling Tower - Uncategorized",
      "District Chilled Water",
      "Evaporative Cooler",
      "Heat Pump - Air Source",
      "Heat Pump - Ground Source",
      "Heat Pump - Uncategorized",
      "Heat Pump - Water Loop",
      "No cooling",
      "Other Or Combination",
      "PTAC",
      "Packaged Direct Expansion",
      "Split AC System",
      "Unknown"
    ];

  $scope.heating = [
      "Boiler - Hot Water",
      "Boiler - Steam",
      "Boiler - Uncategorized",
      "Central Heating",
      "District Hot Water",
      "District Steam",
      "Furnace",
      "Heat Pump - Air Source",
      "Heat Pump - Ground Source",
      "Heat Pump - Uncategorized",
      "Heat Pump - Water Loop",
      "No Heating",
      "Other Or Combination",
      "PTAC",
      "Perimeter Baseboard",
      "Radiator",
      "Resistance Heating",
      "Unknown"
   ];

  //<select ng-options="f as f for f in facility_types" ng-model="selection">
  //<select ng-options="f for f in facility_types" ng-model="selection">
  $scope.facility_types = [
    "Agricultural",
    "Commercial - Uncategorized",
    "Convenience store",
    "Convenience store with gas station",
    "Data Center",
    "Education - College or university",
    "Education - Elementary or middle school",
    "Education - High school",
    "Education - Other classroom",
    "Education - Preschool or daycare",
    "Education - Uncategorized",
    "Food Sales",
    "Food Service  - Other",
    "Food Service  - Restaurant or cafeteria",
    "Food Service - Bakery",
    "Food Service - Fast food",
    "Food Service - Uncategorized",
    "Grocery store or food market",
    "Health Care - Inpatient",
    "Health Care - Outpatient Clinic",
    "Health Care - Outpatient Diagnostic",
    "Health Care - Outpatient Uncategorized",
    "Health Care - Uncategorized",
    "Industrial",
    "Laboratory",
    "Lodging -  Hotel",
    "Lodging - Dormitory or fraternity\/sorority",
    "Lodging - Motel or inn",
    "Lodging - Other",
    "Lodging - Uncategorized",
    "Nursing Home",
    "Office  - Administrative or Professional",
    "Office - Bank or other financial",
    "Office - Government",
    "Office - Medical non diagnostic",
    "Office - Mixed use",
    "Office - Other",
    "Office - Uncategorized",
    "Other",
    "Parking Garage",
    "Public Assembly - Arena",
    "Public Assembly - Drama theater",
    "Public Assembly - Entertainment\/culture",
    "Public Assembly - Large Hall",
    "Public Assembly - Library",
    "Public Assembly - Movie Theater",
    "Public Assembly - Recreation",
    "Public Assembly - Social\/meeting",
    "Public Assembly - Uncategorized",
    "Public Safety - Courthouse",
    "Public Safety - Fire or police station",
    "Public Safety - Uncategorized",
    "Religious worship",
    "Residential",
    "Retail - Big Box (> 50K sf)",
    "Retail - Enclosed mall",
    "Retail - Other than mall",
    "Retail - Small Box (< 50K sf)",
    "Retail - Strip shopping mall",
    "Retail - Uncategorized",
    "Retail - Vehicle dealership\/showroom",
    "Service  - Industrial shop",
    "Service -  Post office or postal center",
    "Service -  Repair shop",
    "Service - Art\/Video\/Photography Studio",
    "Service - Dry-cleaning or Laundry",
    "Service - Other service",
    "Service - Uncategorized",
    "Service - Vehicle service\/repair shop",
    "Transportation Terminal",
    "Vacant",
    "Warehouse - Distribution or Shipping center",
    "Warehouse - Non-refrigerated",
    "Warehouse - Refrigerated",
    "Warehouse - Self-storage",
    "Warehouse - Uncategorized"
  ];

});


bpd.factory('bpdStorage', function () {
	var STORAGE_ID = 'bpd-angularjs';

	return {
		get: function () {
			return JSON.parse(localStorage.getItem(STORAGE_ID) || '[]');
		},

		put: function (programs) {
			localStorage.setItem(STORAGE_ID, JSON.stringify(programs));
		}
	};
});
