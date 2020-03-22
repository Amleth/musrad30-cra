import React from 'react'
import Box from '@material-ui/core/Box'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import Table from '@material-ui/core/Typography'
import { withRouter } from 'react-router'
import axios from 'axios'
import { Container, Card, CardContent, TableHead, TableRow, TableBody, TableCell } from '@material-ui/core'

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
          <Grid>
            <Typography variant="h5" component="h2">
              Affichage du musicien d'id <code>{this.props.match.params.id}</code> (aller lire{' '}
              <code>this.state.data</code>)
            </Typography>

            <Box mx="auto">
              <Grid container direction="row" justify="space-evenly" alignItems="center">
                <Box p={2}>
                  Nom
                </Box>
                <Box p={2}>Prenom</Box>
                <Box p={2}>(Anaissance - Amort)</Box>
              </Grid>
            </Box>
          </Grid>


          <Grid spacing={4} Box direction="row" >
            <Box Box display="flex" flexWrap="nowrap" direction="column" justify="space-between" alignItems="flex-start">
              <Box container direction="column" >
                <Box m={3}>
                  <Typography variant="button" component="h3">
                    statut :
                    </Typography>
                </Box>
                <Box m={3}>
                  <Typography gutterBottom variant="button" component="h3">
                    nationalite :
                  </Typography>
                </Box>
                <Box m={3}>
                  <Typography variant="button" component="h3">
                    style :
                    </Typography>
                </Box>
              </Box>

              <Box m={3}>
                <Typography gutterBottom variant="button" component="h3">
                  Infos :
                  </Typography>
                <Typography varaint="body2" color="textSecondary">
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas non laoreet est.
                  </Typography>
              </Box>
            </Box>
          </Grid>
          {/*Si le musicien possede des oeuvres alors les afficher*/}
          <Grid>
            <Box m={3}>
              <Typography variant="h5" component="h3">
                Oeuvres Composées
              </Typography>
            </Box>
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align="right">Titre</TableCell>
                    <TableCell align="right">Informations de diffusion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                </TableBody>
              </Table>
            </Box>
          </Grid>
          {/*Si le musicien interprete des oeuvres alors les afficher*/}
          <Grid>
            <Box m={3}>
              <Typography variant="h5" component="h3">
                Oeuvres Interpretées
              </Typography>
            </Box>
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                  <TableCell align="right">Titre</TableCell>
                    <TableCell align="right">Informations de diffusion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                </TableBody>
              </Table>
            </Box>
          </Grid>       
        </Container>
      )
    }
  }
}

export default withRouter(Musician)
