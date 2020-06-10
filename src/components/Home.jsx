import { Box } from '@material-ui/core'
import { Container } from '@material-ui/core'
import { Grid } from '@material-ui/core'
import { List } from '@material-ui/core'
import { ListItem } from '@material-ui/core'
import { ListItemText } from '@material-ui/core'
import { ListItemAvatar } from '@material-ui/core'
import { Avatar } from '@material-ui/core'
import { Typography } from '@material-ui/core'
import { Search as SearchIcon } from '@material-ui/icons'
import { ViewList as ViewListIcon } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { DeveloperMode as DeveloperModeIcon } from '@material-ui/icons'
import React from 'react'
import { withRouter } from 'react-router'

const useStyles = makeStyles((theme) => ({
  gridContainer: {
    flexGrow: 1
  },
  list: {
    margin: 0,
    padding: 0,
    '& li': {
      margin: 0,
      marginBottom: theme.spacing(2),
      padding: 0
    }
  }
}))

function Home() {
  const classes = useStyles()
  return (
    <Container maxWidth='md'>
      <Box pt={5} pb={10}>
        <Typography variant='h2' component='h1' align='center'>
          Musicien·ne·s radiodiffusé·e·s depuis les années 1930
        </Typography>
      </Box>
      <Grid container className={classes.gridContainer} spacing={10}>
        <Grid item xs={7}>
          <Typography variant='body1' color='textSecondary' align='justify'>
            Cette base de données a été créée à partir d’un échantillonnage de 3000 heures de
            programmes musicaux sur des radios françaises des années trente. Le relevé des quelque
            20 000 références d’œuvres génère deux groupes de musiciens : plus de 2000
            compositeur•rice•s et presque autant d’interprètes (individuels ou collectifs). {<br />}{' '}
            La base de données permet d’exploiter ces inventaires de manières qualitative et
            quantitative. Elle permet aussi une forte interaction entre les musiciens et les
            programmes cités, mais aussi des tris par nationalité, par époque, par genre musical, ou
            bien encore par type de programme.
          </Typography>
        </Grid>
        <Grid item xs={5}>
          <List className={classes.list}>
            <ListItem disableGutters={true}>
              <ListItemAvatar>
                <Avatar>
                  <SearchIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Responsable scientifique' secondary='Christophe BENNET' />
            </ListItem>
            <ListItem disableGutters={true}>
              <ListItemAvatar>
                <Avatar>
                  <ViewListIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText primary='Prétraitement des données' secondary='Florence LE PRIOL' />
            </ListItem>
            <ListItem disableGutters={true}>
              <ListItemAvatar>
                <Avatar>
                  <DeveloperModeIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary='Modélisation sémantique & développement logiciel'
                secondary='Pierre LA ROCCA + Thomas BOTTINI'
              />
            </ListItem>
          </List>
        </Grid>
      </Grid>
    </Container>
  )
}

export default withRouter(Home)
