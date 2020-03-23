import React from 'react'
import MaterialTable from 'material-table'
import { withRouter } from 'react-router'
import { Container, Box } from '@material-ui/core'

class Musicians extends React.Component {
  render() {
    return (
      <Container>
        <Box>
          <MaterialTable>

          </MaterialTable>
        </Box>
      </Container>
    )
  }
}

export default withRouter(Musicians)
