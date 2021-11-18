const express = require('express');
const router = express.Router();
const AvisoVagas = require('../models/avisoVaga');



router.post("/", async (req, res) => {
    const newPost = new AvisoVagas(req.body)
    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);
    } catch (err) {
        res.status(500).json(err)
    }
})

router.put("/:id", async (req, res) => {
    const post = AvisoVagas.findById(req.params.id);
    try {
        await post.updateOne({ $set: req.body });
        res.status(200).json("modificação pronta")
    } catch (err) {
        res.status(500).json(err);
    }
})
router.delete("/:id", async (req, res) => {
    const post = AvisoVagas.findById(req.params.id);
    try {
        await post.deleteOne();
        res.status(200).json("post deleta")
    } catch (err) {
        res.status(500).json(err);
    }
})
router.get('/salao/:salaoId', async (req, res) => {
    try {
      const { salaoId } = req.params;
  
      const avisoVaga = await AvisoVagas.find({
        salaoId,
      });
  
      res.json({ error: false, avisoVaga });
    } catch (err) {
      res.json({ error: true, message: err.message });
    }
  });

module.exports = router;
