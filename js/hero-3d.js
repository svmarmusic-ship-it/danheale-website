/* danheale.com — hero 3D sculpture.
   Type="module" script, loaded after the reveal system in motion.js (order between
   the two doesn't actually matter — this file is fully self-contained).

   Renders assets/3d/hero-sculpture.glb into the hero background: a slow continuous
   rotation, with a subtle scroll-linked drift (rotation speeds up and the piece
   settles slightly lower) as the visitor scrolls past the hero — no scroll-pin, no
   scroll-linked scale/zoom.

   Only runs on desktop with motion allowed and WebGL available. Everywhere else the
   canvas stays hidden and CSS shows assets/images/hero-3d-poster.jpg (a real capture
   of this same scene) as a static fallback on `.hero-media`'s background. */
(function () {
  'use strict';

  var canvas = document.getElementById('hero-3d-canvas');
  var heroSection = document.querySelector('.hero');
  if (!canvas || !heroSection) return;

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var desktop = window.matchMedia('(min-width: 769px)').matches;

  function hasWebGL() {
    try {
      var c = document.createElement('canvas');
      return !!(window.WebGLRenderingContext &&
        (c.getContext('webgl2') || c.getContext('webgl')));
    } catch (e) {
      return false;
    }
  }

  if (!desktop || reduced || !hasWebGL()) {
    canvas.hidden = true;
    return;
  }

  import('/js/vendor/three.module.min.js').then(function (THREE) {
    import('/js/vendor/GLTFLoader.js').then(function (mod) {
      init(THREE, mod.GLTFLoader);
    });
  }).catch(function () {
    canvas.hidden = true;
  });

  function init(THREE, GLTFLoader) {
    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true, preserveDrawingBuffer: true });
    } catch (e) {
      canvas.hidden = true;
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 6);

    // Violet/blue two-point lighting plus a soft ambient fill — matches the site's
    // accent (#7c5cff) and secondary accent (#4f7cff), no environment map needed.
    scene.add(new THREE.AmbientLight(0x2a2140, 1.4));
    var keyLight = new THREE.DirectionalLight(0x8f7bff, 3.2);
    keyLight.position.set(3, 2, 4);
    scene.add(keyLight);
    var rimLight = new THREE.DirectionalLight(0x5b8cff, 2.4);
    rimLight.position.set(-4, -1.5, -3);
    scene.add(rimLight);
    var fillLight = new THREE.PointLight(0xb79bff, 1.6, 12);
    fillLight.position.set(-2, 2, 3);
    scene.add(fillLight);

    var rig = new THREE.Group(); // holds the model; scroll drift moves this, not the model itself
    scene.add(rig);

    var model = null;
    var baseSpin = 0.18; // radians/sec, continuous idle rotation
    var scrollProgress = 0; // 0..1 across the hero's own height

    new GLTFLoader().load(
      '/assets/3d/hero-sculpture.glb',
      function (gltf) {
        model = gltf.scene;

        // Normalise scale/position: whatever the export's own units and origin are,
        // fit the mesh to a consistent ~2.2 unit diameter centered at the origin.
        var box = new THREE.Box3().setFromObject(model);
        var size = box.getSize(new THREE.Vector3());
        var center = box.getCenter(new THREE.Vector3());
        var radius = Math.max(size.x, size.y, size.z) / 2 || 1;
        var scale = 1.1 / radius;
        model.scale.setScalar(scale);
        model.position.sub(center.multiplyScalar(scale));

        rig.add(model);
      },
      undefined,
      function () {
        canvas.hidden = true; // load failed: fall back to the poster
      }
    );

    function resize() {
      var w = heroSection.clientWidth;
      var h = heroSection.clientHeight;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      // Off-center toward the right, mirroring the old hero composition (subject
      // visible on the right, dark tint over the left where the headline sits).
      camera.setViewOffset(w, h, -w * 0.16, 0, w, h);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    window.addEventListener('scroll', function () {
      var h = heroSection.offsetHeight || 1;
      scrollProgress = Math.min(Math.max(window.scrollY / h, 0), 1);
    }, { passive: true });

    var clock = new THREE.Clock();
    var visible = true;
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
      }).observe(heroSection);
    }

    function animate() {
      requestAnimationFrame(animate);
      if (!visible) return;
      var dt = Math.min(clock.getDelta(), 0.05);
      if (model) {
        var spin = baseSpin + scrollProgress * 0.55; // speeds up as the hero scrolls past
        model.rotation.y += spin * dt;
        model.rotation.x = Math.sin(clock.elapsedTime * 0.25) * 0.06;
      }
      // Subtle drift, not a pin: the whole rig eases down and slightly back as the
      // hero scrolls away, on top of the section's own normal scroll motion.
      rig.position.y = -scrollProgress * 0.35;
      rig.position.z = -scrollProgress * 0.4;
      renderer.render(scene, camera);
    }
    animate();
  }
})();
