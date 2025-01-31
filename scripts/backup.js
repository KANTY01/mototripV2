import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const dbPath = process.env.DATABASE_URL
const backupDir = './backups'

function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupFileName = `db_backup_${timestamp}.sqlite`
  const backupPath = path.join(backupDir, backupFileName)

  if (!fs.existsSync(backupDir)) {
    fs.mkdirSync(backupDir)
  }

  fs.copyFile(dbPath, backupPath, (err) => {
    if (err) {
      console.error('Backup failed:', err)
    } else {
      console.log(`Backup created: ${backupPath}`)
    }
  })
}

createBackup()
