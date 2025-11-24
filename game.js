import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.181.2/build/three.module.js";

// 1️⃣ Scene & Camera
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x87ceeb);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 3.5, 7);
camera.lookAt(0, 0, 0);

// 2️⃣ Renderer
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
document.body.appendChild(renderer.domElement);

// 3️⃣ Lights
const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 10, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.width = 2048;
dirLight.shadow.mapSize.height = 2048;
dirLight.shadow.camera.near = 1;
dirLight.shadow.camera.far = 50;
scene.add(dirLight);

const ambient = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambient);

// 4️⃣ 큐브
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const cubeMaterial = new THREE.MeshToonMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.position.set(0, 3, 2);
scene.add(cube);

// 6️⃣ 바닥
const floorGeometry = new THREE.PlaneGeometry(9, 1000);
const size = 512;
const canvas = document.createElement("canvas");
canvas.width = size;
canvas.height = size;
const ctx = canvas.getContext("2d");

// 아스팔트 자갈 느낌
ctx.fillStyle = "#2c2c2c";
ctx.fillRect(0, 0, size, size);
for (let i = 0; i < 5000; i++) {
  ctx.fillStyle = `rgba(200,200,200,${Math.random()})`;
  ctx.fillRect(Math.random() * size, Math.random() * size, 1, 1);
}

const asphaltTexture = new THREE.CanvasTexture(canvas);
asphaltTexture.wrapS = THREE.RepeatWrapping;
asphaltTexture.wrapT = THREE.RepeatWrapping;
asphaltTexture.repeat.set(20, 200);

const floorMaterial = new THREE.MeshStandardMaterial({ map: asphaltTexture });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2;
floor.position.y = 0;
floor.receiveShadow = true;
scene.add(floor);

// 7️⃣ 좌우선
function createInfiniteSideLines(xPosition) {
  const lineLength = 1000;
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const lineGroup = new THREE.Group();
  for (let i = 0; i < 2; i++) {
    const geometry = new THREE.BoxGeometry(0.4, 0.01, lineLength);
    const line = new THREE.Mesh(geometry, material);
    line.position.set(xPosition, -0.001, -i * lineLength);
    lineGroup.add(line);
  }
  return lineGroup;
}

const leftLine = createInfiniteSideLines(
  -floorGeometry.parameters.width / 2 + 0.4
);
const rightLine = createInfiniteSideLines(
  floorGeometry.parameters.width / 2 - 0.4
);
scene.add(leftLine, rightLine);

// 8️⃣ 중앙 점선
function createCenterLine(floorWidth, floorLength) {
  const lineWidth = 0.5;
  const lineHeight = 0.01;
  const dashLength = 10;
  const gapLength = 10;
  const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
  const centerLineGroup = new THREE.Group();
  let z = -floorLength / 2;
  while (z < floorLength / 2) {
    const geometry = new THREE.BoxGeometry(lineWidth, lineHeight, dashLength);
    const dash = new THREE.Mesh(geometry, material);
    dash.position.set(0, -0.001, z + dashLength / 2);
    centerLineGroup.add(dash);
    z += dashLength + gapLength;
  }
  return centerLineGroup;
}

const centerLine = createCenterLine(
  floorGeometry.parameters.width,
  floorGeometry.parameters.height
);
scene.add(centerLine);

// 9️⃣ 건물 텍스처
const buildingTexture = new THREE.TextureLoader().load("./images/bui.png");
buildingTexture.wrapS = THREE.RepeatWrapping;
buildingTexture.wrapT = THREE.RepeatWrapping;

// 10️⃣ 건물 생성
function createBuildings(xPosition, floorLength) {
  const group = new THREE.Group();
  const buildingMaterial = new THREE.MeshStandardMaterial({
    map: buildingTexture,
  });
  const count = 40;
  for (let i = 0; i < count; i++) {
    const width = 3 + Math.random() * 2;
    const height = 5 + Math.random() * 50;
    const depth = 2 + Math.random() * 3;
    const geometry = new THREE.BoxGeometry(width, height, depth);
    const building = new THREE.Mesh(geometry, buildingMaterial);
    building.castShadow = true;
    building.receiveShadow = true;
    // 건물 아래 바닥 플랫폼

    const baseGeo = new THREE.BoxGeometry(width, 0.2, depth);

    const baseMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });

    const base = new THREE.Mesh(baseGeo, baseMaterial);

    base.position.set(0, -height / 2 - 0.1, 0);

    base.castShadow = true;

    base.receiveShadow = true;

    building.add(base);

    const zPos = Math.random() * floorLength - floorLength / 2;

    building.position.set(xPosition - 0.1, -0.3 + height / 2, zPos);

    group.add(building);
  }
  return group;
}

// 10️⃣ 건물 생성 아래에 추가: 인도를 생성하는 함수
function createSidewalk(xPosition, floorLength, width, height) {
  const geometry = new THREE.BoxGeometry(width, height, floorLength);
  const material = new THREE.MeshStandardMaterial({ color: 0x444444 }); // 인도 색상
  const sidewalk = new THREE.Mesh(geometry, material);

  // X축 위치: 건물 그룹의 중심과 인도의 너비를 고려하여 배치
  // Y축 위치: 바닥 바로 위 (-0.001)에 높이의 절반을 더함
  sidewalk.position.set(xPosition, height / 2, 0);

  sidewalk.receiveShadow = true;
  sidewalk.castShadow = true;

  return sidewalk;
}

const floorLength = floorGeometry.parameters.height; // 1000

// 인도(Sidewalk) 생성 및 추가
const sidewalkWidth = 7; // 인도의 너비
const sidewalkHeight = 0.02; // 인도의 높이 (바닥 위로 튀어나오게)
const roadHalfWidth = floorGeometry.parameters.width / 2;

// 왼쪽 인도 (왼쪽 건물 그룹 옆에 배치)
const leftSidewalkX = -roadHalfWidth - sidewalkWidth / 2 + 0.1;
const leftSidewalk = createSidewalk(
  leftSidewalkX,
  floorLength,
  sidewalkWidth,
  sidewalkHeight
);

// 오른쪽 인도 (오른쪽 건물 그룹 옆에 배치)
const rightSidewalkX = roadHalfWidth + sidewalkWidth / 2 - 0.1;
const rightSidewalk = createSidewalk(
  rightSidewalkX,
  floorLength,
  sidewalkWidth,
  sidewalkHeight
);

scene.add(leftSidewalk, rightSidewalk);

// 건물 아래 플랫폼 만들기
const leftBuildings = createBuildings(leftSidewalkX, floorLength);
const rightBuildings = createBuildings(rightSidewalkX, floorLength);
scene.add(leftBuildings, rightBuildings);

// 자연스러운 이동(건물)
function loopBuildings(buildingGroup) {
  buildingGroup.children.forEach((building) => {
    // 카메라 반대 방향으로 이동
    building.position.z += runSpeed;

    // 앞쪽으로 지나가면 뒤로 재배치
    if (building.position.z > camera.position.z + floorLength / 2) {
      building.position.z -= floorLength;
    }
  });
}

// 11️⃣ 큐브 점프 및 이동
let velocityY = 0;
let gravity = -0.01;
let jumpPower = 0.22;
let isJumping = false;
const groundY = 0.5;
let currentLane = 0;
const laneOffset = 1.5;
const laneMoveSpeed = 0.15;

window.addEventListener("keydown", (e) => {
  if (e.code === "Space" && !isJumping) {
    velocityY = jumpPower;
    isJumping = true;
  }
  if ((e.code === "ArrowLeft" || e.code === "KeyA") && currentLane > -1.5) {
    currentLane -= 1.5;
  }
  if ((e.code === "ArrowRight" || e.code === "KeyD") && currentLane < 1.5) {
    currentLane += 1.5;
  }
});

// 12️⃣ 애니메이션
let runSpeed = 0.3;
function animate() {
  requestAnimationFrame(animate);

  cube.rotation.x -= 0;
  cube.rotation.y -= 0;

  camera.position.z -= 0.3;
  cube.position.z -= runSpeed;
  floor.position.z = camera.position.z - 0.3;

  // 점프 물리
  velocityY += gravity;
  cube.position.y += velocityY;
  const targetX = currentLane * laneOffset;
  cube.position.x += (targetX - cube.position.x) * laneMoveSpeed;
  if (cube.position.y <= groundY) {
    cube.position.y = groundY;
    velocityY = 0;
    isJumping = false;
  }

  // 점선/좌우선 루프
  const loopOffset = 1000;
  centerLine.children.forEach((d) => {
    if (d.position.z > camera.position.z + 20) d.position.z -= loopOffset;
  });
  [leftLine, rightLine].forEach((line) => {
    if (line.position.z > camera.position.z + loopOffset)
      line.position.z -= loopOffset;
  });

  // ⬇️ 바닥 Z 위치 동기화
  floor.position.z = camera.position.z - 0.3;

  // ⬇️ 사이드워크 Z 위치 동기화 (추가)
  if (leftSidewalk && rightSidewalk) {
    // 메쉬가 존재하는지 확인
    leftSidewalk.position.z = camera.position.z - 0.3;
    rightSidewalk.position.z = camera.position.z - 0.3;
  }

  // 건물 루프
  loopBuildings(leftBuildings);
  loopBuildings(rightBuildings);

  renderer.render(scene, camera);
}
animate();

// 13️⃣ 리사이즈
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
