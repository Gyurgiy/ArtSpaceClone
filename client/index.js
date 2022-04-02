(async () => {
  if (window['@notml/core:compatibility'] === false) {
    return false
  }

  const url = new URL(window.location.href)
  let page = './home.js'

  if (url.searchParams.has('room')) {
    page = './scene.js'
  }

  const [{ oom }, { markup }] = await Promise.all([
    import('https://cdn.jsdelivr.net/npm/notml@0.1.0-pre.17/core.js'),
    import(page)
  ])

  await markup(oom)
})().catch(err => {
  err = err.stack ? `${err.message}\n\n${err.stack}` : err

  console.error(err)
  window.document.body.innerHTML += `<code style="white-space: pre-wrap; word-break: break-all; color: #B22222;">${err}</code>`
})
