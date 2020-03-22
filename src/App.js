import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Musician from './components/musician'
import Program from './components/program'
import Musicians from './components/musicians'
import Programs from './components/programs'
import CompWorks from './components/composed_works'

export default function App() {
  return (
    <Router>
      <div>
        <ul>
          <li>
            <Link to='/'>Home</Link>
          </li>
          <li>
            <Link to='/musicians'>Musiciens</Link>
          </li>
          <li>
            <Link to='/programs'>Programmes</Link>
          </li>
          <li>
            <Link to='/composed_works'>Oeuvres Composées</Link>
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
          <Route path='/musicians' children={Musicians} />
          <Route path='/programs' children={Programs} />
          <Route path='/composed_works' children={CompWorks} />
          <Route path='/musician/:id' children={Musician} />
          <Route path='/program/:id' children={Program} />
        </Switch>
      </div>
    </Router>
  )
}
