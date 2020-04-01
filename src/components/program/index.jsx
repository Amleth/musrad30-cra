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
import lodash from 'lodash'

class Program extends React.Component {
  constructor(props) {
    super(props)
    this.state = { programData: null }
  }

  componentDidMount() {
    const id = this.props.match.params.id
    axios.get('http://data-iremus.huma-num.fr/musrad30/super_event/' + id).then(res => {
      let newData = []
      const data = lodash.groupBy(res.data, 'music_event')
      // console.log(data)
      for (const work in data) {
        const performers = data[work].map(item =>
          (item.performer_surname ? (item.performer_given_name ? item.performer_given_name + " " : "") + item.performer_surname : null)
        )
        data[work][0].performer = performers
        newData.push(data[work][0])
      }
      this.setState({ programData: newData })
    })
  }

  render() {
    if (!this.state.programData) {
      return <div>Rien…</div>
    } else {
      const pData = this.state.programData[0]
      let description = pData.description
      description = description.split('@fr')[0]

      let heuredebut = pData.start_date.split('T')[1]
      let heurefin = pData.end_date.split('T')[1]
      let plageHoraire = heuredebut.split(':00+')[0] + ' - ' + heurefin.split(':00+')[0]

      let duree = pData.duration.split('T')[1]
      const heures = duree.split('H')[0]
      let minutes = duree.split('H')[1]
      minutes = minutes.split('M')[0]
      duree = heures + 'h' + minutes +'min.'

      return (
        <Container>
          <Grid>
            <Box mx='auto'>
              <Typography variant='h5' component='h6'>
                <Grid container direction='row' justify='space-between' alignItems='center'>
                  <Box p={2}>{pData.title_label}</Box>
                  <Box p={2}>{pData.station_label}</Box>
                </Grid>
              </Typography>
            </Box>
          </Grid>

          <Grid>
            <Box direction='column' alignItems='center'>
              <Box>
                <Typography variant='h6' component='h6' display="inline">
                  Description :{" "}
                </Typography>
              </Box>
              <Box>
                <Typography variant='subtitle1' component='h3' display="inline">
                  {description}
                </Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={7}>
            <Box mx = 'auto'>
              <Grid container direction='row' justify='space-between' alignItems='center'>
              <Box m={2}> <Typography variant='h6' component='h6'>{pData.jour_debut_diffusion + " " + pData.start_date.slice(8, 10) + "-" + pData.start_date.slice(5, 7) + "-" + pData.start_date.slice(0, 4)}</Typography></Box>
              <Box m={2}> <Typography variant='h6' component='h3' display='inline'>Plage horaire :</Typography><Typography variant='subtitle1' component='h3' display="inline">{" " + plageHoraire}</Typography></Box>
              <Box m={2}> <Typography variant='h6' component='h3' display='inline'>Durée :</Typography><Typography variant='subtitle1' component='h3' display="inline">{" " + duree}</Typography></Box>
              </Grid>
            </Box>

          </Grid>
          <MaterialTable
            title="Plages diffusées"
            columns={[
              {
                title: "Titre de l'oeuvre", render: rowdata => {
                  if (rowdata.work_name) {
                    return rowdata.work_name
                  } else return ('Oeuvre anonyme')
                }
              },
              {
                title: "Compositeurs", render: r => {
                  if (r.composer) {
                    let name = (r.composer_given_name ? r.composer_given_name + " " : "") + r.composer_surname
                    return (name)
                  } else return ('Compositeur anonyme')
                }
              },
              {
                title: "Interprètes", render: r => {
                  if (r.performer[0]) {
                    console.log(r.performer.length)
                    let chaine = ""
                    for (let i = 0; i < (r.performer.length) - 1; i++) {
                      chaine = chaine + r.performer[i] + ", "
                    }
                    chaine = chaine + r.performer[r.performer.length - 1]
                    return (chaine)
                  } else return ('Interprète anonyme')
                }
              },
            ]}
            data={this.state.programData}
            onRowClick={((evt, selectedRow) => {
              const workId = selectedRow.work.slice(-36)
              this.props.history.push('/work/' + workId)
            })}
          >

          </MaterialTable>

        </Container>
      )
    }
  }
}

export default withRouter(Program)