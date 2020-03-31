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
      console.log(data)
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
      return (
        <Container>
          <Grid>
            <Box mx='auto'>
              <Typography variant='h6' component='h6'>
                <Grid container direction='row' justify='space-evenly' alignItems='center'>
                  <Box p={2}>{pData.title_label}</Box>
                  <Box p={2}>{pData.jour_debut_diffusion + " " + pData.start_date.slice(8, 10) + "-" + pData.start_date.slice(5, 7) + "-" + pData.start_date.slice(0, 4)}</Box>
                  <Box p={2}>{pData.station_label}</Box>
                </Grid>
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
            <Box mx='auto' direction='column'>
              <Box>
                <Typography variant='button' component='h3' display="inline">
                  Description :{" "}
                </Typography>
              </Box>
              <Box>
                <Typography variant='subtitle1' component='h3' display="inline">
                  A Implémenter
                  </Typography>
              </Box>
            </Box>
          </Grid>
          <MaterialTable
          title="Plages diffusées"
          columns={[
            {title : "Titre de l'oeuvre", render : rowdata => {
              if (rowdata.work_name) {
                return rowdata.work_name
              } else return ('Oeuvre anonyme')
            }},
            {title : "Compositeurs", render : r => {
              if (r.composer) {
                let name = (r.composer_given_name ? r.composer_given_name + " " : "" ) + r.composer_surname
                return(name)
              } else return ('Compositeur anonyme')
            }},
            {title : "Interprètes", render : r => {
              if (r.performer[0]) {
                console.log(r.performer.length)
                let chaine = ""
                for (let i = 0 ; i < (r.performer.length) - 1 ; i ++){
                  chaine = chaine + r.performer[i] + ", "
                }
                chaine = chaine + r.performer[r.performer.length - 1]
                return chaine
              } else return ('Interprète anonyme')
            }},
          ]}
          data={this.state.programData}
          onRowClick={((evt, selectedRow) => {
            const workId = selectedRow.work.slice(-36)
            this.props.history.push('/work/'+workId)
          })}
          >

          </MaterialTable>

        </Container>
      )
    }
  }
}

export default withRouter(Program)