const router = require("express").Router()
const flights = require("./flightRouters")
const auth = require("./userRouters")
const reservation = require("./resvRouters")


router.use("/flights",flights)
router.use("/users",auth)
router.use("/resv",reservation)

module.exports = router