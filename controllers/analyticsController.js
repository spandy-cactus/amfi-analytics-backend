const BnyGeneral = require("../models/bnyGeneral");
const GenerateQR = require("../models/generateQR");
const PersonCounter = require("../models/personCounter");
const redis = require("../config/redisClient");
exports.getCountForLastHour = async (req, res) => {
  const busIds = req.body.selectedBuses || {};
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - 60 * 60 * 1000); // 1 hour ago

  // Generate 10-minute intervals for the last hour
  const intervals = [];
  const labels = [];
  let current = new Date(startTime);

  while (current < endTime) {
    const startInterval = new Date(current);
    const endInterval = new Date(current.getTime() + 10 * 60 * 1000); // End of the 10-minute interval

    intervals.push({ start: startInterval, end: endInterval });
    labels.push(
      new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata", // IST timezone
      }).format(endInterval)
    );

    current = new Date(current.getTime() + 10 * 60 * 1000); // Move to the next 10-minute interval
  }

  // Query the database for each interval
  const counts = await Promise.all(
    intervals.map(async ({ start, end }) => {
      let query = {
        created_at: { $gte: start, $lt: end },
      };

      // If busIds is provided and not empty, add it to the query
      if (busIds[0] !== "all") {
        query.macAddress = { $in: busIds };
      }

      const count = await BnyGeneral.countDocuments(query);
      return count;
    })
  );

  res.json({ labels, counts });
};

exports.getCountForLastSixHours = async (req, res) => {
  const busIds = req.body.selectedBuses || {};
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - 5 * 60 * 60 * 1000); // 6 hours ago

  // Generate time intervals (1-hour intervals for the last 6 hours)
  const intervals = [];
  const labels = [];
  let current = new Date(startTime);

  while (current < endTime) {
    const startInterval = new Date(current);
    const endInterval = new Date(current.getTime() + 60 * 60 * 1000); // End of the current hour

    intervals.push({ start: startInterval, end: endInterval });
    labels.push(
      new Intl.DateTimeFormat("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata", // IST timezone
      }).format(endInterval)
    );

    current = new Date(current.getTime() + 60 * 60 * 1000); // Move to the next hour
  }

  // Query the database for each interval
  const counts = await Promise.all(
    intervals.map(async ({ start, end }) => {
      let query = {
        created_at: { $gte: start, $lt: end },
      };

      // If busIds is provided and not empty, add it to the query
      if (busIds[0] !== "all") {
        query.macAddress = { $in: busIds };
      }

      const count = await BnyGeneral.countDocuments(query);
      return count;
    })
  );

  res.json({ labels, counts });
};

exports.getCountForLastTwentyFourHours = async (req, res) => {
  const busIds = req.body.selectedBuses || {};
  const endTime = new Date();
  const startTime = new Date(endTime.getTime() - 23 * 60 * 60 * 1000); // 24 hours ago

  // Generate 1-hour intervals for the last 24 hours
  const intervals = [];
  const labels = [];
  let current = new Date(startTime);

  while (current <= endTime) {
    const startInterval = new Date(current);
    const endInterval = new Date(current.getTime() + 60 * 60 * 1000); // End of the 1-hour interval

    intervals.push({ start: startInterval, end: endInterval });
    labels.push(
      new Intl.DateTimeFormat("en-US", {
        // day: "2-digit",
        // month: "short",

        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Kolkata", // IST timezone
      }).format(endInterval)
    );

    current = new Date(current.getTime() + 60 * 60 * 1000); // Move to the next 1-hour interval
  }

  // Query the database for each interval
  const counts = await Promise.all(
    intervals.map(async ({ start, end }) => {
      let query = {
        created_at: { $gte: start, $lt: end },
      };

      // If busIds is provided and not empty, add it to the query
      if (busIds[0] !== "all") {
        query.macAddress = { $in: busIds };
      }

      const count = await BnyGeneral.countDocuments(query);
      return count;
    })
  );

  res.json({ labels, counts });
};

exports.getCountForLastMonth = async (req, res) => {
  const busIds = req.body.selectedBuses || {};
  const endTime = new Date();
  const startTime = new Date(
    endTime.getFullYear(),
    endTime.getMonth() - 1,
    endTime.getDate()
  ); // 1 month ago

  // Generate 4-hour intervals for the last month
  const intervals = [];
  const labels = [];
  let current = new Date(startTime);

  while (current < endTime) {
    const startInterval = new Date(current);
    const endInterval = new Date(current.getTime() + 24 * 60 * 60 * 1000);

    intervals.push({ start: startInterval, end: endInterval });
    labels.push(
      new Intl.DateTimeFormat("en-US", {
        day: "2-digit",
        month: "short",
        hour12: false,
        timeZone: "Asia/Kolkata", // IST timezone
      }).format(startInterval)
    );

    current = new Date(current.getTime() + 24 * 60 * 60 * 1000);
  }

  // Query the database for each interval
  const counts = await Promise.all(
    intervals.map(async ({ start, end }) => {
      let query = {
        created_at: { $gte: start, $lt: end },
      };

      // If busIds is provided and not empty, add it to the query
      if (busIds[0] !== "all") {
        query.macAddress = { $in: busIds };
      }

      const count = await BnyGeneral.countDocuments(query);
      return count;
    })
  );

  res.json({ labels, counts });
};

exports.getCountForLastYear = async (req, res) => {
  const busIds = req.body.selectedBuses || {};

  const endTime = new Date(); // Current date
  const startTime = new Date(
    endTime.getFullYear() - 1,
    endTime.getMonth() + 1,
    1
  );

  // Generate time points (1-month intervals for the last year)
  const intervals = [];
  const labels = [];
  let current = new Date(startTime);

  while (current < endTime) {
    const startInterval = new Date(current);
    const endInterval = new Date(
      current.getFullYear(),
      current.getMonth() + 1,
      1
    ); // Start of the next month

    intervals.push({ start: startInterval, end: endInterval });
    labels.push(
      new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        timeZone: "Asia/Kolkata",
      }).format(startInterval)
    );

    current.setMonth(current.getMonth() + 1); // Move to the next month
  }

  // Query the database for each interval
  const counts = await Promise.all(
    intervals.map(async ({ start, end }) => {
      let query = {
        created_at: { $gte: start, $lt: end },
      };

      // If busIds is provided and not empty, add it to the query
      if (busIds[0] !== "all") {
        query.macAddress = { $in: busIds };
      }

      const count = await BnyGeneral.countDocuments(query);
      return count;
    })
  );

  res.json({ labels, counts });
};

exports.getCountByRange = async (req, res) => {
  switch (req.params.range) {
    case "1":
      return exports.getCountForLastHour(req, res);
    case "6":
      return exports.getCountForLastSixHours(req, res);
    case "24":
      return exports.getCountForLastTwentyFourHours(req, res);
    case "720":
      return exports.getCountForLastMonth(req, res);
    case "8760":
      return exports.getCountForLastYear(req, res);
    default:
      return exports.getCountForLastHour(req, res);
  }
};

exports.getFaceDetectionCount = async (req, res) => {
  const busIds = req.body.selectedBuses || {};
  const query = {};

  if (busIds[0] !== "all") {
    query.macAddress = { $in: busIds };
  }
  try {
    const count = await BnyGeneral.countDocuments(query);
    res.status(200).json(count);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getMascotCount = async (req, res) => {
  const busIds = req.body.selectedBuses || {};

  const query = {};

  if (busIds[0] !== "all") {
    query.macAddress = { $in: busIds };
  }

  const cacheKey = `mascotCount:${busIds.join("").toString()}`;
  const cached = await redis.get(cacheKey);

  if (cached) {
    res.status(200).json(JSON.parse(cached));
    return;
  }

  try {
    const generateQR = await GenerateQR.find(query, { mascot: 1 });
    const sachinCount = generateQR.filter((fd) => fd.mascot === 0).length;
    const rohitCount = generateQR.filter((fd) => fd.mascot === 1).length;
    const dhoniCount = generateQR.filter((fd) => fd.mascot === 2).length;

    const response = {
      totalCount: generateQR.length,
      cricketer: {
        sachin: sachinCount,
        rohit: rohitCount,
        dhoni: dhoniCount,
      },
    };

    await redis.scan(0, "match", "mascotCount:*").then((keys) => {
      for (const key of keys) {
        if (key.length > 0) {
          redis.del(key);
        }
      }
    });

    await redis.setex(cacheKey, 60 * 60, JSON.stringify(response));

    res.status(200).json(response);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPersonCount = async (req, res) => {
  const busIds = req.body.selectedBuses || {};
  const query = {};

  if (busIds[0] !== "all") {
    query.macAddress = { $in: busIds };
  }
  try {
    const personCount = await PersonCounter.findOne(query);
    res.status(200).json(personCount ? personCount.counter : 0);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

exports.getFeedbackCount = async (req, res) => {
  const busIds = req.body.selectedBuses || {};
  const query = {};

  if (busIds[0] !== "all") {
    query.macAddress = { $in: busIds };
  }
  try {
    const count = await Feedback.countDocuments(query);
    res.status(200).json(count);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
