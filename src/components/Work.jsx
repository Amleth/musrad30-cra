import lodash from 'lodash'
import { CircularProgress, Container, Typography } from '@material-ui/core'
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { capitalize } from '../common'

function Work({ history, match }) {
  const id = match.params.id

  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://data-iremus.huma-num.fr/api/musrad30/work/' + id)
      res.json().then((res) => {
        setData(computeData(res))
      })
    }
    fetchData()
  }, [id])

  if (data.length === 0) {
    return (
      <Container maxWidth='md' align='center'>
        <CircularProgress />
      </Container>
    )
  } else {
    const w = data[0]

    // Plage horaire
    const heuredebut = w.super_event_start_date.split('T')[1]
    const heurefin = w.super_event_end_date.split('T')[1]
    const plageHoraire = heuredebut.split(':00+')[0] + ' — ' + heurefin.split(':00+')[0]

    // Compositeurs
    const compositeurs =
      data.map((_) => _.composer).join('').length === 0
        ? 'Anonyme'
        : data.map((_) => _.composer).join(', ')

    return (
      <Container maxWidth='md'>
        <Typography component='h1' variant='h4'>
          {w.work_name || 'Œuvre non titrée'}
        </Typography>
        <Typography component='h2' variant='h5'>
          {compositeurs}
        </Typography>
        <br />
        <MaterialTable
          title='Diffusions'
          columns={[
            { title: 'Radio', field: 'super_event_station_label' },
            {
              title: 'Jour',
              field: 'super_event_jour_debut_diffusion',
              render: (row) => capitalize(row.super_event_jour_debut_diffusion)
            },
            {
              title: 'Date',
              render: (rowData) => {
                return (
                  rowData.super_event_start_date.slice(8, 10) +
                  '/' +
                  rowData.super_event_start_date.slice(5, 7) +
                  '/' +
                  rowData.super_event_start_date.slice(0, 4)
                )
              }
            },
            {
              title: 'Plage horaire',
              type: 'datetime',
              render: (row) => plageHoraire
            },
            {
              title: 'Programme',
              field: 'super_event_title_label',
              render: (row) => capitalize(row.super_event_title_label)
            },
            {
              title: 'Type du programme',
              field: 'super_event_type_label',
              render: (row) => capitalize(row.super_event_type_label)
            },
            {
              title: 'Format de diffusion',
              field: 'super_event_format_label',
              render: (row) => capitalize(row.super_event_format_label)
            },
            {
              title: 'Interprète',
              render: (r) => {
                if (r.performer[0]) {
                  let chaine = ''
                  for (let i = 0; i < r.performer.length - 1; i++) {
                    chaine = chaine + r.performer[i] + ', '
                  }
                  chaine = chaine + r.performer[r.performer.length - 1]
                  return chaine
                } else return 'Anonyme'
              }
            }
          ]}
          data={data}
          onRowClick={(evt, selectedRow) => {
            const progId = selectedRow.super_event.slice(-36)
            history.push('/super_event/' + progId)
          }}
          options={{
            filtering: true,
            cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
            headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
          }}
        ></MaterialTable>
        <br />
      </Container>
    )
  }
}

function computeData(res) {
  let newData = []
  const data = lodash.groupBy(res, 'sub_event')
  for (const sub_event in data) {
    const performers = data[sub_event].map((item) =>
      item.performer_surname
        ? (item.performer_given_name ? item.performer_given_name + ' ' : '') +
          item.performer_surname
        : null
    )

    const composers = data[sub_event].map((item) =>
      item.composer_surname
        ? (item.composer_given_name ? item.composer_given_name + ' ' : '') + item.composer_surname
        : null
    )
    const distinctPerformers = [...new Set(performers)]
    const distinctComposers = [...new Set(composers)]
    data[sub_event][0].performer = distinctPerformers
    data[sub_event][0].composer = distinctComposers
    newData.push(data[sub_event][0])

    return newData
  }
}

export default withRouter(Work)
