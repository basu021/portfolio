import { createRouter, createWebHistory } from 'vue-router'
import Loader from '../views/Loader.vue'
import Office from '../views/Office.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Loader,
      meta: {
        title: 'Portfolio | Basudev Rout - Database Administrator',
>>>>>>> main
        metaTags: [
          {
            rel: 'canonical',
            href: 'https://rbasu.in'
          },
          {
            name: 'title',
            content: 'Portfolio | Basudev Rout - Database Administrator'
>>>>>>> main
          },
          {
            name: 'description',
            content:
              "Discover the portfolio of Basudev Rout, passionate Database Administrator, specializing in database management, optimization, and administration."
          },
          {
            name: 'keywords',
            content: 'portfolio, basudev rout, database administrator, DBA, database management, SQL, database optimization, data administration'
>>>>>>> main
          },
          {
            name: 'author',
            content: 'Basudev Rout'
          },
          {
            name: 'robots',
            content: 'index, follow'
          },
          {
            name: 'theme-color',
            content: '#000000'
          },
          {
            name: 'mobile-web-app-capable',
            content: 'yes'
          },
          {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black'
          },
          {
            name: 'apple-mobile-web-app-title',
            content: 'Portfolio | Basudev Rout - Database Administrator'
          },
          {
            name: 'application-name',
            content: 'Portfolio | Basudev Rout - Database Administrator'
          },
          {
            name: 'twitter:card',
            content: 'summary'
          },
          {
            name: 'twitter:title',
            content: 'Portfolio | Basudev Rout - Database Administrator'
          },
          {
            name: 'twitter:description',
            content:
              "Discover the portfolio of Basudev Rout, passionate Database Administrator, specializing in database management, optimization, and administration."
          },
          {
            name: 'twitter:image',
            content: 'https://rbasu.in/img/logo-portfolio-black.webp'
          },
          {
            name: 'twitter:image:alt',
            content: 'Logo Portfolio Basudev Rout'
          },
          {
            property: 'og:type',
            content: 'website'
          },
          {
            property: 'og:title',
            content: 'Portfolio | Basudev Rout - Database Administrator'
          },
          {
            property: 'og:description',
            content:
              "Discover the portfolio of Basudev Rout, passionate Database Administrator, specializing in database management, optimization, and administration."
          },
          {
            property: 'og:site_name',
            content: 'Portfolio | Basudev Rout - Database Administrator'
          },
          {
            property: 'og:url',
            content: 'https://rbasu.in'
          },
          {
            property: 'og:image',
            content: 'https://rbasu.in/img/logo-portfolio-black.webp'
          },
          {
            property: 'og:image:alt',
            content: 'Logo Portfolio Basudev Rout'
          },
          {
            property: 'og:locale',
            content: 'en_US'
          },
          {
            property: 'og:locale:alternate',
            content: 'en_US'
          }
        ]
      }
    },
    {
      path: '/office',
      name: 'Office',
      component: Office,
      meta: {
        title: 'Office | Basudev Rout - Database Administrator',
        metaTags: [
          {
            rel: 'canonical',
            href: 'https://rbasu.in/office'
          },
          {
            name: 'title',
            content: 'Office | Basudev Rout - Database Administrator'
          },
          {
            name: 'description',
            content:
              "Discover the office of Basudev Rout, passionate Database Administrator, specializing in database management, optimization, and administration."
          },
          {
            name: 'keywords',
            content: 'office, basudev rout, database administrator, DBA, database management, SQL, database optimization, data administration'
          },
          {
            name: 'author',
            content: 'Basudev Rout'
          },
          {
            name: 'robots',
            content: 'index, follow'
          },
          {
            name: 'theme-color',
            content: '#000000'
          },
          {
            name: 'mobile-web-app-capable',
            content: 'yes'
          },
          {
            name: 'apple-mobile-web-app-status-bar-style',
            content: 'black'
          },
          {
            name: 'apple-mobile-web-app-title',
            content: 'Office | Basudev Rout - Database Administrator'
          },
          {
            name: 'application-name',
            content: 'Office | Basudev Rout - Database Administrator'
          },
          {
            name: 'twitter:card',
            content: 'summary'
          },
          {
            name: 'twitter:title',
            content: 'Office | Basudev Rout - Database Administrator'
          },
          {
            name: 'twitter:description',
            content:
              "Discover the office of Basudev Rout, passionate Database Administrator, specializing in database management, optimization, and administration."
          },
          {
            name: 'twitter:image',
            content: 'https://rbasu.in/img/logo-portfolio-black.webp'
          },
          {
            name: 'twitter:image:alt',
            content: 'Logo Portfolio Basudev Rout'
          },
          {
            name: 'og:type',
            content: 'website'
          },
          {
            name: 'og:title',
            content: 'Office | Basudev Rout - Database Administrator'
          },
          {
            name: 'og:description',
            content:
              "Discover the office of Basudev Rout, passionate Database Administrator, specializing in database management, optimization, and administration."
          },
          {
            name: 'og:site_name',
            content: 'Office | Basudev Rout - Database Administrator'
          },
          {
            name: 'og:url',
            content: 'https://rbasu.in/office'
          },
          {
            name: 'og:image',
            content: 'https://rbasu.in/img/logo-portfolio-black.webp'
          },
          {
            name: 'og:image:alt',
            content: 'Logo Portfolio Basudev Rout'
          },
          {
            name: 'og:locale',
            content: 'en_US'
          },
          {
            name: 'og:locale:alternate',
            content: 'en_US'
          }
        ]
      }
    }
  ]
})

export default router
