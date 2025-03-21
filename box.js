import * as THREE from 'three'

function showBox() {

  const oldCanvas = document.querySelector('canvas')
  if (oldCanvas) oldCanvas.remove()

    
  // Need 4 things: scene, object, camera, renderer

  const scene = new THREE.Scene()

  const image = new Image()
  const texture = new THREE.Texture(image)
  texture.colorSpace = THREE.SRGBColorSpace
  image.addEventListener('load', () => {
      texture.needsUpdate = true
  })
  image.src = '/textures/wood_door_basecolor.jpg'
  const geometry = new THREE.BoxGeometry(1, 2, 3)
  const material = new THREE.MeshBasicMaterial({ map: texture })
  const mesh = new THREE.Mesh(geometry, material)
  scene.add(mesh)
  mesh.position.set(0.7, 0.2, -0.5)

  const sizes = {
    width: window.innerWidth - 200,
    height: window.innerHeight - 200
  }
  const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height)
  camera.position.z = 3
  scene.add(camera)

  const renderer = new THREE.WebGLRenderer({ antialias: true })  
  document.body.appendChild(renderer.domElement)
  renderer.setSize(sizes.width, sizes.height)


  // Animate, adapt to frame rate
  let t1 = Date.now()
  const tick = () => {
    const t2 = Date.now()
    const dt = t2 - t1
    t1 = t2
    mesh.rotation.y += 0.01 * dt
    window.requestAnimationFrame(tick)
    renderer.render(scene, camera)
  }
      
  tick()
}

export { showBox };