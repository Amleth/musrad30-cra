import React from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import axios from 'axios'

class CompWorks extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      worksData: [],
    }
  }

  componentDidMount() {
    axios.get('http://data-iremus.huma-num.fr/musrad30/works/').then(res => {
      const identifiedWorks = res.data.filter(w => w.work_name || w.composer)
      // console.log(identifiedWorks.length)
      this.setState({ worksData: identifiedWorks })
    })
  }

  render() {
    if (!this.state.worksData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      return (
        <div style={{ maxWidth: '100%' }}>
          <MaterialTable
            title='Index des oeuvres composées'
            columns={[
              { title: 'Nom', field: 'work_name' },
              { title: 'Compositeur', field : 'string', render: rowData => {
                if (rowData.composer_given_name){
                  return (rowData.composer_given_name + " " + rowData.composer_surname)
                } else {
                  return (rowData.composer_surname)
                }
              }
              },
            ]}
            options={{
              pageSize: 20,
              pageSizeOptions: [10, 20, 50]
            }}
            data={this.state.worksData}
            onRowClick={((evt, selectedRow) => {
              const workId = selectedRow.work.slice(-36)
              this.props.history.push('/work/'+workId)
            })}
          >
          </MaterialTable>
        </div>
      )
    }

  }
}

export default withRouter(CompWorks)
