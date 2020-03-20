import React from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import MaterialTable from 'material-table'
import spacing from '@material-ui/system'
import { withRouter } from 'react-router'
import axios from 'axios'
import { Container } from '@material-ui/core'

class Musician extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: null }
  }

  componentDidMount() {
    const id = this.props.match.params.id
    console.log(id)

    // Exemple d'appel d'API REST bidon
    axios.get('https://www.mocky.io/v2/5185415ba171ea3a00704eed').then(res => {
      this.setState({ data: res.data })
      console.log(this.state.data)
    })
  }

 
  render() {
    if (!this.state.data) {
      return <div>Rien…</div>
    } else {
      return (
        
        <Container>

          <Box mx="auto">
            <Typography>
            Affichage du musicien d'id <code>{this.props.match.params.id}</code> (aller lire{' '}
            <code>this.state.data</code>)
            </Typography>
          </Box>
          
          <Box mx="auto">
            <Grid container Box xs={12} spacing={3}>
              <Box p={2}>Nom</Box>
              <Box p={2}>Prenom</Box>
              <Box p={2}>(Anaissance - Amort)</Box>
            </Grid>
          </Box>
          
        </Container>
        
      )
    }
  }
}

export default withRouter(Musician)
