        document.addEventListener('DOMContentLoaded', () => {
                console.log("Script is alive and DOM is ready!");
   // Select the element you want to follow the mouse
   const maskParent = document.querySelector('.team-member-mask');
    const maskChild = document.querySelector('.masked-image');

// This must be exactly HALF of the .team-member-mask's CSS width (20vw / 2 = 10)
    const maskHalfWidthVw = 10; 
    let isClicked = false;
window.addEventListener('mousemove', (e) => {
        if(window.innerWidth<991)return
    if (isClicked) return;
    // 1. Convert mouse X position to VW units
    const xVw = (e.clientX / window.innerWidth) * 100;
    
    // 2. Subtract the 10vw offset to pull the div's center to the mouse
    const centeredX = xVw - maskHalfWidthVw;
    
    // 3. Apply the Counter-Translate
    // Parent follows the mouse with the offset applied
    maskParent.style.transform = `translate3d(${centeredX.toFixed(3)}vw, 0px, 0px)`;
    
    // Child moves the exact opposite way to keep the image stationary
    maskChild.style.transform = `translate3d(-${centeredX.toFixed(3)}vw, 0px, 0px)`;
});


let radiobtn = document.querySelectorAll('.w-radio');
let mask = document.querySelector('.masked-image');
let images = [...document.getElementsByClassName('member-bg-image')];
const imageMap = {};

images.forEach(img => {
    imageMap[img.dataset.memberBg] = img;
    if (img.getAttribute('data-member-bg') == 'lerato') return;
    img.classList.add('hidden');
});

const memberMap = {
    Lerato: 'lerato',
    Ayanda: 'ayanda',
    SIMLET: 'sim',
    Katlego: 'kat',
    Lesedi: 'lesedi'
};

const imageUrls = {
    Lerato: "https://cdn.prod.website-files.com/696f71293b9af01fb672ff8b/69a85cb583261bccbdf63eb5_elo.jpg",
    Ayanda: "https://cdn.prod.website-files.com/696f71293b9af01fb672ff8b/69a85cb6c5a41a97bfb8247f_Aya.png",
    SIMLET: "https://cdn.prod.website-files.com/696f71293b9af01fb672ff8b/69a85cb5896172322cd07eb2_sim.jpg",
    Katlego: "https://cdn.prod.website-files.com/696f71293b9af01fb672ff8b/69a85cb6fce8b63d6648cbbb_kat.png",
    Lesedi: "https://cdn.prod.website-files.com/696f71293b9af01fb672ff8b/698581d200832bbd823a4e69_001b.png.jpg"
};

radiobtn.forEach(e => {
    e.addEventListener('mouseover', () => {
        isClicked = false;
        const memberId = e.id;
        const targetImgNumber = memberMap[memberId];

        mask.setAttribute('data-background-image', memberId);
        startRippleEffect(imageUrls[memberId]); // This passes the URL string correctly

        images.forEach(img => img.classList.add('hidden'));
        if (imageMap[targetImgNumber]) {
            imageMap[targetImgNumber].classList.remove('hidden');


            document.getElementsByClassName('team-member-mask')[0].classList.remove('largeimg')
        }
    });
    e.addEventListener('click', () => {
        
        isClicked = true;
        const memberId = e.id;
        const targetImgNumber = memberMap[memberId];

        mask.setAttribute('data-background-image', memberId);
        startRippleEffect(imageUrls[memberId]); // This passes the URL string correctly

        images.forEach(img => img.classList.add('hidden'));
        if (imageMap[targetImgNumber]) {
            imageMap[targetImgNumber].classList.remove('hidden');
            if(window.innerWidth>990){
                    console.log('screen large')
            document.getElementsByClassName('team-member-mask')[0].classList.add('largeimg')
            }
            document.getElementsByClassName('team-member-mask')[0].style.transform = '';
            document.getElementsByClassName('masked-image')[0].style.transform = '';
        }
    });
});

function startRippleEffect(imgUrl) {
    // Check if imgUrl is a string (prevents error when s.onload passes an Event)
    if (typeof imgUrl !== 'string') return;

    document.querySelectorAll(".masked-image").forEach((item) => {
        item.innerHTML = ''; // Clear previous canvas to prevent WebGL crash
        const imageSrc = imgUrl.replace(/url\(["']?/, "").replace(/["']?\)$/, "");

        const canvas = document.createElement("canvas");
        canvas.style.width = "100%";
        canvas.style.height = "100%";
        item.appendChild(canvas);

        let time = 0;
        let rippleStrength = 0;
        const mouse = new THREE.Vector2(0.5, 0.5);
        const lastMouse = new THREE.Vector2(0.5, 0.5);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            antialias: true,
            alpha: true,
        });
        renderer.setClearColor(0x000000, 1);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.z = 1;

        item.addEventListener("mousemove", (e) => {
            const rect = canvas.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = 1 - (e.clientY - rect.top) / rect.height;
            mouse.set(x, y);
            const movement = mouse.distanceTo(lastMouse);
            rippleStrength += movement * 6.0;
            rippleStrength = Math.min(rippleStrength, 8.0);
            lastMouse.copy(mouse);
        });

        new THREE.TextureLoader().load(imageSrc, (texture) => {
            texture.flipY = true;
            const geometry = new THREE.PlaneGeometry(2, 2);
            const material = new THREE.ShaderMaterial({
                uniforms: {
                    uTexture: { value: texture },
                    uTime: { value: 0 },
                    uMouse: { value: mouse },
                    uStrength: { value: 0 },
                },
                vertexShader: `
                    varying vec2 vUv;
                    void main() {
                        vUv = uv;
                        gl_Position = vec4(position,1.0);
                    }
                `,
                fragmentShader: `
                    precision highp float;
                    uniform sampler2D uTexture;
                    uniform float uTime;
                    uniform vec2 uMouse;
                    uniform float uStrength;
                    varying vec2 vUv;
                    void main() {
                        vec2 uv = vUv;
                        vec2 diff = uv - uMouse;
                        float dist = length(diff);
                        float ripple = sin(dist * 20.0 - uTime * 6.0) * exp(-dist * 8.0) * 0.03 * uStrength;
                        uv += normalize(diff) * ripple;
                        gl_FragColor = texture2D(uTexture, uv);
                    }
                `,
            });

            const mesh = new THREE.Mesh(geometry, material);
            scene.add(mesh);

            function animate() {
                const w = canvas.clientWidth;
                const h = canvas.clientHeight;
                renderer.setSize(w, h, false);
                time += 0.016;
                rippleStrength *= 0.97;
                material.uniforms.uTime.value = time;
                material.uniforms.uStrength.value = rippleStrength;
                renderer.render(scene, camera);
                requestAnimationFrame(animate);
            }
            animate();
        });
    });
}

// Fixed Loader Logic
const textures = {}; // Global store for loaded textures
let material; // Global reference for your shader material

function preloadTextures(callback) {
    const manager = new THREE.LoadingManager();
    const loader = new THREE.TextureLoader(manager);

    // Loop through your imageUrls object
    Object.entries(imageUrls).forEach(([name, url]) => {
        loader.load(url, (texture) => {
            texture.flipY = true; // Match Three.js coordinate system
            textures[name] = texture;
        });
    });

    // This fires ONLY after ALL textures are finished loading
    manager.onLoad = () => {
        console.log("All textures preloaded!");
        callback(); 
    };

    manager.onError = (url) => {
        console.error('There was an error loading ' + url);
    };
}

// Fixed Loader Execution
if (typeof THREE === "undefined") {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js";
    s.onload = () => preloadTextures(() => init(imageUrls.Lerato));
    document.body.appendChild(s);
} else {
    preloadTextures(() => init(imageUrls.Lerato));
}
})
