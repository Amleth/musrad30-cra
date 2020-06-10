import { Container } from '@material-ui/core'
import { CircularProgress } from '@material-ui/core'
import MaterialTable from 'material-table'
import React from 'react'
import { useEffect, useState } from 'react'
import { withRouter } from 'react-router'

function Composers({ history }) {
  const [data, setData] = useState([])

  async function fetchData() {
    const res = await fetch('http://data-iremus.huma-num.fr/api/musrad30/composers/')
    res.json().then((res) => setData(res))
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
      title='Liste des compositeur•rice•s'
      columns={[
        { title: 'Nom', field: 'surname' },
        { title: 'Prénom', field: 'given_name' },
        { title: 'Nationalité', field: 'nationality_label' },
        { title: 'Style', field: 'style_label' }
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
  )
}

export default withRouter(Composers)
