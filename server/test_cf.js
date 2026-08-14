const { Cashfree, CFEnvironment } = require("cashfree-pg");

try {
  const cashfree = new Cashfree(
    CFEnvironment?.SANDBOX || "SANDBOX",
    "test_id",
    "test_secret"
  );
  console.log("Success with new Cashfree()");
} catch (e) {
  console.log("Error with new Cashfree():", e.message);
  try {
    Cashfree.XClientId = "test_id";
    Cashfree.XClientSecret = "test_secret";
    Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;
    console.log("Success with Cashfree.XClientId");
  } catch (err) {
    console.log("Error with static Cashfree:", err.message);
  }
}
