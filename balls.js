// Three.js - Shadows - Fake
// from https://threejs.org/manual/examples/shadows-fake.html

import * as THREE from 'three';

export const showBalls = () => {

  const oldCanvas = document.querySelector('canvas')
  if (oldCanvas) oldCanvas.remove()

  document.body.appendChild(document.createElement('canvas'))

	const canvas = document.querySelector( 'canvas' );
	const renderer = new THREE.WebGLRenderer( { antialias: true, canvas } );

	const fov = 50;
	const aspect = 2; // the canvas default
	const near = 0.1;
	const far = 50;
	const camera = new THREE.PerspectiveCamera( fov, aspect, near, far );
	camera.position.set( 0, 10, 20 );
	camera.lookAt( 0, 0, 0 );

	const scene = new THREE.Scene();
	scene.background = new THREE.Color( 'steelblue' );

	const loader = new THREE.TextureLoader();

	{
		const planeSize = 50;
		const texture = loader.load( 'textures/checker.png' );
		texture.wrapS = THREE.RepeatWrapping;
		texture.wrapT = THREE.RepeatWrapping;
		texture.magFilter = THREE.NearestFilter;
		texture.colorSpace = THREE.SRGBColorSpace;
		const repeats = planeSize / 2;
		texture.repeat.set( repeats, repeats );

		const planeGeo = new THREE.PlaneGeometry( planeSize, planeSize );
		const planeMat = new THREE.MeshBasicMaterial( {
			map: texture,
			side: THREE.DoubleSide,
		} );
		planeMat.color.setRGB( 1.5, 1.5, 1.5 );
		const mesh = new THREE.Mesh( planeGeo, planeMat );
		mesh.rotation.x = Math.PI * - .5;
		scene.add( mesh );

	}

	const shadowTexture = loader.load( 'textures/roundshadow.png' );
	const sphereShadowBases = [];
	{
		const sphereRadius = 1;
		const sphereWidthDivisions = 32;
		const sphereHeightDivisions = 16;
		const sphereGeo = new THREE.SphereGeometry( sphereRadius, sphereWidthDivisions, sphereHeightDivisions );

		const planeSize = sphereRadius;
		const shadowGeo = new THREE.PlaneGeometry( planeSize, planeSize );

		const numSpheres = 10;
		for ( let i = 0; i < numSpheres; ++ i ) {

			// make a base for the shadow and the sphere.
			// so they move together.
			const base = new THREE.Object3D();
			scene.add( base );

			// add shadow to the base
			// we make a new material for each sphere
			// so we can set that sphere's material transparency separately.
			const shadowMat = new THREE.MeshBasicMaterial( {
				map: shadowTexture,
				transparent: true, // so we can see the ground
				depthWrite: false, // so we don't have to sort
			} );
			const shadowMesh = new THREE.Mesh( shadowGeo, shadowMat );
			shadowMesh.position.y = 0.001; // so we're above the ground slightly
			shadowMesh.rotation.x = Math.PI * -0.5;
			const shadowSize = sphereRadius * 4;
			shadowMesh.scale.set( shadowSize, shadowSize, shadowSize );
			base.add( shadowMesh );

			// add the sphere to the base
			const u = i / numSpheres;
			const sphereMat = new THREE.MeshPhongMaterial();
			sphereMat.color.setHSL( u, 1, .75 );
			const sphereMesh = new THREE.Mesh( sphereGeo, sphereMat );
			sphereMesh.position.set( 0, sphereRadius + 2, 0 );
			base.add( sphereMesh );

			// kepp all 3 plus the y position
			sphereShadowBases.push( { base, sphereMesh, shadowMesh, y: sphereMesh.position.y } );
		}
	}

  // Add two lightings
	{
		const skyColor = 0xB1EEFF; // light blue
		const groundColor = 0xaaaaaa; // grey
		const intensity = 0.75;
		const light = new THREE.HemisphereLight( skyColor, groundColor, intensity );
		scene.add( light );
	}
	{
		const color = 0xFFFFFF;
		const intensity = 2.5;
		const light = new THREE.DirectionalLight( color, intensity );
		light.position.set( 0, 10, 5 );
		light.target.position.set( - 5, 0, 0 );
		scene.add( light );
		scene.add( light.target );
	}

	function resizeRendererToDisplaySize( renderer ) {
		const canvas = renderer.domElement;
		const width = canvas.clientWidth;
		const height = canvas.clientHeight;
		const needResize = canvas.width !== width || canvas.height !== height;
		if ( needResize ) {
			renderer.setSize( width, height, false );
		}
		return needResize;
	}

	function render( time ) {
		time *= 0.001; // convert to seconds
		resizeRendererToDisplaySize( renderer );
		{
			const canvas = renderer.domElement;
			camera.aspect = canvas.clientWidth / canvas.clientHeight;
			camera.updateProjectionMatrix();
		}

		sphereShadowBases.forEach((sphereShadowBase, ndx) => {
			const { base, sphereMesh, shadowMesh, y } = sphereShadowBase;
			// u is a value that goes from 0 to 1 as we iterate the spheres
			const u = ndx / sphereShadowBases.length;
			// compute a position for their base. This will move
			// both the sphere and its shadow
			const speed = time * 0.2;
			const angle = speed + u * Math.PI * 2 * ( ndx % 1 ? 1 : - 1 );
			const radius = Math.sin( speed - ndx ) * 10;
			base.position.set( Math.cos( angle ) * radius, 0, Math.sin( angle ) * radius );

			// yOff is a value that goes from 0 to 1
			const yOff = Math.abs( Math.sin( time * 2 + ndx ) );
			// move the sphere up and down
			sphereMesh.position.y = y + THREE.MathUtils.lerp( - 2, 2, yOff );
			// fade the shadow as the sphere goes up
			shadowMesh.material.opacity = THREE.MathUtils.lerp( 1, .25, yOff );
		} );
		renderer.render( scene, camera );
		requestAnimationFrame( render );
	}
	requestAnimationFrame( render );
}


