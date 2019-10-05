
const routes = [
  {
    path: '/',
    component: () => import('layouts/MyLayout.vue')
  },
  {
    path: '/cardapio-manager',
    component: () => import('layouts/CadastroCardapio.vue')
  }
]

// Always leave this as last one
if (process.env.MODE !== 'ssr') {
  routes.push({
    path: '*',
    component: () => import('pages/Error404.vue')
  })
}

export default routes
