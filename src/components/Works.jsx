import lodash from 'lodash'
import { Container } from '@material-ui/core'
import { CircularProgress } from '@material-ui/core'
import MaterialTable from 'material-table'
import React from 'react'
import { useEffect, useState } from 'react'
import { withRouter } from 'react-router'

function Works({ history }) {
  const [data, setData] = useState([])

  async function fetchData() {
    const res = await fetch('http://data-iremus.huma-num.fr/api/musrad30/works/')
    res.json().then((res) => setData(computeData(res)))
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
      title='Liste des œuvres identifiées'
      columns={[
        { title: 'Nom', field: 'work_name' },
        {
          title: 'Compositeur•rice•s',
          field: 'composer',
          filtering: true,
          sorting: false,
          render: (r) => {
            if (r.composer[0]) {
              let chaine = ''
              for (let i = 0; i < r.composer.length - 1; i++) {
                chaine = chaine + r.composer[i] + ', '
              }
              chaine = chaine + r.composer[r.composer.length - 1]
              return chaine
            } else return 'Anonyme'
          }
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
        const workId = selectedRow.work.slice(-36)
        history.push('/work/' + workId)
      }}
    ></MaterialTable>
  )
}

function computeData(res) {
  res = res.filter((w) => w.work_name || w.composer)
  let newData = []
  const data = lodash.groupBy(res, 'work')
  for (const work in data) {
    const composers = data[work].map((item) =>
      item.composer_surname
        ? (item.composer_given_name ? item.composer_given_name + ' ' : '') + item.composer_surname
        : null
    )
    data[work][0].composer = composers
    newData.push(data[work][0])
  }

  return newData
}

export default withRouter(Works)
