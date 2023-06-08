import * as THREE from "three";
import TextureBuilder from "./TextureBuilder";

class MaterialBuilder {
  static buildMaterial(options:any):THREE.MeshStandardMaterial {
    if (options.type == "MeshStandardMaterial") {

      let map = TextureBuilder.buildTexture(options.map);
      
      const material = new THREE.MeshStandardMaterial({
        color: options.color,
        flatShading : options.flatShading,
        metalness: options.metalness,
        roughness: options.roughness,
        wireframe: options.wireframe,
        map: map
      });
      material.uuid = options.uuid;
      return material;
    }
    throw `Cannot create material of type:${options.type}`;
  }
}

export default MaterialBuilder;