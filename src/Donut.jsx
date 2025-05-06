import { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function Donut() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const isMobile = window.innerWidth <= 768;
    const camera = new THREE.PerspectiveCamera(
      isMobile ? 85 : 75,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = isMobile ? 7 : 6;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.TorusGeometry(
        isMobile ? 1.6 : 2,
        isMobile ? 0.7 : 1,
        isMobile ? 32 : 64,
        isMobile ? 50 : 100
      );

    const colors = [];
    for (let i = 0; i < geometry.attributes.position.count; i++) {
        colors.push(0.88, 0.53, 0.29);
    }
    geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
      
    const material = new THREE.MeshStandardMaterial({
        vertexColors: true,
        roughness: 0.2,
        metalness: 0.4,
    });
    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(5, 5, 5);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const rotation = { x: 0, y: 0 };
    let targetRotation = { x: 0, y: 0 };

    const onMouseMove = (e) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = -(e.clientY / window.innerHeight) * 2 + 1;
      targetRotation.y = x * Math.PI * 1.2;
      targetRotation.x = y * Math.PI * 1.0;
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      const x = (touch.clientX / window.innerWidth) * 2 - 1;
      const y = -(touch.clientY / window.innerHeight) * 2 + 1;
      targetRotation.y = x * Math.PI * 1.2;
      targetRotation.x = y * Math.PI * 1.0;
    };

    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('touchmove', onTouchMove);

    const animate = () => {
      requestAnimationFrame(animate);
      rotation.x += (targetRotation.x - rotation.x) * 0.07;
      rotation.y += (targetRotation.y - rotation.y) * 0.07;
      mesh.rotation.x = rotation.x;
      mesh.rotation.y = rotation.y;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('resize', handleResize);
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={containerRef} style={{ width: '100vw', height: '100vh' }} />;
}