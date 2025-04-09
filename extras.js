/*
here i will paste the practise codde and the code that i have re formateedc


app.delete("/user", async (req, res) => {
  try {
    const ans = await User.findByIdAndDelete(req.body.id);
    if (ans === null) {
      res.send("user not exist ..");
    }
    res.send("Deleted successfully .. ");
  } catch (err) {
    res.status(404).send("Something went wrong !!");
  }
});

app.patch("/user", async (req, res) => {
  const data = req.body;
  const id = req.body.userId;

  try {
    const ALLOWED_FIELDS = ["about", "photoUrl", "skills"];
    const isUpdatedAllowed = Object.keys(data).every((k) => {
      ALLOWED_FIELDS.includes(k);
    });
    if (!isUpdatedAllowed) {
      throw new Error("update not allowed");
    }
    const a = await User.findByIdAndUpdate(id, data, { runValidators: true });
    // console.log(a);
    res.send("Updated successfully .. ");
  } catch (err) {
    res.status(400).send("Update failed ..");
  }
});







app.get("/feed", async (req, res) => {
  const name = req.body.firstName;

  try {
    const data = await User.findOne({});
    if (data.length === 0) {
      res.send("Data not found in the DB");
    } else {
      res.send(data);
    }
  } catch (err) {
    res.status(404).send("Some thing went wrong ");
  }
});

*/