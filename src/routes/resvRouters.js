const express = require("express");
const router = express.Router();
const {
  makeReservation,
  getReservations,
  retrieveReservation,
  updateReservation,
  deleteReservation,
} = require("../controllers/resvControllers");
const protect = require("../middleware/authMiddleware");

router.post("/", protect, makeReservation);
router.get("/", protect, getReservations);
router.get("/:id", protect, retrieveReservation);
router.put("/:id", protect, updateReservation);
router.delete("/:id", protect, deleteReservation);

module.exports = router;
