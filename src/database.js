import { randomUUID } from 'node:crypto'
import fs from 'node:fs/promises'

const databasePath = new URL('../db.json', import.meta.url)

export class Database {
  #database = {}

  constructor() {
    fs.readFile(databasePath, 'utf-8').then(data => {
      this.#database = JSON.parse(data)
    }).catch(() => {
      this.#persist()
    })
  }

  #persist = () => {
    fs.writeFile(databasePath, JSON.stringify(this.#database, null, 2))
    }

  select(table, search) {
    let data = this.#database[table] ?? []
    
    if(search) {
      data = data.filter(row => {
        return Object.entries(search).some(([key, value]) => row[key].toLowerCase().includes(value.toLowerCase()))
      })
    }

    return data
  }

  insert(table, data) {
    const currentData = this.#database[table] ?? []
    this.#database[table] = [...currentData, {...data, id: randomUUID() }]
    this.#persist()
    return data
  }

  delete(table, id) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex === -1) return false

    this.#database[table].splice(rowIndex, 1)
    this.#persist()
  }

  update(table, id, data) {
    const rowIndex = this.#database[table].findIndex(row => row.id === id)

    if(rowIndex === -1) return false

    this.#database[table][rowIndex] = {...this.#database[table][rowIndex], ...data}
    this.#persist()
  }
}