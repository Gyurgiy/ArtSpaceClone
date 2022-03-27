(async () => {
  const url = new URL(window.location.href)
  let page = './home.js'

  if (url.searchParams.has('room')) {
    page = './scene.js'
  }

  const [{ oom }, { markup }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/notml@0.1.0-pre.14/core.js'),
    import(page)
  ])

  await markup(oom)
})().catch(console.error)
