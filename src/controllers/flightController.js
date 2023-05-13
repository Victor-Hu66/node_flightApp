const Flights = require("../models/flightModel");
const dayjs = require("dayjs");

// @desc    Get fligths
// @route   GET /api/flights
// @access  Public
const getFlights = async (req, res) => {
  try {
    if (req.user?.userRole === "staffUser") {
      const flights = await Flights.find();
      res.status(200).json(flights);
    } else {
      const now = new Date();
      const flights = await Flights.find({ dateofDeparture: { $gt: now } });
      res.status(200).json(flights);
    }
  } catch (error) {
    res.status(500).json({ message: "something went wrong" });
  }
};

// @desc    Set fligth
// @route   POST /api/flights
// @access  Private
const setFlights = async (req, res) => {
  const {
    flightNumber,
    operatingAirlines,
    departureCity,
    arrivalCity,
    dateofDeparture,
  } = req.body;

  const isValidFormat = dayjs(dateofDeparture).isValid();
  const now = new Date();

  const isComingDate = dayjs(dateofDeparture).diff(dayjs(now)) > 0;

  if (isValidFormat && isComingDate) {
    const flight = await Flights.create({
      flightNumber,
      operatingAirlines,
      departureCity,
      arrivalCity,
      dateofDeparture,
    });
    return res.status(200).json(flight);
  } else {
    return res.status(400).json({ error: "Please check date" });
  }
};

// @desc    Update flights
// @route   PUT /api/flights
// @access  Private
const updateFlights = async (req, res) => {
  const flight = await Flights.findById(req.params.id);
  if (!flight) {
    res.status(400);
    throw new Error("Flight not found");
  }

  const updatedFlight = await Flights.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.status(200).json(updatedFlight);
};

// @desc    Delete flights
// @route   Delete /api/flights
// @access  Private
const deleteFlights = async (req, res) => {
  const flight = await Flights.findById(req.params.id);
  if (!flight) {
    res.status(400);
    throw new Error("Flight not found");
  }

  const deletedFlight = await Flights.findByIdAndDelete(req.params.id);
  res
    .status(200)
    .json({ Message: "Flight deleted successfully", deletedFlight });
};


module.exports = {
  getFlights,
  setFlights,
  updateFlights,
  deleteFlights,
};
