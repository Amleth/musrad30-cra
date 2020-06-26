import { Container, List, ListItem, Link } from '@material-ui/core'
import { CircularProgress } from '@material-ui/core'
import MaterialTable from 'material-table'
import React from 'react'
import { useEffect, useState } from 'react'
import { withRouter } from 'react-router'

function Works({ history }) {
  const [data, setData] = useState([])

  async function fetchData() {
    const res = await fetch('http://data-iremus.huma-num.fr/api/musrad30/works/')
    res.json().then((res) => setData(res.filter((w) => w.name || w.composers)))
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
        {
          title: 'Nom',
          field: 'name',
          customSort: (a, b) => {
            if (!a.work_name && !b.work_name) return 0
            if (!a.work_name) return 1
            if (!b.work_name) return -1
            return a.work_name.localeCompare(b.work_name)
          }
        },
        {
          title: 'Compositeur•rice•s',
          field: 'composers',
          render: (rowdata) =>{
            if (rowdata.composers){
              const composers = rowdata.composers
              console.log(composers)
              const composant = <List>
                  { 
                  (Object.keys(composers).map((c) =>(
                    <ListItem key = {c}>
                      <Link key={composers[c].id} href={'/musician/' + composers[c].id.slice(-36)}>{(composers[c].given_name ? composers[c].given_name + ' ' : '') + composers[c].surname}</Link>
                    </ListItem>)
                    ))
                  }
                </List>
              return composant
            } else {
              return <List> <ListItem key = {Math.random()}>Anonyme</ListItem></List>
            } 
          },
          filtering: true,
          sorting: false,
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
        const workId = selectedRow.id.slice(-36)
        history.push('/work/' + workId)
      }}
    ></MaterialTable>
  )
}

export default withRouter(Works)
