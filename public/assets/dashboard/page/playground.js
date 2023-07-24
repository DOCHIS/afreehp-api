var WS_URL = "wss://1u34vaowee.execute-api.ap-northeast-2.amazonaws.com/dev"; // WebSocket URL
var ws = null; // WebSocket 연결을 저장하는 변수
var cmdQueue = []; // cmd 데이터를 저장하는 큐
var isConnected = false; // WebSocket 연결 상태를 저장하는 변수
var isJoined = false; // JOIN 응답 상태를 저장하는 변수
var lastActivity = Date.now(); // 마지막 활동 시간을 저장하는 변수
var socketLogs = $("#socketLogs");
var chatHistoryBody = $(".chat-history-body");
var joinTimeout = null; // JOIN 응답 타임아웃

/**
 * 현재 시간 YYY-MM-DD HH:MM:SS 형식으로 반환
 */
function getNow() {
  var date = new Date();
  var hour = date.getHours();
  var minute = date.getMinutes();
  var second = date.getSeconds();

  hour = hour >= 10 ? hour : "0" + hour;
  minute = minute >= 10 ? minute : "0" + minute;
  second = second >= 10 ? second : "0" + second;

  return hour + ":" + minute + ":" + second;
}

/**
 * 소켓 미리보기 처리용 함수
 * @param {string} source | server, client, local
 * @param {string} msg | 메시지
 */
function writeSocketLog(source, msg) {
  var sourceClass;

  if (source == "local") {
    var log =
      '<li class="chat-message" style="justify-content: center">' +
      msg +
      "</li>";
  } else {
    var sourceClass =
      source == "server" ? "chat-message-left" : "chat-message-right";
    var log = '<li class="chat-message ' + sourceClass + '">';
    log += '<div class="d-flex overflow-hidden">';
    log += '<div class="chat-message-wrapper flex-grow-1">';
    log += '<div class="chat-message-text">';
    log += '<p class="mb-0" style="word-break: break-all">' + msg + "</p>";
    log += "</div>";
    log += "<div class='text-end text-muted mt-1'>";
    log += '<i class="bx bx-check-double text-success"></i>';
    log += "<small>" + getNow() + "</small>";
    log += "</div>";
    log += "</div>";
    log += "</div>";
    log += "</li>";
  }

  socketLogs.append(log);
  chatHistoryBody.scrollTop(chatHistoryBody[0].scrollHeight);
}

/**
 * 소켓 연결
 */

// WebSocket 연결을 초기화하는 함수
var initWebSocket = function () {
  writeSocketLog("local", "새로운 소켓 연결중...");
  ws = new WebSocket(WS_URL);

  // 연결이 성공하면 init 이벤트를 전송
  ws.onopen = function () {
    writeSocketLog("local", "소켓 연결 성공");
    lastActivity = Date.now(); // 마지막 활동 시간 갱신
    isConnected = true;
  };

  // 메시지를 수신하면 연결 상태를 확인
  ws.onmessage = function (event) {
    writeSocketLog("server", event.data);
    lastActivity = Date.now(); // 마지막 활동 시간 갱신

    // JOIN 응답체크
    if (event.data == "JOIN\tSUCCESS") {
      isJoined = true;
      clearTimeout(joinTimeout);
    }
  };

  // 연결이 끊어지면 재연결 시도
  ws.onclose = function () {
    isConnected = false;
    joinTimeout = setTimeout(initWebSocket, 5000); // 5초 후에 재연결 시도
    writeSocketLog("local", "소켓 연결 끊김. 5초 뒤 재연결 시도예정");
  };
};
initWebSocket();

/**
 * 서버로 이벤트 전송
 * @param {string} type | 이벤트 타입
 * @param {object} data | 이벤트 데이터
 * @param {boolean} isLog | 소켓 미리보기 여부
 */
function sendEvent(type, data, isLog) {
  if (!isConnected) {
    toastr.error("소켓이 연결되어있지 않습니다", "잠시 후 다시 시도해주세요");
    return;
  }

  if (isLog) {
    writeSocketLog("client", type + "\t" + JSON.stringify(data));
  }

  ws.send(type + "\t" + JSON.stringify(data));
  lastActivity = Date.now(); // 마지막 활동 시간 갱신
}

/**
 * 설정폼 이벤트 처리
 */
$("#configForm").submit(function (e) {
  e.preventDefault();
  clearTimeout(joinTimeout);

  var alertbox_idx = $("#alertbox_idx").val();
  var rooms = [];

  if (
    $("input[name=join_room]").length ===
    $("input[name=join_room]:checked").length
  )
    rooms.push(alertbox_idx + "-ALL");
  else
    $("input[name=join_room]:checked").each(function () {
      rooms.push(alertbox_idx + "-" + $(this).val());
    });

  if (isConnected) {
    isJoined = false;
    sendEvent("JOIN", { alertbox_idx, rooms }, true);

    // 5초 안에 JOIN 응답이 없으면 재연결 시도
    setTimeout(function () {
      if (!isJoined) {
        writeSocketLog("local", "JOIN 응답이 없어 소켓을 재연결합니다");
        initWebSocket();
      }
    }, 5000);
  } else {
    toastr.error("소켓이 연결되어있지 않습니다");
  }

  return false;
});

/**
 * 테스트 이벤트 처리
 */
$("#testForm").submit(function (e) {
  e.preventDefault();

  if (!isConnected) {
    toastr.error("소켓이 연결되어있지 않습니다");
    return false;
  }

  if (!isJoined) {
    toastr.error("JOIN이 완료되지 않았습니다");
    return false;
  }

  var test_event = $("#test_event").val();
  var test_amount = parseInt($("#test_amount").val());
  var test_id = $("#test_id").val();
  var test_name = $("#test_name").val();
  var test_msg = $("#test_msg").val();
  var data = "";

  // 이벤트 설정
  switch (test_event) {
    case "donation":
      data =
        '{"broad":"afreeca","main":true,"type":"SENDBALLOON","value":{test_amount},"join":0,"msg":"{test_msg}","id":"{test_id}","name":"{test_name}"}';
      break;
    case "chat":
      data =
        '{"broad":"afreeca","main":true,"type":"chat","gender":"m","hidegender":false,"agent":"pc","quick":"quick","grade":"fan","support":"","fanclub":"fanclub","follow":"","period":1,"id":"{test_id}","name":"{test_name}.","msg":"{test_msg}"}';
      break;
  }

  // {} 치환
  data = data.replace(/{test_amount}/g, test_amount);
  data = data.replace(/{test_id}/g, test_id);
  data = data.replace(/{test_name}/g, test_name);
  data = data.replace(/{test_msg}/g, test_msg);

  // 이벤트 전송
  console.log(">> sendEvent", data);
  sendEvent("CMD", JSON.parse(data), false);

  writeSocketLog("local", "테스트 이벤트 전송 완료");
  return false;
});

/**
 * 채팅 히스토리 clean
 */
$("#socketLogsClean").click(function () {
  $("#socketLogs").html("");
});