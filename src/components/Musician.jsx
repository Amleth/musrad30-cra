import {
  Box,
  CircularProgress,
  Container,
  Link,
  Paper,
  TextField,
  Typography
} from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { capitalize } from '../common'

function Musician({ history, match }) {
  const classes = useStyles()
  const id = match.params.id

  const [musicianData, setMusicianData] = useState([])
  const [composedWorks, setComposedWorks] = useState([])
  const [performedWorks, setPerformedWorks] = useState([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://data-iremus.huma-num.fr/api/musrad30/musician/' + id)
      res.json().then((res) => {
        setMusicianData(res)
        if (res.hasOwnProperty('composed_works')) {
          setComposedWorks(computeComposedWorks(res.composed_works))
        }
        if (res.hasOwnProperty('performed_works')) {
          setPerformedWorks(res.performed_works)
        }
      })
    }
    fetchData()
  }, [id])

  if (Object.entries(musicianData).length === 0) {
    return (
      <Container maxWidth='md'>
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

    return (
      <Container maxWidth='md'>
        <div className={classes.root}>
          <div className={classes.fields}>
            <form className={classes.form} noValidate autoComplete='off'>
              {makeTextField('Nom', musicianData.surname)}
              {makeTextField('Prénom', musicianData.given_name)}
              {makeTextField('Dates', datesMusicien)}
              {makeTextField('Statut', capitalize(musicianData.status_label))}
              {makeTextField('Nationalité', musicianData.nationality_label)}
              {makeTextField('Style', musicianData.style_label)}
            </form>
            <br />
            <Box fontStyle='italic'>{description && <Typography>{description}</Typography>}</Box>
          </div>
          <Paper elevation={3} style={{ maxWidth: PICTURE_MAX_WIDTH }}>
            <img
              style={{
                display: 'inline-block',
                minHeight: 50,
                maxWidth: PICTURE_MAX_WIDTH,
                minWidth: PICTURE_MAX_WIDTH,
                '&:after': {
                  backgroundColor: 'red'
                }
              }}
              alt='Wikipédia'
              src={'/wikipedia_pictures/' + musicianData.musrad30_id + '.jpeg'}
            />
            {musicianData.wikipedia && (
              <Link
                style={{ display: 'block', padding: '1em', wordWrap: 'break-word' }}
                href={musicianData.wikipedia}
                target='_blank'
              >
                {decodeURI(musicianData.wikipedia)}
              </Link>
            )}
          </Paper>
        </div>
        <br />
        {composedWorks && composedWorks.length > 0 && (
          <MaterialTable
            title='Œuvres composées'
            columns={[{ title: 'Titre', field: 'work_name', defaultSort: 'asc' }]}
            data={composedWorks}
            onRowClick={(evt, selectedRow) => {
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
                field: 'composer_surname',
                render: (row) => {
                  return row.composer_surname
                    ? (row.composer_given_name ? row.composer_given_name + ' ' : '') +
                        row.composer_surname
                    : 'Anonyme'
                },
                title: 'Compositeur•rice'
              }
            ]}
            data={performedWorks}
            onRowClick={(evt, selectedRow) => {
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
  fields: { '& .MuiTextField-root': { margin: theme.spacing(1), marginLeft: 0 } },
  form: {
    padding: 0
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

function makeTextField(f, v) {
  return (
    <TextField
      label={f}
      defaultValue={v}
      InputProps={{
        readOnly: true
      }}
    />
  )
}

export default withRouter(Musician)
