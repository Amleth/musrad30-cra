import React from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import axios from 'axios'

// this.props.history.push("/musician/133c5242-11de-419f-b6bf-3b61170a20d2")

class Composers extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      composersData: [],
    }
  }

  componentDidMount() {
    axios.get('http://data-iremus.huma-num.fr/musrad30/composers/').then(res => {
      this.setState({ composersData: res.data })
    })
  }

  render() {
    if (!this.state.composersData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      return (
        <div style={{ maxWidth: '100%' }}>
          <MaterialTable
            title='Liste des compositeurs'
            columns={[
              { title: 'Nom', field: 'surname' },
              { title: 'Prenom', field: 'given_name' },
              { title: 'Nationalté', field: 'nationality_label' },
              { title: 'Style', field: 'style_label' },
            ]}
            options={{
              pageSize : 20,
              pageSizeOptions : [10,20,50],
              filtering : true,
              sorting : true
            }}
            data={this.state.composersData}
            onRowClick={((evt, selectedRow) => {
              const composerId = selectedRow.composer.slice(-36)
              this.props.history.push('/musician/'+composerId)
            })}
          >
          </MaterialTable>
        </div>
      )
    }
  }
}

export default withRouter(Composers)
