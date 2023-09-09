const path = require("path");
const multer = require("multer");
const fs = require("fs");
const allowedExtensions = [".jpg", ".jpeg", ".png"];
const { Image, Tag, sequelize, Like } = require("../models");
const { boolean } = require("joi");
require("dotenv").config();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "..", "uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    const filename = `${file.fieldname}-${uniqueSuffix}`;
    cb(null, filename);
  },
});

const uploadMiddleware = multer({ storage: storage }).single("image");

class ImageController {
  static async getImgeByUserId(req, res) {
    try {
      const { id } = req.userLogged
      const data = await Image.findAll({
        where: { user_id: id }, include: [
          {
            model: Tag,
          },
        ],
      })
      if (data) {
        res.status(200).json({ data })
      } else {
        res.status(404).json({ message: 'Not Found' })
      }
    } catch (error) {
      console.log(error)
    }
  }

  static async getAllPost(req, res) {
    try {
      const posts = await Image.findAll({
        include: [
          {
            model: Tag,
          },
        ],
      });
      res.status(200).json(posts);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error while fetching posts." });
    }
  }

  static async createPostImage(req, res) {
    let t = await sequelize.transaction();

    try {
      uploadMiddleware(req, res, async function (err) {
        if (err instanceof multer.MulterError) {
          await t.rollback();
          return res.status(500).json({
            message: "Error while uploading file.",
          });
        }

        if (!req.file) {
          await t.rollback();
          return res.status(400).json({ message: "Please upload a file!" });
        }

        const fileExtension = path.extname(req.file.originalname).toLowerCase();

        if (!allowedExtensions.includes(fileExtension)) {
          await t.rollback();
          return res
            .status(400)
            .json({ message: "Only JPG, JPEG, and PNG files are allowed!" });
        }

        const { id } = req.userLogged;
        const { caption, location, tagsId } = req.body;

        const tagsInstance = await Tag.findAll({
          where: { id: tagsId },
          transaction: t,
        });

        if (!tagsInstance || tagsInstance.length === 0) {
          await t.rollback();
          return res.status(400).json({ message: "Tags Not Found" });
        }

        const baseUrl = process.env.BASE_URL;
        const imageUrl = `${baseUrl}/uploads/${req.file.filename}`;
        const data = await Image.create(
          {
            user_id: id,
            image_url: imageUrl,
            caption,
            location,
            total_likes: 0,
          },
          { transaction: t }
        );

        await data.setTags(tagsInstance, { transaction: t });

        await t.commit();

        res.status(201).json({
          message: "Image and data successfully uploaded",
          data,
          tags: tagsInstance.map((instance) => ({
            name_tag: instance.tag_name,
          })),
        });
      });
    } catch (err) {
      console.log(err);
      if (t) {
        await t.rollback();
      }
      res.status(500).json({
        message: `Could not upload the file: ${req.file ? req.file.originalname : "Unknown File"
          }. ${err}`,
      });
    }
  }

  static async cekUserIsLike(req, res) {
    try {
      const { imageId } = req.params;
      const { id } = req.userLogged;
      const likesAlready = await Like.findOne({
        where: { user_id: id, image_id: imageId },
      });

      if (likesAlready) {
        return res.status(200).json({ message: 'already', data: true })
      } else {
        return res.status(200).json({ message: 'Not yet', data: false })
      }
    } catch (error) {
      console.log(error)
    }
  }


  static async likeImage(req, res) {
    try {
      const { imageId } = req.params;
      const { id } = req.userLogged;

      const image = await Image.findByPk(imageId);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      const likesAlready = await Like.findOne({
        where: { user_id: id, image_id: imageId },
      });

      if (likesAlready) {
        return res.status(400).json({ message: "You already like this image" });
      } else {
        const likesTable = await Like.create({
          user_id: id,
          image_id: imageId,
          status: "like",
        });

        if (!likesTable) {
          return res.status(500).json({ message: "Something went wrong" });
        } else {
          image.total_likes += 1;
          await image.save(); // Simpan perubahan total_likes ke dalam database
          return res.status(200).json({ message: "Image liked successfully" });
        }
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async unlikeImage(req, res) {
    try {
      const { imageId } = req.params;
      const { id } = req.userLogged;

      const image = await Image.findByPk(imageId);
      if (!image) {
        return res.status(404).json({ message: "Image not found" });
      }

      const likesAlready = await Like.findOne({
        where: { user_id: id, image_id: imageId },
      });

      if (likesAlready) {
        await Like.destroy({ where: { user_id: id, image_id: imageId } });

        image.total_likes -= 1;
        if (image.total_likes < 0) {
          image.total_likes = 0; // Pastikan total_likes tidak negatif
        }
        await image.save(); // Simpan perubahan total_likes ke dalam database

        return res.status(200).json({ message: "Image unliked successfully" });
      }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }

  static async updatePostImage(req, res) {
    let t = await sequelize.transaction();
    try {
      const { imageId } = req.params; // Assuming you're passing the imageId in the URL
      const { caption, location, tagsId } = req.body;
      const image = await Image.findByPk(imageId, { transaction: t });

      if (!image) {
        await t.rollback();
        return res.status(404).json({ message: "Image not found" });
      }
      await image.update({ caption, location }, { transaction: t });

      const updatedTags = await Tag.findAll({
        where: { id: tagsId },
        transaction: t,
      });

      if (!updatedTags || updatedTags.length === 0) {
        await t.rollback();
        return res.status(400).json({ message: "Tags Not Found" });
      }

      await image.setTags(updatedTags, { transaction: t });

      await t.commit();

      res.status(200).json({
        message: "Image and data successfully updated",
        data: image,
        tags: updatedTags.map((instance) => ({
          name_tag: instance.tag_name,
        })),
      });
    } catch (err) {
      console.log(err);
      if (t) {
        await t.rollback();
      }
      res.status(500).json({
        message: `Could not update the image: ${err}`,
      });
    }
  }

  static async deletePost(req, res) {
    try {
      const { imageId } = req.params;

      const post = await Image.findByPk(imageId);

      if (!post) {
        return res.status(404).json({ message: "Post not found." });
      }

      await post.destroy();

      res.status(200).json({ message: "Post image deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Error while deleting post." });
    }
  }
}

module.exports = ImageController;
