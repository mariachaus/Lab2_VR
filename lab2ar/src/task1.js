import './style.css'

import * as THREE from "three"
import { ARButton } from "three/addons/webxr/ARButton.js"
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

let camera, scene, renderer;
let cylinderMesh, torusMesh, octahedronMesh; 
let controls;

init();
animate();

function init() {
    const container = document.createElement('div');
    document.body.appendChild(container);

    // Сцена
    scene = new THREE.Scene();

    // Камера
    camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.01, 40);

    // Об'єкт рендерингу
    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
            
    renderer.xr.enabled = true; // Життєво важливий рядок коду для вашого застосунку!
    container.appendChild(renderer.domElement);
            
    // Світло
    const directionalLight = new THREE.DirectionalLight(0xf6b26b, 2); 
    directionalLight.position.set(3, 3, 3);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xf6b26b, 5, 10); 
    pointLight.position.set(-2, 2, 2);
    scene.add(pointLight);

    
    const ambientLight = new THREE.AmbientLight(0x5d194d, 1.2); 
    scene.add(ambientLight);
    
    // 1. Створюємо об'єкт циліндра
    const CylinderGeometry = new THREE.CylinderGeometry(0.4, 0.2, 0.6);
    
    // Матеріал для першого об'єкту 
    const glassMaterial = new THREE.MeshPhysicalMaterial({
        color: 0x87CEEB, 
        transparent: true,
        opacity: 0.5,
        roughness: 0.4,
        metalness: 0.8,
        reflectivity: 1.0,
        transmission: 0.8,
    });

    // Створюємо меш
    cylinderMesh = new THREE.Mesh(CylinderGeometry, glassMaterial);
    cylinderMesh.position.x = -1.0;
    cylinderMesh.position.z = -1.0;
    scene.add(cylinderMesh);

    // 2. Створюємо об'єкт Torus Knot
    const torusGeometry = new THREE.TorusKnotGeometry(0.2, 0.08, 100, 16);
    // Матеріал для другого
    const emissiveMaterial = new THREE.MeshStandardMaterial({
        color: 0xcfe2f3, 
        emissive: 0x0000ff, 
        emissiveIntensity: 3, 
        metalness: 0.5,
        roughness: 0.2,
    });
    // Створюємо наступний меш
    torusMesh = new THREE.Mesh(torusGeometry, emissiveMaterial);
    scene.add(torusMesh);

    // 3. Створюємо об'єкт Icosahedron
    const octahedronGeometry = new THREE.OctahedronGeometry(0.2, 0);
    // Матеріал для третього
    const goldMaterial = new THREE.MeshStandardMaterial({
        color: 0xea9999,
        metalness: 1,
        roughness: 0.3,
    });

    // Створюємо наступний меш
    octahedronMesh = new THREE.Mesh(octahedronGeometry, goldMaterial);
    octahedronMesh.position.x = 1.0;
    octahedronMesh.position.z = -1.0;
    scene.add(octahedronMesh);
    
    // Позиція для камери
    camera.position.z = 5;

    // Контролери для 360 огляду на вебсторінці, але не під час AR-сеансу
    controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

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
    controls.update();
}

function render() {
    rotateObjects();
    renderer.render(scene, camera);
}
    
function rotateObjects() {
    cylinderMesh.rotation.x += 0.1;
    torusMesh.rotation.x -= 0.05;
    octahedronMesh.rotation.y += 0.03;
}