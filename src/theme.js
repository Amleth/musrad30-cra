import { red } from '@material-ui/core/colors'
import { createMuiTheme } from '@material-ui/core/styles'

const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#1693A5'
    },
    secondary: {
      main: '#ADD8C7'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#fff'
    }
  },
  spacing: 8
})

export default theme
