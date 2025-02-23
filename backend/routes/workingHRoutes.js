const express = require("express");
const router = express.Router();
const WorkingH = require("../model/workingH");

// Add new working hours
router.route("/add").post((req, res) => {
  const { empID, wHours } = req.body;

  const newWorkingH = new WorkingH({
    empID,
    wHours,
    date: new Date(),
    time: new Date().toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false
    })
  });

  newWorkingH
    .save()
    .then(() => {
      res.json("Working hours uploaded successfully");
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ error: err.message });
    });
});

// Fetch all working hours
router.route("/").get((req, res) => {
  WorkingH.find()
    .then((workingHours) => {
      res.json(workingHours);
    })
    .catch((err) => {
      console.error(err);
      res
        .status(500)
        .send({ status: "Error fetching working hours", error: err.message });
    });
});

// Fetch working hours by ID
router.route("/get/:id").get(async (req, res) => {
  try {
    let workingHID = req.params.id;
    const workingH = await WorkingH.findById(workingHID);
    if (!workingH) {
      return res.status(404).send({ status: "Working hours not found" });
    }

    res
      .status(200)
      .send({ status: "Working hours fetched", workingH: workingH });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ status: "Error fetching working hours", error: err.message });
  }
});

// Fetch all working hours by empID
router.route("/getByEmpID").get(async (req, res) => {
  try {
    let empID = req.body.empID;
    const workingH = await WorkingH.find({ empID: empID });

    if (!workingH || workingH.length === 0) {
      return res.status(404).send({ status: "Working hours not found" });
    }

    res
      .status(200)
      .send({ status: "Working hours fetched by empID", workingH: workingH });
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .send({ status: "Error fetching working hours", error: err.message });
  }
});
module.exports = router;
