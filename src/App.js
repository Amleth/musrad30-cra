import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Musician from './components/musician'
import Program from './components/program'
import Work from './components/work'
import Composers from './components/composers'
import Performers from './components/performers'
import Programs from './components/programs'
import IdentifiedWorks from './components/identified_works'
import { Typography, Box, Grid, Container, Button, AppBar, Toolbar } from '@material-ui/core'
import { Home } from '@material-ui/icons';

export default function App() {
  return (
    <Router>
      <AppBar position="static">
        <Toolbar>
          <Grid container justify="space-between" direction='row' alignItems="center" >
            <Grid item>
              <Button edge="start" color="inherit" aria-label="home" component={Link} to="/" startIcon={<Home />}>
                Home
          </Button>
            </Grid>

            <Grid item>
              <Box>
                <Button color='inherit' component={Link} to="/composers" startIcon={<i className="fas fa-user"></i>}>Compositeurs</Button>

                <Button color='inherit' component={Link} to="/performers" startIcon={<i className="far fa-user"></i>}>Interprètes</Button>

                <Button color='inherit' component={Link} to="/identified_works" startIcon={<i className="fas fa-music"></i>}>Oeuvres Identifiées</Button>

                <Button color='inherit' component={Link} to="/super_events" startIcon={<i className="fas fa-microphone-alt"></i>}>Programmes</Button>
              </Box>
            </Grid>

            <Grid item>

            </Grid>

          </Grid>
        </Toolbar>
      </AppBar>
      <Box m={2} />
      <div>
        <Switch>
          <Route exact path='/'>
            <Container maxWidth="md">
              <Grid container justify="center">
                <Typography variant="h2" component="h1" align="center">
                  Musiciens Radiodiffusés
              </Typography>
                <Typography variant="h2" component="h1" align="center">dans les années 1930</Typography>
              </Grid>
              <Box m={5} />
              <Grid container justify="space-between" direction='column'>
                <Grid container justify="space-between">
                  <Box width={1 / 2}>
                    <Button size='large' variant='contained' color='primary' fullWidth={true} component={Link} to="/composers">Compositeurs</Button>
                  </Box>
                  <Box width={1 / 2}>
                    <Button size='large' variant='contained' color='primary' fullWidth={true} component={Link} to="/performers">Interprètes</Button>
                  </Box>
                </Grid>

                <Grid container justify="space-between">
                  <Box width={1 / 2}>
                    <Button size='large' variant='contained' color='primary' fullWidth={true} component={Link} to="/identified_works">Oeuvres Identifiées</Button>
                  </Box>
                  <Box width={1 / 2}>
                    <Button size='large' variant='contained' color='primary' fullWidth={true} component={Link} to="/super_events">Programmes</Button>
                  </Box>
                </Grid>
              </Grid>
              <Box m={5} />
              <Grid>
                <Typography variant="h6" component="h2" color='textPrimary'>A propos :</Typography>
                <Typography variant="body1" component="body" color='textSecondary'>
                Cette base de données a été créée à partir d’un échantillonnage de 3000 heures de programmes musicaux sur des radios françaises des années trente. Le relevé des quelque 20 000 références d’œuvres génère deux groupes de musiciens : plus de 2000 compositeurs et presque autant d’interprètes (individuels ou collectifs). {<br/>} La base de données permet d’exploiter ces inventaires de manières qualitative et quantitative. Elle permet aussi une forte interaction entre les musiciens et les programmes cités, mais aussi des tris par nationalité, par époque, par genre musical, ou bien encore par type de programme.
                </Typography>
                <Box m={1} />
                <Typography variant="h6" component="h2" color='textPrimary'>Crédits :</Typography>
                <Typography variant="body1" component="body" color='textSecondary'>
                  Responsable scientifique : Christophe BENNET<br/>
                  Prétraitement des données : Florence LE PRIOL<br/>
                  Modélisation sémantique et développement de l'API : Thomas BOTTINI<br/>
                  Traitement des données, conception et développement de l'interface : Pierre LA ROCCA<br/>
                </Typography>
              </Grid>

            </Container>

          </Route>
          <Route path='/composers' children={Composers} />
          <Route path='/performers' children={Performers} />
          <Route path='/super_events' children={Programs} />
          <Route path='/identified_works' children={IdentifiedWorks} />
          <Route path='/musician/:id' children={Musician} />
          <Route path='/work/:id' children={Work} />
          <Route path='/super_event/:id' children={Program} />
        </Switch>
      </div>
    </Router>
  )
}
