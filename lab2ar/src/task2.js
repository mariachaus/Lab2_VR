import './style.css'

import * as THREE from "three"
import { ARButton } from "three/addons/webxr/ARButton.js"
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

let camera, scene, renderer;
let loader;
let model;

init();
animate();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputEncoding = THREE.sRGBEncoding;

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true; // Не забуваємо про цей рядок коду.
    container.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2); 
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 2); 
    scene.add(ambientLight);
    
    
    // Додаємо GLTF модель на сцену
    const modelUrl = 'https://raw.githubusercontent.com/mariachaus/lab2/refs/heads/main/scene.gltf';

    // Створюємо завантажувач
    loader = new GLTFLoader();
	loader.load(
        modelUrl,
        function (gltf) {
            model = gltf.scene;
            model.position.z = -1;
            scene.add(model);

            // Створюємо матеріал для моделі (якщо потрібно)
            const blueMaterial = new THREE.MeshStandardMaterial({
                color: 0x1a3196, // Золотий колір
                metalness: 0.2,
                roughness: 0.5,
                emissive: 0xc10074, 
                emissiveIntensity: 0.2, 
                near: 0,
                far: 1
            });
            
            // Змінюємо модель (якщо потрібно)
            model.traverse((child) => {
                if (child.isMesh) {
                    child.material = blueMaterial;
                    child.material.needsUpdate = true;
                }
            });

            console.log("Model added to scene");
        },

        function (xhr) {
            // console.log((xhr.loaded / xhr.total * 100) + '% loaded' );
        },

        function (error) {
            console.error(error);
        }
    );

    document.body.appendChild(ARButton.createButton(renderer));

    window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    renderer.setAnimationLoop(render);
}

function render() {
    rotateModel();
    renderer.render(scene, camera);
}
    
let degrees = 0; // кут для оберту нашої моделі
    
function rotateModel() {
    if (model !== undefined) {
        // допустима межа градусів - від 0 до 360
        // Після 360 three.js сприйматиме 360 як 0, 361 як 1, 362 як 2 і так далі
        degrees +=  0.8; 
        model.rotation.y = THREE.MathUtils.degToRad(degrees); // тут перетворюємо градуси у радіани
    } 
}