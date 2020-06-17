import { parseISO } from 'date-fns'
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
    res.json().then((res) => {
      res = res.map((p) => ({
        ...p,
        composers_count: parseInt(p['composers_count'].split('^^')[0]),
        performers_count: parseInt(p['performers_count'].split('^^')[0]),
        works_count: parseInt(p['works_count'].split('^^')[0]),
        date: p['start_date'] ? parseISO(p['start_date'].split('^^')[0]) : null
      }))
      setData(res)
    })
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
          field: 'date',
          filtering: true,
          sorting: true,
          title: 'Date',
          render: (rowData) => (rowData['date'] ? rowData['date'].toLocaleDateString() : '')
        },
        {
          title: 'Plage horaire',
          sorting: false,
          render: (rowData) => {
            if (!rowData.start_date || !rowData.end_date) return '?'
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
          field: 'composers_count'
        },
        {
          title: 'Interprètes mentionné•e•s',
          field: 'performers_count'
        },
        {
          title: 'Œuvres mentionnées',
          field: 'works_count'
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
