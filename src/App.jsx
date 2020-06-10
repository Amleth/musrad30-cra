import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import { Box, Button, AppBar, Toolbar } from '@material-ui/core'
import { Home as HomeIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'

import Composers from './components/Composers'
import Home from './components/Home'
import Musician from './components/Musician'
import Performers from './components/Performers'
import Program from './components/Program'
import Programs from './components/Programs'
import Work from './components/Work'
import Works from './components/Works'

const useStyles = makeStyles({
  bar: {
    flexWrap: 'wrap',
    justifyContent: 'center',
    '& a': {
      margin: '0 5px'
    }
  }
})

export default function App() {
  const classes = useStyles()
  return (
    <Router>
      <AppBar position='static'>
        <Toolbar className={classes.bar}>
          <Button
            color='inherit'
            aria-label='home'
            component={Link}
            to='/'
            startIcon={<HomeIcon />}
          >
            Accueil
          </Button>
          <Button
            color='inherit'
            component={Link}
            to='/composers'
            startIcon={<i className='fas fa-user'></i>}
          >
            Compositeur·rice·s
          </Button>
          <Button
            color='inherit'
            component={Link}
            to='/performers'
            startIcon={<i className='far fa-user'></i>}
          >
            Interprètes
          </Button>
          <Button
            color='inherit'
            component={Link}
            to='/identified_works'
            startIcon={<i className='fas fa-music'></i>}
          >
            Œuvres Identifiées
          </Button>
          <Button
            color='inherit'
            component={Link}
            to='/super_events'
            startIcon={<i className='fas fa-microphone-alt'></i>}
          >
            Programmes
          </Button>
        </Toolbar>
      </AppBar>
      <Box m={2} />
      <div>
        <Switch>
          <Route exact path='/' children={Home} />
          <Route path='/composers' children={Composers} />
          <Route path='/performers' children={Performers} />
          <Route path='/super_events' children={Programs} />
          <Route path='/identified_works' children={Works} />
          <Route path='/musician/:id' children={Musician} />
          <Route path='/work/:id' children={Work} />
          <Route path='/super_event/:id' children={Program} />
        </Switch>
      </div>
    </Router>
  )
}
