function windows (u,b, current_building, camxpos) {

	 	//WINDOW FUNCTIONS
	 	var windowbuffer = 0.01,
		 	xpos = current_building.position.x,
		 	zpos = current_building.position.z,
		 	campos = camxpos * 0.768442623, 
		 	window_materials = [
		 		new THREE.MeshBasicMaterial( { 
		 		 		// color:  0x4d3c3c,
		 		 		color:  0x1a1100,
		 		} )
		 	],
		 	small_window_geometry = new THREE.PlaneGeometry( 
		 		0.09, 
		 		0.125
		 	),
		 	tall_window_geometry = new THREE.PlaneGeometry( 
		 		0.18, 
		 		0.325
		 	),
		 	double_window_geometry = new THREE.PlaneGeometry( 
		 		0.21, 
		 		0.125
		 	),
		 	long_window_geometry = new THREE.PlaneGeometry( 
		 		(b.width/2), 
		 		0.125
		 	);

	 	// set up colors and materials

	 	for (var i = 0; i < 3; i++) {

	 		var window_on_color = randomColor({ 
	 			hue: 'yellow', 
	 			format: 'hex' 
	 		});

	 		window_materials.push(
	 			new THREE.MeshBasicMaterial({ 
	 			color:  window_on_color
	 			})
	 		);

	 		// window_materials.push(
	 		// 	new THREE.MeshBasicMaterial({ 
	 		// 	color:  "red"
	 		// 	})
	 		// )

	 	}

	 	
		function small (window_columns, window_rows, side) {
			if (u.flipcoin() || side) { 
				var doubleSpaceCheck = true;
			}


			for (var k = 0; k < window_columns; k++) {

				if(doubleSpaceCheck){
					var doubleSpace = u.isMultiple(k,4); 
				}


				if ( u.isEven(k) && doubleSpace && doubleSpaceCheck || u.isEven(k) && !doubleSpaceCheck ) {
					for (var l = 0; l < window_rows; l++) {

						var doubleRow = u.isMultiple(l,4); 
						

						if (u.isEven(l) && l >= 4 && l <= (window_rows - 2)  && doubleRow ) {
		
							var windowmat = window_materials[0];
							var onstate = false;

							if (u.flipcoin()) {
								windowmat = window_materials[u.rand(1,window_materials.length - 1,true)];
								onstate = true;

							}

							var window_mesh =  new THREE.Mesh(small_window_geometry,windowmat);
							
							if (side) {
								if (xpos > campos) {
									window_mesh.position.set(
										(b.width/2) + windowbuffer, 
										(l*0.1),
										-(b.depth/2) + (k*0.1) + 0.065
									);
									window_mesh.rotation.y = u.de2ra(90);
					 			}
					 			if (xpos < campos) {
					 				window_mesh.position.set(
					 					-((b.width/2) + windowbuffer), 
					 					(l*0.1),
					 					-(b.depth/2) + (k*0.1) + 0.065
					 				);
					 				window_mesh.rotation.y = u.de2ra(-90);
								}
							}else{
								window_mesh.position.set(
									-(b.width/2) + (k*0.1) + 0.065, 
									(l*0.1),
									(b.depth/2) + windowbuffer
								);
							}

							window_mesh.name = "window";
							window_mesh.onstate = onstate;


							current_building.add(window_mesh);

						}
					}
				}
			} 
		}

		function tall (window_columns, window_rows, side) {
			if (u.flipcoin() || side) { 
				var staggercheck = true;
			}
			for (var k = 0; k < window_columns; k++) {

				if(staggercheck){
					var stagger = u.isMultiple(k,4); 
				}
				
				if ( u.isEven(k) && stagger && staggercheck || u.isEven(k) && !staggercheck ) {
					for (var l = 0; l < window_rows; l++) {
						if (u.isEven(l) && l >= 2 && l <= (window_rows - 1) ) {
							

							var windowmat = window_materials[0];
							var onstate = false;

							if (u.flipcoin()) {
								windowmat = window_materials[u.rand(1,window_materials.length - 1,true)];
								onstate = true;

							}

							var window_mesh =  new THREE.Mesh(tall_window_geometry,windowmat);
							window_mesh.name = "window";
							window_mesh.onstate = onstate;

							if(side){
								if (xpos > campos) {
									window_mesh.position.set(
										(b.width/2) + windowbuffer, 
										(l*0.3),
										-(b.depth/2) + (k*0.18) + 0.15
									);
									window_mesh.rotation.y = u.de2ra(90);
					 			}
					 			if (xpos < campos) {
					 				window_mesh.position.set(
					 					-((b.width/2) + windowbuffer), 
					 					(l*0.3),
					 					-(b.depth/2) + (k*0.18) + 0.15
					 				);
					 				window_mesh.rotation.y = u.de2ra(-90);
								}
							}else{
								window_mesh.position.set(
									-(b.width/2) + (k*0.18) + 0.15, 
									(l*0.3),
									(b.depth/2) + windowbuffer
								);
							}
							

							current_building.add(window_mesh);

						}
					}
				}
			} 
		};

		function double (window_columns, window_rows, side) {
			if (u.flipcoin() || side) { 
				var staggercheck = true;
			}
			for (var k = 0; k < window_columns; k++) {

				if(staggercheck){
					var stagger = u.isMultiple(k,4); 
				}
				
				if ( u.isEven(k) && stagger && staggercheck || u.isEven(k) && !staggercheck ) {
					for (var l = 0; l < window_rows; l++) {
						if (u.isEven(l) && l >= 4 && l <= (window_rows - 2) ) {
							

							var windowmat = window_materials[0];
							var onstate = false;

							if ( u.flipcoin() ) {
								windowmat = window_materials[u.rand(1,window_materials.length - 1,true)];
								onstate = true;

							}

							var window_mesh =  new THREE.Mesh(double_window_geometry,windowmat);
							window_mesh.name = "window";
							window_mesh.onstate = onstate;

							if (side) {

								if (xpos > campos) {
									window_mesh.position.set(
										(b.width/2) + windowbuffer, 
										(l*0.1),
										-(b.depth/2) + (k*0.165) + 0.2
									);
									window_mesh.rotation.y = u.de2ra(90);


					 			}
					 			if (xpos < campos) {
					 				window_mesh.position.set(
					 					-(b.width/2) - (windowbuffer), 
					 					(l*0.1),
					 					-(b.depth/2) + (k*0.165) + 0.2
					 				);
					 				window_mesh.rotation.y = u.de2ra(-90);
								}

							}else{
								window_mesh.position.set(
									-(b.width/2) + (k*0.165) + 0.2, 
									(l*0.1),
									(b.depth/2) + windowbuffer
								);
							}

							current_building.add(window_mesh);

						}
					}
				}
			}  
		};

		function long (window_columns, window_rows, side) {

			for (var k = 0; k < window_columns; k++) {
				for (var l = 0; l < window_rows; l++) {
					if (u.isEven(l) && l >= 4 && l <= (window_rows - 3) ) {
						
						var windowmat = window_materials[0];
						var onstate = false;

						if ( u.flipcoin()) {
							windowmat = window_materials[u.rand(1,window_materials.length - 1,true)];
							onstate = true;
						}

						var window_mesh =  new THREE.Mesh(long_window_geometry,windowmat);
						window_mesh.onstate = onstate;
						window_mesh.name = "window";

						if (side) {

							if (xpos > campos) {
								window_mesh.position.set(
									(b.width/2) + windowbuffer, 
									(l*0.1),
									-(b.depth/4)  + (k*b.depth/2) + (0.1)
								);
								window_mesh.rotation.y = u.de2ra(90);


				 			}
				 			if (xpos < campos) {
				 				window_mesh.position.set(
				 					-((b.width/2) ) - windowbuffer, 
				 					(l*0.1),
				 					-(b.depth/4)  + (k*b.depth/2) + (0.1)
				 				);
				 				window_mesh.rotation.y = u.de2ra(-90);
				 			}
						}else{
							window_mesh.position.set(
								-(b.width/4)  + (k*b.width/2), 
								(l*0.1),
								(b.depth/2) + windowbuffer 
							);
						}

						

						current_building.add(window_mesh);
					}
				}
			}  
		};

		function small_cap (window_columns, window_rows, tier, sumofheights) {
			if (u.flipcoin()) { 
				var staggercheck = true;
			}
			for (var k = 0; k < window_columns; k++) {

				if(staggercheck){
					var stagger = u.isMultiple(k,4); 
				}
				
				if ( u.isEven(k) && stagger && staggercheck || u.isEven(k) && !staggercheck ) {
					for (var l = 0; l < window_rows; l++) {
						if (u.isEven(l) && l <= (window_rows - 2)) {
							

							var windowmat = window_materials[0];
							var onstate = false;
							if (u.flipcoin()) {
								windowmat = window_materials[u.rand(1,window_materials.length - 1,true)];
								onstate = true;
							}

							var window_mesh =  new THREE.Mesh(small_window_geometry ,windowmat);
							window_mesh.name = "window";
							window_mesh.onstate = onstate;

							window_mesh.position.set(
								-(b.width/2) + (k*0.1) + (0.065 + (0.2*tier)), 
								((l+1)*0.125) + (sumofheights*2),
								( b.depth - (b.depth*(0.2*tier)) )/2 + windowbuffer
							);

							current_building.add(window_mesh);
						}
					}
				}
			} 
		};

		function long_cap ( window_rows, tier, sumofheights ) {
			for (var l = 0; l < window_rows; l++) {
				if (u.isEven(l) && l >= 1 ) {

					var window_geometry = new THREE.PlaneGeometry( 
						b.depth - (b.depth*(0.2*tier)), 
						0.125
					);

					var windowmat =  window_materials[0];
					var onstate = false;

					if (u.flipcoin()) {
						windowmat = window_materials[u.rand(1,window_materials.length - 1,true)];
						onstate = true;

					}

					var window_mesh =  new THREE.Mesh(window_geometry,windowmat);
					window_mesh.name = "window";
					window_mesh.onstate = onstate;

					window_mesh.position.set(
						(0 ), 
						(l*0.125) + (sumofheights*2),
						( b.depth - (b.depth*(0.2*tier)) )/2 + windowbuffer
					);

					current_building.add(window_mesh);

				}
			}
		};

		return {
			small: small,
			tall: tall,
			double: double,
			long: long,
			small_cap: small_cap,
			long_cap: long_cap
		};

};
 	