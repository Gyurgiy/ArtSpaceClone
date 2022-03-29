export function markup(oom) {
  const templates = oom
    .template({ id: 'avatar-template' }, oom
      .aEntity({ class: 'avatar', networkedAudioSource: true }, oom
        .aSphere({ class: 'head', scale: '0.45 0.5 0.4' })
        .aEntity({ class: 'face', position: '0 0.05 0' }, oom
          .aSphere({ class: 'eye', color: '#efefef', position: '0.16 0.1 -0.35', scale: '0.12 0.12 0.12' }, oom
            .aSphere({ class: 'pupil', color: '#000', position: '0 0 -1', scale: '0.2 0.2 0.2' }))
          .aSphere({ class: 'eye', color: '#efefef', position: '-0.16 0.1 -0.35', scale: '0.12 0.12 0.12' }, oom
            .aSphere({ class: 'pupil', color: '#000', position: '0 0 -1', scale: '0.2 0.2 0.2' })))))

  oom(window.document.getElementById('main-scene'), oom.div({ id: 'templates' }, templates))

  // @ts-ignore
  window.NAF.schemas.add({
    template: '#avatar-template',
    components: ['position', 'rotation', {
      selector: '.head',
      component: 'material',
      property: 'color'
    }]
  })
}
