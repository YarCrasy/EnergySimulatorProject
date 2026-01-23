import {describe, it, expect } from 'vitest'
const { roundCoord } = require("@/pages/simulator/workspace/WorkspaceUtils")

describe ( 'roundCoord', () =>{
    it('redonde los numeros a dos decimales, maneja strings y null', () =>{
  // Arrange: preparar datos y mocks
  const valueFloat = 1.234656
  const valueString = '3.234656'
  const valueNull = null

  // Act: ejecutar la función
  const resultFloat = roundCoord(valueFloat)
  const resultString = roundCoord(valueString)
  const resultNull = roundCoord(valueNull)

  // Assert: verificar resultado
    expect(resultFloat).toBe(1.23)
    expect(resultString).toBe(3.23)
    expect(resultNull).toBe()
    })
})