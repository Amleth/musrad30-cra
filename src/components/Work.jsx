import { CircularProgress, Container, Typography, Link, List, ListItem } from '@material-ui/core'
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
        setData(res)
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

    const compositeurs = <List> 
      {(data.composers
      ? data.composers.map((c) => (
      <ListItem key={c.composer}> <Link key={c.composer} href={'/musician/' + c.composer.slice(-36)}> {(c.composer_given_name ? c.composer_given_name : '') + ' ' + c.composer_surname} </Link> </ListItem>
      ))
      : <ListItem> 'Compositeur Anonyme') </ListItem>)
    }
       </List>

    return (

      <Container maxWidth='md'>
        <Typography component='h1' variant='h4'>
          {data.work_name || 'Œuvre non titrée'}
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
              field: 'super_event_start_date',

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
              render: (row) => row.super_event_start_date.split('T')[1].split(':00+')[0] + ' — ' + row.super_event_end_date.split('T')[1].split(':00+')[0]
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
              field: 'performers',
              render: (r) => {
                if (r.performers) {
                  // let chaine = ''
                  // for (let i = 0; i < r.performers.length - 1; i++) {
                  //   chaine = chaine + r.performers[i].performer_surname + ', '
                  // }
                  // chaine = chaine + r.performers[r.performers.length - 1].performer_surname
                  // return chaine
                  return r.performers.map((p => (<Link key={p.performer} href={'/musician/' + p.performer.slice(-36)}>{p.performer_surname + '\n'}</Link>)))
                } else
                  return 'Anonyme'
              }
            }
          ]}
          data={data.events}
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

// function computeData(res) {
//   let newData = []

//   const data = lodash.groupBy(res, 'sub_event')

//   console.log(data)

//   for (let sub_event in data) {
//     console.log(data[sub_event][9])
//     const performers = data[sub_event][9].map((item) =>
//       item.performers.performer_surname
//         ? (item.performers.performer_given_name ? item.performers.performer_given_name + ' ' : '') +
//           item.performers.performer_surname
//         : null
//     )
//     console.log('performers :' + performers)

//     const composers = data[sub_event].map((item) =>
//       item.composer_surname
//         ? (item.composer_given_name ? item.composer_given_name + ' ' : '') + item.composer_surname
//         : null
//     )
//     // const distinctPerformers = [...new Set(performers)]
//     const distinctComposers = [...new Set(composers)]
//     // data[sub_event][0].performer = distinctPerformers  
//     data[sub_event][0].composer = distinctComposers

//     newData.push(data[sub_event][0])

//   }

//   return newData
// }

export default withRouter(Work)
