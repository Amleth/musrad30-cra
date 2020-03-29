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
      musicianData: null,
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id

    axios.get('http://data-iremus.huma-num.fr/musrad30/musician/' + id).then(res => {
      this.setState({ musicianData: res.data })
    })
  }

  handleClick(rang){
    const WorkId = (rang).slice(-36)
    this.props.history.push('/work/'+WorkId)
  }

  render() {
    if (!this.state.musicianData) {
      return <div>Données en cours de téléchargement...</div>
    } else {

      let tableCompositions = null
      let tableInterpretations = null

      if (this.state.musicianData.composed_works !== undefined) {
        let compositionData = this.state.musicianData.composed_works;
        tableCompositions =
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
                    <TableCell align='left'>Titre de l'oeuvre</TableCell>
                    {/*<TableCell align='right'>Lien d'accès</TableCell>*/}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {compositionData.map(row =>
                    <TableRow key={row}
                    onClick={() => {
                      this.handleClick(row.work)
                    }
                    }>
                      <TableCell component="th" scope="row">
                        {row.work_name}
                      </TableCell>
                      {/*<TableCell align="right">{row.work}</TableCell>*/}
                    </TableRow>
                  )
                  }
                </TableBody>
              </Table>
            </Box>
          </Grid>
      }

      if (this.state.musicianData.performed_works !== undefined) {
        let performanceData = this.state.musicianData.performed_works;
        tableInterpretations =
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
                    <TableCell align='left'>Titre de l'oeuvre</TableCell>
                    <TableCell align='left'>Radio de diffusion</TableCell>
                    <TableCell align='left'>Date de l'interprétation</TableCell>
                    <TableCell align='left'>Horaires du programme</TableCell>
                    <TableCell align='left'>Compositeur de l'oeuvre</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {performanceData.map(row =>
                    <TableRow key={row} onClick={
                      () => {
                        this.handleClick(row.work)
                      }
                    } >
                      <TableCell component="th" scope="row">
                        {row.work_name}
                      </TableCell>
                      <TableCell align="center">{row.radio_name}</TableCell>
                      <TableCell align="center">{row.jour_debut_diffusion+ " " + row.start_date.slice(8,10) + " " + row.start_date.slice(5,7) + " " + row.start_date.slice(0,4)}</TableCell>
                      <TableCell align="center">{row.start_date.slice(11,16) + " - " + row.end_date.slice(11,16)}</TableCell>
                      <TableCell align="center">{row.composer_given_name + " " + row.composer_surname}</TableCell>
                    </TableRow>
                  )
                  }
                </TableBody>
              </Table>
            </Box>
          </Grid>
      }
      
      const dateNaissance = this.state.musicianData.birth_date
      const dateMort = this.state.musicianData.death_date
      let datesMusicien = ""
      // if (dateNaissance !== undefined) {
      //   datesMusicien.append(dateNaissance)
      // } else{
      //   datesMusicien.append("???? - ")
      // }
      // if (dateMort !== undefined) {
      //   datesMusicien.append(dateMort)
      // }
      // else{
      //   datesMusicien.append("????")
      // }
      // console.log(datesMusicien)
      if (dateNaissance !== undefined) {
        datesMusicien = dateNaissance + " - "
      } else {
        datesMusicien = "???? - "
      }
      if (dateMort !== undefined) {
          datesMusicien = datesMusicien + dateMort
        }
        else{
          datesMusicien = datesMusicien + "????"
        }
      console.log(datesMusicien)

      return (
        <Container>
          <Grid>
            {/*<Typography variant='h5' component='h2'>
              Affichage du musicien d'id <code>{this.props.match.params.id}</code>
            </Typography>*/}

            <Box mx='auto'>
              <Typography variant='h6' component='h6'>
                <Grid container direction='row' justify='space-evenly' alignItems='center'>
                  <Box p={2}>{this.state.musicianData.surname}</Box>
                  <Box p={2}>{this.state.musicianData.given_name}</Box>
                  <Box p={2}>({datesMusicien})</Box>
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
                    {this.state.musicianData.status_label}
                  </Typography>

                </Box>
                <Box>
                  <Typography gutterBottom variant='button' component='h3' display="inline">
                    nationalite :{" "}
                  </Typography>
                  <Typography variant='subtitle1' component='h3' display="inline">
                    {this.state.musicianData.nationality_label}
                  </Typography>

                </Box>
                <Box>
                  <Typography variant='button' component='h3' display="inline">
                    style :{" "}
                  </Typography>
                  <Typography variant='subtitle1' component='h3' display="inline">
                    {this.state.musicianData.style_label}
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
                  {this.state.musicianData.description}
                </Typography>
              </Box>
            </Grid>
          </Grid>
          {tableCompositions}
          {tableInterpretations}
        </Container>
      )
    }
  }
}

export default withRouter(Musician)
