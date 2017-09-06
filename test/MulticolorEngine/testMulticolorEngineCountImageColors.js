const async = require('async');
const config = require('../testConfig.js');
const FormData = require('form-data');
const fs = require('fs');
const got = require('got');
const { MulticolorEngine }= require('../../../tineye-services');
const mocha = require('mocha');
const libxmljs = require('libxmljs');

var multicolorengine = new MulticolorEngine(
	config.MulticolorEngine.user, 
	config.MulticolorEngine.pass, 
	'', 
	config.MulticolorEngine.url
	);

describe('MulticolorEngine CountImageColors:', function() {

	//Set timeout to 15s
	this.timeout(15000);

   	var colorsPath = __dirname + '/../colors.png';
	var bluePath = __dirname + '/../blue.png';
	var purplePath = __dirname + '/../purple.png';
	var greensPath = __dirname + '/../greens.png';
	var url = 'http://tineye.com/images/meloncat.jpg';
	var url2 = 'https://services.tineye.com/developers/matchengine/_images/364069_a1.jpg';

	var images = {
		colorsPath:{
			imagePath:colorsPath,
			filePath:'multicolorEngineCountImageTestColors.jpg'
		}, 
		bluePath:{
			imagePath:bluePath,
			filePath:'multicolorEngineCountImageTestBlue.jpg'
		}, 
		greensPath:{
			imagePath:bluePath,
			filePath:'multicolorEngineCountImageTestGreens.jpg'
		}, 
		purplePath:{
			imagePath:purplePath,
			filePath:'multicolorEngineCountImageTestPurple.jpg'
		}
	};
   
	//post an image to the collection manually
	before(function(done) {

		async.forEachOfSeries(images, function (value, key, callback) {

			var form = new FormData();
			form.append('image', fs.createReadStream(value.imagePath));
			form.append('filepath', value.filePath);

		   	got.post(config.MulticolorEngine.url + 'add', {
		      auth:config.MulticolorEngine.user + ':' + config.MulticolorEngine.pass,
		      body: form
			})
			.then(response => {
		    	callback();
			})
			.catch(error => {
		    	callback(error);
			});

		}, function (err,results) {
			if(err){
				done(err);
			}
			else{
				done();
			}
		});


	});

	//make call to delete images after tests
	after(function(done){

		async.forEachOfSeries(images, function (value, key, callback) {

		    got.delete(config.MulticolorEngine.url + 'delete', {
		      	auth:config.MulticolorEngine.user + ':' + config.MulticolorEngine.pass,
	      		json: true,
	      		query: {filepath:value.filePath}
		    })
		    .then((response) => {
	   			callback();
		    })
		    .catch((err) => {
		    	callback(err);
		    });

		}, function (err,results) {
			if(err){
				done(err);
			}
			else{
				done();
			}
		});
				
	});

	// //serach with file
	describe('Count colors by image file', function() {
		
		it('Should return a call with status "ok" and 2 results', function(done) {

			var params = {
				images:[colorsPath,bluePath],
				count_colors:['#f1c40f','#e74c3c']
			};

			multicolorengine.countImageColors(params, function(err, data) {

	    		if(err){
	    			done(new Error(JSON.stringify(data.err,null, 4)));
	    		}
				else if (data.result.length === 2){
	    			done();
				}
				else{
	    			done(new Error('Result returned:' + JSON.stringify(data.result,null, 4)));
				}

			});

		});

	});

		// //serach with url
	describe('Count colors by image url', function() {
		
		it('Should return a call with status "ok" and 2 results', function(done) {

			var params = {
				urls:[url],
				count_colors:['#f1c40f','#e74c3c']
			};

			multicolorengine.countImageColors(params, function(err, data) {

	    		if(err){
	    			done(new Error(JSON.stringify(data.err,null, 4)));
	    		}
				else if (data.result.length === 2){
	    			done();
				} 
				else{
	    			done(new Error('Result returned:' + JSON.stringify(data.result,null, 4)));
				}

			});

		});

	});

	// //serach with url
	describe('Count colors by image urls', function() {
		
		it('Should return a call with status "ok" and 2 results', function(done) {

			var params = {
				urls:[url,url2],
				count_colors:['#f1c40f','#e74c3c']
			};

			multicolorengine.countImageColors(params, function(err, data) {

	    		if(err){
	    			done(new Error(JSON.stringify(data.err,null, 4)));
	    		}
				else if (data.result.length === 2){
	    			done();
				}
				else{
	    			done(new Error('Result returned:' + JSON.stringify(data.result,null, 4)));
				}

			});

		});

	});
});