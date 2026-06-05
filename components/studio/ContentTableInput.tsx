import {AddIcon, TrashIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Stack, Text, TextInput} from '@sanity/ui'
import {PatchEvent, set} from 'sanity'

type TableRow = {
  _key: string
  cells: string[]
}

type TableValue = {
  _type?: string
  rows?: TableRow[]
}

function createKey() {
  return Math.random().toString(36).slice(2, 12)
}

export function ContentTableInput(props: any) {
  const value = (props.value || {}) as TableValue
  const rows = value.rows || []
  const columnCount = Math.max(1, ...rows.map((row) => row.cells?.length || 0))

  const commitRows = (nextRows: TableRow[]) => {
    props.onChange(PatchEvent.from(set({...value, _type: 'contentTable', rows: nextRows})))
  }

  const normalizedRows = rows.map((row) => ({
    ...row,
    cells: Array.from({length: columnCount}, (_, index) => row.cells?.[index] || ''),
  }))

  const addRow = () => {
    commitRows([
      ...normalizedRows,
      {_key: createKey(), cells: Array.from({length: columnCount}, () => '')},
    ])
  }

  const addColumn = () => {
    if (!normalizedRows.length) {
      commitRows([{_key: createKey(), cells: ['', '']}])
      return
    }

    commitRows(normalizedRows.map((row) => ({...row, cells: [...row.cells, '']})))
  }

  const removeColumn = (columnIndex: number) => {
    if (columnCount === 1) return
    commitRows(normalizedRows.map((row) => ({
      ...row,
      cells: row.cells.filter((_, index) => index !== columnIndex),
    })))
  }

  const removeRow = (rowIndex: number) => {
    commitRows(normalizedRows.filter((_, index) => index !== rowIndex))
  }

  const updateCell = (rowIndex: number, columnIndex: number, cellValue: string) => {
    commitRows(normalizedRows.map((row, index) => {
      if (index !== rowIndex) return row

      return {
        ...row,
        cells: row.cells.map((cell, cellIndex) => cellIndex === columnIndex ? cellValue : cell),
      }
    }))
  }

  return (
    <Stack space={3}>
      <Flex align="center" gap={2} justify="space-between">
        <Text muted size={1}>
          {normalizedRows.length} {normalizedRows.length === 1 ? 'row' : 'rows'} · {columnCount} {columnCount === 1 ? 'column' : 'columns'}
        </Text>
        <Flex gap={2}>
          <Button icon={AddIcon} mode="ghost" onClick={addColumn} text="Add column" />
          <Button icon={AddIcon} mode="ghost" onClick={addRow} text="Add row" />
        </Flex>
      </Flex>

      <Card border radius={2} overflow="auto" padding={3}>
        <Box style={{minWidth: `${Math.max(columnCount * 180, 360)}px`}}>
          <Box
            marginBottom={2}
            style={{
              display: 'grid',
              gap: '8px',
              gridTemplateColumns: `44px repeat(${columnCount}, minmax(160px, 1fr)) 36px`,
            }}
          >
            <Box />
            {Array.from({length: columnCount}, (_, columnIndex) => (
              <Flex align="center" justify="space-between" key={columnIndex}>
                <Text muted size={1} weight="semibold">Column {columnIndex + 1}</Text>
                {columnCount > 1 ? (
                  <Button
                    aria-label={`Remove column ${columnIndex + 1}`}
                    icon={TrashIcon}
                    mode="bleed"
                    onClick={() => removeColumn(columnIndex)}
                    tone="critical"
                  />
                ) : null}
              </Flex>
            ))}
            <Box />
          </Box>

          <Stack space={2}>
            {normalizedRows.map((row, rowIndex) => (
              <Box
                key={row._key}
                style={{
                  alignItems: 'center',
                  display: 'grid',
                  gap: '8px',
                  gridTemplateColumns: `44px repeat(${columnCount}, minmax(160px, 1fr)) 36px`,
                }}
              >
                <Text muted size={1} weight="semibold">Row {rowIndex + 1}</Text>
                {row.cells.map((cell, columnIndex) => (
                  <TextInput
                    key={`${row._key}-${columnIndex}`}
                    onChange={(event) => updateCell(rowIndex, columnIndex, event.currentTarget.value)}
                    placeholder={`R${rowIndex + 1} C${columnIndex + 1}`}
                    value={cell}
                  />
                ))}
                <Button
                  aria-label={`Remove row ${rowIndex + 1}`}
                  icon={TrashIcon}
                  mode="bleed"
                  onClick={() => removeRow(rowIndex)}
                  tone="critical"
                />
              </Box>
            ))}
          </Stack>

          {!normalizedRows.length ? (
            <Card marginTop={2} padding={4} radius={2} tone="transparent">
              <Flex align="center" direction="column" gap={3}>
                <Text muted size={1}>Start the table by adding a row.</Text>
                <Button icon={AddIcon} onClick={addRow} text="Add first row" />
              </Flex>
            </Card>
          ) : null}
        </Box>
      </Card>
    </Stack>
  )
}
