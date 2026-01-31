import { Object3DNode, MaterialNode } from '@react-three/fiber';
import * as THREE from 'three';

declare module '*.glb';
declare module '*.png';

declare module 'meshline' {
    export const MeshLineGeometry: any;
    export const MeshLineMaterial: any;
}

declare global {
    namespace JSX {
        interface IntrinsicElements {
            meshLineGeometry: Object3DNode<any, any>;
            meshLineMaterial: MaterialNode<any, any>;
        }
    }
}
