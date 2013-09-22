/**
 * Module dependencies.
 */

var express = require('express')
    , http = require('http')
    , path = require('path')
    , request = require('request')
    , ejs = require('ejs');

//SET APP_RELATIVE_PATH to a folder where your app's index.html resides.
var APP_RELATIVE_PATH = path.join(__dirname, '/public/');
console.log(APP_RELATIVE_PATH);

var app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 80);
    app.set('view engine', 'ejs');
    app.use(express.favicon());
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.static(APP_RELATIVE_PATH));
});

app.configure('development', function () {
    app.use(express.errorHandler());
});

var client_id = process.env.client_id;
var app_url = process.env.app_url;

app.get('/', function (req, res) {
    res.render("index", { client_id: client_id, app_url: app_url});
});
app.get('/index.html', function (req, res) {
    res.render("index", { client_id: client_id, app_url: app_url});
});

app.post('/hop/?*', function(req, res){
  var body = JSON.stringify( req.body );
  var headers = req.headers;

  console.log( headers ); 

  var options = {
    'url' : 'https://bpd.lbl.gov/api/v1/analyze/peers/?format=json',
    'method': 'POST',
    'headers': headers,
    'body': body,
    'rejectUnauthorized':false
  };

  console.log( options );


  var fake = {"eui_distribution": {"bin_centers": [55225826.1403295, 62171020.730192505, 69116215.3200555, 76061409.9099185, 83006604.4997815, 89951799.0896445, 96896993.6795075, 103842188.2693705, 110787382.8592335, 117732577.4490965, 124677772.0389595, 131622966.6288225, 138568161.2186855, 145513355.8085485, 152458550.3984115, 159403744.9882745, 166348939.5781375, 173294134.1680005, 180239328.7578635, 187184523.3477265, 194129717.9375895, 201074912.5274525, 208020107.1173155, 214965301.7071785, 221910496.2970415, 228855690.8869045, 235800885.4767675, 242746080.0666305, 249691274.6564935, 256636469.2463565, 263581663.8362195, 270526858.4260825, 277472053.0159455, 284417247.6058085, 291362442.1956715, 298307636.7855345, 305252831.37539744, 312198025.96526045, 319143220.55512345, 326088415.14498645, 333033609.73484945, 339978804.32471246, 346923998.91457546, 353869193.50443846, 360814388.09430146, 367759582.68416446, 374704777.27402747, 381649971.86389047, 388595166.4537535, 395540361.0436165], "bin_counts": [4, 2, 4, 4, 2, 3, 8, 11, 7, 9, 20, 12, 10, 18, 13, 15, 12, 11, 16, 10, 13, 8, 5, 6, 3, 2, 6, 2, 2, 3, 2, 2, 1, 2, 1, 2, 0, 2, 2, 1, 1, 3, 1, 1, 0, 0, 0, 2, 1, 0], "bin_lefts": [51753228.845398, 58698423.435261, 65643618.025124, 72588812.614987, 79534007.20485, 86479201.794713, 93424396.384576, 100369590.974439, 107314785.564302, 114259980.154165, 121205174.744028, 128150369.333891, 135095563.923754, 142040758.513617, 148985953.10348, 155931147.693343, 162876342.283206, 169821536.873069, 176766731.462932, 183711926.052795, 190657120.642658, 197602315.232521, 204547509.822384, 211492704.412247, 218437899.00211, 225383093.591973, 232328288.181836, 239273482.771699, 246218677.361562, 253163871.951425, 260109066.541288, 267054261.131151, 273999455.721014, 280944650.310877, 287889844.90074, 294835039.490603, 301780234.080466, 308725428.670329, 315670623.260192, 322615817.850055, 329561012.439918, 336506207.029781, 343451401.619644, 350396596.209507, 357341790.79937, 364286985.389233, 371232179.979096, 378177374.568959, 385122569.158822, 392067763.748685], "bin_width": 6945194.589862994, "eui_type": "total_source_consumption", "mean": 168220273.04164204, "median": 159211258.9568607, "number_of_bins": 50, "number_of_outliers_removed": 12, "quartiles": {"0": 54032738.99446352, "0.25": 125586130.17005238, "0.5": 159211258.9568607, "0.75": 194204766.13310406, "1.0": 390945913.7578491}, "standard_deviation": 64125560.86324785, "total_count": 265, "units": "Joules/square meters/month", "value_max": 390945913.7578491, "value_min": 54032738.99446352}, "meta": {"message": "success", "request_time": 0.11038398742675781, "url": "/developers/docs#analyze/peers"}, "totals": {"number_of_matching_buildings": 265, "number_of_total_buildings_in_BPD": 72763}};
  
  //request( options ).pipe(res);
  res.send( fake );

  });

function log(req) {
    console.log("req.headers[\"authorization\"] = " + req.headers["authorization"]);
    console.log("req.headers[\"x-authorization\"] = " + req.headers["x-authorization"]);
    console.log('req.method = ' + req.method);
    console.log('req.body ' + JSON.stringify(req.body));
}

http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
