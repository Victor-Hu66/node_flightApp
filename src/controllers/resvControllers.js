const Reservation = require("../models/reservationModel");
const Passenger = require("../models/passengerModel");
const Flights = require("../models/flightModel");

// @desc    Set Reservation
// @route   POST /api/resv
// @access  Protected
const makeReservation = async (req, res) => {
  const { flightID, passengers } = req.body;
  const user = req.user;

  // check request data exists
  if (user && flightID && passengers) {
    // check flightID is valid
    const flight = await Flights.findById(flightID);

    if (flight) {
      try {
        // handle passenger data
        for (const item of passengers) {
          const passenger = await Passenger.findOne({ email: item.email });
          // passenger' first name and last name are matching with new data x for update endpoint also
          // check passenger did make resv for this flight before  x for update endpoint also
          TODO: if (passenger) {
            passenger.flights.push(flight.id);
            passenger.save();
          } else {
            const checkphone = await Passenger.findOne({
              phoneNumber: item.phoneNumber,
            });

            if (!checkphone) {
              const newPassenger = await Passenger.create(item);
              newPassenger.flights.push(flight.id);
              newPassenger.save();
            } else {
              return res.status(400).json({
                message: `this ${checkphone.phoneNumber} phone number already in use`,
              });
            }
          }
        }

        // create reservation
        const reservation = await Reservation.create({
          user,
          flight: flightID,
          passengers,
        });
        return res.status(200).json(reservation);
      } catch (error) {
        return res.status(500).json({ message: "something went wrong" });
      }
    } else {
      return res
        .status(404)
        .json({ message: "please provide a valid flight ID" });
    }
  } else {
    return res.status(400).json({
      message: "please provide a flight ID and passenger information",
    });
  }
};

// @desc    Get Reservation
// @route   GET /api/resv
// @access  Protected
const getReservations = async (req, res) => {
  try {
    if (req.user.userRole === "staffUser") {
      const reservations = await Reservation.find().populate("flight");
      return res.status(200).json(reservations);
    } else {
      const reservation = await Reservation.find({ user: req.user }).populate(
        "flight"
      );
      return res.status(200).json(reservation);
    }
  } catch (error) {
    return res.status(404).json(error);
  }
};

// @desc    Retrieve Single Reservation
// @route   GET /api/resv/:id
// @access  Protected
const retrieveReservation = async (req, res) => {
  const reservation = await Reservation.findById(req.params.id).populate(
    "flight"
  );
  if (
    (reservation && req.user.userRole === "staffUser") ||
    (reservation && req.user.id == reservation.user)
  ) {
    return res.status(200).json(reservation);
  } else if (!reservation) {
    return res.status(404).json({
      mesage: "There is not a reservation with this id!.",
    });
  } else {
    return res.status(404).json({
      mesage: "You do not have permission to access this reservation.",
    });
  }
};

// @desc    Update Reservation
// @route   PUT /api/resv/:id
// @access  Protected
const updateReservation = async (req, res) => {
  const reservation = await Reservation.findById(req.params.id);

  // check the reservation owner or staffUser
  if (
    (reservation && req.user.userRole === "staffUser") ||
    (reservation && req.user.id == reservation.user)
  ) {
    const { flight: flightID, passengers } = req.body;

    // check flightID is valid
    const flight = await Flights.findById(flightID);
    if (!flight) {
      return res.status(404).json({ message: "Please check flight ID" });
    }

    //! HANDLE PASSENGERS STARTS//////////////////////////////////
    // handle new reservation passengers
    const newPassArray = [];
    for (const item of passengers) {
      const samepassengers = await Passenger.findOne({ email: item.email });

      if (samepassengers) {
        newPassArray.push(samepassengers.email);
        // remove old flightID from passenger documents and add new flightID
        const index = samepassengers.flights.indexOf(reservation.flight);
        if (index > -1) {
          // only splice array when item is found
          samepassengers.flights.splice(index, 1); // 2nd parameter means remove one item only
          samepassengers.flights.push(flight.id);
          samepassengers.save();
        }
      } else {
        // If passenger is not exists create passenger add flightID to passenger documents(when creating check phoneNumber)
        const checkphone = await Passenger.findOne({
          phoneNumber: item.phoneNumber,
        });

        if (!checkphone) {
          const newPassenger = await Passenger.create(item);
          newPassenger.flights.push(flight.id);
          newPassenger.save();
        } else {
          return res.status(400).json({
            message: `this ${checkphone.phoneNumber} phone number already in use`,
          });
        }
      }
    }
    // handle old reservation passengers if they are not in the new reservation (remove flightIDs from their documents)
    for (const item2 of reservation.passengers) {
      if (!newPassArray.includes(item2.email)) {
        const oldPassenger = await Passenger.findOne({ email: item2.email });
        const index = oldPassenger.flights.indexOf(reservation.flight);
        if (index > -1) {
          // only splice array when item is found
          oldPassenger.flights.splice(index, 1); // 2nd parameter means remove one item only
          oldPassenger.save();
        }
      }
    } //! HANDLE PASSENGERS ENDS //////////////////////////////////

    // Update the reservation
    const newReservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    return res.status(200).json(newReservation);
  } else if (!reservation) {
    return res.status(404).json({
      mesage: "There is not a reservation with this id!.",
    });
  } else {
    return res.status(401).json({
      mesage: "You do not have permission to access this reservation.",
    });
  }
};

// @desc    Delete Reservation
// @route   DELETE /api/resv/:id
// @access  Protected
const deleteReservation = async (req, res) => {
  const reservation = await Reservation.findById(req.params.id).populate(
    "flight"
  );
  if (
    (reservation && req.user.userRole === "staffUser") ||
    (reservation && req.user.id == reservation.user)
  ) {

    // Remove flight from passengers document
    for (const item of reservation.passengers) {
      const passenger = await Passenger.findOne({ email: item.email });
      let i = 0;
      while (i < passenger.flights.length) {
        if (passenger.flights[i] === reservation.flight.id) {
          passenger.flights.splice(i, 1);
          passenger.save();
        } else {
          ++i;
        }
      }
    }

    const deletedReservation = await Reservation.findByIdAndDelete(
      req.params.id
    );
    return res.status(200).json({
      message: "Reservation successfully deleted",
      deletedReservation,
    });
  } else if (!reservation) {
    return res.status(404).json({
      mesage: "There is not a reservation with this id!.",
    });
  } else {
    return res.status(404).json({
      mesage: "You do not have permission to access this reservation.",
    });
  }
};

module.exports = {
  makeReservation,
  getReservations,
  retrieveReservation,
  updateReservation,
  deleteReservation,
};
