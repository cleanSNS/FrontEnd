const apiUrl = "http://api.cleanbook.site";
export const siteUrl = "http://cleanbook.site";

/***************************로그인 관련 URl***********************************/
//기본 로그인 Url
export const loginApiUrl = `${apiUrl}/user/auth/login`;

//카카오 소셜 로그인 Url
export const kakaoLoginUrl = `${apiUrl}/social/login/kakao/code`;

//네이버 소셜 로그인 Url
export const naverLoginApiUrl = `${apiUrl}/social/login/naver/code`;

//회원가입 Url
export const signUpApiUrl = `${apiUrl}/user/auth/signup`;

//이메일 인증 Url
export const emailApiUrl = `${apiUrl}/user/auth/signup/request`;


/***************************메인 페이지 관련 URl***********************************/
//새 글 피드 가져오는 Url
export const pageloadUrl = `${apiUrl}/page/main`;