import { Container } from '@material-ui/core'
import { CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import MaterialTable from 'material-table'
import React from 'react'
import { useEffect, useState } from 'react'
import { withRouter } from 'react-router'

const useStyles = makeStyles((theme) => ({
  formControl: {
    marginLeft: theme.spacing(2),
    minWidth: 150
  },
  selectEmpty: {
    marginTop: theme.spacing(2)
  }
}))

function Performers({ history }) {
  const classes = useStyles()
  const [data, setData] = useState([])
  const [style, setStyle] = useState('')

  async function fetchData() {
    const res = await fetch(
      process.env.REACT_APP_SHERLOCK_SERVICE_BASE_URL + 'musrad30/performers/'
    )
    res.json().then((res) =>
      setData(
        res.map((o) => ({
          ...o,
          music_events: parseInt(o['music_events'].split('^')[0])
        }))
      )
    )
  }

  const handleStyleChange = (event) => {
    setStyle(event.target.value)
  }

  useEffect(() => {
    fetchData()
  }, [])

  let styles = data.map((_) => _.style_label).map((_) => (_ ? _.toLowerCase() : ''))
  let o = {}
  for (let s of styles) o[s] = null
  styles = Object.keys(o)
    .filter((s) => s.length > 0)
    .sort()

  return data.length === 0 ? (
    <Container maxWidth='md' align='center'>
      <CircularProgress />
    </Container>
  ) : (
    <>
      <FormControl className={classes.formControl}>
        <InputLabel id='style-select-label'>Liste des styles</InputLabel>
        <Select
          labelId='style-select-label'
          id='style-select'
          onChange={handleStyleChange}
          value={style}
        >
          <MenuItem value=''>
            <em>Pas de filtre</em>
          </MenuItem>
          {styles.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <MaterialTable
        title='Liste des interprètes'
        columns={[
          { title: 'Nom', field: 'surname', defaultSort: 'asc' },
          { title: 'Prénom', field: 'given_name' },
          { title: 'Nationalité', field: 'nationality_label' },
          { title: 'Style', field: 'style_label', defaultFilter: style },
          { title: 'Interprétations enregistrées', field: 'music_events' },
          { title: 'Description', field: 'description' }
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
        onRowClick={(e, selectedRow) => {
          if (e.target.nodeName === 'A') return
          const performerId = selectedRow.performer.slice(-36)
          history.push('/musician/' + performerId)
        }}
      ></MaterialTable>
    </>
  )
}

export default withRouter(Performers)
