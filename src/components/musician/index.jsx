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
import MaterialTable from 'material-table'

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

      if (res.data.composed_works) {
        let newDataComp = {}
        let tabDataComp = []
        const tab = res.data.composed_works
        for (let i = 0; i < tab.length; i++) {
          if (!(tab[i].work in newDataComp)) {
            newDataComp[tab[i].work] = tab[i].work_name
          }
        }
        for (let key in newDataComp) {
          let workObj = new Object
          workObj.work = key
          workObj.work_name = newDataComp[key]
          tabDataComp.push(workObj)
        }
        console.log(tabDataComp)
        res.data.composed_works = tabDataComp
      }

      this.setState({ musicianData: res.data })
    }
    )
  }

  handleClick(rang) {
    const WorkId = (rang).slice(-36)
    this.props.history.push('/work/' + WorkId)
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
              <MaterialTable
                title='Oeuvres Composées'
                columns={[
                  { title: "Titre de l'oeuvre", field: "work_name" }
                ]}
                data={this.state.musicianData.composed_works}
                onRowClick={((evt, selectedRow) => {
                  const workId = selectedRow.work.slice(-36)
                  this.props.history.push('/work/' + workId)
                })}
              >

              </MaterialTable>
            </Box>
          </Grid>
      }

      if (this.state.musicianData.performed_works !== undefined) {
        let performanceData = this.state.musicianData.performed_works;
        tableInterpretations =
          <Grid>
            <Box m={3}>
              <MaterialTable
              title='Oeuvres Interprétées'
              columns={[
                {title : "Titre", render : row => {
                  return(row.work_name ? row.work_name : 'Oeuvre anonyme')
                }},
                {title : "Radio de diffusion", field : "radio_name"},
                {title : "Date d'interprétation", render : row => {
                  let date = row.start_date.split('T')[0]
                  date = date.split('-')
                  return(date[2]+"-"+date[1]+"-"+ date[0])
                }},
                {title : "Plage horaire d'interprétation", render : row => {
                  let HDeb = row.start_date.split('T')[1]
                  HDeb = HDeb.split(':00+')[0]
                  let HFin = row.end_date.split('T')[1]
                  HFin = HFin.split(':00+')[0]
                  return(HDeb+" - "+HFin)
                }},
                {title : "Compositeur de l'oeuvre", render : row => {
                  return(row.composer_surname ? (row.composer_given_name ? row.composer_given_name + " " : "" ) + row.composer_surname : 'Compositeur anonyme')
                }},
              ]}
              data={performanceData}
              onRowClick={((evt, selectedRow) => {
                const workId = selectedRow.work.slice(-36)
                this.props.history.push('/work/'+workId)
              })}>
              </MaterialTable>
            </Box>
          </Grid>
      }

      const dateNaissance = this.state.musicianData.birth_date
      const dateMort = this.state.musicianData.death_date
      let datesMusicien = ""
      if (dateNaissance !== undefined) {
        datesMusicien = dateNaissance + " - "
      } else {
        datesMusicien = "???? - "
      }
      if (dateMort !== undefined) {
        datesMusicien = datesMusicien + dateMort
      }
      else {
        datesMusicien = datesMusicien + "????"
      }

      return (
        <Container>
          <Grid>
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
