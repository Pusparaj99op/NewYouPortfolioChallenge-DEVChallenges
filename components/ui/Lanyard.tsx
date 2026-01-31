'use client';

import { useEffect, useRef, useState } from 'react';
import { Canvas, extend, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Environment, Lightformer } from '@react-three/drei';
import {
    BallCollider,
    CuboidCollider,
    Physics,
    RigidBody,
    useRopeJoint,
    useSphericalJoint,
    RigidBodyProps
} from '@react-three/rapier';
import { MeshLineGeometry, MeshLineMaterial } from 'meshline';
import * as THREE from 'three';
import './Lanyard.css';

// Extend only on the client side to avoid SSR issues
if (typeof window !== 'undefined') {
    extend({ MeshLineGeometry, MeshLineMaterial });
}

declare module '@react-three/fiber' {
    interface ThreeElements {
        meshLineGeometry: any;
        meshLineMaterial: any;
    }
}

interface LanyardProps {
    position?: [number, number, number];
    gravity?: [number, number, number];
    fov?: number;
    transparent?: boolean;
}

export default function Lanyard({
    position = [0, 0, 30],
    gravity = [0, -40, 0],
    fov = 20,
    transparent = true
}: LanyardProps) {
    const [isMobile, setIsMobile] = useState<boolean>(false);

    useEffect(() => {
        // Re-extend on mount to ensure it's available
        extend({ MeshLineGeometry, MeshLineMaterial });

        setIsMobile(window.innerWidth < 768);
        const handleResize = (): void => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="lanyard-wrapper" style={{ background: 'transparent' }}>
            <Canvas
                camera={{ position, fov }}
                dpr={[1, 2]}
                gl={{ alpha: true, preserveDrawingBuffer: true }}
                onCreated={({ gl }) => {
                    gl.setClearColor(new THREE.Color(0x000000), 0);
                }}
                style={{ pointerEvents: 'auto' }}
            >
                <ambientLight intensity={Math.PI} />
                <Physics gravity={gravity} timeStep={1 / 60}>
                    <Band isMobile={isMobile} />
                </Physics>
                <Environment blur={0.75}>
                    <Lightformer
                        intensity={2}
                        color="white"
                        position={[0, -1, 5]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={3}
                        color="white"
                        position={[-1, -1, 1]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={3}
                        color="white"
                        position={[1, 1, 1]}
                        rotation={[0, 0, Math.PI / 3]}
                        scale={[100, 0.1, 1]}
                    />
                    <Lightformer
                        intensity={10}
                        color="white"
                        position={[-10, 0, 14]}
                        rotation={[0, Math.PI / 2, Math.PI / 3]}
                        scale={[100, 10, 1]}
                    />
                </Environment>
            </Canvas>
        </div>
    );
}

interface BandProps {
    maxSpeed?: number;
    minSpeed?: number;
    isMobile?: boolean;
}

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }: BandProps) {
    const band = useRef<any>(null);
    const fixed = useRef<any>(null);
    const j1 = useRef<any>(null);
    const j2 = useRef<any>(null);
    const j3 = useRef<any>(null);
    const card = useRef<any>(null);

    const vec = new THREE.Vector3();
    const ang = new THREE.Vector3();
    const rot = new THREE.Vector3();
    const dir = new THREE.Vector3();

    const segmentProps: any = {
        type: 'dynamic' as RigidBodyProps['type'],
        canSleep: true,
        colliders: false,
        angularDamping: 4,
        linearDamping: 4
    };

    // Explicitly preload the assets
    useGLTF.preload('/card.glb');
    useTexture.preload('/lanyard.png');

    const { nodes, materials } = useGLTF('/card.glb') as any;
    const texture = useTexture('/lanyard.png');

    // Safe geometry access
    const cardGeometry = nodes?.card?.geometry;
    const clipGeometry = nodes?.clip?.geometry;
    const clampGeometry = nodes?.clamp?.geometry;
    const baseMap = materials?.base?.map;
    const metalMaterial = materials?.metal;

    const [curve] = useState(
        () =>
            new THREE.CatmullRomCurve3([new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()])
    );
    const [dragged, drag] = useState<false | THREE.Vector3>(false);
    const [hovered, hover] = useState(false);

    useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
    useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
    useSphericalJoint(j3, card, [
        [0, 0, 0],
        [0, 1.45, 0]
    ]);

    useEffect(() => {
        if (hovered) {
            document.body.style.cursor = dragged ? 'grabbing' : 'grab';
            return () => {
                document.body.style.cursor = 'auto';
            };
        }
    }, [hovered, dragged]);

    useFrame((state, delta) => {
        if (dragged && typeof dragged !== 'boolean') {
            vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
            dir.copy(vec).sub(state.camera.position).normalize();
            vec.add(dir.multiplyScalar(state.camera.position.length()));
            [card, j1, j2, j3, fixed].forEach(ref => ref.current?.wakeUp());
            card.current?.setNextKinematicTranslation({
                x: vec.x - dragged.x,
                y: vec.y - dragged.y,
                z: vec.z - dragged.z
            });
        }
        if (fixed.current) {
            [j1, j2].forEach(ref => {
                if (!ref.current.lerped) ref.current.lerped = new THREE.Vector3().copy(ref.current.translation());
                const clampedDistance = Math.max(0.1, Math.min(1, ref.current.lerped.distanceTo(ref.current.translation())));
                ref.current.lerped.lerp(
                    ref.current.translation(),
                    delta * (minSpeed + clampedDistance * (maxSpeed - minSpeed))
                );
            });
            curve.points[0].copy(j3.current.translation());
            curve.points[1].copy(j2.current.lerped);
            curve.points[2].copy(j1.current.lerped);
            curve.points[3].copy(fixed.current.translation());

            if (band.current) {
                band.current.geometry.setPoints(curve.getPoints(32));
            }

            if (card.current) {
                ang.copy(card.current.angvel());
                rot.copy(card.current.rotation());
                card.current.setAngvel({ x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z });
            }
        }
    });

    curve.curveType = 'chordal';
    texture.wrapS = texture.wrapT = THREE.RepeatWrapping;

    // Render a fallback if assets are not ready/found
    if (!cardGeometry || !baseMap) {
        return null;
    }

    return (
        <>
            <group position={[0, 4, 0]}>
                <RigidBody ref={fixed} {...segmentProps} type={'fixed' as RigidBodyProps['type']} />
                <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps} type={'dynamic' as RigidBodyProps['type']}>
                    <BallCollider args={[0.1]} />
                </RigidBody>
                <RigidBody
                    position={[2, 0, 0]}
                    ref={card}
                    {...segmentProps}
                    type={dragged ? ('kinematicPosition' as RigidBodyProps['type']) : ('dynamic' as RigidBodyProps['type'])}
                >
                    <CuboidCollider args={[0.8, 1.125, 0.01]} />
                    <group
                        scale={2.25}
                        position={[0, -1.2, -0.05]}
                        onPointerOver={() => hover(true)}
                        onPointerOut={() => hover(false)}
                        onPointerUp={(e: any) => {
                            e.target.releasePointerCapture(e.pointerId);
                            drag(false);
                        }}
                        onPointerDown={(e: any) => {
                            e.target.setPointerCapture(e.pointerId);
                            drag(new THREE.Vector3().copy(e.point).sub(vec.copy(card.current.translation())));
                        }}
                    >
                        <mesh geometry={cardGeometry}>
                            <meshPhysicalMaterial
                                map={baseMap}
                                map-anisotropy={16}
                                clearcoat={1}
                                clearcoatRoughness={0.15}
                                roughness={0.3}
                                metalness={0.5}
                            />
                        </mesh>
                        <mesh geometry={clipGeometry} material={metalMaterial} material-roughness={0.3} />
                        <mesh geometry={clampGeometry} material={metalMaterial} />
                    </group>
                </RigidBody>
            </group>
            <mesh ref={band}>
                <meshLineGeometry />
                <meshLineMaterial
                    color="white"
                    depthTest={false}
                    resolution={[typeof window !== 'undefined' ? window.innerWidth : 800, typeof window !== 'undefined' ? window.innerHeight : 600]}
                    useMap
                    map={texture}
                    repeat={[-3, 1]}
                    lineWidth={1}
                />
            </mesh>
        </>
    );
}
