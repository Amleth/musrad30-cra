import React from 'react'
import { withRouter } from 'react-router'
import axios from 'axios'
import {
  Box,
  Grid,
  Container,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Typography
} from '@material-ui/core'

class Musician extends React.Component {
  constructor(props) {
    super(props)
    this.state = { 
      composerData: null,
      composedWorks: ["Sonate", "Gavotte", "Fugue", "Bourrée"],
      performedWorks: [],
     }
  }

  componentDidMount() {
    const id = this.props.match.params.id

    axios.get('http://data-iremus.huma-num.fr/musrad30/musician/' + id).then(res => {
      this.setState({ composerData: res.data })
    })
  }

  render() {
    if (!this.state.composerData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      return (
        <Container>
          <Grid>
            <Typography variant='h5' component='h2'>
              Affichage du musicien d'id <code>{this.props.match.params.id}</code>
            </Typography>

            <Box mx='auto'>
              <Typography variant='h6' component='h6'>
                <Grid container direction='row' justify='space-evenly' alignItems='center'>
                  <Box p={2}>{this.state.composerData.surname}</Box>
                  <Box p={2}>{this.state.composerData.givenName}</Box>
                  <Box p={2}>({this.state.composerData.birthDate} - {this.state.composerData.deathDate})</Box>
                </Grid>
              </Typography>
            </Box>
          </Grid>

          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box mx='auto' direction='column'>
                <Box>
                  <Typography variant='button' component='h3' display="inline">
                    statut :{" "}
                  </Typography>
                  <Typography variant='subtitle1' component='h3' display="inline">
                    {this.state.composerData.status_label}
                  </Typography>

                </Box>
                <Box>
                  <Typography gutterBottom variant='button' component='h3' display="inline">
                    nationalite :{" "}
                  </Typography>
                  <Typography variant='subtitle1' component='h3' display="inline">
                    {this.state.composerData.nationality_label}
                  </Typography>

                </Box>
                <Box>
                  <Typography variant='button' component='h3' display="inline">
                    style :{" "}
                  </Typography>
                  <Typography variant='subtitle1' component='h3' display="inline">
                    {this.state.composerData.style_label}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography gutterBottom variant='button' component='h3'>
                  Infos :
                </Typography>
                <Typography variant='subtitle1' component='h3'>
                  {this.state.composerData.description}
                </Typography>
              </Box>
            </Grid>


          </Grid>

          {/*Si le musicien possede des oeuvres alors les afficher*/}
          <Grid>
            <Box m={3}>
              <Typography variant='h5' component='h3'>
                Oeuvres Composées
              </Typography>
            </Box>
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='right'>Titre</TableCell>
                    <TableCell align='right'>Informations de diffusion</TableCell>
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
              <Typography variant='h5' component='h3'>
                Oeuvres Interpretées
              </Typography>
            </Box>
            <Box>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell align='right'>Titre</TableCell>
                    <TableCell align='right'>Informations de diffusion</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody></TableBody>
              </Table>
            </Box>

          </Grid>
        </Container>
      )
    }
  }
}

export default withRouter(Musician)
