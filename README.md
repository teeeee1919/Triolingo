# Triolingo
# 쉬운 수학 학습

과목 → 학년 → 단원을 고르면 개념 설명, 계산 꿀팁, 예제 풀이를 볼 수 있는 학습 사이트입니다.
빌드 과정 없이 정적 파일만으로 동작합니다.

## 현재 상태
- 수학: 고1 (공통수학1·2) 7개 단원
- 나머지 학년/과목은 "준비 중"으로 표시됩니다.

## GitHub Pages로 배포하기
1. 이 폴더의 파일을 GitHub 저장소 루트에 올립니다.
2. 저장소 **Settings → Pages** 에서 Source를 `Deploy from a branch`, Branch를 `main` / `(root)` 로 선택합니다.
3. 잠시 뒤 `https://<아이디>.github.io/<저장소명>/` 에서 확인할 수 있습니다.

로컬에서 확인하려면 폴더에서 `python3 -m http.server` 를 실행하고 `http://localhost:8000` 으로 접속하세요.

## 파일 구성
| 파일 | 역할 |
| --- | --- |
| `index.html` | 페이지 틀 |
| `style.css` | 디자인 |
| `app.js` | 화면 전환(과목/학년/단원/상세) |
| `data-math-high1.js` | 고1 수학 단원 내용 |

## 새 학년 추가하기
1. `data-math-high1.js` 를 복사해 `data-math-high2.js` 처럼 만들고 `window.MATH_HIGH2` 로 이름을 바꿉니다.
2. `index.html` 에 `<script src="data-math-high2.js"></script>` 를 추가합니다.
3. `app.js` 의 `READY_GRADES` 에 `h2: window.MATH_HIGH2` 를 추가합니다.

수식은 KaTeX 문법(`$...$`, `$$...$$`)을 사용합니다.
