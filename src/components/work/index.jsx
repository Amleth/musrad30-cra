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

class Work extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      workData: null,
    }
  }

  componentDidMount() {
    const id = this.props.match.params.id

    axios.get('http://data-iremus.huma-num.fr/musrad30/work/' + id).then(res => {
      this.setState({ workData: res.data })
    })
  }
/*A adapter*/
  handleClick(rang){
    const composedWorkId = (rang).slice(-36)
    this.props.history.push('/work/'+composedWorkId)
  }

  render() {
    if (!this.state.workData) {
      return <div>Données en cours de téléchargement...</div>
    } else {
      return (
        <Container>
          <Grid>
            <Typography variant='h5' component='h2'>
              Affichage de l'oeuvre d'id <code>{this.props.match.params.id}</code>
            </Typography>

            {/*<Box mx='auto'>
              <Typography variant='h6' component='h6'>
                <Grid container direction='row' justify='space-evenly' alignItems='center'>
                  <Box p={2}>{this.state.musicianData.surname}</Box>
                  <Box p={2}>{this.state.musicianData.givenName}</Box>
                  <Box p={2}>({this.state.musicianData.birthDate} - {this.state.musicianData.death_date})</Box>
                </Grid>
              </Typography>
      </Box>*/}
          </Grid>
{/*
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <Box mx='auto' direction='column'>
                <Box>
                  <Typography variant='button' component='h3' display="inline">
                    statut :{" "}
                  </Typography>
                  <Typography variant='subtitle1' component='h3' display="inline">
                    {this.state.musicianData.status_label}
                  </Typography>

                </Box>
                <Box>
                  <Typography gutterBottom variant='button' component='h3' display="inline">
                    nationalite :{" "}
                  </Typography>
                  <Typography variant='subtitle1' component='h3' display="inline">
                    {this.state.musicianData.nationality_label}
                  </Typography>

                </Box>
                <Box>
                  <Typography variant='button' component='h3' display="inline">
                    style :{" "}
                  </Typography>
                  <Typography variant='subtitle1' component='h3' display="inline">
                    {this.state.musicianData.style_label}
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={6}>
              <Box>
                <Typography gutterBottom variant='button' component='h3'>
                  Infos :
                </Typography>
                <Typography variant='subtitle1' component='h3'>
                  {this.state.musicianData.description}
                </Typography>
              </Box>
            </Grid>
</Grid>*/}
        </Container>
      )
    }
  }
}

export default withRouter(Work)
