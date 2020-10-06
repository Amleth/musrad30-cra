import { CircularProgress, Container, Link as LinkM, Paper } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { parseISO } from 'date-fns'
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { capitalize, makeTextField } from '../common'

function Musician({ history, match }) {
  const classes = useStyles()
  const id = match.params.id

  const [musicianData, setMusicianData] = useState([])
  const [composedWorks, setComposedWorks] = useState([])
  const [performedWorks, setPerformedWorks] = useState([])
  const [composerEvents, setComposerEvents] = useState([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        process.env.REACT_APP_SHERLOCK_SERVICE_BASE_URL + 'musrad30/musician/' + id
      )
      res.json().then((res) => {
        setMusicianData(res)
        setComposedWorks(
          computeComposedWorks(res.hasOwnProperty('composed_works') ? res.composed_works : [])
        )
        setPerformedWorks(res.hasOwnProperty('performed_works') ? res.performed_works : [])
        setComposerEvents(
          res.composer_events
            ? res.composer_events.map((e) => ({
                ...e,
                date: e['broadcast_super_event_startDate']
                  ? parseISO(e['broadcast_super_event_startDate'].split('^^')[0])
                  : null
              }))
            : []
        )
      })
    }
    fetchData()
  }, [id])

  if (Object.entries(musicianData).length === 0) {
    return (
      <Container maxWidth='md' align='center'>
        <CircularProgress />
      </Container>
    )
  } else {
    // DATES
    const dateNaissance = musicianData.birth_date
    const dateMort = musicianData.death_date
    let datesMusicien = ''
    if (dateNaissance !== undefined) {
      datesMusicien = dateNaissance + ' — '
    } else {
      datesMusicien = '???? - '
    }
    if (dateMort !== undefined) {
      datesMusicien = datesMusicien + dateMort
    } else {
      datesMusicien = datesMusicien + '????'
    }

    // DESCRIPTION
    const description = musicianData.description
      ? musicianData.description
          .trim()
          .split(';')
          .map((_) => _.trim())
          .filter((_) => _.length > 0)
          .join(' • ')
      : ''

    // STATUTS
    let statuts = ''
    if (musicianData.statuses) {
      for (let i = 0; i < musicianData.statuses.length - 1; i++) {
        statuts = statuts + capitalize(String(musicianData.statuses[i].label)) + ', '
      }
      statuts =
        statuts + capitalize(String(musicianData.statuses[musicianData.statuses.length - 1].label))
    }

    return (
      <Container maxWidth='md'>
        <div className={classes.root}>
          <div className={classes.form}>
            {makeTextField('Nom', musicianData.family_name)}
            {makeTextField('Prénom', musicianData.given_name)}
            {makeTextField('Dates', datesMusicien)}
            {makeTextField('Statut', statuts)}
            {makeTextField('Nationalité', musicianData.nationality_label)}
            {makeTextField('Style', musicianData.style_label)}
            {description && makeTextField('Description', description, true, true)}
          </div>
          <Paper elevation={3} style={{ maxWidth: PICTURE_MAX_WIDTH }}>
            <img
              style={{
                display: 'inline-block',
                minHeight: 50,
                maxWidth: PICTURE_MAX_WIDTH,
                minWidth: PICTURE_MAX_WIDTH
              }}
              alt='Portrait'
              src={
                process.env.PUBLIC_URL + '/wikipedia_pictures/' + musicianData.musrad30_id + '.jpeg'
              }
            />
            {musicianData.wikipedia && (
              <LinkM
                className='link'
                style={{ display: 'block', padding: '1em', wordWrap: 'break-word' }}
                href={musicianData.wikipedia}
                target='_blank'
              >
                {decodeURI(musicianData.wikipedia)}
              </LinkM>
            )}
          </Paper>
        </div>
        <br />
        {composedWorks && composedWorks.length > 0 && (
          <MaterialTable
            title='Œuvres composées'
            columns={[{ title: 'Titre', field: 'work_name', defaultSort: 'asc' }]}
            data={composedWorks}
            onRowClick={(e, selectedRow) => {
              if (e.target.nodeName === 'A') return
              const workId = selectedRow.work.slice(-36)
              history.push('/work/' + workId)
            }}
            options={{
              filtering: true,
              pageSize: composedWorks.length < 10 ? composedWorks.length : 10,
              pageSizeOptions: composedWorks.length < 10 ? [composedWorks.length] : [10, 30],
              sorting: true,
              cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
              headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
            }}
          />
        )}
        <br />
        {performedWorks && performedWorks.length > 0 && (
          <MaterialTable
            title='Œuvres interprétées'
            columns={[
              {
                field: 'work_name',
                title: 'Titre',
                render: (row) => (row.work_name ? row.work_name : 'Œuvre anonyme')
              },
              { title: 'Radio', field: 'radio_name' },
              {
                field: 'start_date',
                render: (row) => {
                  let date = row.start_date.split('T')[0]
                  date = date.split('-')
                  return date[2] + '/' + date[1] + '/' + date[0]
                },
                title: 'Date'
              },
              {
                render: (row) => {
                  let HDeb = row.start_date.split('T')[1]
                  HDeb = HDeb.split(':00+')[0]
                  let HFin = row.end_date.split('T')[1]
                  HFin = HFin.split(':00+')[0]
                  return HDeb + ' — ' + HFin
                },
                sorting: false,
                title: 'Heures'
              },
              {
                field: 'composer_family_name',
                render: (row) =>
                  row.composer ? (
                    <Link className='link' to={'/musician/' + row.composer.slice(-36)}>
                      {(row.composer_given_name ? row.composer_given_name + ' ' : '') +
                        row.composer_family_name}
                    </Link>
                  ) : (
                    'Anonyme'
                  ),
                title: 'Compositeur•rice'
              }
            ]}
            data={performedWorks}
            onRowClick={(e, selectedRow) => {
              if (e.target.nodeName === 'A') return
              const workId = selectedRow.work.slice(-36)
              history.push('/work/' + workId)
            }}
            options={{
              filtering: true,
              pageSize: performedWorks.length < 10 ? performedWorks.length : 10,
              pageSizeOptions: performedWorks.length < 10 ? [performedWorks.length] : [10, 30],
              sorting: true,
              cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
              headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
            }}
          />
        )}
        <br />
        {composerEvents.length > 0 && (
          <MaterialTable
            title="Occurences d'œuvres"
            columns={[
              {
                title: 'Œuvre',
                field: 'work_name',
                render: (row) => (
                  <Link className='link' to={'/work/' + row.work.slice(-36)}>
                    {row.work_name}
                  </Link>
                )
              },
              { title: 'Radio', field: 'broadcast_super_event_publishedOn_name' },
              {
                field: 'date',
                filtering: true,
                sorting: true,
                title: 'Date',
                render: (rowData) => (rowData['date'] ? rowData['date'].toLocaleDateString() : '')
              },
              {
                title: 'Type',
                field: 'broadcast_super_event_type_label',
                render: (row) => capitalize(row.broadcast_super_event_type_label)
              },
              { title: 'Titre', field: 'broadcast_super_event_title_label' },
              {
                title: 'Format',
                field: 'broadcast_super_event_format_label',
                render: (row) => capitalize(row.broadcast_super_event_format_label)
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
            data={composerEvents}
            onRowClick={(e, selectedRow) => {
              if (e.target.nodeName === 'A') return
              const progId = selectedRow.broadcast_super_event.slice(-36)
              history.push('/super_event/' + progId)
            }}
          />
        )}
        <br />
      </Container>
    )
  }
}

const PICTURE_MAX_WIDTH = 200

const useStyles = makeStyles((theme) => ({
  root: {
    alignItems: 'flex-start',
    display: 'flex'
  },
  form: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    padding: 0,
    '& .MuiTextField-root': {
      margin: theme.spacing(1),
      marginLeft: 0,
      marginRight: theme.spacing(4)
    }
  }
}))

function computeComposedWorks(data) {
  let newDataComp = {}
  let tabDataComp = []
  const tab = data

  for (let i = 0; i < tab.length; i++) {
    if (!(tab[i].work in newDataComp)) {
      newDataComp[tab[i].work] = tab[i].work_name
    }
  }

  for (let key in newDataComp) {
    let workObj = {}
    workObj.work = key
    workObj.work_name = newDataComp[key]
    tabDataComp.push(workObj)
  }

  return tabDataComp
}

export default withRouter(Musician)
