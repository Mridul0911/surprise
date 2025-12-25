let scene, camera, renderer, stars, heart, particles;
let clickCount = 0;
let heartPulse = 0;

init();
animate();

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    75, window.innerWidth / window.innerHeight, 0.1, 1000
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);
  document.body.appendChild(renderer.domElement);

  createStars();
  createHeart();
  createParticles();

  window.addEventListener('resize', onWindowResize);
  document.addEventListener("click", progressStory);
  
  // Setup button handlers
  setupButtons();
}

function setupButtons() {
  const yesBtn = document.getElementById("yesBtn");
  const waffleBtn = document.getElementById("waffleBtn");
  
  if (yesBtn) {
    yesBtn.onclick = () => {
      const text = document.getElementById("storyText");
      gsap.to(text, { opacity: 0, duration: 0.5, onComplete: () => {
        text.innerHTML = "Amrita, can't wait to see you 💛<br>- Mridul";
        gsap.to(text, { opacity: 1, duration: 0.8 });
      }});
      
      // Heart celebration animation
      if (heart) {
        gsap.to(heart.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.3, yoyo: true, repeat: 3 });
      }
    };
  }
  
  if (waffleBtn) {
    waffleBtn.onclick = () => {
      const text = document.getElementById("storyText");
      gsap.to(text, { opacity: 0, duration: 0.5, onComplete: () => {
        text.innerHTML = "Deal, Amrita. Waffles on me when we meet 😄🧇<br>- Mridul";
        gsap.to(text, { opacity: 1, duration: 0.8 });
      }});
      
      // Heart celebration animation
      if (heart) {
        gsap.to(heart.scale, { x: 1.3, y: 1.3, z: 1.3, duration: 0.3, yoyo: true, repeat: 3 });
      }
    };
  }
}

function createStars() {
  const starGeometry = new THREE.BufferGeometry();
  const starCount = 3000;
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);

  for (let i = 0; i < starCount; i++) {
    const i3 = i * 3;
    positions[i3] = (Math.random() - 0.5) * 200;
    positions[i3 + 1] = (Math.random() - 0.5) * 200;
    positions[i3 + 2] = (Math.random() - 0.5) * 200;

    // Varying star colors (white to light blue/pink)
    const color = new THREE.Color();
    const hue = Math.random() * 0.1 + 0.5; // White to light blue
    color.setHSL(hue, 0.3, 0.8 + Math.random() * 0.2);
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    sizes[i] = Math.random() * 1.5 + 0.3;
  }

  starGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  starGeometry.setAttribute("size", new THREE.BufferAttribute(sizes, 1));

  const starMaterial = new THREE.PointsMaterial({
    size: 1.2,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });

  stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
}

function createHeart() {
  const x = (t) => 16 * Math.pow(Math.sin(t), 3);
  const y = (t) => 
    13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);

  const heartShape = new THREE.Shape();
  for (let t = 0; t <= Math.PI * 2; t += 0.01) {
    heartShape.lineTo(x(t) * 0.1, y(t) * 0.1);
  }

  const geometry = new THREE.ExtrudeGeometry(heartShape, { 
    depth: 0.6, 
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.1,
    bevelSegments: 8
  });
  
  const material = new THREE.MeshPhongMaterial({ 
    color: 0xff3366, 
    emissive: 0x880033,
    shininess: 100,
    specular: 0xff6699
  });
  
  heart = new THREE.Mesh(geometry, material);
  heart.visible = false;
  scene.add(heart);

  // Multiple lights for better effect
  const light1 = new THREE.PointLight(0xff3366, 3, 50);
  light1.position.set(0, 0, 5);
  scene.add(light1);

  const light2 = new THREE.PointLight(0xff6699, 2, 30);
  light2.position.set(2, 2, 3);
  scene.add(light2);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
  scene.add(ambientLight);
}

function createParticles() {
  const particleGeometry = new THREE.BufferGeometry();
  const particleCount = 100;
  const positions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 10;
  }

  particleGeometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0xff3366,
    size: 0.1,
    transparent: true,
    opacity: 0,
    blending: THREE.AdditiveBlending,
  });

  particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);
}

function progressStory() {
  clickCount++;

  const text = document.getElementById("storyText");
  
  // Fade out current text
  gsap.to(text, { opacity: 0, duration: 0.5, onComplete: () => {
    if (clickCount === 1) {
      text.innerHTML = "Amrita, some matches are algorithms…";
    } else if (clickCount === 2) {
      text.innerHTML = "But some are destiny ✨";
    } else if (clickCount === 3) {
      text.innerHTML = "We talked, laughed, shared stories…<br>And when we meet, we'll share waffles too 🧇";
    } else if (clickCount === 4) {
      heart.visible = true;
      heart.scale.set(0, 0, 0);
      
      // Animate heart appearance
      gsap.to(heart.scale, { 
        x: 1, y: 1, z: 1, 
        duration: 1.5, 
        ease: "back.out(1.7)" 
      });
      
      // Camera zoom
      gsap.to(camera.position, { z: 1.8, duration: 3, ease: "power2.out" });
      
      // Particle burst
      gsap.to(particles.material, { opacity: 1, duration: 0.5 });
      gsap.to(particles.material, { opacity: 0, duration: 2, delay: 0.5 });
      
      text.innerHTML = 
        `Amrita, I'd really like to meet you in Bhopal this January…<br>will you go on a date with me?`;
      
      setTimeout(() => {
        const buttons = document.getElementById("finalButtons");
        buttons.style.display = "flex";
        buttons.style.opacity = "0";
        gsap.to(buttons, { opacity: 1, y: 0, duration: 1, ease: "power2.out" });
      }, 2000);
    }
    
    // Fade in new text
    gsap.to(text, { opacity: 1, duration: 0.8 });
  }});
}


function animate() {
  requestAnimationFrame(animate);
  
  // Rotate stars
  stars.rotation.y += 0.0005;
  stars.rotation.x += 0.0002;
  
  // Heart pulsing and rotation
  if (heart && heart.visible) {
    heart.rotation.y += 0.01;
    heartPulse += 0.05;
    const pulse = 1 + Math.sin(heartPulse) * 0.1;
    heart.scale.set(
      heart.scale.x * (pulse / (1 + Math.sin(heartPulse - 0.05) * 0.1)),
      heart.scale.y * (pulse / (1 + Math.sin(heartPulse - 0.05) * 0.1)),
      heart.scale.z * (pulse / (1 + Math.sin(heartPulse - 0.05) * 0.1))
    );
    
    // Update emissive for glow effect
    heart.material.emissive.setHSL(0.95, 0.8, 0.3 + Math.sin(heartPulse) * 0.2);
  }
  
  // Rotate particles
  if (particles) {
    particles.rotation.y += 0.002;
  }
  
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
