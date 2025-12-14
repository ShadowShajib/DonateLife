const express = require("express");

const {
  getRegisterPage,
  postRegisterPage,
  getHospitalRegisterPage,
  registerHospital,
  // verifyEmail,
} = require("../controllers/register.controller.js");

const router = express.Router();

router.get("/", getRegisterPage);

router.get('/hospital', getHospitalRegisterPage)

router.post("/", postRegisterPage);

router.post('/hospital', registerHospital)

// router.get("/verify-email", verifyEmail);


// Forward geocoding (search)
router.get("/search-location", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Query required" });

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        "User-Agent": "BloodApp/1.0 (eakramul.karim.cse@gmail.com)"
      }
    });
    const data = await response.json();
    // checker log
    console.log(data);
    res.json(data);
  } catch (err) {
    console.error("Forward geocode error:", err);
    res.status(500).json({ error: "Error fetching location" });
  }
});

router.get("/reverse-location", async (req, res) => {
  const { lat, lng } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: "Lat and Lng required" });

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`;
    const response = await fetch(url, {
      headers: {
         "User-Agent": "BloodApp/1.0 (eakramul.karim.cse@gmail.com)"
      }
    });
    const data = await response.json();
    res.json(data);
  } catch (err) {
    console.error("Reverse geocode fetch error:", err);
    res.status(500).json({ error: "Error fetching location" });
  }
});



module.exports = router;
