const express = require("express")
const router = express.Router()
const {getFlights, setFlights, updateFlights, deleteFlights} = require("../controllers/flightController")
const {isStaffUser, setUser} = require("../middleware/permissionMiddleware")
const protect  = require("../middleware/authMiddleware")


router.get("/",setUser, getFlights)
router.post("/", protect, isStaffUser,  setFlights)
router.put("/:id", protect, isStaffUser,  updateFlights)
router.delete("/:id", protect, isStaffUser,  deleteFlights)



module.exports = router