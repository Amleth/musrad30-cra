import { TextField } from '@material-ui/core'
import React from 'react'

export const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export function makeTextField(f, v, fw = false, ml = false) {
  return (
    <TextField
      value={v}
      fullWidth={fw}
      label={f}
      InputProps={{
        readOnly: true
      }}
      multiline={ml}
    />
  )
}
