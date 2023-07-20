var socket = null;
var widget_id = window.location.href.split("/").pop();

function collectCmd(type, data) {
  $.ajax({
    url: "/api/collectCmd",
    type: "GET",
    data: {
      widget_id: widget_id,
      type: type,
      raw: JSON.stringify(data),
    },
    dataType: "json",
    success: function (data) {
      console.log(data);
    },
  });
}
