// controllers/match.controller.js
const BloodDonation = require('../models/BloodDonation');
const BloodRequest = require('../models/BloodRequest');

/**
 * GET /match/:requestId
 * Find donors that match the bloodgroup of the request and are within 25 km,
 * sorted by distance (nearest first). Returns JSON:
 * { donors: [ { ...donorDoc..., distanceMeters: <number> }, ... ] }
 */
exports.matchDonorsByDistance = async (req, res) => {
  try {
    const requestId = req.params.requestId;
    if (!requestId) return res.status(400).json({ error: 'Missing requestId parameter' });

    const request = await BloodRequest.findById(requestId);
    if (!request) return res.status(404).json({ error: 'Request not found' });

    // Ensure the request has a location
    if (!request.location || !Array.isArray(request.location.coordinates) || request.location.coordinates.length < 2) {
      return res.status(400).json({ error: 'Request has no valid location coordinates' });
    }

    const [lng, lat] = request.location.coordinates;
    const radiusMeters = 25000; // 25 km

    // Use aggregation with $geoNear to compute distance in meters and filter by bloodgroup
    const results = await BloodDonation.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: [lng, lat] },
          distanceField: 'distanceMeters',
          spherical: true,
          maxDistance: radiusMeters,
          query: { bloodgroup: request.bloodgroup }
        }
      },
      { $limit: 200 } // safety cap
    ]);

    // Return the donors array (Mongoose will return plain objects via aggregate)
    return res.json({ donors: results });
  } catch (err) {
    console.error('matchDonorsByDistance error:', err);
    return res.status(500).json({ error: 'Server error' });
  }
};
