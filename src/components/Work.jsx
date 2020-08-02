import { CircularProgress, Container, Typography } from '@material-ui/core'
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { capitalize } from '../common'

function Work({ history, match }) {
  const id = match.params.id

  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        process.env.REACT_APP_SHERLOCK_SERVICE_BASE_URL + 'musrad30/work/' + id
      )
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
    return (
      <Container maxWidth='md'>
        <Typography component='h1' variant='h4'>
          {data.work_name || 'Œuvre non titrée'}
        </Typography>
        {data.composers && data.composers.length > 0 && (
          <>
            <span>Composée par&nbsp;: </span>
            {data.composers
              .map((c) => (
                <Link className='link' key={c.composer} to={'/musician/' + c.composer.slice(-36)}>
                  {(c.composer_given_name ? c.composer_given_name : '') + ' ' + c.composer_surname}
                </Link>
              ))
              .reduce((prev, curr) => [prev, ', ', curr])}
          </>
        )}
        <br />
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
              render: (row) =>
                row.super_event_start_date.split('T')[1].split(':00+')[0] +
                ' — ' +
                row.super_event_end_date.split('T')[1].split(':00+')[0]
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
                  return r.performers
                    .map((p) => (
                      <Link
                        className='link'
                        key={p.performer}
                        to={'/musician/' + p.performer.slice(-36)}
                      >
                        {p.performer_surname}
                      </Link>
                    ))
                    .reduce((prev, curr) => [prev, ', ', curr])
                } else return 'Anonyme'
              }
            }
          ]}
          data={data.events}
          onRowClick={(e, selectedRow) => {
            if (e.target.nodeName === 'A') return
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

export default withRouter(Work)
