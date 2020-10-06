import lodash from 'lodash'
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import moment from 'moment'
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { Link } from 'react-router-dom'
import { makeTextField } from '../common'

function Program({ history, match }) {
  const id = match.params.id
  const classes = useStyles()

  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch(
        process.env.REACT_APP_SHERLOCK_SERVICE_BASE_URL + 'musrad30/super_event/' + id
      )
      res.json().then((res) => {
        setData(computeData(res))
      })
    }
    fetchData()
  }, [id])

  if (data.length === 0) {
    return <Container maxWidth='md'>—</Container>
  } else {
    let description = data[0].description
    description = description.split('@fr')[0]

    let heuredebut = !data[0].start_date ? '?' : data[0].start_date.split('T')[1]
    let heurefin = !data[0].end_date ? '' : data[0].end_date.split('T')[1]
    let plageHoraire = heuredebut.split(':00+')[0] + ' - ' + heurefin.split(':00+')[0]

    const duration = data[0].duration
      ? moment.duration(data[0].duration.split('^^')[0])
      : ''

    return (
      <Container maxWidth='md'>
        <form className={classes.form} noValidate autoComplete='off'>
          {makeTextField('Titre', data[0].title_label)}
          {makeTextField('Station de diffusion', data[0].station_label)}
          {makeTextField(
            'Date de diffusion',
            data[0].jour_debut_diffusion +
            ' ' +
            (!data[0].start_date
              ? ''
              : data[0].start_date.slice(8, 10) +
              '/' +
              data[0].start_date.slice(5, 7) +
              '/' +
              data[0].start_date.slice(0, 4))
          )}
          {makeTextField('Plage horaire', plageHoraire)}
          {makeTextField('Durée', duration.hours() + 'h ' + duration.minutes() + 'm')}
          {makeTextField('Description', description, true, true)}
        </form>
        <br />
        <MaterialTable
          title='Plages diffusées'
          columns={[
            {
              title: 'Titre',
              field: 'work_name',
              render: (row) =>
                row.work_name ? (
                  <Link className='link' to={'/work/' + row.work.slice(-36)}>
                    {row.work_name}
                  </Link>
                ) : (
                    'Sans titre'
                  )
            },
            {
              title: 'Compositeurs',
              sorting: false,
              render: (rowdata) => {
                const composers = compositeurs(rowdata)
                return Object.keys(composers)
                  .map((c) =>
                    composers[c] !== 'null' ? (
                      <Link className='link' key={c} to={'/musician/' + c.slice(-36)}>
                        {composers[c]}
                      </Link>
                    ) : (
                        'Anonyme'
                      )
                  )
                  .reduce((prev, curr) => [prev, ', ', curr])
              }
            },
            {
              render: (rowdata) => {
                const performers = interpretes(rowdata)
                return Object.keys(performers)
                  .map((p) =>
                    performers[p] !== 'null' ? (
                      <Link className='link' key={p} to={'/musician/' + p.slice(-36)}>
                        {performers[p]}
                      </Link>
                    ) : (
                        'Anonyme'
                      )
                  )
                  .reduce((prev, curr) => [prev, ', ', curr])
              },
              sorting: false,
              title: 'Interprètes'
            }
          ]}
          data={data}
          onRowClick={(e, selectedRow) => {
            if (e.target.nodeName === 'A') return
            const workId = selectedRow.work.slice(-36)
            history.push('/work/' + workId)
          }}
          options={{
            filtering: true,
            pageSize: data.length < 10 ? data.length : 10,
            pageSizeOptions: data.length < 10 ? [data.length] : [10, 30],
            cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
            headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' }
          }}
        />
      </Container>
    )
  }
}

function computeData(res) {
  let newData = []
  const data = lodash.groupBy(res, 'music_event')

  for (const work in data) {
    const performers_given_name = data[work].map((item) =>
      item.performer_given_name ? item.performer_given_name : null
    )

    const performers_family_name = data[work].map((item) =>
      item.performer_family_name ? item.performer_family_name : null
    )

    const performers = data[work].map((item) => (item.performer ? item.performer : null))

    const composers_given_name = data[work].map((item) =>
      item.composer_given_name ? item.composer_given_name : null
    )

    const composers_family_name = data[work].map((item) =>
      item.composer_family_name ? item.composer_family_name : null
    )

    const composers = data[work].map((item) => (item.composer ? item.composer : null))
    data[work][0].performer_given_name = performers_given_name
    data[work][0].performer_family_name = performers_family_name
    data[work][0].performer = performers
    data[work][0].composer_given_name = composers_given_name
    data[work][0].composer_family_name = composers_family_name
    data[work][0].composer = composers
    newData.push(data[work][0])
  }

  return newData
}

const useStyles = makeStyles((theme) => ({
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
function compositeurs(r) {
  let tableauVerif = []
  let compositeurs = {}
  if (r.composer.length > 0) {
    for (let i = 0; i < r.composer.length; i++) {
      if (!tableauVerif.includes(r.composer[i])) {
        tableauVerif.push(r.composer[i])
      }
    }
    for (let i = 0; i < tableauVerif.length; i++) {
      compositeurs[r.composer[i]] =
        (r.composer_given_name[i] ? r.composer_given_name[i] + ' ' : '') + r.composer_family_name[i]
    }
  } else compositeurs = null

  return compositeurs
}

function interpretes(r) {
  let tableauVerif = []
  let interpretes = {}
  if (r.performer.length > 0) {
    for (let i = 0; i < r.performer.length; i++) {
      if (!tableauVerif.includes(r.performer[i])) {
        tableauVerif.push(r.performer[i])
      }
    }
    for (let i = 0; i < tableauVerif.length; i++) {
      interpretes[r.performer[i]] =
        (r.performer_given_name[i] ? r.performer_given_name[i] + ' ' : '') + r.performer_family_name[i]
    }
  } else interpretes = null
  return interpretes
}

export default withRouter(Program)
