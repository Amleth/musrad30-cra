import { parseISO } from 'date-fns'
import { Container } from '@material-ui/core'
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import MaterialTable from 'material-table'
import { makeStyles } from '@material-ui/core/styles'
import React from 'react'
import { useEffect, useState } from 'react'
import { withRouter } from 'react-router'
import { capitalize } from '../common'

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginLeft: theme.spacing(2),
    minWidth: 150
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}))

function Programs({ history }) {
  const classes = useStyles()
  const [data, setData] = useState([])
  const [type, setStyle] = useState('')
  const [titre, setTitre] = useState('')
  const [format, setFormat] = useState('')


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

  const handleStyleChange = (event) => {
    setStyle(event.target.value)
  }

  const handleTitreChange = (event) => {
    setTitre(event.target.value)
  }

  const handleFormatChange = (event) => {
    setFormat(event.target.value)
  }

  let typesProg = data.map((_) => _.type_label).map((_) => (_ ? _.toLowerCase() : ''))
  let o = {}
  for (let s of typesProg) o[s] = null
  typesProg = Object.keys(o)
    .filter((s) => s.length > 0)
    .sort()

  let titresProg = data.map((_) => _.title_label).map((_) => (_ ? _.toLowerCase() : ''))
  let p = {}
  for (let s of titresProg) p[s] = null
  titresProg = Object.keys(p)
    .filter((s) => s.length > 0)
    .sort()

  let formatProg = data.map((_) => _.format_label).map((_) => (_ ? _.toLowerCase() : ''))
  let f = {}
  for (let s of formatProg) f[s] = null
  formatProg = Object.keys(f)
    .filter((s) => s.length > 0)
    .sort()

  useEffect(() => {
    fetchData()
  }, [])

  return data.length === 0 ? (
    <Container maxWidth='md' align='center'>
      <CircularProgress />
    </Container>
  ) : (
      <>
        <FormControl className={classes.formControl}>
          <InputLabel id='type-select-label'>Liste des types</InputLabel>
          <Select
            labelId='type-select-label'
            id='type-select'
            onChange={handleStyleChange}
            value={type}
          >
            <MenuItem value=''>
              <em>Pas de filtre</em>
            </MenuItem>
            {typesProg.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel id='titre-select-label'>Liste des titres</InputLabel>
          <Select
            labelId='titre-select-label'
            id='titre-select'
            onChange={handleTitreChange}
            value={titre}
          >
            <MenuItem value=''>
              <em>Pas de filtre</em>
            </MenuItem>
            {titresProg.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl className={classes.formControl}>
          <InputLabel id='format-select-label'>Liste des formats</InputLabel>
          <Select
            labelId='format-select-label'
            id='format-select'
            onChange={handleFormatChange}
            value={format}
          >
            <MenuItem value=''>
              <em>Pas de filtre</em>
            </MenuItem>
            {formatProg.map((s) => (
              <MenuItem key={s} value={s}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

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

            { title: 'Type', field: 'type_label', render: (row) => capitalize(row.type_label), defaultFilter: type },
            { title: 'Titre', field: 'title_label', defaultFilter: titre },
            { title: 'Format', field: 'format_label', render: (row) => capitalize(row.format_label), defaultFilter: format },
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
      </>
    )
}


export default withRouter(Programs)
