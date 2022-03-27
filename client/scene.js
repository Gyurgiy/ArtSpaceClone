export async function markup(oom) {
  const aframeLib = oom.script({ src: 'https://cdn.jsdelivr.net/npm/aframe@1.3.0/dist/aframe-master.js' })

  oom(window.document.head, oom
    .script({ src: 'https://cdn.jsdelivr.net/npm/socket.io-client@4.4.1/dist/socket.io.js' })
    // https://github.com/open-easyrtc/open-easyrtc/pull/70
    // .script({ src: 'https://cdn.jsdelivr.net/npm/open-easyrtc@2.0.13/api/easyrtc.js' })
    .script({ src: 'https://cdn.jsdelivr.net/gh/open-easyrtc/open-easyrtc@socket.io-4/api/easyrtc.js' }))

  oom(window.document.head, aframeLib)
  await new Promise(resolve => { aframeLib.dom.onload = () => resolve() })

  oom(window.document.head, oom
    .script({ src: 'https://cdn.jsdelivr.net/npm/networked-aframe@0.9.1/dist/networked-aframe.js' })
    .script({ src: 'https://cdn.jsdelivr.net/npm/aframe-extras@6.1.1/dist/aframe-extras.js' })
    .script({ src: './scene/aframe-register-component.js' }))

  const scripts = window.document.head.querySelectorAll('script')
  const script = scripts.item(scripts.length - 1)

  await new Promise(resolve => { script.onload = () => resolve() })

  await import('./scene/aframe-templates.js').then(({ markup }) => markup(oom))

  const scene = oom.aScene({ networkedScene: 'room: basic; debug: true;' })
  const assets = oom.aAssets(oom
    .img({
      id: 'grid',
      src: 'https://img.gs/bbdkhfbzkk/stretch/https://i.imgur.com/25P1geh.png',
      crossorigin: 'anonymous'
    })
    .img({
      id: 'sky',
      src: 'https://img.gs/bbdkhfbzkk/2048x2048,stretch/https://i.imgur.com/WqlqEkq.jpg',
      crossorigin: 'anonymous'
    }))
  const player = oom
    .aEntity({
      id: 'player',
      networked: 'template:#avatar-template;attachTemplateToLocal:false;',
      position: '0 1.6 0',
      spawnInCircle: 'radius:3',
      wasdControls: true,
      // movementControls: 'constrainToNavMesh: true; speed:0.2;',
      lookControls: 'pointerLockEnabled: true',
      camera: true
    }, oom
      .aSphere({ class: 'head', visible: 'false', randomColor: true }))
  const world = oom
    .aEntity({
      position: '0 0 0',
      geometry: 'primitive: plane; width: 10000; height: 10000;',
      rotation: '-90 0 0',
      material: 'src: #grid; repeat: 10000 10000; transparent: true; metalness:0.6; roughness: 0.4; sphericalEnvMap: #sky;'
    })
    .aEntity({ light: 'color: #ccccff; intensity: 1; type: ambient;', visible: '' })
    .aEntity({ light: 'color: #ffaaff; intensity: 1.5', position: '5 5 5' })
    .aSky({ src: '#sky', rotation: '0 -90 0' })

  scene(assets, player, world)
  oom(window.document.body, scene)
}
