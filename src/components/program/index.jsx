import React from 'react'
import { withRouter } from 'react-router'
import axios from 'axios'

class Program extends React.Component {
  constructor(props) {
    super(props)
    this.state = { data: null }
  }

  componentDidMount() {
    const id = this.props.match.params.id
    console.log(id)

    // Exemple d'appel d'API REST bidon
    axios.get('https://www.mocky.io/v2/5185415ba171ea3a00704eed').then(res => {
      this.setState({ data: res.data })
      console.log(this.state.data)
    })
  }

  render() {
    if (!this.state.data) {
      return <div>Rien…</div>
    } else {
      return (
        <div>
          Affichage du programme d'id <code>{this.props.match.params.id}</code> (aller lire{' '}
          <code>this.state.data</code>)…
        </div>
      )
    }
  }
}

export default withRouter(Program)