# Dynamodb 설계문서
dynamodb는 AWS의 권장사항에 따라 Single Table Design을 채택하였습니다. 이 디자인 방식 채택을 통해 읽기/쓰기 용량을 효율적으로 관리할 수 있습니다.

## 테이블 설계
![ER 다이어그램](https://raw.githubusercontent.com/dochis/afreehp-api/prod/.github/docs/statics/aws_dynamodb.png)

## PK & SK
|모델|PK|SK|Description|
|---|---|---|---|
|alertbox|ALERTBOX#{ID}|ALERTBOX#{ID}|Alert Box 정보|
|||CMD#{ID}|Alert Box Cmd 정보|
|alertbox uid|ALERTBOX|UID#{UID}|Alert Box UID 매칭 정보|
|connection|CONNECTION|CONNECTION#{ID}|Socket Connection 정보|
||CONNECTION|CONNECTION#{ID}#ROOM#{ROOM}|Connection 연결된 룸 정보|
|uuid|UUID#{ID}|UUID#{ID}|UUID 정보|

## 엑세스 패턴
|#|Access Patterns|Table/GSI/LSI|Key Condition|Filter|Server Side Filter|
|---|---|---|---|---|---|
|1|alertbox_idx를 가지고 alertbox 정보 조회|Table|PK=ALERTBOX#{ID} and SK=ALERTBOX#{ID}|N/A|N/A|
|2|alertbox_uuid를 가지고 alertbox 정보 조회|Table|PK=ALERTBOX and SK=UID#{UID}|N/A|얻은 alertbox_idx를 가지고 alertbox 정보 조회【1】|
|3|uuid를 가지고 어디에서 사용되고 있는지 조회|Table|PK=UUID#{ID} and SK=UUID#{ID}|N/A|N/A|
|4|alertbox_idx를 가지고 alertbox cmd 전체 조회|Table|PK=ALERTBOX#{ID} and begins_with(SK, "CMD#")|N/A|N/A|
|5|alertbox_idx를 가지고 특정 cmd.type의 cmd만 조회|Table|PK=ALERTBOX#{ID} and begins_with(SK, "CMD#")|cmd.type=type|N/A|
|6|connection_id를 가지고 connection 정보 조회|Table|PK=CONNECTION and SK=CONNECTION#{ID}|N/A|N/A|
|7|connection_id를 가지고 해당 connection이 연결된 룸 정보 조회|Table|PK=CONNECTION and BEGINS_WITH(SK, CONNECTION#{ID})|N/A|N/A|
|8|특정 룸를 구독하는 connection 정보 조회|Table|PK=CONNECTION|connection_room={ROOM}|N/A|