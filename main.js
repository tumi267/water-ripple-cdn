let radiobtn = document.querySelectorAll('.w-radio');
        let mask = document.querySelector('.masked-image');
        let images=[...document.getElementsByClassName('member-bg-image')]
        const imageMap = {}
        images.forEach(img => {
            imageMap[img.dataset.memberBg] = img;
            if(img.getAttribute('data-member-bg')=='lerato')return
            img.classList.add('hidden')
        });
        const memberMap = {
            Lerato: 'lerato',
            Ayanda: 'ayanda',
            SIMLET: 'sim',
            Katlego:'kat',
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
                const memberId = e.id; 
                const targetImgNumber = memberMap[memberId];
                
                mask.setAttribute('data-background-image', memberId);
                init(imageUrls[memberId])
                images.forEach(img => img.classList.add('hidden'));
                if (imageMap[targetImgNumber]) {
                imageMap[targetImgNumber].classList.remove('hidden');
                }
                })
                })
// function init(mask) {
  
//     // const bg = window.getComputedStyle(mask).backgroundImage;
//     const bg=mask;
//     if (!bg) return;

//     const imageSrc = bg.replace(/url\(["']?/, "").replace(/["']?\)$/, "");

//     const canvas = document.createElement("canvas");
//     canvas.style.width = "100%";
//     canvas.style.height = "100%";
//     mask.appendChild(canvas);
//     mask.style.backgroundImage = "none";
//     let time = 0;
//     let rippleStrength = 0;

//     const mouse = new THREE.Vector2(0.5, 0.5);
//     const lastMouse = new THREE.Vector2(0.5, 0.5);

//     const renderer = new THREE.WebGLRenderer({
//       canvas: canvas,
//       antialias: true,
//       alpha: true,
//     });

//     renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

//     const scene = new THREE.Scene();
//     const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
//     camera.position.z = 1;

//     item.addEventListener("mousemove", (e) => {
//       const rect = canvas.getBoundingClientRect();
//       const x = (e.clientX - rect.left) / rect.width;
//       const y = 1 - (e.clientY - rect.top) / rect.height;

//       mouse.set(x, y);

//       const movement = mouse.distanceTo(lastMouse);
//       rippleStrength += movement * 6.0;
//       rippleStrength = Math.min(rippleStrength, 8.0);

//       lastMouse.copy(mouse);
//     });

//   new THREE.TextureLoader().load(imageSrc, (texture) => {

//     texture.flipY = true;

//     const geometry = new THREE.PlaneGeometry(2, 2);

//     const material = new THREE.ShaderMaterial({
//       uniforms: {
//         uTexture: { value: texture },
//         uTime: { value: 0 },
//         uMouse: { value: mouse },
//         uStrength: { value: 0 },
//       },
//       vertexShader: `
//         varying vec2 vUv;
//         void main() {
//           vUv = uv;
//           gl_Position = vec4(position,1.0);
//         }
//       `,
//       fragmentShader: `
//         precision highp float;
//         uniform sampler2D uTexture;
//         uniform float uTime;
//         uniform vec2 uMouse;
//         uniform float uStrength;
//         varying vec2 vUv;

//         void main() {
//           vec2 uv = vUv;
//           vec2 diff = uv - uMouse;
//           float dist = length(diff);

//           float ripple =
//             sin(dist * 20.0 - uTime * 6.0) *
//             exp(-dist * 8.0) *
//             0.03 *
//             uStrength;

//           uv += normalize(diff) * ripple;
//           gl_FragColor = texture2D(uTexture, uv);
//         }
//       `,
//     });

//     const mesh = new THREE.Mesh(geometry, material);
//     scene.add(mesh);

//     function resize() {
//       const w = canvas.clientWidth;
//       const h = canvas.clientHeight;
//       renderer.setSize(w, h, false);
//     }

//     function animate() {
//       resize();
//       time += 0.016;
//       rippleStrength *= 0.97;

//       material.uniforms.uTime.value = time;
//       material.uniforms.uStrength.value = rippleStrength;

//       renderer.render(scene, camera);
//       requestAnimationFrame(animate);
//     }

//     animate();
//   })

// };

     function init(imageSrc) {

    if (!imageSrc) return;

    const canvas = document.createElement("canvas");
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    mask.innerHTML = ""; // remove old canvas
    mask.appendChild(canvas);

    let time = 0;
    let rippleStrength = 0;

    const mouse = new THREE.Vector2(0.5, 0.5);
    const lastMouse = new THREE.Vector2(0.5, 0.5);

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
        antialias: true,
        alpha: true,
    });

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1,1,1,-1,0.1,10);
    camera.position.z = 1;

    mask.addEventListener("mousemove", (e) => {

        const rect = canvas.getBoundingClientRect();

        const x = (e.clientX - rect.left) / rect.width;
        const y = 1 - (e.clientY - rect.top) / rect.height;

        mouse.set(x,y);

        const movement = mouse.distanceTo(lastMouse);

        rippleStrength += movement * 6;
        rippleStrength = Math.min(rippleStrength,8);

        lastMouse.copy(mouse);

    });

    new THREE.TextureLoader().load(imageSrc,(texture)=>{

        texture.flipY = true;

        const material = new THREE.ShaderMaterial({

            uniforms:{
                uTexture:{ value:texture },
                uTime:{ value:0 },
                uMouse:{ value:mouse },
                uStrength:{ value:0 }
            },

            vertexShader:`
                varying vec2 vUv;
                void main(){
                    vUv = uv;
                    gl_Position = vec4(position,1.0);
                }
            `,

            fragmentShader:`
                precision highp float;

                uniform sampler2D uTexture;
                uniform float uTime;
                uniform vec2 uMouse;
                uniform float uStrength;

                varying vec2 vUv;

                void main(){

                    vec2 uv = vUv;

                    vec2 diff = uv - uMouse;
                    float dist = length(diff);

                    float ripple =
                        sin(dist*20.0 - uTime*6.0) *
                        exp(-dist*8.0) *
                        0.03 *
                        uStrength;

                    uv += normalize(diff)*ripple;

                    gl_FragColor =
                        texture2D(uTexture, uv);

                }
            `
        });

        const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(2,2),
            material
        );

        scene.add(mesh);

        function animate(){

            time += 0.016;
            rippleStrength *= 0.97;

            material.uniforms.uTime.value = time;
            material.uniforms.uStrength.value = rippleStrength;

            renderer.render(scene,camera);

            requestAnimationFrame(animate);
        }

        animate();

    });

}
  if (typeof THREE === "undefined") {
    const s = document.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.min.js";
    s.onload = init;
    document.body.appendChild(s);
  } else {
    init(imageUrls.Ayanda);
  }   
