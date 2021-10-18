// import Cookies from 'js-cookie'

const app = {
    state: {
        language: localStorage.getItem('language_market') || 'en',
        routerMenu: localStorage.getItem('routerMenu') || 0,
        metaAddress: sessionStorage.getItem('metaAddress') || ''
    },
    mutations: {
        SET_LANGUAGE: (state, language) => {
            state.language = language
            localStorage.setItem('language', language)
        },
        SET_ROUTERMENU: (state, routerMenu) => {
            // console.log(state, routerMenu);
            state.routerMenu = routerMenu
            localStorage.setItem('routerMenu', routerMenu)
        },
        SET_METAADDRESS: (state, metaAddress) => {
            state.metaAddress = metaAddress
            sessionStorage.setItem('metaAddress', metaAddress)
        },

    },
    actions: {
        setLanguage({commit}, language) {
            commit('SET_LANGUAGE', language)
        },
        setRouterMenu({commit}, routerMenu) {
            commit('SET_ROUTERMENU', routerMenu)
        },
        setMetaAddress({commit}, metaAddress) {
            commit('SET_METAADDRESS', metaAddress)
        }
    }
}

export default app
