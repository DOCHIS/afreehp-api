var alertbox_idx = window.location.href.split("/").pop().replace("x8bYmqSVwJY", "");
var ws = null;  // WebSocket 연결을 저장하는 변수
var cmdQueue = [];  // cmd 데이터를 저장하는 큐
var isConnected = false;  // WebSocket 연결 상태를 저장하는 변수
var joinTimeout = null;  // JOIN 응답 타임아웃을 저장하는 변수
var lastActivity = Date.now();  // 마지막 활동 시간을 저장하는 변수

// WebSocket 연결을 초기화하는 함수
var initWebSocket = function() {
    ws = new WebSocket(WS_URL);
    
    // 연결이 성공하면 init 이벤트를 전송
    ws.onopen = function() {
        console.log('WebSocket 연결 성공');
        ws.send("JOIN\t" + JSON.stringify({alertbox_idx: alertbox_idx, rooms: []}));  // Init 이벤트 전송
        lastActivity = Date.now();  // 마지막 활동 시간 갱신
        joinTimeout = setTimeout(function() {
            if (!isConnected) {
                console.log('JOIN 응답 없음. 연결 끊고 재시도...');
                ws.close();
            }
        }, 5000);  // 5초 후에 JOIN 응답을 체크
    };

    // 메시지를 수신하면 연결 상태를 확인
    ws.onmessage = function(event) {
        lastActivity = Date.now();  // 마지막 활동 시간 갱신
        if (event.data === "JOIN\tSUCCESS") {
            console.log('WebSocket 정상 연결 확인');
            isConnected = true;
            clearTimeout(joinTimeout);  // JOIN 응답 타임아웃을 취소
            sendData();
        }
    };

    // 연결이 끊어지면 재연결 시도
    ws.onclose = function() {
        console.log('WebSocket 연결 끊김. 재연결 시도...');
        isConnected = false;
        setTimeout(initWebSocket, 5000);  // 5초 후에 재연결 시도
    };
}

// cmd 데이터를 큐에 저장하는 함수
var collectCmd = function(type, data) {
    cmdQueue.push({type, data});
}

// 큐에서 데이터를 꺼내 WebSocket으로 전송하는 함수
var sendData = function() {
    var currentTime = Date.now();
    if (currentTime - lastActivity > 30000 && isConnected) {  // 30초 동안 활동이 없으면 PING 메시지 전송
        ws.send("PING\t{}");
        lastActivity = currentTime;  // 마지막 활동 시간 갱신
    } else if (ws.readyState === WebSocket.OPEN && cmdQueue.length > 0 && isConnected) {
        var cmdData = cmdQueue.shift();
        ws.send("CMD" + "\t" + JSON.stringify(cmdData.data));
        lastActivity = currentTime;  // 마지막 활동 시간 갱신
    }

    // 다음 데이터 전송을 위해 스케줄링
    setTimeout(sendData, 100);  // 0.1초마다 데이터 전송
}

initWebSocket();
