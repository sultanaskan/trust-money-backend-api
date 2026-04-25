const express = require('express');
const router = express.Router();
const packageController = require("../controllers/packageController");


router.post("/", packageController.setPackage);
router.get("/", packageController.getPackages);
router.get("/:id", packageController.getPackage);
router.put("/:id", packageController.putPackage);
router.delete("/:id", packageController.deletePackage);

module.exports = router