/**
 * 기본 프록시
 */
module.exports = function (req, res) {
  let template = "dashboard/" + req.path.replace("/dashboard/", "");
  if (template == "dashboard/") template = "dashboard/index";

  let params = {
    head: {
      title: "아프리카 도우미",
      description: "",
      keywords: "",
    },
  };

  return res.render(template, params);
};
