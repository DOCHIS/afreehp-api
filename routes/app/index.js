/**
 * root 라우팅
 */
module.exports = function (req, res) {
  if (req.headers.host === process.env.APP_HOME) {
    if (req.headers["x-forwarded-proto"] !== "https") {
      return res.redirect("https://" + req.headers.host + req.url);
    }
  }
  return res.render("landing/index");
};
