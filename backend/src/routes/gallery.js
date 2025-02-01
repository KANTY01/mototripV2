import express from 'express'
import fs from 'fs'
import path from 'path'

const router = express.Router()
const ALLOWED_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp)$/i

/**
 * @swagger
 * /api/gallery:
 *   get:
 *     summary: Get all images from the gallery
 *     tags: [Gallery]
 *     responses:
 *       200:
 *         description: List of gallery images
 *       500:
 *         description: Server error
 */
router.get('/', async (req, res) => {
  const galleryPath = path.join(process.cwd(), '..', 'gallery')
  
  try {
    // Check if directory exists
    if (!fs.existsSync(galleryPath)) {
      console.error(`Gallery directory not found: ${galleryPath}`)
      return res.status(500).json({ message: 'Gallery directory not found' })
    }

    const files = fs.readdirSync(galleryPath)
    const images = files
      .filter(file => ALLOWED_EXTENSIONS.test(file))
      .map(file => ({
        name: file,
        url: `/api/gallery/${file}`,
        path: `/gallery/${file}`
      }))
    
    res.json(images)
  } catch (err) {
    console.error('Gallery error:', err)
    res.status(500).json({ 
      message: 'Failed to load gallery images. Please try again later.'
    })
  }
})

export default router