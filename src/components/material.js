var registerComponent = require('../core/register-component');
var pbrFragmentShader = require('../shaders/pbrFragment.glsl');
var pbrVertexShader = require('../shaders/pbrVertex.glsl');
var THREE = require('../../lib/three');

var defaults = {
  color: Math.random() * 0xffffff,
  roughness: 1.0,
  metallic: 0.5,
  lightIntensity: 7.001
};

module.exports.Component = registerComponent('material', {

  update: {
    value: function () {
      var object3D = this.el.object3D;
      object3D.material = this.getMaterial();
    }
  },

  getMaterial: {
    value: function () {
      var data = this.data;
      var material = data.url ? this.getTextureMaterial() : this.getPBRMaterial();
      return material;
    }
  },

  getTextureMaterial: {
    value: function () {
      var data = this.data;
      var url = data.url;
      return this.setupTextureMaterial(url);
    }
  },

  setupTextureMaterial: {
    value: function (url) {
      var data = this.data;
      var color = data.color || 0xffffff;
      var texture = THREE.ImageUtils.loadTexture(url);
      var material = this.textureMaterial || new THREE.MeshBasicMaterial({
        color: color,
        side: THREE.DoubleSide
      });
      material.map = texture;
      this.textureMaterial = material;
      return material;
    }
  },

  getPBRMaterial: {
    value: function () {
      var data = this.data;
      var material = this.pbrMaterial || this.setupPBRMaterial();
      var color = data.color || defaults.color;
      color = new THREE.Color(color);
      color = new THREE.Vector3(color.r, color.g, color.b);
      material.uniforms.baseColor.value = color;
      material.uniforms.roughness.value = data.roughness || defaults.roughness;
      material.uniforms.metallic.value = data.metallic || defaults.metallic;
      material.uniforms.lightIntensity.value = data.lightIntensity || defaults.lightIntensity;
      return material;
    }
  },

  setupPBRMaterial: {
    value: function () {
      // Shader parameters
      var baseColor = new THREE.Vector3(0.5, 0.5, 0.5);
      var roughness = 1.0;
      var metallic = 0.5;
      var lightIntensity = 7.001;

      // See comments of the function ComputeEnvColor for the explanations on this hug number of cubemaps.
      // Cube Map mip 0
      var path = '../_images/pbr/maskonaive_m00_c0';
      var format = '.png';
      var urls = [
        path + '0' + format, path + '1' + format,
        path + '2' + format, path + '3' + format,
        path + '4' + format, path + '5' + format
      ];
      var cubeMapMip0 = THREE.ImageUtils.loadTextureCube(urls);
      cubeMapMip0.format = THREE.RGBFormat;

      // Cube Map mip 1
      path = '../_images/pbr/maskonaive_m01_c0';
      format = '.png';
      urls = [
        path + '0' + format, path + '1' + format,
        path + '2' + format, path + '3' + format,
        path + '4' + format, path + '5' + format
      ];
      var cubeMapMip1 = THREE.ImageUtils.loadTextureCube(urls);
      cubeMapMip1.format = THREE.RGBFormat;

      // Cube Map mip 2
      path = '../_images/pbr/maskonaive_m02_c0';
      format = '.png';
      urls = [
        path + '0' + format, path + '1' + format,
        path + '2' + format, path + '3' + format,
        path + '4' + format, path + '5' + format
      ];
      var cubeMapMip2 = THREE.ImageUtils.loadTextureCube(urls);
      cubeMapMip2.format = THREE.RGBFormat;

      // Cube Map mip 3
      path = '../_images/pbr/maskonaive_m03_c0';
      format = '.png';
      urls = [
        path + '0' + format, path + '1' + format,
        path + '2' + format, path + '3' + format,
        path + '4' + format, path + '5' + format
      ];
      var cubeMapMip3 = THREE.ImageUtils.loadTextureCube(urls);
      cubeMapMip3.format = THREE.RGBFormat;

      // Cube Map mip 4
      path = '../_images/pbr/maskonaive_m04_c0';
      format = '.png';
      urls = [
        path + '0' + format, path + '1' + format,
        path + '2' + format, path + '3' + format,
        path + '4' + format, path + '5' + format
      ];
      var cubeMapMip4 = THREE.ImageUtils.loadTextureCube(urls);
      cubeMapMip4.format = THREE.RGBFormat;

      // Cube Map mip 5
      path = '../_images/pbr/maskonaive_m05_c0';
      format = '.png';
      urls = [
        path + '0' + format, path + '1' + format,
        path + '2' + format, path + '3' + format,
        path + '4' + format, path + '5' + format
      ];
      var cubeMapMip5 = THREE.ImageUtils.loadTextureCube(urls);
      cubeMapMip5.format = THREE.RGBFormat;

      var material = new THREE.ShaderMaterial({
        uniforms: {
          baseColor: {
            type: 'v3',
            value: baseColor
          },

          envMap0: {
            type: 't',
            value: cubeMapMip0
          },

          envMap1: {
            type: 't',
            value: cubeMapMip1
          },

          envMap2: {
            type: 't',
            value: cubeMapMip2
          },

          envMap3: {
            type: 't',
            value: cubeMapMip3
          },

          envMap4: {
            type: 't',
            value: cubeMapMip4
          },

          envMap5: {
            type: 't',
            value: cubeMapMip5
          },

          roughness: {
            type: 'f',
            value: roughness
          },

          metallic: {
            type: 'f',
            value: metallic
          },

          lightIntensity: {
            type: 'f',
            value: lightIntensity
          },

          uvScale: {
            type: 'v2',
            value: new THREE.Vector2(1.0, 1.0)
          }
        },
        vertexShader: pbrVertexShader(),
        fragmentShader: pbrFragmentShader()
      });

      this.pbrMaterial = material;
      return material;
    }
  }
});
