// routes/request.route.js
const express = require("express");
const router = express.Router();
const BloodRequest = require("../models/BloodRequest");

// Show request form
router.get("/create", (req, res) => {
  res.render("request-form", { googleClientKey: process.env.GOOGLE_CLIENT_API_KEY });
});

// Handle request submit
router.post("/create", async (req, res) => {
  try {
    const { bloodgroup, phone, bags, description, lat, lng } = req.body;

    if (!bloodgroup || !lat || !lng) {
      return res.status(400).send("Missing required fields");
    }

    const locationPoint = {
      type: "Point",
      coordinates: [parseFloat(lng), parseFloat(lat)] // [lng, lat]
    };

    const newReq = new BloodRequest({
      bloodgroup,
      phone,
      bags,
      description,
      location: locationPoint
    });

    const saved = await newReq.save();

    // after saving → show matches
    return res.redirect(`/request/result/${saved._id}`);

  } catch (err) {
    console.error(err);
    return res.status(500).send("Error saving request");
  }
});

module.exports = router;
