import lodash from 'lodash'
import { Container } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import React, { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { makeTextField } from '../common'

function Program({ history, match }) {
  const id = match.params.id
  const classes = useStyles()

  const [data, setData] = useState([])

  useEffect(() => {
    async function fetchData() {
      const res = await fetch('http://data-iremus.huma-num.fr/api/musrad30/super_event/' + id)
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

    let duree = data[0].duration.split('T')[1]
    const heures = duree.split('H')[0]
    let minutes = duree.split('H')[1]
    minutes = minutes.split('M')[0]
    duree = heures + 'h' + minutes + 'min.'

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
          {makeTextField('Durée', duree)}
          {makeTextField('Description', description, true, true)}
        </form>
        <MaterialTable
          title='Plages diffusées'
          columns={[
            {
              title: 'Titre',
              field: 'work_name',
              render: (rowdata) => rowdata.work_name || 'Sans titre'
            },
            {
              title: 'Compositeurs',
              sorting: false,
              render: (r) => {
                if (r.composer[0]) {
                  let tableauVerif = []
                  let chaine = ''
                  for (let i = 0; i < r.composer.length - 1; i++) {
                    if (!tableauVerif.includes(r.composer[i])) {
                      tableauVerif.push(r.composer[i])
                    }
                  }
                  for (let i = 0; i < tableauVerif.length - 1; i++) {
                    chaine = chaine + r.composer[i] + ', '
                  }
                  chaine = chaine + r.composer[r.composer.length - 1]
                  return chaine
                } else return 'Anonyme'
              }
            },
            {
              render: (r) => {
                if (r.performer[0]) {
                  let chaine = ''
                  for (let i = 0; i < r.performer.length - 1; i++) {
                    chaine = chaine + r.performer[i] + ', '
                  }
                  chaine = chaine + r.performer[r.performer.length - 1]
                  return chaine
                } else return 'Anonyme'
              },
              sorting: false,
              title: 'Interprètes'
            }
          ]}
          data={data}
          onRowClick={(evt, selectedRow) => {
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
        ></MaterialTable>
      </Container>
    )
  }
}

function computeData(res) {
  let newData = []
  const data = lodash.groupBy(res, 'music_event')

  for (const work in data) {
    const performers = data[work].map((item) =>
      item.performer_surname
        ? (item.performer_given_name ? item.performer_given_name + ' ' : '') +
          item.performer_surname
        : null
    )
    const composers = data[work].map((item) =>
      item.composer_surname
        ? (item.composer_given_name ? item.composer_given_name + ' ' : '') + item.composer_surname
        : null
    )
    data[work][0].performer = performers
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

export default withRouter(Program)
