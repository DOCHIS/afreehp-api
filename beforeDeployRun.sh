# ./node_modules/serverless-lift 디렉토리 내 모든 파일에서 ViewerProtocolPolicy.REDIRECT_TO_HTTPS 라는 문자를 찾아 ViewerProtocolPolicy.ALLOW_ALL로 변경하는 스크립트
# 시간이 없어 빠르게 만들었기 때문에, ViewerProtocolPolicy.REDIRECT_TO_HTTPS 라는 문자가 있는 파일만 변경하도록 만들었습니다.
# 향후 PR을 통해 더 좋은 방법으로 변경하겠습니다.

function replace_in_js_files {
  local filepath="$1"
  grep -q "ViewerProtocolPolicy.REDIRECT_TO_HTTPS" "$filepath" &&
  sed -i 's/ViewerProtocolPolicy.REDIRECT_TO_HTTPS/ViewerProtocolPolicy.ALLOW_ALL/g' "$filepath"
}

directory="./node_modules/serverless-lift"

find "$directory" -type f \( -name "*.js" -o -name "*.js.map" \) -print0 | while IFS= read -r -d '' file; do
  replace_in_js_files "$file"
done