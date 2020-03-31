import React from 'react'
import { withRouter } from 'react-router'
import axios from 'axios'
import {
  Box,
  Grid,
  Container,
  Table,
  TableHead,
  TableRow,
  TableBody,
  TableCell,
  Typography
} from '@material-ui/core'

class Program extends React.Component {
  constructor(props) {
    super(props)
    this.state = { programData: null }
  }

  componentDidMount() {
    const id = this.props.match.params.id
    axios.get('http://data-iremus.huma-num.fr/musrad30/super_event/'+id).then(res => {
      this.setState({ programData: res.data })
    })
  }

  render() {
    if (!this.state.programData) {
      return <div>Rien…</div>
    } else {
      const pData = this.state.programData[0]
      return (
        <Container>
          <Grid>
            <Box mx='auto'>
              <Typography variant='h6' component='h6'>
                <Grid container direction='row' justify='space-evenly' alignItems='center'>
                  <Box p={2}>{pData.title_label}</Box>
                  <Box p={2}>{pData.jour_debut_diffusion + " " + pData.start_date.slice(8,10)+"-"+pData.start_date.slice(5,7)+"-"+pData.start_date.slice(0,4)}</Box>
                  <Box p={2}>{pData.station_label}</Box>
                </Grid>
              </Typography>
            </Box>
          </Grid>

          <Grid item xs={6}>
              <Box mx='auto' direction='column'>
                <Box>
                  <Typography variant='button' component='h3' display="inline">
                    Détails :{" "}
                  </Typography>
                  <Typography variant='subtitle1' component='h3' display="inline">
                    A Implémenter
                  </Typography>
                </Box>
              </Box>
            </Grid>

            <Grid>
              
            </Grid>

        </Container>
      )
    }
  }
}

export default withRouter(Program)