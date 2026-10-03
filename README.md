# 11th_WebServer_A

SWU UMC 11기 Web Server A팀 스터디 레포지토리입니다.
<br>매주 워크북의 실습과 미션을 각자 구현하고, Pull Request로 공유합니다.

<br>

## 👥 팀원

<table>
  <tr>
    <td align="center">
      <img src="https://github.com/ammgree.png" width="120"><br/>
      <b>베리 / 엄규리</b><br/>
      <a href="https://github.com/ammgree">@ammgree</a>
    </td>
    <td align="center">
      <img src="https://github.com/llszos.png" width="120"><br/>
      <b>미니 / 김민주</b><br/>
      <a href="https://github.com/llszos">@llszos</a>
    </td>
    <td align="center">
      <b>지야 / 한지희</b>
    </td>
    <td align="center">
      <img src="https://github.com/LEle-donut91.png" width="120"><br/>
      <b>애플 / 이석현</b><br/>
      <a href="https://github.com/LEle-donut91">@LEle-donut91</a>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="https://github.com/dahliare.png" width="120"><br/>
      <b>달이 / 서영은</b><br/>
      <a href="https://github.com/dahliare">@dahliare</a>
    </td>
    <td align="center">
      <img src="https://github.com/uijin219.png" width="120"><br/>
      <b>으잔 / 성의진</b><br/>
      <a href="https://github.com/uijin219">@uijin219</a>
    </td>
    <td align="center">
      <img src="https://github.com/yoons-art.png" width="120"><br/>
      <b>셀린 / 윤성은</b><br/>
      <a href="https://github.com/yoons-art">@yoons-art</a>
    </td>
    <td></td>
  </tr>
</table>

<br>

## 🛠 기술 스택

| 구분 | 스택 |
| --- | --- |
| Framework (택 1) | ![Spring Boot](https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white) ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white) |
| Database | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white) |
| API 테스트 | ![Postman](https://img.shields.io/badge/Postman-FF6C37?style=for-the-badge&logo=postman&logoColor=white) |
<br>

## 📁 폴더 구조

각자 `닉네임/weekN/` 폴더를 만들어 그 안에서 작업합니다. 닉네임은 영문 소문자로 씁니다.

```
11th_WebServer_A/
├── apple/
│   ├── week3/
│   └── week4/
├── mini/
│   ├── week3/
│   └── week4/
└── ...
```

<br>

## 🌿 Git 작업 순서

본인의 브랜치에서만 작업하고, `main` 브랜치는 직접 수정하지 않습니다.

#### 1. 최신 main 받아오기

```sh
git switch main
git pull origin main
```

#### 2. 주차별 브랜치 만들기

```sh
git switch -c <닉네임>/week<N>
```

#### 3. 변경 사항 확인 후 추가

```sh
git status
git add <닉네임>/week<N>
```

#### 4. 커밋

```sh
git commit -m "Commit Message"
```

#### 5. 원격 저장소에 본인 브랜치로 푸시

```sh
git push origin <브랜치명>
```

#### 6. Pull Request 생성 및 Merge

GitHub에서 본인 브랜치 → `main`으로 PR을 생성하고, 본인이 직접 Merge합니다.

<br>

## 📝 Convention

### Branch

브랜치는 `닉네임/weekN` 형식으로 생성합니다.

| 규칙 | 설명 | 예시 |
| --- | --- | --- |
| 닉네임 | 영문 소문자 닉네임 | `apple`, `mini` |
| weekN | 미션 주차 번호 | `week3`, `week4` |
| 구분자 | 슬래시(`/`)로 닉네임과 주차 구분 | `mini/week4` |

### Commit

커밋 메시지는 `타입: 설명` 형식을 권장합니다. 설명은 무엇을 했는지 알 수 있게 자유롭게 작성합니다.

| 타입 | 설명 |
| --- | --- |
| feat | 새로운 기능 추가 |
| fix | 버그 수정 |
| refactor | 코드 리팩토링 |
| docs | 문서 수정 (README 등) |
| style | 코드 스타일 변경 (포맷팅, 세미콜론 등) |
| chore | 빌드 및 패키지 설정 변경 |
| test | 테스트 코드 추가 |

```sh
git commit -m "feat: 3주차 미션 도서 조회 API 구현"
git commit -m "fix: 4주차 미션 카테고리 예외 처리 수정"
```

### Pull Request

- PR은 주차별로 생성합니다.
- PR 제목은 몇 주차인지와 작업 내용을 알 수 있게 자유롭게 작성합니다.
  - 예: `[Week4] JPA 기반 도서 API 리팩터링`, `4주차 미션`
- 본문에는 작업 내용과 실행 결과를 적습니다.
- 본인 폴더(`닉네임/`) 안의 파일만 수정합니다.
- PR은 작성자 본인이 직접 `main`에 Merge합니다.

<br>

## ⚠️ 주의 사항

- DB 비밀번호 같은 민감한 정보는 커밋하지 않습니다. 환경 변수나 `.env` 파일로 분리하고, `.env`는 `.gitignore`에 추가합니다.
- IDE 설정과 빌드 결과물(`.idea/`, `build/`, `node_modules/`, `dist/` 등)은 커밋하지 않습니다.
