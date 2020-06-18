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

function Composers({ history }) {
  const classes = useStyles()
  const [data, setData] = useState([])
  const [style, setStyle] = useState('')

  async function fetchData() {
    const res = await fetch('http://data-iremus.huma-num.fr/api/musrad30/composers/')
    res.json().then((res) => setData(res))
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
        title='Liste des compositeur•rice•s'
        columns={[
          { title: 'Nom', field: 'surname', defaultSort: "asc" },
          { title: 'Prénom', field: 'given_name' },
          { title: 'Nationalité', field: 'nationality_label' },
          { title: 'Style', field: 'style_label', defaultFilter: style }
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
          const composerId = selectedRow.composer.slice(-36)
          history.push('/musician/' + composerId)
        }}
      ></MaterialTable>
    </>
  )
}

export default withRouter(Composers)
