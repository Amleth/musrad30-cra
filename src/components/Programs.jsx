import { Container } from '@material-ui/core'
import { CircularProgress } from '@material-ui/core'
import MaterialTable from 'material-table'
import React from 'react'
import { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { capitalize } from '../common'

function Programs({ history }) {
  const [data, setData] = useState([])

  async function fetchData() {
    const res = await fetch('http://data-iremus.huma-num.fr/api/musrad30/super_events')
    res.json().then((res) => setData(res))
  }

  useEffect(() => {
    fetchData()
  }, [])

  return data.length === 0 ? (
    <Container maxWidth='md' align='center'>
      <CircularProgress />
    </Container>
  ) : (
    <MaterialTable
      title='Liste des programmes'
      columns={[
        { title: 'Radio', field: 'station_label' },
        {
          title: 'Date',
          sorting: false,
          filtering: true,
          render: (rowData) => {
            let date = rowData.start_date.split('T')[0]
            return date.split('-')[2] + '/' + date.split('-')[1] + '/' + date.split('-')[0]
          }
        },
        {
          title: 'Plage horaire',
          type: 'date',
          render: (rowData) => {
            let heuredebut = rowData.start_date.split('T')[1]
            let heurefin = rowData.end_date.split('T')[1]
            return heuredebut.split(':00+')[0] + ' — ' + heurefin.split(':00+')[0]
          }
        },
        // { title : "Durée", type : 'time', render: rowData => {
        //   let duree = rowData.duration.split('T')[1]
        //   let heures = duree.split('H')[0]
        //   let minutes = duree.split('H')[1]
        //   minutes = minutes.split('M')[0]
        //   return (heures + 'h' + minutes +'min.')
        // }}, a mettre dans super_event/id !!

        { title: 'Type', field: 'type_label', render: (row) => capitalize(row.type_label) },
        { title: 'Titre', field: 'title_label' },
        { title: 'Format', field: 'format_label', render: (row) => capitalize(row.format_label) },
        {
          title: 'Compositeur•rice•s mentionné•e•s',
          render: (rowData) => {
            return rowData.composers_count.split('^^')[0]
          }
        },
        {
          title: 'Interprètes mentionné•e•s',
          render: (rowData) => {
            return rowData.performers_count.split('^^')[0]
          }
        },
        {
          title: 'Œuvres mentionnées',
          render: (rowData) => {
            return rowData.works_count.split('^^')[0]
          }
        }
      ]}
      options={{
        pageSize: 20,
        pageSizeOptions: [20, 100],
        filtering: true,
        sorting: true,
        cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
        headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
      }}
      data={data}
      onRowClick={(evt, selectedRow) => {
        const progId = selectedRow.super_event.slice(-36)
        history.push('/super_event/' + progId)
      }}
    ></MaterialTable>
  )
}

export default withRouter(Programs)
