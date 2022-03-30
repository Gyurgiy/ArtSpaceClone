export function markup(
  /** @type {import("@notml/core").oom} */ oom,
  /** @type {import("@notml/core").OOMElementProxy} */ assets,
  /** @type {import("@notml/core").OOMElementProxy} */ scene
) {
  assets(oom
    .aAssetItem({
      id: 'model-artist',
      src: '/scene/models/artist.glb'
    })
    .template({ id: 'artist-template' }, oom
      .aEntity({ class: 'avatar', networkedAudioSource: true }, oom
        .aEntity({
          gltfModel: '#model-artist',
          position: '0 0 0',
          rotation: '0 180 0'
        })))
    .template({ id: 'viewer-template' }, oom
      .aEntity({ class: 'avatar', networkedAudioSource: true }, oom
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
    components: ['position', 'rotation']
  })
  // @ts-ignore
  window.NAF.schemas.add({
    template: '#viewer-template',
    components: ['position', 'rotation', {
      selector: '.head',
      component: 'material',
      property: 'color'
    }]
  })

  const url = new URL(window.location.href)
  const isArtist = (url.searchParams.get('username') || '').toLocaleLowerCase() === 'artist'
  const player = isArtist
    ? oom
      .aEntity({
        id: 'artist',
        movementControls: 'constrainToNavMesh: true; speed:0.2;',
        lookControls: 'pointerLockEnabled: true',
        networked: 'template:#artist-template;attachTemplateToLocal:false;',
        position: '0 0 0',
        spawnInCircle: 'radius:3'
      }, oom.aEntity({ position: '0 1.6 0', camera: true }))
    : oom
      .aEntity({
        id: 'viewer',
        movementControls: 'constrainToNavMesh: true; speed:0.2;',
        lookControls: 'pointerLockEnabled: true',
        networked: 'template:#viewer-template;attachTemplateToLocal:false;',
        position: '0 1.6 0',
        spawnInCircle: 'radius:3'

      }, oom
        .aEntity({ camera: true })
        .aSphere({ class: 'head', visible: 'false', randomColor: true }))

  scene(player)
}
