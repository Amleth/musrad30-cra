import React from 'react'
import { withRouter } from 'react-router'
import axios from 'axios'
import {
  Box,
  Grid,
  Container,
  Typography
} from '@material-ui/core'
import MaterialTable from 'material-table'
import lodash from 'lodash'

class Work extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      workData: null,
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id

    axios.get('http://data-iremus.huma-num.fr/musrad30/work/' + id).then(res => {
      let newData = []
      const data = lodash.groupBy(res.data, 'sub_event')
      for (const sub_event in data) {
        const performers = data[sub_event].map(item => item.performer_surname + "\n")
        data[sub_event][0].performer = performers
        newData.push(data[sub_event][0])
      }
      console.log(newData)
      this.setState({ workData: newData })
    })
  }

  render() {
    if (!this.state.workData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      return (
        <Container>
          <Grid>
            <Box mx='auto'>
              <Typography variant='h6' component='h6'>
                <Grid container direction='row' justify='space-evenly' alignItems='center'>
                  <Box p={2}>{this.state.workData[0].work_name}</Box>
                  <Box p={2}>{this.state.workData[0].composer_given_name + " " + this.state.workData[0].composer_surname}</Box>
                </Grid>
              </Typography>
            </Box>
          </Grid>

          <MaterialTable
          title="Diffusions de l'oeuvre"
          columns={[
            { title : "Radio", field : "super_event_station_label"},
            { title : "Jour", field : "super_event_jour_debut_diffusion"},
            { title : "Date", render: rowData => {
              return (rowData.super_event_start_date.slice(8,10)+"-"+rowData.super_event_start_date.slice(5,7)+"-"+rowData.super_event_start_date.slice(0,4))
            }},
            { title : "Horaire de début", field : "super_event_start_date", type : 'datetime', render: rowData => {
              return (rowData.super_event_start_date.slice(11,16))
            }},
            { title : "Horaire de fin", field : "super_event_end_date", type : 'datetime', render: rowData => {
              return (rowData.super_event_end_date.slice(11,16))
            }},
            { title : "Titre du programme", field : "super_event_title_label"},
            { title : "Type du programme", field : "super_event_type_label"},
            { title : "Format de diffusion", field : "super_event_format_label"},
            { title : "Interprète", field : "performer"},
          ]}
          data={this.state.workData}
          onRowClick={((evt, selectedRow) => {
            const progId = selectedRow.super_event.slice(-36)
            this.props.history.push('/super_event/'+progId)
          })}
          >

          </MaterialTable>
        </Container>
      )
    }
  }
}

export default withRouter(Work)
