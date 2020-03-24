import React from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import axios from 'axios'

class Musicians extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      musiciansData: null,
    }
  }

  componentDidMount() {
    axios.get('http://data-iremus.huma-num.fr/musrad30/musicians/').then(res => {
      this.setState({ musiciansData: res.data })
    })
  }

  render() {
    if (!this.state.musiciansData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      return (
        
        <div style={{maxWidth: '100%'}}>
          <MaterialTable
          title = 'Index des Musiciens'
          columns={[
            {title:'Nom', field:'surname'},
            {title:'Prenom', field:'givenName'},
            {title:'Status', field:'status_label'},
            {title:'Nationalté', field:'nationality_label'},
            {title:'Style', field:'style_label'},
            {title:'Page associee', field:'style_label'},
          ]}
          data = {this.state.musiciansData}
          >

          </MaterialTable>  
        </div>
      )
    }
  }
}

export default withRouter(Musicians)
