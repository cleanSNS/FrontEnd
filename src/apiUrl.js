const apiUrl = "https://api.cleanbook.site";
export const siteUrl = "https://cleanbook.site";

/***************************로그인 관련 URl***********************************/
//기본 로그인 Url
export const loginApiUrl = `${apiUrl}/user/auth/login`;

//카카오 소셜 로그인 Url
export const kakaoLoginUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=75670ae520e9b0c56500f349b16c3c68&redirect_uri=${siteUrl}`;

//카카오 소셜 로그인 토큰 인증
export const KakaoTokenUrl = `${apiUrl}/social/login/kakao?code=`;

//네이버 소셜 로그인 토큰 인증
export const NaverLoginUrl = `https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=_A0bRpk1yPqnrmV8eBx8&state=state&redirect_uri=${siteUrl}`;

//네이버 소셜 로그인 URl
export const NaverTokenUrl = `${apiUrl}/social/login/naver?code=`;

//회원가입 Url
export const signUpApiUrl = `${apiUrl}/user/auth/signup`;

//이메일 인증 Url
export const emailApiUrl = `${apiUrl}/user/auth/signup/request`;

//로그아웃 Url
export const logoutApiUrl = `${apiUrl}/user/auth/logout`;

//비밀번호찾기 Url
export const findPWUrl = `${apiUrl}/user/mypage/password/reset`;


/***************************글 관련 URl***********************************/
//새 글 피드 가져오는 Url
export const pageloadUrl = `${apiUrl}/page/main`;

//글 올리는 Url
export const newPostUrl = `${apiUrl}/page`;


/***************************설정 관련 URl***********************************/
export const getcurrentProfileUrl = `${apiUrl}/user/mypage/profile`;

export const submitProfileSettingUrl = `${apiUrl}/user/mypage/profile`;

export const getCurrentNoticeSettingUrl = `${apiUrl}/user/mypage/push`;

export const submitCurrentNoticeSettingUrl = `${apiUrl}/user/mypage/push`;

export const passwordCheckForPasswordChangeUrl = `${apiUrl}/user/mypage/password/check`;

export const passwordChangeUrl = `${apiUrl}/user/mypage/password/change`;

export const getCurrentBlockedPersonUrl = `${apiUrl}/user/block`;