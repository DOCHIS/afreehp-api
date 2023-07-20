# Dynamodb 설계문서
dynamodb는 AWS의 권장사항에 따라 Single Table Design을 채택하였습니다. 이 디자인 방식 채택을 통해 읽기/쓰기 용량을 효율적으로 관리할 수 있습니다.

## ER 다이어그램
[ER 다이어그램](https://dbdiagram.io/d/64b926a402bd1c4a5e68e063)

## PK & SK
|모델|PK|SK|Description|
|---|---|---|---|
|alertbox|ALERTBOX#{ID}|ALERTBOX#{ID}|Alert Box 정보|
|||CMD#{ID}|Alert Box Cmd 정보|
|socket|SOCKET|CONNECTION#{ID}|Socket Connection 정보|
|||ROOM#{ID}|Socket Room 정보|

## 엑세스 패턴
|#|Access Patterns|Table/GSI/LSI|Key Condition|Server Side Filter|
|---|---|---|---|---|
|1|특정 Alert Box 조회|table|PK="ALERTBOX#{ID}" and SK="ALERTBOX#{ID}"|N/A|
|2|특정 Alert Box Cmd 조회|table|PK="ALERTBOX#{ID}" and BEGIN_WITH(SK, "CMD#")|N/A|
|3|특정 Alert Box에서 특정 Type의 Cmd 조회|table|PK="ALERTBOX#{ID}"|특정 Type에 대한 필터링|
|4|특정 Alert Box에서 특정 플랫폼의 Cmd 조회|table|PK="ALERTBOX#{ID}"|특정 플랫폼에 대한 필터링|
|5|특정 Alert Box에서 최신 Cmd 조회|table|PK="ALERTBOX#{ID}"|N/A|
|6|전체 Connections 조회|table|PK="SOCKET" and BEGIN_WITH(SK, "CONNECTION#")|N/A|
|7|특정 Socket Connections 조회|table|PK="SOCKET" and SK = "CONNECTIONS#{ID}"|N/A|
|8|특정 Connection이 가입 된 ROOM 조회|table|PK="SOCKET" and BEGIN_WITH(SK, "ROOM#")|N/A|
|9|특정 Room에 가입 된 Connections 조회|table|PK="SOCKET" and SK = "ROOM#{ID}"|N/A|