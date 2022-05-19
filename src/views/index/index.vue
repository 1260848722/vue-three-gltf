<template>
  <div class="index-content">
    <div class="index-action">
      <header class="headers">
        <nav class="header-nav">
          <ul @click="active">
            <li :class="{ active: activeValue === '1' }" data-value="1">
              首页
            </li>
            <li :class="{ active: activeValue === '2' }" data-value="2">
              首页
            </li>
            <li :class="{ active: activeValue === '3' }" data-value="3">
              首页
            </li>
            <li :class="{ active: activeValue === '4' }" data-value="4">
              首页
            </li>
            <li :class="{ active: activeValue === '5' }" data-value="5">
              首页
            </li>
          </ul>
        </nav>
      </header>
      <div class="scene" ref="scene"></div>
    </div>
  </div>
</template>
<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
// 导入轨道模型控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
export default {
  name: "Index",
  data() {
    return {
      activeValue: "1", //导航点击下标
      container: "", //获取canvs画布对象
      scene: null, //场景对象
      camera: null, //照相机
      width: null, //相机高度
      height: null,
      renderer: null, //渲染器
      controls: null,
      point: null, //光源
    };
  },
  methods: {
    active({ target }) {
      this.activeValue = target.dataset.value;
    },
    //初始化
    init() {
      //创建场景对象
      this.container = this.$refs.scene;
      this.scene = new THREE.Scene();
      this.createCamera();
      this.createRenderer();
      this.createPoint();
      this.createControls();
      this.loadModel();
      this.renderer.setAnimationLoop(() => {
        this.update();
        this.render();
      });
    },
    // 创建相机
    createCamera() {
      var width = window.innerWidth; //窗口宽度
      var height = window.innerHeight; //窗口高度
      var k = width / height; //窗口宽高比
      var s = 1; //三维场景显示范围控制系数，系数越大，显示的范围越大
      this.camera = new THREE.OrthographicCamera(-s * k, s * k, s, -s, 0.1, 100);
      this.camera.position.set(0, 0, 18);
      this.camera.lookAt(this.scene.position); //设置相机方向(指向的场景对象)
    },
    // 创建光源
    createPoint() {
      this.point = new THREE.PointLight(0xffffff);
      this.point.position.set(400, 200, 300); //点光源位置
      this.scene.add(this.point); //点光源添加到场景中
    },
    createControls() {
      this.controls = new OrbitControls(this.camera, this.container);
      this.controls.enableZoom = true;
      this.controls.minDistance = 5;
      this.controls.maxDistance = 25;
      this.controls.enablePan = false;
      this.controls.enableDamping = true;
      this.controls.dampingFactor = 0.35;
      this.controls.minPolarAngle = 1.5708;
      this.controls.maxPolarAngle = 1.5708;
      this.controls.autoRotate = true;
      this.controls.autoRotateSpeed = 0.25;
    },
    //  创建渲染画布
    createRenderer() {
      this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.autoClear = false;
      this.renderer.setClearColor(0xb9d3ff, 1);
      this.container.appendChild(this.renderer.domElement);
    },
    // 导入GLTF
    loadModel() {
      const loader = new GLTFLoader();
      loader.load(
        "/static/yari-devil-glenfx.gltf",
        (gltf) => {
          gltf.scene.position.set(0, 0, 0);
          this.scene.add(gltf.scene);
        },
        (xhr) => {
          console.log(`${(xhr.loaded / xhr.total) * 100}% loaded`);
        },
        (error) => {
          console.error("An error happened", error);
        }
      );
    },
    update() {
      this.controls.update();
    },
    render() {
      this.renderer.render(this.scene, this.camera);
    },
  },
  mounted() {
    this.init();
  },
};
</script>
<style lang="scss" scoped>
.index-content {
  width: 100vw;
  height: 100vh;
  background: url("@/assets/bg_2.jpeg") center center no-repeat;
  display: flex;
  justify-content: center;

  .index-action {
    width: 100vw;
    height: 100vh;
    background: linear-gradient(
        to right,
        rgba(0, 0, 0, 0.6),
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0.6)
      ),
      linear-gradient(
        to bottom,
        rgba(0, 0, 0, 1),
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 0),
        rgba(0, 0, 0, 1)
      );

    .headers {
      .header-nav {
        background: url("@/assets/header_ul.png") center center/100% 100%;
        height: 10vh;
        width: 70vw;
        ul {
          // width: 80%;
          line-height: 8vh;
          li {
            cursor: pointer;
            width: 120px;
            height: 42px;
            line-height: 42px;
            display: inline-block;
            background: url("@/assets/header_btn.png") center center/100% 100%;
            color: #fff;
            text-align: center;
            font-size: 16px;
          }
          .active {
            background: url("@/assets/header_btn_active.png") center center/100%
              100%;
          }
        }
      }
    }
    #container {
      width: 500px;
      height: 500px;
    }
  }
}
</style>