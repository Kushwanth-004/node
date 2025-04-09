const express = require("express");
const { userAuth } = require("../middlewares/Auth");
const requestRouter = express.Router();
const { connectionRequestModel } = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params.status;
      const toUserId = req.params.toUserId;
      const fromUserId = req.user._id;


      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.json({
          message: "Invalid status type : " + status,
        });
      }

      const toUser = await User.findById(toUserId);
      if (!toUser) {
        return res.send("user is not valid");
      }

      const existingConnectionRequest = await connectionRequestModel.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res.json({
          message: "connection request is already exists",
        });
      }

      const connectionRequest = new connectionRequestModel({
        status,
        fromUserId,
        toUserId,
      });

      const data = await connectionRequest.save();
      res.json({
        message: "connection request sent succesfully",
        data,
      });
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "status is not valid" });
      }

      const connectionRequest = await connectionRequestModel.findOne({
        status: "interested",
        toUserId: loggedInUser._id,
        _id: requestId,
      });
      if (!connectionRequest) {
        return res.status(400).json({
          message: "Connection request not found",
        });
      }
      connectionRequest.status = status;
      const data = await connectionRequest.save();
      res.json({
        message: "connection request " + status,
        data,
      });
    } catch (err) {
      res.send(err.message);
    }
  }
);

module.exports = {
  requestRouter,
};
