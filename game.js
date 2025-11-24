import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.181.2/build/three.module.js";

// 1. Scene 생성
const scene = new THREE.Scene();

// 2. Camera 설정
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3.5, 7);
camera.lookAt(0, 0, 0);

// 3. Renderer
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Toon Light 추가
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 10, 5);
scene.add(dirLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

// 4. Toon Material Cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshToonMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
cube.position.y = 0.5;
cube.position.z = 2;
scene.add(cube);

// 박스도 toon으로 변경
const boxGeo = new THREE.BoxGeometry(2, 10, 10);
const boxMat = new THREE.MeshToonMaterial({ color: 0x0000ff });
const box = new THREE.Mesh(boxGeo, boxMat);
box.position.set(4.5, 0.5, 0);
scene.add(box);

// const boxGeo2 = new THREE.BoxGeometry(2, 10, 10);
// const boxMat2 = new THREE.MeshToonMaterial({ color: 0x0000ff });
// const box2 = new THREE.Mesh(boxGeo2, boxMat2);
// box.position.set(0, 2, 0);
// scene.add(box);

// 헬퍼
scene.add(new THREE.AxesHelper(10));

// 바닥
const floorGeometry = new THREE.PlaneGeometry(8, window.innerHeight);
const floorMaterial = new THREE.MeshToonMaterial({ color: 0x808080 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
scene.add(floor);

// 큐브 점프 넣기
// 점프 관련 변수
let velocityY = 0;
let gravity = -0.01;
let jumpPower = 0.22;
let isJumping = false;
const groundY = 0.5; // 큐브 높이 1이므로 바닥 위 y=0.5

// 스페이스바로 점프
window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isJumping) {
    velocityY = jumpPower;
    isJumping = true;
  }
});

// 애니메이션
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x -= 0.01;
  cube.rotation.y -= 0.01;
  // 카메라 Z 전진
  camera.position.z -= 0.05;
  let runSpeed = 0.05;
  // 길이 뒤로 흘러가는 효과
  cube.position.z -= runSpeed;
  floor.position.z = camera.position.z - 5;
  // 점프 관련 물리 업데이트
  velocityY += gravity;
  cube.position.y += velocityY;
  // 바닥에 착지 처리
  if (cube.position.y <= groundY) {
    cube.position.y = groundY;
    velocityY = 0;
    isJumping = false;
  }
  renderer.render(scene, camera);
}
animate();

// 리사이즈 처리
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
