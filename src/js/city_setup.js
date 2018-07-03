function city_setup (u, camera) {
	//u = utilities
	//w = window_functions

	//buildings
	var buildings =  new THREE.Group();

	var b = {
		// columns: Math.round(window.innerWidth/64),
		columns: Math.round(window.innerWidth/60),
		rows: 12,
		width: 1.74,
		depth: 1.74,
		materials: [],
		materials_dark: []
	}

	var small_margin = 0.3,
		large_margin = 0.7;

	var red_light_material = new THREE.MeshPhongMaterial({
		color:  0xff0000,
		emissive: 0xff0000,
		emissiveIntensity: 1
	});

	for (var i = 0; i < 6; i++) {

		//make colors

		var building_color = randomColor({ 
			// luminosity: 'light',
			hue: 'monochrome', 
			format: 'hex' 
		});

		var dark_building_color = randomColor({ 
			// luminosity: 'dark',
			hue: 'monochrome', 
			format: 'hex' 
		});

		// build the material
		var darkmaterial  = new THREE.MeshPhongMaterial({
		  	color:  dark_building_color,
		});

		var wallmaterial = new THREE.MeshPhongMaterial( { 
			color:  building_color,
		} );

		b.materials.push(wallmaterial);
		b.materials_dark.push(darkmaterial);
	}

	var roadcolumns = new THREE.Group();
	var roadrows = new THREE.Group();

	roadcolumns.rotation.x = u.de2ra(-90);
	roadcolumns.position.y = 0.01; 
	roadrows.position.y = 0.01; 

	//billboard stuff
	
 	var board_height = 0.6,
	 	board_geometry = new THREE.PlaneGeometry( 
	 		b.width*0.75, 
	 		board_height
	 	),
	 	board_geometry_side = new THREE.PlaneGeometry( 
	 		b.depth*0.75, 
	 		board_height
	 	),
	 	billboard_materials = [],
	 	billboard_materials_side = [],
	 	billboardnum = 7,
	 	sidebillboardnum = 4,
	 	billboard_material;

	 	
	for (var i = 1; i < billboardnum; i++) {
		var tex = new THREE.TextureLoader().load( "assets/billboard-0"+i+".jpg" );

		tex.magFilter = THREE.NearestFilter;
		tex.minFilter = THREE.LinearFilter;

		billboard_material = new THREE.MeshPhongMaterial( { 
			map: tex
		} );

		billboard_materials.push(billboard_material);
	}

	for (var i = 1; i < sidebillboardnum; i++) {

		var tex = new THREE.TextureLoader().load( "assets/billboard-side-0"+i+".jpg" );

		// tex.magFilter = THREE.NearestFilter;

		billboard_material = new THREE.MeshPhongMaterial( { 
			map: tex
		} );

		billboard_materials_side.push(billboard_material);
	}

 	var road_material = new THREE.MeshLambertMaterial( { 
 		color: 0x000000
 	} );


 	for (var i = 0; i < b.columns; i++) {
 		var building_column_margin;
 		// if (u.isEven(i)) {
 		// 	var part = i/2;
 		// 	var odd = Math.ceil(part);
 		// 	var even = Math.floor(part);
 		// 	building_column_margin = small_margin;
 		// }else{
 			// building_column_margin = u.rand(small_margin,large_margin,true);
 			// building_column_margin = small_margin;
 			building_column_margin = large_margin;
 		// }

 		if (i > Math.round(b.columns * 0.3) && i < Math.round(b.columns * 0.6) ) {
 			var road_column_geometry = new THREE.PlaneGeometry( building_column_margin*0.5, b.rows*(b.depth+building_column_margin), 1, 1 );

 			var road_mesh = new THREE.Mesh( road_column_geometry, road_material );

 			road_mesh.position.x = (i*(b.width + building_column_margin ) ) + b.width/2 + building_column_margin*0.5 ;
 			roadcolumns.add(road_mesh);
 		}

 		for (var ii = 0; ii < b.rows; ii++) {
 			var building_row_margin = 0.8;

 			var road_row_geometry = new THREE.PlaneGeometry(  b.columns*(b.width+building_row_margin), building_row_margin*0.5, 1, 1 );
 			var road_mesh = new THREE.Mesh( road_row_geometry, road_material );
 			road_mesh.position.z = (i*(b.depth + building_row_margin ) ) + b.depth/2 + building_row_margin*0.5 ;
 			road_mesh.position.x = (b.columns*(b.width+building_row_margin))/2;
 			road_mesh.rotation.x = u.de2ra(-90);

 			roadrows.add(road_mesh);

 			var rand_height = u.rand(0.75,3),
 				extruded = false,
 				current_building = new THREE.Group();

 			current_building.height = rand_height;
 			
 			var core_geometry = new THREE.BoxGeometry( b.width, rand_height, b.depth);


 			var xpos =  i*(b.width + building_column_margin) ;
 			var zpos = ii*(b.depth + building_row_margin ) ;

 			var camxpos = ((b.columns * (b.width + building_column_margin))/2);

 			var w = windows(u,b, current_building, camxpos );

 			var seed =  u.rand(0,8, true);

 			//Choose what type of window for the building
			var windowseed = u.rand(0,3, true);

			winspawn(windowseed);
			


 			switch(seed) {
 				case 8:
 					addfourlights(rand_height);
 					// winspawn(windowseed,true);
 					break;
 				case 7:
 					if (rand_height > 1.5) {
 						addSideBillboard(xpos); 
 					}
 					if(u.flipcoin() ){ 
 						addMiniboxes(rand_height*.5);
 					}
 					
 					break;
 				case 6 :
 					if (rand_height > 1.5) {
 						addSideBillboard(xpos); 
 					}
 					// addfourlights(rand_height);
 					break;
 				case 4 || 5:
 					extrude();
 					break;
 				case 3:
 					addcap(1,(rand_height*.5) );
 					break;
 				case 2:
 					addspire(rand_height);
 					addfourlights(rand_height);
 					if(u.flipcoin ){
 						// if (xpos < camera.leftbank && xpos > camera.rightbank ) {
 							winspawn(windowseed,true);
 						// }
					}
 					break;
 				case 1:
 					addbillboard();
 					if(u.flipcoin){
 						// if (xpos < camera.leftbank && xpos > camera.rightbank ) {
 							winspawn(windowseed,true);
 						// }
					}
 					break;
 				case 0:
 					addMiniboxes(rand_height*.5);

 					if(u.flipcoin() ){ 
 						if (rand_height > 1.5) {
 							addSideBillboard(xpos); 
 						}
 					}else if (u.flipcoin()) {
 						// if (xpos < camera.leftbank && xpos > camera.rightbank ) {
 							winspawn(windowseed,true);
 						// }
 					}
 					break;
 			}

 			function winspawn (windowseed, side) {
 				// console.log('test');


 				switch(windowseed) {
 					case 3:
 						var columns = Math.round(b.width/0.2);
 						var rows = Math.round(rand_height/0.3);

 						w.tall(columns, rows, side);
 						break;
 					case 2:
 						var columns = Math.round(b.width/0.1);
 						var rows = Math.round(rand_height/0.1);

 						w.small(columns, rows, side);
 						break;
 					case 1:
 						var columns = Math.round(b.width/0.2);
 						var rows = Math.round(rand_height/0.1);

 						w.double(columns, rows, side);	
 						break;
 					case 0:
 						var columns = 2;
 						var rows = Math.round(rand_height/0.1);

 						w.long(columns, rows, side);
 						break;
 				}
 			}
 			
 			// if (xpos < 20) {
 			// 	core_geometry.faces.splice( 2, 2 );
 			// }
 			// if (xpos > 30) {
 			// 	core_geometry.faces.splice( 6, 2 );
 			// }

 			var building_body_mesh = new THREE.Mesh( core_geometry, b.materials[u.rand(0,b.materials.length -1, true)] );
 			building_body_mesh.position.set( 0, rand_height/2, 0);
 			// building_body_mesh.castShadow = true;

 			if(extruded){
 				building_body_mesh.rotation.x = Math.PI / 2;
 				building_body_mesh.position.set( 0, rand_height, 0);
 			}

 			current_building.add(building_body_mesh);

 			current_building.position.set( xpos, 0 , zpos);

			buildings.add(current_building);

			function addcap (tier, sumofheights) {
				//creating the multi-layered  rectangular cap
				var newtier = tier + 1;
				var rand_cap_height = u.rand(0.05,2.5);

				var simpletop_geometry = new THREE.BoxGeometry( 
					b.width - (b.width*(0.2*tier)), 
					rand_cap_height, 
					b.depth - (b.depth*(0.2*tier))
				);

				//remove bottom for preformance
				simpletop_geometry.faces.splice( 6, 2 );
				//remove back for preformance
				simpletop_geometry.faces.splice( 9, 2 );

				var building_cap_mesh = new THREE.Mesh( simpletop_geometry, b.materials[u.rand(0,b.materials.length -1, true)] );

				building_cap_mesh.position.set( 0, sumofheights, 0);

				current_building.height = sumofheights;

				core_geometry.mergeMesh(building_cap_mesh);


				if (rand_cap_height > 0.3 ) {
					var columns = Math.round( (b.width - (b.width*(0.2*tier))) /0.1);
					var rows = Math.round((rand_cap_height/2)/0.125);

					if (u.flipcoin()){
						w.small_cap(columns, rows, tier, sumofheights);
					}else{
						w.long_cap(rows, tier, sumofheights);
					}
					
				}

				if (u.flipcoin() && tier < 6) {
					addcap(newtier, sumofheights);
				}else{
					if (u.flipcoin()){
						addspire(sumofheights)
					}
				}

				
			};
			function addfourlights(buildingheight){
				//creating four ligts

				var light_height = 0.05;

				var light_geometry = new THREE.BoxGeometry( 
					light_height, 
					light_height, 
					light_height
				);

				//remove bottom for preformance
				light_geometry.faces.splice( 6, 2 );
				// light_geometry.faces.splice( , 2 );

				var building_fourlights = new THREE.Group();

				for (var i = 0; i < 4; i++) {
					var building_light_mesh = new THREE.Mesh( light_geometry, red_light_material );
					building_fourlights.add(building_light_mesh);

				}	

				building_fourlights.children[0].position.set(-(b.width/2) + (light_height/2), 0, -(b.depth/2) + (light_height/2));
				building_fourlights.children[1].position.set((b.width/2) - (light_height/2), 0, (b.depth/2) - (light_height/2));
				building_fourlights.children[2].position.set((b.width/2) - (light_height/2), 0, -(b.depth/2) + (light_height/2));
				building_fourlights.children[3].position.set(-(b.width/2) + (light_height/2), 0, (b.depth/2) - (light_height/2));
				building_fourlights.position.set(0,buildingheight + (light_height/2),0)


				current_building.add(building_fourlights);

			};

			function addspire(buildingheight){
				//creating an antenna

				var rand_spire_height = 1;
				var spire_cap_height = 0.05;

				var spire_cap_geometry = new THREE.BoxGeometry( 
					b.width*0.025, 
					spire_cap_height, 
					b.depth*0.025
				);

				var spire_geometry = new THREE.BoxGeometry( 
					b.width*0.025, 
					rand_spire_height, 
					b.depth*0.025
				);

				//remove bottom for preformance
				spire_geometry.faces.splice( 6, 2 );
				spire_cap_geometry.faces.splice( 6, 2 );

				//remove back for preformance
				spire_geometry.faces.splice( 9, 2 );
				spire_cap_geometry.faces.splice( 9, 2 );


				var building_spire_cap_mesh = new THREE.Mesh( spire_cap_geometry, red_light_material );

				var building_spire_mesh = new THREE.Mesh( spire_geometry, b.materials_dark[u.rand(0,b.materials_dark.length -1, true)] );

				building_spire_mesh.position.set( 0, (buildingheight + (rand_spire_height/2)), 0);
				building_spire_cap_mesh.position.set(0, (buildingheight + rand_spire_height) + (spire_cap_height/2),0);

				// core_geometry.mergeMesh(building_spire_mesh);
				current_building.add(building_spire_mesh);

				current_building.add(building_spire_cap_mesh);


			};

			function addMiniboxes(buildingheight){
				//creating an antenna

				for (var i = 0; i < u.rand(1,4, true); i++) {
					var rand_box_height = u.rand(0.1,0.5);

					var mini_box_geometry = new THREE.BoxGeometry( 
						u.rand(0.2,0.5), 
						rand_box_height, 
						u.rand(0.2,0.5)
					);

					//remove bottom for preformance
					mini_box_geometry.faces.splice( 6, 2 );
					//remove back for preformance
					mini_box_geometry.faces.splice( 9, 2 );

					// mini_box_geometry.materials = [b.materials[u.rand(0,b.materials.length -1, true)] ];

					// mini_box_geometry.faces.forEach( function(face, k) {
					// 	face.materialIndex = 0;
					// });

					var mini_box = new THREE.Mesh( mini_box_geometry, b.materials[u.rand(0,b.materials.length -1, true)] );

					mini_box.position.set( 
						u.rand( -(b.width/2)*0.6, (b.width/2)*0.6),
						buildingheight, 
						u.rand( -(b.depth/2)*0.6, (b.depth/2)*0.6)
					);

					core_geometry.mergeMesh(mini_box);
				}

			};


			function addbillboard () {
				// create billboard
				
				var building_board_mesh = new THREE.Mesh( board_geometry, billboard_materials[u.rand(0,billboard_materials.length-1,true)] );
	 			// building_board_mesh.castShadow = true;


				building_board_mesh.position.set( 0, (rand_height + (board_height/2)), (0 + (b.depth/2) - 0.05) );


				// buildings.add(building_board_mesh);
				current_building.add(building_board_mesh);

			};

			function addSideBillboard (xpos) {
				// create billboard
				var building_board_mesh;
				var height = board_height;
			
					var board_geometry_side2 = new THREE.PlaneGeometry( 
						b.depth*0.75, 
						rand_height*0.75
					);
					building_board_mesh = new THREE.Mesh( board_geometry_side2,  billboard_materials_side[u.rand(0,billboard_materials_side.length-1,true)] );
					height = rand_height*0.75;

				
	 			// building_board_mesh.castShadow = true;

				if (xpos < 15) {
					building_board_mesh.position.set( (b.width/2) + 0.05 , (rand_height - (height/2)) , 0 );
					building_board_mesh.rotation.y = u.de2ra(90);


	 			}
	 			if (xpos > 18) {
	 				// (0 + (b.depth/2) - 0.05)
	 				building_board_mesh.position.set( -(b.width/2) - 0.05 , (rand_height - (height/2)) , 0 );
	 				building_board_mesh.rotation.y = u.de2ra(-90);

	 			}




				// buildings.add(building_board_mesh);
				current_building.add(building_board_mesh);

				
			};


			function extrude(){

				var bevelmodifier = u.rand(0.1,0.5);

				var shape = new THREE.Shape();
				shape.moveTo( -(b.depth - (bevelmodifier*2))/2, 0 );
				shape.lineTo( -(b.depth - (bevelmodifier*2))/2, (b.width - (bevelmodifier*2))/2 );
				shape.lineTo( (b.depth - (bevelmodifier*2))/2, (b.width - (bevelmodifier*2))/2 );
				shape.lineTo( (b.depth - (bevelmodifier*2))/2, 0 );
				shape.lineTo( -(b.depth - (bevelmodifier*2))/2, 0 );

				var extrudeSettings = {
					steps: 1,
					amount: (rand_height + bevelmodifier),
					bevelEnabled: true,
					bevelThickness: bevelmodifier,
					bevelSize: bevelmodifier,
					bevelSegments: 1
				};


				core_geometry =  new THREE.ExtrudeGeometry( shape, extrudeSettings );



				// remove bottom for preformance
				core_geometry.faces.splice( 2, 1 );
				// remove back for preformance
				// core_geometry.faces.splice( 5, 2 );

				// core_geometry.rotation.x = Math.PI / 2;

				extruded = true;
			};
 		};
 	};

	return {
		buildings: buildings,
		b: b,
		building_row_margin: building_row_margin,
		building_column_margin: building_column_margin,
		roadcolumns: roadcolumns,
		roadrows: roadrows

	};

};