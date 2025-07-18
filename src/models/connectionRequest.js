const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      ///now we are creating ref to user collection

      required: true,
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "interested", "accepted", "rejected"],
        message: "{VALUE} is incorrect statuss type",
      },
    },
  },
  {
    timestamps: true,
  }
);

connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });

connectionRequestSchema.pre("save", function (next) {
  const connectionRequest = this;
  //check if the from user id and to id are same are not
  if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
    throw new Error(
      "from User Id and to User Id is same that is cannot send connection request to yourself"
    );
    //we can check there also but we are using to explore this method
  }
  next();
});

const connectionRequestModel = mongoose.model(
  "connectionRequest",
  connectionRequestSchema
);

module.exports = {
  connectionRequestModel,
};
