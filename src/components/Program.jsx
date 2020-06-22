import lodash, { random } from 'lodash'
import { Container, Link, ListItem, List } from '@material-ui/core'
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
              render: (rowdata) => {
                const composers = compositeurs(rowdata)
                const composant = <List>
                  { 
                  (Object.keys(composers).map((c) =>(
                    composers[c] !== 'null'
                    ?(<ListItem key = {c}>
                      <Link key={c} href={'/musician/' + c.slice(-36)}>{composers[c]}</Link>
                    </ListItem>)
                    : <ListItem key = {random()}> Anonyme </ListItem>
                    )))
                  }
                </List>
              return composant
              }
            },
        {
          render: (rowdata) => {
            const performers = interpretes(rowdata)
            const composant = <List>
              { 
              (Object.keys(performers).map((p) =>(
                performers[p] !== 'null'
                ?(<ListItem key = {p}>
                  <Link key={p} href={'/musician/' + p.slice(-36)}>{performers[p]}</Link>
                </ListItem>)
                : <ListItem key = {random()}> Anonyme </ListItem>
                )))
              }
            </List>
          return composant
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
      </Container >
    )
  }
}

function computeData(res) {
  let newData = []
  const data = lodash.groupBy(res, 'music_event')

  for (const work in data) {

    const performers_given_name =
      (data[work].map((item) =>
        item.performer_given_name ? item.performer_given_name : null))

    const performers_surname =
      (data[work].map((item) =>
        item.performer_surname ? item.performer_surname : null))

    const performers = data[work].map((item) =>
      item.performer
        ? item.performer
        : null
    )

    const composers_given_name = data[work].map((item) =>
      item.composer_given_name
        ? item.composer_given_name
        : null)

    const composers_surname = data[work].map((item) =>
      item.composer_surname
        ? item.composer_surname
        : null)

    const composers = data[work].map((item) =>
      item.composer
        ? item.composer
        : null)
    data[work][0].performer_given_name = performers_given_name
    data[work][0].performer_surname = performers_surname
    data[work][0].performer = performers
    data[work][0].composer_given_name = composers_given_name
    data[work][0].composer_surname = composers_surname
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
      compositeurs[r.composer[i]] = ((r.composer_given_name[i] ? r.composer_given_name[i] + ' ' : '') + r.composer_surname[i])
    }
  }
  else compositeurs = null

  return compositeurs
}

function interpretes(r) {
  let tableauVerif = []
  let interpretes = {}
  if (r.performer.length > 0 ) {
    for (let i = 0; i < r.performer.length; i++) {
      if (!tableauVerif.includes(r.performer[i])) {
        tableauVerif.push(r.performer[i])
      }
    }
    for (let i = 0; i < tableauVerif.length; i++) {
      interpretes[r.performer[i]] = ((r.performer_given_name[i] ? r.performer_given_name[i] + ' ' : '') + r.performer_surname[i])
    }
  }
  else interpretes = null
  return interpretes
}


export default withRouter(Program)
