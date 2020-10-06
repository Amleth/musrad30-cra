import { Container } from '@material-ui/core';
import { CircularProgress } from '@material-ui/core';
import MaterialTable from 'material-table';
import React, { useEffect, useState } from 'react';
import { withRouter } from 'react-router';
import { Link } from 'react-router-dom';

function Works({ history }) {
  const [data, setData] = useState([]);

  async function fetchData() {
    const res = await fetch(
      process.env.REACT_APP_SHERLOCK_SERVICE_BASE_URL + 'musrad30/works/'
    );
    res.json().then((res) =>
      setData(
        res.map((c) => ({
          ...c,
          name: c.name || '?',
          composers_text:
            c.composers && c.composers.length > 0
              ? c.composers
                  .map(
                    (c) =>
                      (c.given_name ? c.given_name : '') + ' ' + c.family_name
                  )
                  .reduce((prev, curr) => [prev, ', ', curr])
              : '?',
          composers_links:
            c.composers && c.composers.length > 0
              ? c.composers
                  .map((c) => (
                    <Link
                      className='link'
                      key={c.id}
                      to={'/musician/' + c.id.slice(-36)}
                    >
                      {(c.given_name ? c.given_name : '') + ' ' + c.family_name}
                    </Link>
                  ))
                  .reduce((prev, curr) => [prev, ', ', curr])
              : '?',
          performers_text:
            c.performers && c.performers.length > 0
              ? c.performers
                  .map(
                    (c) =>
                      (c.given_name ? c.given_name : '') + ' ' + c.family_name
                  )
                  .reduce((prev, curr) => [prev, ', ', curr])
              : '?',
          performers_links:
            c.performers && c.performers.length > 0
              ? c.performers
                  .map((c) => (
                    <Link
                      className='link'
                      key={c.id}
                      to={'/musician/' + c.id.slice(-36)}
                    >
                      {(c.given_name ? c.given_name : '') + ' ' + c.family_name}
                    </Link>
                  ))
                  .reduce((prev, curr) => [prev, ', ', curr])
              : '?',
        }))
      )
    );
  }

  useEffect(() => {
    fetchData();
  }, []);

  return data.length === 0 ? (
    <Container maxWidth='md' align='center'>
      <CircularProgress />
    </Container>
  ) : (
    <MaterialTable
      title='Liste des œuvres identifiées'
      columns={[
        {
          field: 'name',
          customSort: (a, b) => {
            if (!a.name && !b.name) return 0;
            if (!a.name) return 1;
            if (!b.name) return -1;
            return a.name.localeCompare(b.name);
          },
          title: 'Nom',
        },
        {
          field: 'composers_text',
          filtering: true,
          title: 'Compositeur•rice•s',
          sorting: false,
          render: (row) => row.composers_links,
        },
        {
          field: 'performers_text',
          filtering: true,
          title: 'Interprètes',
          sorting: false,
          render: (row) => row.performers_links,
        },
      ]}
      options={{
        pageSize: 20,
        pageSizeOptions: [20, 100],
        filtering: true,
        sorting: true,
        cellStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
        headerStyle: { paddingBottom: '0.3em', paddingTop: '0.3em' },
      }}
      data={data}
      onRowClick={(e, selectedRow) => {
        if (e.target.nodeName === 'A') return;
        const workId = selectedRow.id.slice(-36);
        history.push('/work/' + workId);
      }}
    ></MaterialTable>
  );
}

export default withRouter(Works);
