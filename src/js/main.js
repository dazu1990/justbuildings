function buildCity () {
	// NProgress.start();
	// NProgress.done();

	// - comment code
	// - vary road distances and sizes
	// - restrict light logic on outskirts of city
	// - consider turning buildings into instances *



	// utilities 
	var u = utilities();

 	var scene = new THREE.Scene();
 	var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );


 	//set up renderer
 	var renderer = new THREE.WebGLRenderer();
	 	renderer.setSize( window.innerWidth, window.innerHeight );

 	document.body.appendChild( renderer.domElement );

 	// color background
 	var skyblue = {h: 0.61,s: 0.7, l: 0.7},
 		nightblue = {h: 0.66, s: 0.5, l: 0.2};

 	scene.background = new THREE.Color(0.50,1,0.85);

 	//framecounter
 	var count = 0;

 	// setupeverything(){}

 	var starField = starspawn(),
 		floor = makefloor(),
 		city = city_setup(u);

 	var ambientlight_color = randomColor({ 
 			luminosity: 'light',
 			format: 'hex' 
 		});

 	//set up ambient light so you can see the buildings at night
 	var ambientlight = new THREE.HemisphereLight( 0xffffff, 0.001 );

 	// var ambientlight = new THREE.HemisphereLight( ambientlight_color, 0.001 );



 	// Create a DirectionalLight and turn on shadows for the light
 	var sunlight = new THREE.DirectionalLight( 0xff751a, 1, 100 );
 	sunlight.position.set( -1, 100, 300 ); 			//default; light shining from top
 	sunlight.castShadow = true;            // default false



 	scene.add( city.buildings, city.roadcolumns, city.roadrows, starField,floor, ambientlight,sunlight);


 	camera.position.z = (city.b.rows * 2) + (city.b.depth * 4);
 	camera.position.y = 5.8;
 	// camera.position.y = 4.7;
 	camera.position.x = ((city.b.columns * (city.b.width + city.building_column_margin))/2) ;
 	camera.rotation.x += 5.8;

 	camera.leftbank = (camera.position.x - (camera.position.x * 0.25));
 	camera.rightbank = (camera.position.x + (camera.position.x * 0.18));


 	

 	var window_on_color = randomColor({ 
 		hue: 'yellow', 
 		format: 'hex' 
 	});

 	var window_off_material = new THREE.MeshLambertMaterial( { 
	 		color: 0x1a1100
	 	} ),
	 	window_material = new THREE.MeshBasicMaterial( { 
	 		color: window_on_color
	 	} );

 	

 	//time tracking
 	var daytime = true,
 		framerate = 2,
 		prev_wave_state = 0;

 	// filter the buildings children to get just the windows

 	var windows = window_plucker(),
 		focuswindows = [],
 		windowspos = [],
 		offfocuswindowsA = [],
 		offfocuswindowsB = [],
 		offfocuswindowsC = [],
 		offfocuswindowsD = [],
 		offfocuswindows;

 	scene.updateMatrixWorld(true);

 	// setup_offwindows

 	// function function_name (argument) {
 	// 	// body... 
 	// }


	windows.forEach( function(win, index) {
		var win_pos = new THREE.Vector3();
		win_pos.setFromMatrixPosition( win.matrixWorld );
		if (win_pos.x > camera.leftbank && win_pos.x < camera.rightbank ) {
			focuswindows.push(win);
		}else{
			if (u.isEven(index)) {
				if (u.flipcoin()) {
					offfocuswindowsA.push(win);
				}else{
					offfocuswindowsB.push(win);
				}

			}else{
				if (u.flipcoin()) {
					offfocuswindowsC.push(win);
				}else{
					offfocuswindowsD.push(win);
				}

			}
		}
	});


	offfocuswindowsA = _.where(offfocuswindowsA, {onstate: true});
	offfocuswindowsB = _.where(offfocuswindowsB, {onstate: true});
	offfocuswindowsC = _.where(offfocuswindowsC, {onstate: true});
	offfocuswindowsD = _.where(offfocuswindowsD, {onstate: true});

	offfocuswindows = [ offfocuswindowsA, offfocuswindowsB, offfocuswindowsC, offfocuswindowsD];

 	window.addEventListener('resize', resizewindow);

 	animate();

 	var offfocustoggle = false;
 	function animate() {

 		requestAnimationFrame( animate );
 		renderer.render( scene, camera );


 		camera.position.z -= 0.055;
 		// camera.position.y
 		// camera.position.y = Math.cos(count/120)  * 2.8 + 3.2;


 		count++;
 		var framechange = u.isMultiple(count,framerate);

 		// sunlight.position.y = Math.cos(count/30);
 		prev_wave_state = sunlight.intensity;
 		sunlight.intensity = Math.cos(count/30);


 		var intensity_dir; // true = upward, false = downward


 		var hsl = scene.background.getHSL(scene.background);
 

 		// var skyblue = {h: 0.50,s: 1, l: 0.85};
 		// var nightblue = {h: 0.83, s: 0.19, l: 0.17};

 		if (prev_wave_state > sunlight.intensity) {
 			intensity_dir = false;

 			var alter = {h: 0.01, s: -0.02, l: -0.01};

 			if (hsl.h >=  nightblue.h) { alter.h = 0; }
 			if (hsl.s <=  nightblue.s) { alter.s = 0; }
 			if (hsl.l <=  nightblue.l) { alter.l = 0; }

 		}else{
 			intensity_dir = true;

 			var alter = {h: -0.01, s: 0.02, l: 0.01};

 			if (hsl.h <=  skyblue.h) { alter.h = 0; }
 			if (hsl.s >=  skyblue.s) { alter.s = 0; }
 			if (hsl.l >=  skyblue.l) { alter.l = 0; }
 		}

 		scene.background.offsetHSL (alter.h,  alter.s,  alter.l);

 		starField.material.opacity =  -sunlight.intensity;

 		//turn windows off and on accroding to lighting

 		if (sunlight.intensity > 0) {
 			if (intensity_dir) {
 				windows_rand_on(0.002);
 				if (sunlight.intensity < 0.25) { windows_bulk(0, true); }else 
				if (sunlight.intensity < 0.5) { windows_bulk(1, true); }else
				if (sunlight.intensity < 0.75) { windows_bulk(2, true); }else
				if (sunlight.intensity > 1) { windows_bulk(3, true); }
 			}else{
 				windows_rand_off(0.01);
 				if (sunlight.intensity > 0.25) { windows_bulk(0, false); }else 
				if (sunlight.intensity > 0.5) { windows_bulk(1, false); }else
				if (sunlight.intensity > 0.75) { windows_bulk(2, false); }else
				if (sunlight.intensity < 1) { windows_bulk(3, false); }
 			}
 		}else{
			if (!intensity_dir) {
				windows_rand_on(0.045);
				if (sunlight.intensity > -0.25) { windows_bulk(0, true); }else 
				if (sunlight.intensity > -0.5) { windows_bulk(1, true); }else
				if (sunlight.intensity > -0.75) { windows_bulk(2, true); }else
				if (sunlight.intensity > -1) { windows_bulk(3, true); }
			}else{
				windows_rand_off(0.05);
				if (sunlight.intensity < -0.25) { windows_bulk(0, false); }else 
				if (sunlight.intensity < -0.5) { windows_bulk(1, false); }else
				if (sunlight.intensity < -0.75) { windows_bulk(2, false); }else
				if (sunlight.intensity > -1) { windows_bulk(3, false); }	
			}
 		}

 		
 		var zpositions = _.pluck(city.buildings.children, "position" );
	 		zpositions = _.pluck(zpositions, "z" ),
	 		min_z_pos = _.min(zpositions);

 		city.buildings.children.forEach( function(building, index) {
 			if (building.position.z > (camera.position.z + city.b.depth + city.building_row_margin)) {
 				building.position.z = min_z_pos -  city.b.depth - city.building_row_margin;
 				building.position.y = -building.height;
 			}
 			if(building.position.y <= 0){
	 			building.position.y += 0.09;
 			}
 		});

 		city.roadrows.children.forEach(function(road, index){
 			if (road.position.z > camera.position.z) {
 				road.position.z = ( min_z_pos -  (city.b.depth/2)) - (city.building_row_margin/2);
 			}

 		});

 		city.roadcolumns.position.z = camera.position.z - ( city.b.rows  ) - 4;
 		floor.position.z = camera.position.z + 69.5;
 		starField.position.z = camera.position.z - 300;

 	}

 	function windows_bulk(stage,onoff){
 		var winmat;

 		if (onoff) {
 			// winmat = window_materials[u.rand(0,window_materials.length -1, true)]; 
 			winmat = window_material; 
 		}else{
 			winmat = window_off_material;
 		}

 		offfocuswindows[stage].forEach( function(win, index) {
			win.onstate = onoff;
			win.material = winmat;
		});

 		
 	}


 	function windows_rand_on (rate) {

 		for (var i = 0; i < Math.round(focuswindows.length * rate); i++) {
 			var index = u.rand(0, focuswindows.length - 1, true);

 			// var win_pos = new THREE.Vector3();
 			// win_pos.setFromMatrixPosition( windows[ index ].matrixWorld );
 			
 			if ( 
 				focuswindows[ index ]&& !focuswindows[ index ].onstate 
 			) {
 				var window_on_color = randomColor({ 
 					hue: 'yellow', 
 					format: 'hex' 
 				});
 					
 				var window_on_material = new THREE.MeshBasicMaterial( { 
 					color:  window_on_color
 				} );

 				var randselect = u.rand(0, windows.length, true);

 				focuswindows[ index ].material = window_on_material;
 				focuswindows[ index ].onstate = true;

 			}
 		}
 	}

 	function windows_rand_off (rate) {
 		for (var i = 0; i < Math.round(focuswindows.length * rate); i++) {
 			var index = u.rand(0, focuswindows.length - 1, true);
 			// var win_pos = new THREE.Vector3();
 			// win_pos.setFromMatrixPosition( windows[ index ].matrixWorld );

 			if ( 
 				focuswindows[ index].onstate 
 			) {
 				focuswindows[ index ].material = window_off_material;
 				focuswindows[ index ].onstate = false;
 			}
 		} 
 	}

 	function makefloor () {
 		/* Floor  */    

 		// Math.round(window.innerWidth/64) * (city.b.width + city.building_column_margin),
	 	var floor_geometry = new THREE.PlaneGeometry( 100,  200, 1, 1 );
	 	var floor_material = new THREE.MeshLambertMaterial( { 
	 		color: 0x383838
	 	} );
	 	var floor_mesh = new THREE.Mesh( floor_geometry, floor_material );
	 	floor_mesh.material.side = THREE.DoubleSide;
	 	floor_mesh.rotation.x = Math.PI/2;
	 	floor_mesh.position.x = camera.position.x + 25;

	 	return floor_mesh;
 	}

 	function starspawn () {
 		var starsGeometry = new THREE.Geometry();

 		for ( var i = 0; i < window.innerWidth/3.6; i ++ ) {

 			var star = new THREE.Vector3();
 			star.x = u.rand(-window.innerWidth/3,window.innerWidth/3);
 			star.y = u.rand(-50,100);

 			starsGeometry.vertices.push( star );

 		}

 		var starsMaterial = new THREE.PointsMaterial( { color: 0xffffff } );

 		var starField = new THREE.Points( starsGeometry, starsMaterial );
 		starField.position.z = -300;
 		starField.material.transparent = true;

 		return starField;
 	}

 	function window_plucker () {
 		var windows = _.pluck(city.buildings.children, "children" );
 		 	windows = _.flatten(windows);
 		 	windows = _.where(windows, {name: "window"});

 		return windows;
 	}




	function resizewindow (argument) {
		camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
 		renderer.setSize( window.innerWidth, window.innerHeight );

 		scene.remove(logo_solid,logo_wire,city.buildings, city.roadcolumns, city.roadrows, starField,floor);


 		starField = starspawn();
 		floor = makefloor();

 		city = city_setup(u);

 		scene.add( city.buildings, city.roadcolumns, city.roadrows, starField,floor, ambientlight,sunlight);


 		camera.position.z = (city.b.rows * 2) + (city.b.depth * 4);
 		camera.position.y = 4.8;
 		camera.position.x = ((city.b.columns * (city.b.width + city.building_column_margin))/2) ;
 		camera.rotation.x = 5.8;

	 	windows = window_plucker(),
 		focuswindows = [],
 		windowspos = [],
 		offfocuswindowsA = [],
 		offfocuswindowsB = [],
 		offfocuswindowsC = [],
 		offfocuswindowsD = [],
 		offfocuswindows;
	 		
	 	scene.updateMatrixWorld(true);



		windows.forEach( function(win, index) {
			var win_pos = new THREE.Vector3();
			win_pos.setFromMatrixPosition( win.matrixWorld );

			if (win_pos.x > camera.leftbank && win_pos.x < camera.rightbank ) {
				focuswindows.push(win);
			}else{
				if (u.isEven(index)) {
					if (u.flipcoin()) {
						offfocuswindowsA.push(win);
					}else{
						offfocuswindowsB.push(win);
					}

				}else{
					if (u.flipcoin()) {
						offfocuswindowsC.push(win);
					}else{
						offfocuswindowsD.push(win);
					}

				}
			}
		});


		offfocuswindowsA = _.where(offfocuswindowsA, {onstate: true});
		offfocuswindowsB = _.where(offfocuswindowsB, {onstate: true});
		offfocuswindowsC = _.where(offfocuswindowsC, {onstate: true});
		offfocuswindowsD = _.where(offfocuswindowsD, {onstate: true});

		offfocuswindows = [ offfocuswindowsA, offfocuswindowsB, offfocuswindowsC, offfocuswindowsD];


	}
}

// $(window).ready(function(){
// 	console.log('ready');
// });

$(window).load(function(){
	buildCity();
	$('.preloader').addClass('mod-hide');

});

