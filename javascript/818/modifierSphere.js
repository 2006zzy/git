// modifierSphere.js
// 使用权威爱心公式生成3D立体爱心

import * as THREE from 'three';

export function createHeartMesh(scene) {
    const segments = 64;
    const vertices = [];
    const indices = [];
    const colors = [];
    
    const scale = 2.4;
    
    for (let i = 0; i <= segments; i++) {
        const u = (i / segments) * Math.PI * 2;
        for (let j = 0; j <= segments; j++) {
            const v = (j / segments) * Math.PI;
            
            const sinU = Math.sin(u);
            const cosU = Math.cos(u);
            const sinV = Math.sin(v);
            const cosV = Math.cos(v);
            
            const heartX2d = 15 * sinU - 4 * Math.sin(3 * u);
            const heartZ2d = 15 * cosU - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u);
            
            const px = sinV * heartX2d / 17;
            const py = 8 * cosV / 17;
            const pz = sinV * heartZ2d / 17;
            
            vertices.push(px * scale, py * scale * 1.1, pz * scale);
            
            const normY = (py + 0.7) / 1.4;
            const r = 0.85 + 0.15 * (1 - normY);
            const g = 0.1 + 0.3 * (1 - normY) * 0.5;
            const b = 0.2 + 0.6 * normY;
            colors.push(r, g * 0.7, b * 0.85);
        }
    }
    
    for (let i = 0; i < segments; i++) {
        for (let j = 0; j < segments; j++) {
            const a = i * (segments + 1) + j;
            const b = i * (segments + 1) + j + 1;
            const c = (i + 1) * (segments + 1) + j;
            const d = (i + 1) * (segments + 1) + j + 1;
            indices.push(a, b, c);
            indices.push(b, d, c);
        }
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geometry.setIndex(indices);
    geometry.computeVertexNormals();
    
    const material = new THREE.MeshPhongMaterial({
        vertexColors: true,
        emissive: 0x3a1020,
        emissiveIntensity: 0.25,
        shininess: 40,
        transparent: true,
        opacity: 0.92,
        side: THREE.DoubleSide,
        specular: 0x442233,
        flatShading: false
    });
    
    const mesh = new THREE.Mesh(geometry, material);
    return mesh;
}

export function createDecorations(scene) {
    // 粒子数量 5000
    const particleCount = 5000;
    const particles = new THREE.BufferGeometry();
    const posArray = new Float32Array(particleCount * 3);
    const colArray = new Float32Array(particleCount * 3);
    
    const c1 = new THREE.Color(0xff4d8a);
    const c2 = new THREE.Color(0x4ecdc4);
    const c3 = new THREE.Color(0xaa88ff);
    
    for (let i = 0; i < particleCount; i++) {
        const u = Math.random() * Math.PI * 2;
        const v = Math.random() * Math.PI;
        const rOffset = 0.4 + Math.random() * 2.0;
        
        const sinU = Math.sin(u);
        const cosU = Math.cos(u);
        const sinV = Math.sin(v);
        const cosV = Math.cos(v);
        
        const heartX2d = 15 * sinU - 4 * Math.sin(3 * u);
        const heartZ2d = 15 * cosU - 5 * Math.cos(2 * u) - 2 * Math.cos(3 * u) - Math.cos(4 * u);
        
        const scale = 2.4;
        const baseX = sinV * heartX2d / 17 * scale * rOffset;
        const baseY = 8 * cosV / 17 * scale * 1.1 * rOffset;
        const baseZ = sinV * heartZ2d / 17 * scale * rOffset;
        
        const noise = 0.3 + Math.random() * 0.3;
        posArray[i*3] = baseX + (Math.random() - 0.5) * noise;
        posArray[i*3+1] = baseY + (Math.random() - 0.5) * noise;
        posArray[i*3+2] = baseZ + (Math.random() - 0.5) * noise;
        
        let mixCol;
        const rand = Math.random();
        if (rand < 0.4) mixCol = c1.clone().lerp(c2, Math.random());
        else if (rand < 0.7) mixCol = c2.clone().lerp(c3, Math.random());
        else mixCol = c3.clone().lerp(c1, Math.random());
        mixCol.multiplyScalar(0.6 + Math.random() * 0.5);
        
        colArray[i*3] = mixCol.r;
        colArray[i*3+1] = mixCol.g;
        colArray[i*3+2] = mixCol.b;
    }
    
    particles.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    particles.setAttribute('color', new THREE.BufferAttribute(colArray, 3));
    
    const particleMat = new THREE.PointsMaterial({
        size: 0.08,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.9,
        sizeAttenuation: true
    });
    
    const particleSystem = new THREE.Points(particles, particleMat);
    return { particleSystem, stars: null };
}

// 为了兼容，添加 stars
export function createDecorationsWithStars(scene) {
    const result = createDecorations(scene);
    
    // 星点
    const starCount = 400;
    const starGeo = new THREE.BufferGeometry();
    const starPos = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
        const radius = 4.5 + Math.random() * 5;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos((Math.random() * 2) - 1);
        starPos[i*3] = radius * Math.sin(phi) * Math.cos(theta);
        starPos[i*3+1] = radius * Math.sin(phi) * Math.sin(theta) * 0.6 + 0.2;
        starPos[i*3+2] = radius * Math.cos(phi);
    }
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPos, 3));
    const starMat = new THREE.PointsMaterial({
        color: 0x88aaff,
        size: 0.05,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
        opacity: 0.4,
        sizeAttenuation: true
    });
    const stars = new THREE.Points(starGeo, starMat);
    scene.add(stars);
    
    return { ...result, stars };
}

export function createRings(scene) {
    const rings = [];
    
    const ringConfigs = [
        { color: 0xff4d8a, radius: 2.8, opacity: 0.08, rotX: Math.PI / 2.3, rotZ: 0.3 },
        { color: 0x4ecdc4, radius: 3.2, opacity: 0.06, rotX: 0.7, rotY: 0.5 },
        { color: 0xaa88ff, radius: 2.4, opacity: 0.07, rotX: 1.1, rotY: 0.2 }
    ];
    
    ringConfigs.forEach((cfg, index) => {
        const mat = new THREE.MeshBasicMaterial({
            color: cfg.color,
            transparent: true,
            opacity: cfg.opacity,
            side: THREE.DoubleSide
        });
        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(cfg.radius, 0.01 + index * 0.002, 16, 48),
            mat
        );
        if (cfg.rotX) ring.rotation.x = cfg.rotX;
        if (cfg.rotY) ring.rotation.y = cfg.rotY;
        if (cfg.rotZ) ring.rotation.z = cfg.rotZ;
        rings.push(ring);
    });
    
    return rings;
}