import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

async function initializeDb() {
  return open({
    filename: './sqlite.db',
    driver: sqlite3.Database
  })
}

export default initializeDb
