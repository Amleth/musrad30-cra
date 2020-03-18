import React from 'react'
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom'
import Musician from './components/musician'
import Musicians from './components/musicians'

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
        </ul>
        <hr />
        <Switch>
          <Route exact path='/'>
            <div>
              Et si on allait voir le{' '}
              <Link to='/musician/0cedf2af-88b8-42ea-a2e0-45adcac126d6'>
                musicien d'id <code>0cedf2af-88b8-42ea-a2e0-45adcac126d6</code>
              </Link>
              &nbsp;?
            </div>
          </Route>
          <Route path='/musicians' children={Musicians} />
          <Route path='/musician/:id' children={Musician} />
        </Switch>
      </div>
    </Router>
  )
}
