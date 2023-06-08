import * as THREE from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { ColladaLoader } from "three/examples/jsm/loaders/ColladaLoader";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import MaterialBuilder from "../Builders/MaterialBuilder";
import {DotNet} from "@microsoft/dotnet-js-interop"

class Loaders {
  static loadGltf(scene:THREE.Scene, url:any, guid:any, containerId:any) {
    const loader = new GLTFLoader();
    loader.load(url, (object) => {
      object.scene.uuid = guid;
      scene.add(object.scene);
      Loaders.callDotNet(containerId, guid);
    });
  }
  static loadFbx(scene:THREE.Scene, url:any, guid:any, containerId:any) {
    const loader = new FBXLoader();
    loader.load(url, (object) => {
      scene.add(object);
      object.uuid = guid;
      Loaders.callDotNet(containerId, guid);
    });
  }

  static loadCollada(scene:THREE.Scene, url:any, guid:any, containerId:any) {
    let object:any;
    const manager = new THREE.LoadingManager(() => {
      scene.add(object);
      object.uuid = guid;
      Loaders.callDotNet(containerId, guid);
    });
    const loader = new ColladaLoader(manager);
    loader.load(url, (obj) => {
      object = obj.scene;
    });
  }

  static loadOBJ(scene:THREE.Scene, objUrl:any, textureUrl:any, guid:any, containerId:any) {
    let object:any;
    const manager = new THREE.LoadingManager(() => {
      if (textureUrl){
        object.traverse(function (child:any) {
          if (child.isMesh) child.material.map = texture;
        });
      }
      scene.add(object);
      object.uuid = guid;
      Loaders.callDotNet(containerId, guid);
    });

    const textureLoader = new THREE.TextureLoader(manager);
    const texture = textureLoader.load(textureUrl);

    const loader = new OBJLoader(manager);
    loader.load(objUrl, (obj) => {
      object = obj;
    });
    return object;
  }

  static loadStl(scene:THREE.Scene, url:any, guid:any, containerId:any, materialSettings:any) {
    let mesh;
    const loader = new STLLoader();
    loader.load( url, function ( geometry ) {

      // const material = new THREE.MeshPhongMaterial( { color: 0xff5533, specular: 0x111111, shininess: 200 } );
      // const material = new THREE.MeshStandardMaterial({
      //   color: 0xff5533,
      // });
      const  material = MaterialBuilder.buildMaterial(materialSettings);
      mesh = new THREE.Mesh( geometry, material );
      mesh.uuid = guid;
      
      // mesh.position.set( 0, - 0.25, 0.6 );
      // mesh.rotation.set( 0, - Math.PI / 2, 0 );
      // mesh.scale.set( 0.5, 0.5, 0.5 );

      // mesh.castShadow = true;
      // mesh.receiveShadow = true;

      scene.add( mesh );
      Loaders.callDotNet(containerId, guid);

    } );
  }

  static import3DModel(scene:THREE.Scene, settings:any, containerId:any) {
    const format = settings.format;
    let objUrl = settings.fileURL;
    let textureUrl = settings.textureURL;
    let guid = settings.uuid;
    let material = settings.material;

    if(format == "Obj"){
      return Loaders.loadOBJ(scene, objUrl, textureUrl, guid, containerId);
    }
    if(format == "Collada"){
      return Loaders.loadCollada(scene, objUrl, guid, containerId);
    }
    if(format == "Fbx"){
      return Loaders.loadFbx(scene, objUrl, guid, containerId);
    }
    if(format == "Gltf"){
      return Loaders.loadGltf(scene, objUrl, guid, containerId);
    }

    if(format == "Stl"){
      return Loaders.loadStl(scene, objUrl, guid, containerId, material);
    }
    
    return null;
  }

  static callDotNet(containerId:any, uuid:any){
    // (window.DotNet as DotNet)
    // (window as any).
    DotNet.invokeMethodAsync(
      "Blazor3D",
      "ReceiveLoadedObjectUUID",
      containerId,
      uuid
    );
  }
}

export default Loaders;