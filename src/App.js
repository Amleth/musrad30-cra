import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Musician from './components/musician'
import Program from './components/program'
import Work from './components/work'
import Composers from './components/composers'
import Performers from './components/performers'
import Programs from './components/programs'
import IdentifiedWorks from './components/identified_works'

export default function App() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/composers'>Compositeurs</Link>
          </li>
          <li>
            <Link to='/performers'>Interprètes</Link>
          </li>
          <li>
            <Link to='/super_events'>Programmes</Link>
          </li>
          <li>
            <Link to='/identified_works'>Oeuvres Identifiées</Link>
          </li>
        </ul>
        <hr />
        <Switch>
          <Route exact path='/'>
            <div>
              Et si on allait voir le{' '}
              <Link to='/musician/02a7add6-4982-42e2-936d-7231909d8d8d'>
                musicien d'id <code>02a7add6-4982-42e2-936d-7231909d8d8d</code>
              </Link>
              &nbsp;?
            </div>
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
