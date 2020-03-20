import React from 'react'
import Box from '@material-ui/core/Box'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'

class CompWorks extends React.Component {
  render() {
    return (
      <div>
        <Box>
          <MaterialTable 
          title = 'Oeuvres composées'
          options={
            {
              filtering: true
            }
          }
          >
          </MaterialTable>
        </Box>
      </div>
    )
  }
}

export default withRouter(CompWorks)
