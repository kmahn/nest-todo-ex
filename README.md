# NestJS를 이용한 Todo API

## 패키지 설치
```shell
$ npm i
```

## Start MongoDB
```shell
$ npm run docker:mongo:start
```

## env 파일 설정
프로젝트 루트의 config 폴더 아래에 다음의 파일들을 생성
* Development: .development.env
* Stage: .stage.env
* Production: .product.env

env 파일 내용
```
PORT=<사용할 API 서버 포트>
MONGO_URI=<몽고 데이터베이스 URI, 예: mongodb://localhost/todo>
JWT_SECRET=<JSON Web Token Secret key>

ADMIN_EMAIL=<관리자 이메일(관리자 로그인에 필요)>
ADMIN_NAME=<관리자 이름>
ADMIN_PHONE=<관리자 연락처>
ADMIN_PASSWORD=<관리자 비밀번호>

UPLOAD_DEST=<파일 업로드시 파일이 저장될 경로(해당 경로의 퍼미션 확인 필요)>

```

## Start Dev
```shell
$ npm run start:dev
```
