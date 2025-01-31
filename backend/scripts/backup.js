import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'

dotenv.config()

const dbPath = process.env.DATABASE_URL
const backupDir = process.env.BACKUP_DIR || './backups'

function createBackup() {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
  const backupFileName = `db_backup_${timestamp}.sqlite`
  const backupPath = path.join(backupDir, backupFileName)

  if (!fs.existsSync(backupDir)) {
    try {
      fs.mkdirSync(backupDir)
    } catch (err) {
      console.error('Error creating backup directory:', err)
      return
    }
  }

  if (!fs.existsSync(dbPath)) {
    console.error('Database file not found:', dbPath)
    return
  }

  try {
    fs.copyFileSync(dbPath, backupPath)
    console.log(`Backup created: ${backupPath}`)
  } catch (err) {
    console.error('Backup failed:', err)
  }
}

createBackup()
