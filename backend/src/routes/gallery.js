import express from "express";
import fs from "fs";
import path from "path";

const router = express.Router();
const ALLOWED_EXTENSIONS = /\.(jpg|jpeg|png|gif|webp)$/i;

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
router.get("/", async (req, res) => {
  const galleryPath = path.join(process.cwd(), "..", "gallery");

  try {
    // Check if directory exists
    if (!fs.existsSync(galleryPath)) {
      console.error(`Gallery directory not found: ${galleryPath}`);
      return res
        .status(404)
        .json({ message: "Gallery directory not found", path: galleryPath });
    }

    const files = fs.readdirSync(galleryPath);
    const images = files
      .filter((file) => ALLOWED_EXTENSIONS.test(file))
      .map((file) => ({
        name: file,
        url: `/api/gallery/${file}`,
        path: `/gallery/${file}`,
      }));

    res.json(images);
  } catch (err) {
    console.error("Gallery error:", err);
    console.error("Error details:", err.message);
    res.status(500).json({
      message: "Failed to load gallery images",
      error: err.message,
    });
  }
});

/**
 * @swagger
 * /api/gallery/{filename}:
 *   get:
 *     summary: Get a specific image from the gallery
 *     tags: [Gallery]
 *     parameters:
 *       - in: path
 *         name: filename
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Image file
 *       404:
 *         description: Image not found
 */
router.get("/:filename", (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(process.cwd(), "..", "gallery", filename);

  if (!fs.existsSync(imagePath)) {
    console.error(`Image not found: ${imagePath}`);
    return res
      .status(404)
      .json({ message: "Image not found", path: imagePath });
  }

  res.setHeader("Cache-Control", "public, max-age=31536000");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.sendFile(imagePath, { dotfiles: "allow" });
});

export default router;
