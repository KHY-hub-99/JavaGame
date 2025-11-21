import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.181.2/build/three.module.js";

// 1. Scene 생성
const scene = new THREE.Scene();

// 2. Camera 설정 (시야각, 비율, near, far)
const camera = new THREE.PerspectiveCamera(
  60, // 시야각
  window.innerWidth / window.innerHeight,
  0.1, // near (보이는 최소 거리)
  1000 // far (보이는 최대거리)
);
camera.position.set(0, 3.5, 7); // x, y, z 위치 모두 올려서 대각선 위쪽에서 바라보게
camera.lookAt(0, 0, 0); // 씬의 중심을 바라보게 설정

// 3. Renderer 생성 + 화면에 추가
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// 3-1. 컨트롤러 조정
// const controls = new THREE.O(camera, renderer, domElement);
// controls.enableDamping = true; // 관성 효과
// controls.dampingFactor = 0.1;

// 4. Mesh 생성 (Geometry + Material)
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 박스 생성
const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const boxMat = new THREE.MeshStandardMaterial({ color: 0x0000ff });
const box = new THREE.Mesh(boxGeo, boxMat);

// 위치 조정: 바닥(floor) 옆
box.position.set(3, 0.5, 0); // x=2면 바닥 오른쪽으로 조금 떨어진 위치, y=0.5로 바닥 위에 올라감
scene.add(box);

// 4-1. 축 헬퍼
const axesHelper = new THREE.AxesHelper(10);
scene.add(axesHelper);

// 4-2. 길 추가
const floorGeometry = new THREE.PlaneGeometry(6, window.innerHeight);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = -0.5;
scene.add(floor);

// 5. 카메라 위치 조정
camera.position.z = 5.5;

// 6. 애니메이션 루프
function animate() {
  requestAnimationFrame(animate);
  cube.rotation.x -= 0.01;
  cube.rotation.y -= 0.01;
  // controls.update();
  renderer.render(scene, camera);
}

// 실행
animate();

// 창 크기 변경 시 카메라 및 렌더러 재설정
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
