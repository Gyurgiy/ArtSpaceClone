export async function markup(/** @type {import("@notml/core").oom} */ oom) {
  const loadingLib = src => new Promise(resolve => {
    oom(window.document.head, oom.script({ src, onload: () => resolve() }))
  })
  const url = new URL(window.location.href)
  const isArtist = (url.searchParams.get('username') || '').toLocaleLowerCase() === 'artist'

  await loadingLib('https://cdn.jsdelivr.net/npm/aframe@1.3.0/dist/aframe-master.js')
  await loadingLib('https://cdn.jsdelivr.net/npm/socket.io-client@4.4.1/dist/socket.io.js')
  // https://github.com/open-easyrtc/open-easyrtc/pull/70
  //               'https://cdn.jsdelivr.net/npm/open-easyrtc@2.0.13/api/easyrtc.js'
  await loadingLib('https://cdn.jsdelivr.net/gh/open-easyrtc/open-easyrtc@socket.io-4/api/easyrtc.js')
  await loadingLib('https://cdn.jsdelivr.net/npm/aframe-extras@6.1.1/dist/aframe-extras.js')
  await loadingLib('https://cdn.jsdelivr.net/npm/networked-aframe@0.9.1/dist/networked-aframe.js')

  await Promise.all([
    import('https://cdn.jsdelivr.net/npm/@material/mwc-fab@0.25.3/+esm')
  ])

  oom(window.document.head, oom
    .script({ src: './scene/aframe-register-component.js' }))

  const scripts = window.document.head.querySelectorAll('script')
  const script = scripts.item(scripts.length - 1)

  await new Promise(resolve => { script.onload = () => resolve() })

  const scene = oom.aScene({ id: 'main-scene', networkedScene: `room: basic; debug: false; adapter: easyrtc; audio: ${isArtist};` })

  oom(window.document.body, scene)

  await import('./scene/aframe-templates.js').then(({ markup }) => markup(oom))

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
      movementControls: 'constrainToNavMesh: true; speed:0.2;',
      lookControls: 'pointerLockEnabled: true'
    }, oom
      .aEntity({ camera: true })
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

  class SceneActions extends oom.extends(HTMLElement) {

    static tagName = 'scene-actions'
    static style = oom.style({
      'scene-actions': {
        opacity: '0.7',
        position: 'fixed',
        bottom: '8px',
        left: '8px'
      }
    })

    enableMicrophone = true

    micIcon = oom.mwcIcon({ slot: 'icon' }, 'mic')
    template = () => {
      const tmpl = oom()

      if (isArtist) {
        tmpl(oom
          .mwcFab({
            onclick: () => this.toggleMicrophone(),
            ...{ mini: true, label: 'Mic' }
          }, this.micIcon))
      }

      return tmpl
    }

    toggleMicrophone() {
      this.enableMicrophone = !this.enableMicrophone
      // @ts-ignore
      window.NAF.connection.adapter.enableMicrophone(this.enableMicrophone)
      this.micIcon({ innerHTML: this.enableMicrophone ? 'mic' : 'mic_off' })
    }

  }

  oom.define(SceneActions)
  oom(window.document.body, new SceneActions())
}
