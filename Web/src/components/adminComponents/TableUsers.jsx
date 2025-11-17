'use client';

import {
  ActionBar,
  Button,
  Checkbox,
  Kbd,
  Portal,
  Table,
} from '@chakra-ui/react';
import { useState } from 'react';

export const App = () => {
  const [selection, setSelection] = useState<string[]>([]);

  const hasSelection = selection.length > 0;
  const indeterminate = hasSelection && selection.length < items.length;

  const rows = items.map((item) => (
    <Table.Row
      key={item.name}
      data-selected={selection.includes(item.name) ? '' : undefined}
    >
      <Table.Cell>
        <Checkbox.Root
          size="sm"
          top="0.5"
          aria-label="Select row"
          checked={selection.includes(item.name)}
          onCheckedChange={(changes) => {
            setSelection((prev) =>
              changes.checked
                ? [...prev, item.name]
                : selection.filter((name) => name !== item.name)
            );
          }}
        >
          <Checkbox.HiddenInput />
          <Checkbox.Control />
        </Checkbox.Root>
      </Table.Cell>
      <Table.Cell>{item.name}</Table.Cell>
      <Table.Cell>{item.email}</Table.Cell>
      <Table.Cell>{item.date}</Table.Cell>
      <Table.Cell>{item.password}</Table.Cell>
    </Table.Row>
  ));

  return (
    <>
      <Table.Root>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader w="6">
              <Checkbox.Root
                size="sm"
                top="0.5"
                aria-label="Select all rows"
                checked={indeterminate ? 'indeterminate' : selection.length > 0}
                onCheckedChange={(changes) => {
                  setSelection(
                    changes.checked ? items.map((item) => item.name) : []
                  );
                }}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control />
              </Checkbox.Root>
            </Table.ColumnHeader>
            <Table.ColumnHeader>Usuario</Table.ColumnHeader>
            <Table.ColumnHeader>Email</Table.ColumnHeader>
            <Table.ColumnHeader>Date</Table.ColumnHeader>
            <Table.ColumnHeader>Password</Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>{rows}</Table.Body>
      </Table.Root>

      <ActionBar.Root open={hasSelection}>
        <Portal>
          <ActionBar.Positioner>
            <ActionBar.Content>
              <ActionBar.SelectionTrigger>
                {selection.length} Delete<Kbd>⌫</Kbd>
              </ActionBar.SelectionTrigger>
              <ActionBar.Separator />
              <Button variant="outline" size="sm">
                Edit 
              </Button>
            </ActionBar.Content>
          </ActionBar.Positioner>
        </Portal>
      </ActionBar.Root>
    </>
  );
};

const items = [
  {
    id: 1,
    name: 'Juan',
    email: 'juaaa@gmail.com',
    date: '12/09/2000',
    password: 'nata',
  },
  {
    id: 2,
    name: 'Pepe',
    email: 'juppn@gmail.com',
    date: '12/09/2000',
    password: 'nata',
  },
  {
    id: 3,
    name: 'Maria',
    email: 'jmmn@gmail.com',
    date: '12/09/2000',
    password: 'nata',
  },
  {
    id: 4,
    name: 'Sonia',
    email: 'soniaan@gmail.com',
    date: '12/09/2000',
    password: 'nata',
  },
];
