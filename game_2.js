import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// 1️⃣ Scene & Camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

// 카메라 초기 위치 (자동차 위, 뒤쪽)
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 2️⃣ Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// 3️⃣ Lights
const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
scene.add(dirLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambient);

// 4️⃣ 자동차 모델 로드
let car;
const loader = new GLTFLoader();
loader.load(
  "./models/tesla.glb", // 자동차 GLB 경로
  (gltf) => {
    car = gltf.scene;
    car.scale.set(0.01, 0.01, 0.01);
    car.position.set(0, 0, 0);
    car.rotation.y = Math.PI; // 정면 회전

    car.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(car);
    console.log("🚗 자동차 로드 완료");
  },
  undefined,
  (err) => console.error(err)
);

// 5️⃣ 카메라 애니메이션 설정
let angle = 0;
const radius = 5; // 자동차 주위를 도는 거리
const height = 2; // 카메라 높이

function animate() {
  requestAnimationFrame(animate);

  if (car) {
    // 자동차 주위를 원형으로 카메라 이동
    angle += 0.01;
    camera.position.x = car.position.x + radius * Math.sin(angle);
    camera.position.z = car.position.z + radius * Math.cos(angle);
    camera.position.y = car.position.y + height;

    // 항상 자동차를 바라보도록
    camera.lookAt(car.position);
  }

  renderer.render(scene, camera);
}

// 6️⃣ 리사이즈 대응
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
