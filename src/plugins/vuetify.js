// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { md3 } from 'vuetify/blueprints'

// Vuetify
import { createVuetify } from 'vuetify'

const myCustomDarkTheme = {
  dark: true,
  colors: {
    background: '#263226',
    surface: '#F5F5F5',
    primary: '#647ea2',
    'primary-darken-1': '#3700B3',
    secondary: '#9DAAA3',
    'secondary-darken-1': '#018786',
    tertiary: '#907471',
    'tertiary-darken-1': '#826865',
    error: '#f44336',
    info: '#000000',
    success: '#54a069',
    warning: '#d19031',
  }
}

export default createVuetify({
  // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
  blueprint: md3,
  theme: {
    defaultTheme: 'myCustomDarkTheme',
    themes: {
      myCustomDarkTheme,
    }
  }
})
