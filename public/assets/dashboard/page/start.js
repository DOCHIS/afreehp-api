$("#startForm").submit(function (e) {
  e.preventDefault();

  var form = $(this);
  var method = form.attr("method");
  var url = form.attr("action");
  var widgetUrl = form.find("input[name=widgetUrl]").val();

  form.find(".invalid-feedback").hide();
  form.find("input").removeClass("is-invalid");

  if (widgetUrl == "") {
    form.find(".invalid-feedback").text("위젯 URL을 입력해주세요.").show();
    form.find("input[name=widgetUrl]").addClass("is-invalid").focus();
    return false;
  }

  $.ajax({
    type: method,
    url: url,
    contentType: "application/json",
    data: JSON.stringify({ widgetUrl: widgetUrl }),
    success: function (res) {
      if (res.success) {
        location.href = "/dashboard";
      } else {
        form.find(".invalid-feedback").text(res.message).show();
        form.find("input[name=widgetUrl]").addClass("is-invalid").focus();
      }
    },
    error: function (e) {
      form.find(".invalid-feedback").text("서버와의 통신에 실패했습니다.");
    },
  });

  return false;
});
