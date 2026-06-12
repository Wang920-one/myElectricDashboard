<template>
  <div class="three-scene-wrap">
    <div ref="containerRef" class="three-container"></div>
    <div class="scene-hud">
      <span class="hud-tag">数字孪生 · 厂区</span>
      <span class="hud-tip">拖拽旋转 · 滚轮缩放 · 点击建筑添加标记</span>
      <span v-if="markerCount" class="hud-count"
        >已标记 {{ markerCount }} 处</span
      >
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

const containerRef = ref(null);
const markerCount = ref(0);

let renderer = null;
let scene = null;
let camera = null;
let controls = null;
let animationId = null;
let raycaster = null;
let pointer = null;
let factoryGroup = null;
let markerGroup = null;
let flowParticles = [];
let resizeObserver = null;

/** 低饱和度配色 */
const COLORS = {
  bg: 0x1c2430,
  node: 0x6b8299,
  line: 0x4a6070,
  particle: 0x7eb8c9,
  ground: 0x3d4f5c,
  building: [0x7a8fa0, 0x8899a8, 0x6d7f8f, 0x95a3b0, 0x748998],
};

/** 创建厂区低模 */
function createFactory() {
  const group = new THREE.Group();
  group.name = "factory";

  const ground = new THREE.Mesh(
    new THREE.PlaneGeometry(28, 22),
    new THREE.MeshStandardMaterial({
      color: COLORS.ground,
      roughness: 0.92,
      metalness: 0.05,
    })
  );
  ground.rotation.x = -Math.PI / 2;
  ground.receiveShadow = true;
  ground.userData.type = "factory";
  group.add(ground);

  const addBuilding = (w, h, d, x, y, z, colorIdx, name) => {
    const mesh = new THREE.Mesh(
      new THREE.BoxGeometry(w, h, d),
      new THREE.MeshStandardMaterial({
        color: COLORS.building[colorIdx % COLORS.building.length],
        roughness: 0.78,
        metalness: 0.12,
      })
    );
    mesh.position.set(x, y + h / 2, z);
    mesh.castShadow = true;
    mesh.receiveShadow = true;
    mesh.userData.type = "factory";
    mesh.userData.buildingName = name;
    group.add(mesh);
  };

  addBuilding(10, 2.2, 6, -4, 0, 2, 0, "主厂房");
  addBuilding(6, 3.5, 4, 5, 0, -1, 1, "办公楼");
  addBuilding(8, 1.8, 5, 2, 0, 4, 2, "仓储中心");
  addBuilding(3, 4.5, 3, -6, 0, -4, 3, "变电站");
  addBuilding(2, 6, 2, -6.5, 0, -4, 4, "输电塔");

  const roof = new THREE.Mesh(
    new THREE.BoxGeometry(10.2, 0.3, 6.2),
    new THREE.MeshStandardMaterial({ color: 0x5c6d7a, roughness: 0.85 })
  );
  roof.position.set(-4, 2.35, 2);
  roof.userData.type = "factory";
  group.add(roof);

  return group;
}

/** 背景节点网络 */
// function createNodeNetwork() {
//     const group = new THREE.Group()
//     group.name = 'nodeNetwork'

//     const nodePositions = []
//     const layers = [
//         { count: 8, y: 6, radius: 10 },
//         { count: 10, y: 9, radius: 12 },
//         { count: 6, y: 12, radius: 8 },
//     ]

//     layers.forEach((layer) => {
//         for (let i = 0; i < layer.count; i++) {
//             const angle = (i / layer.count) * Math.PI * 2 + layer.y * 0.2
//             const r = layer.radius + (Math.random() - 0.5) * 2
//             nodePositions.push(
//                 new THREE.Vector3(
//                     Math.cos(angle) * r,
//                     layer.y + (Math.random() - 0.5) * 1.5,
//                     Math.sin(angle) * r
//                 )
//             )
//         }
//     })

//     const nodeGeo = new THREE.SphereGeometry(0.18, 10, 10)
//     const nodeMat = new THREE.MeshBasicMaterial({
//         color: COLORS.node,
//         transparent: true,
//         opacity: 0.75,
//     })

//     nodePositions.forEach((pos) => {
//         const node = new THREE.Mesh(nodeGeo, nodeMat)
//         node.position.copy(pos)
//         group.add(node)
//     })

//     const edges = []
//     for (let i = 0; i < nodePositions.length; i++) {
//         const next = (i + 1) % nodePositions.length
//         edges.push([nodePositions[i], nodePositions[next]])
//         if (i % 3 === 0) {
//             const far = (i + 4) % nodePositions.length
//             edges.push([nodePositions[i], nodePositions[far]])
//         }
//     }

//     const lineMat = new THREE.LineBasicMaterial({
//         color: COLORS.line,
//         transparent: true,
//         opacity: 0.35,
//     })

//     edges.forEach(([a, b]) => {
//         const geo = new THREE.BufferGeometry().setFromPoints([a, b])
//         group.add(new THREE.Line(geo, lineMat))

//         const count = 1 + Math.floor(Math.random() * 2)
//         for (let p = 0; p < count; p++) {
//             const particle = new THREE.Mesh(
//                 new THREE.SphereGeometry(0.08, 6, 6),
//                 new THREE.MeshBasicMaterial({
//                     color: COLORS.particle,
//                     transparent: true,
//                     opacity: 0.85,
//                 })
//             )
//             flowParticles.push({
//                 mesh: particle,
//                 from: a.clone(),
//                 to: b.clone(),
//                 progress: Math.random(),
//                 speed: 0.15 + Math.random() * 0.2,
//             })
//             group.add(particle)
//         }
//     })

//     return group
// }

/** Canvas 纹理 Sprite 标记 */
function createMarkerSprite(label, index) {
  const size = 128;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");

  const grd = ctx.createRadialGradient(
    size / 2,
    size / 2,
    4,
    size / 2,
    size / 2,
    40
  );
  grd.addColorStop(0, "rgba(126, 184, 201, 0.95)");
  grd.addColorStop(0.6, "rgba(79, 130, 160, 0.6)");
  grd.addColorStop(1, "rgba(79, 130, 160, 0)");

  ctx.fillStyle = grd;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 38, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "rgba(200, 230, 240, 0.9)";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 14, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = "#e8f4f8";
  ctx.font = 'bold 22px "PingFang SC", sans-serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(String(index), size / 2, size / 2);

  ctx.fillStyle = "rgba(200, 230, 240, 0.85)";
  ctx.font = '14px "PingFang SC", sans-serif';
  ctx.fillText(label.slice(0, 4), size / 2, size / 2 + 28);

  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;

  const material = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });

  const sprite = new THREE.Sprite(material);
  sprite.scale.set(1.6, 1.6, 1);
  sprite.renderOrder = 999;
  return sprite;
}

function initScene() {
  const container = containerRef.value;
  if (!container) return;

  const width = container.clientWidth;
  const height = container.clientHeight;

  scene = new THREE.Scene();
  scene.background = new THREE.Color(COLORS.bg);
  scene.fog = new THREE.Fog(COLORS.bg, 18, 42);

  camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
  camera.position.set(14, 10, 16);

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.06;
  controls.maxPolarAngle = Math.PI / 2.05;
  controls.minDistance = 8;
  controls.maxDistance = 32;
  controls.target.set(0, 2, 0);

  const ambient = new THREE.AmbientLight(0x8fa3b5, 0.55);
  scene.add(ambient);

  const dirLight = new THREE.DirectionalLight(0xc8d8e4, 0.85);
  dirLight.position.set(10, 18, 8);
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.set(1024, 1024);
  scene.add(dirLight);

  const fillLight = new THREE.DirectionalLight(0x5a7088, 0.35);
  fillLight.position.set(-8, 6, -6);
  scene.add(fillLight);

  // scene.add(createNodeNetwork())

  factoryGroup = createFactory();
  scene.add(factoryGroup);

  markerGroup = new THREE.Group();
  markerGroup.name = "markers";
  scene.add(markerGroup);

  const grid = new THREE.GridHelper(30, 30, 0x3a4a58, 0x2a3540);
  grid.position.y = 0.01;
  grid.material.opacity = 0.25;
  grid.material.transparent = true;
  scene.add(grid);

  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();

  renderer.domElement.addEventListener("pointerdown", onPointerDown);
  animate();
}

let pointerDownPos = { x: 0, y: 0 };

function onPointerDown(event) {
  pointerDownPos.x = event.clientX;
  pointerDownPos.y = event.clientY;
  renderer.domElement.addEventListener("pointerup", onPointerUp, {
    once: true,
  });
}

function onPointerUp(event) {
  const dx = event.clientX - pointerDownPos.x;
  const dy = event.clientY - pointerDownPos.y;
  if (Math.hypot(dx, dy) > 6) return;

  const container = containerRef.value;
  if (!container || !factoryGroup || !camera) return;

  const rect = container.getBoundingClientRect();
  pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObjects(factoryGroup.children, true);

  const hit = intersects.find(
    (item) => item.object.userData.type === "factory"
  );
  if (!hit) return;

  markerCount.value += 1;
  const label = hit.object.userData.buildingName || "监测点";
  const sprite = createMarkerSprite(label, markerCount.value);
  sprite.position.copy(hit.point);
  sprite.position.y += 0.35;
  markerGroup.add(sprite);
}

function updateFlowParticles(delta) {
  flowParticles.forEach((p) => {
    p.progress += p.speed * delta;
    if (p.progress >= 1) {
      p.progress = 0;
      const tmp = p.from;
      p.from = p.to;
      p.to = tmp;
    }
    p.mesh.position.lerpVectors(p.from, p.to, p.progress);
    const pulse = 0.7 + Math.sin(p.progress * Math.PI * 4) * 0.3;
    p.mesh.material.opacity = pulse;
  });
}

function animate() {
  animationId = requestAnimationFrame(animate);
  const delta = 0.016;
  updateFlowParticles(delta);
  controls?.update();
  renderer?.render(scene, camera);
}

function handleResize() {
  const container = containerRef.value;
  if (!container || !camera || !renderer) return;
  const width = container.clientWidth;
  const height = container.clientHeight;
  if (width === 0 || height === 0) return;
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
}

function disposeScene() {
  if (animationId) cancelAnimationFrame(animationId);
  renderer?.domElement?.removeEventListener("pointerdown", onPointerDown);
  resizeObserver?.disconnect();

  flowParticles = [];

  scene?.traverse((obj) => {
    if (obj.geometry) obj.geometry.dispose();
    if (obj.material) {
      if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
      else obj.material.dispose();
    }
    if (obj.material?.map) obj.material.map.dispose();
  });

  renderer?.dispose();
  if (renderer?.domElement?.parentNode) {
    renderer.domElement.parentNode.removeChild(renderer.domElement);
  }

  scene = null;
  camera = null;
  renderer = null;
  controls = null;
  factoryGroup = null;
  markerGroup = null;
}

onMounted(() => {
  initScene();
  resizeObserver = new ResizeObserver(handleResize);
  if (containerRef.value) resizeObserver.observe(containerRef.value);
});

onUnmounted(disposeScene);
</script>

<style lang="scss" scoped>
.three-scene-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 420px;
  overflow: hidden;
  border-radius: 8px;
}

.three-container {
  width: 100%;
  height: 100%;

  :deep(canvas) {
    display: block;
    outline: none;
  }
}

.scene-hud {
  position: absolute;
  top: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 8px 12px;
  pointer-events: none;
  z-index: 2;
}

.hud-tag {
  padding: 4px 10px;
  font-size: 12px;
  font-weight: 600;
  color: rgba(200, 230, 240, 0.95);
  background: rgba(28, 36, 48, 0.65);
  backdrop-filter: blur(6px);
  border: 1px solid rgba(126, 184, 201, 0.25);
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.hud-tip {
  font-size: 11px;
  color: rgba(180, 200, 215, 0.75);
}

.hud-count {
  margin-left: auto;
  font-size: 11px;
  color: rgba(126, 184, 201, 0.9);
  padding: 3px 8px;
  background: rgba(28, 36, 48, 0.5);
  border-radius: 4px;
}
</style>
