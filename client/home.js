export async function markup(/** @type {import("@notml/core").oom} */ oom) {
  await Promise.all([
    import('https://cdn.jsdelivr.net/npm/@material/mwc-top-app-bar-fixed@0.25.3/+esm'),
    import('https://cdn.jsdelivr.net/npm/@material/mwc-select@0.25.3/+esm'),
    import('https://cdn.jsdelivr.net/npm/@material/mwc-textfield@0.25.3/+esm'),
    import('https://cdn.jsdelivr.net/npm/@material/mwc-button@0.25.3/+esm')
  ])


  class LoginForm extends oom.extends(HTMLElement) {

    static tagName = 'login-form'
    static style = oom.style({
      '.content': { display: 'flex', flexDirection: 'column' },
      '.login': { display: 'flex', justifyContent: 'flex-end' },
      '.space': { margin: '8px' }
    })

    /** @type {import("@material/mwc-select").Select} */ // @ts-ignore
    room = oom.mwcSelect({ class: 'space', required: true, label: 'Комната' }, oom
      .mwcListItem({ selected: true, value: 'demo' }, 'Демо сцена')
    ).dom

    /** @type {import("@material/mwc-textfield").TextField} */ // @ts-ignore
    username = oom.mwcTextfield({ class: 'space', required: true, label: 'Ваше имя' }).dom

    template = oom
      .mwcTopAppBarFixed({ dense: true, centertitle: true }, oom
        .div({ slot: 'title' }, 'Вход в онлайн галерею'))
      .div({ class: 'content space' }, this.room, this.username, oom
        .div({ class: 'login space' }, oom.mwcButton({
          onclick: () => this.openRoom(),
          ...{ outlined: true, icon: 'login', label: 'Вход' }
        })))


    openRoom() {
      const url = new URL(window.location.href)
      const room = this.room.value
      const username = this.username.value

      if (room && username) {
        url.searchParams.set('room', room)
        url.searchParams.set('username', username)

        window.location.href = url.href
      }
    }

  }


  oom.define(LoginForm)
  oom(window.document.body, new LoginForm())
}
