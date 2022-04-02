export function markup(
  /** @type {import("@notml/core").oom} */ oom,
  /** @type {import("@notml/core").OOMElementProxy} */ assets,
  /** @type {import("@notml/core").OOMElementProxy} */ scene
) {
  const url = new URL(window.location.href)
  const userName = url.searchParams.get('username') || ''
  const isArtist = userName.toLocaleLowerCase() === 'artist'

  assets(oom
    .aAssetItem({
      id: 'model-artist',
      src: '/scene/models/artist.glb'
    })
    // .template({ id: 'artist-template' }, oom
    //   .aEntity({ class: 'avatar', networkedAudioSource: true }, oom
    //     .aEntity({ class: 'nametag', text: 'value: Artist; align:center;', position: '0 2.3 0', rotation: '0 180 0', scale: '8 8 8' })
    //     .aEntity({
    //       gltfModel: '#model-artist',
    //       position: '0 0 0',
    //       rotation: '0 180 0'
    //     })))
    .template({ id: 'artist-template' }, oom
      .aEntity({ class: 'avatar', networkedAudioSource: true }, oom
        .aEntity({ class: 'nametag', text: 'value: Artist; align:center;', position: '0 0.8 0', rotation: '0 180 0', scale: '8 8 8' })
        .aSphere({ class: 'head', scale: '0.45 0.5 0.4' })
        .aEntity({ class: 'face', position: '0 0.05 0' }, oom
          .aSphere({ class: 'eye', color: '#efefef', position: '0.16 0.1 -0.35', scale: '0.12 0.12 0.12' }, oom
            .aSphere({ class: 'pupil', color: '#000', position: '0 0 -1', scale: '0.2 0.2 0.2' }))
          .aSphere({ class: 'eye', color: '#efefef', position: '-0.16 0.1 -0.35', scale: '0.12 0.12 0.12' }, oom
            .aSphere({ class: 'pupil', color: '#000', position: '0 0 -1', scale: '0.2 0.2 0.2' })))))
    .template({ id: 'viewer-template' }, oom
      .aEntity({ class: 'avatar', networkedAudioSource: true }, oom
        .aEntity({ class: 'nametag', text: 'value: Viewer; align:center;', position: '0 0.8 0', rotation: '0 180 0', scale: '8 8 8' })
        .aSphere({ class: 'head', scale: '0.45 0.5 0.4' })
        .aEntity({ class: 'face', position: '0 0.05 0' }, oom
          .aSphere({ class: 'eye', color: '#efefef', position: '0.16 0.1 -0.35', scale: '0.12 0.12 0.12' }, oom
            .aSphere({ class: 'pupil', color: '#000', position: '0 0 -1', scale: '0.2 0.2 0.2' }))
          .aSphere({ class: 'eye', color: '#efefef', position: '-0.16 0.1 -0.35', scale: '0.12 0.12 0.12' }, oom
            .aSphere({ class: 'pupil', color: '#000', position: '0 0 -1', scale: '0.2 0.2 0.2' })))))
  )

  // @ts-ignore
  window.NAF.schemas.add({
    template: '#artist-template',
    components: ['position', 'rotation',
      {
        selector: '.head',
        component: 'material',
        property: 'color'
      },
      {
        selector: '.nametag',
        component: 'text',
        property: 'value'
      }
    ]
  })
  // @ts-ignore
  window.NAF.schemas.add({
    template: '#viewer-template',
    components: ['position', 'rotation',
      {
        selector: '.head',
        component: 'material',
        property: 'color'
      },
      {
        selector: '.nametag',
        component: 'text',
        property: 'value'
      }
    ]
  })

  const player = isArtist
    ? oom
      // .aEntity({
      //   id: 'artist',
      //   movementControls: 'constrainToNavMesh: true; speed:0.2;',
      //   lookControls: 'pointerLockEnabled: true',
      //   networked: 'template:#artist-template;attachTemplateToLocal:false;',
      //   position: '0 0 0',
      //   spawnInCircle: 'radius:3'
      // }, oom
      //   .aEntity({ class: 'nametag', text: `value: ${userName}; align:center;` })
      //   .aEntity({ position: '0 1.6 0', camera: true }))
      .aEntity({
        id: 'artist',
        movementControls: 'constrainToNavMesh: true; speed:0.2;',
        lookControls: 'pointerLockEnabled: true',
        networked: 'template:#artist-template;attachTemplateToLocal:false;',
        position: '0 1.6 0',
        spawnInCircle: 'radius:2'
      }, oom
        .aEntity({ camera: true })
        .aEntity({ class: 'nametag', text: `value: ${userName}; align:center;` })
        .aSphere({ class: 'head', visible: 'false', randomColor: true }))
    : oom
      .aEntity({
        id: 'viewer',
        movementControls: 'constrainToNavMesh: true; speed:0.2;',
        lookControls: 'pointerLockEnabled: true',
        networked: 'template:#viewer-template;attachTemplateToLocal:false;',
        position: '0 1.6 0',
        spawnInCircle: 'radius:2'
      }, oom
        .aEntity({ camera: true })
        .aEntity({ class: 'nametag', text: `value: ${userName}; align:center;` })
        .aSphere({ class: 'head', visible: 'false', randomColor: true }))

  scene(player)
}
