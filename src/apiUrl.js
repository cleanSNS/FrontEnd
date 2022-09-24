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

//access 토큰 재발급 Url
export const refreshNewAccessTokenUrl = `${apiUrl}/user/auth/refresh`;


/***************************글 관련 URl***********************************/
//새 글 피드 가져오는 Url
export const pageloadUrl = `${apiUrl}/page/main`;

//글 올리는 Url
export const newPostUrl = `${apiUrl}/page`;

//특정 글의 세부 내용을 불러오는 Url
export const LoadDetailPageUrl = `${apiUrl}/page`;


/***************************설정 관련 URl***********************************/
//지금 프로필 가져오는 Url
export const getcurrentProfileUrl = `${apiUrl}/user/mypage/profile`;

//프로필 설정 변경 내용 제출 Url
export const submitProfileSettingUrl = `${apiUrl}/user/mypage/profile`;

//지금 알림 설정 가져오는 Url
export const getCurrentNoticeSettingUrl = `${apiUrl}/user/mypage/push`;

//알림 설정 변경 내용 제출 Url
export const submitCurrentNoticeSettingUrl = `${apiUrl}/user/mypage/push`;

//비민번호 변경을 위해 현 비밀번호 확인하는 Url
export const passwordCheckForPasswordChangeUrl = `${apiUrl}/user/mypage/password/check`;

//비밀번호 변경을 하는 Url
export const passwordChangeUrl = `${apiUrl}/user/mypage/password/change`;

//지금 차단된 유저를 가져오는 Url
export const getCurrentBlockedPersonUrl = `${apiUrl}/user/block`;

//차단된 유저를 취소하는 Url
export const blockUserCancleUrl = `${apiUrl}/user/unblock`;

//유저를 차단하는 Url
export const blockUserUrl = `${apiUrl}/user/block`;

//유저를 검색하는 Url
export const searchUserUrl = `${apiUrl}/user/search?nickname=`;

//필터링 설정을 가져오는 Url
export const getCurrentfilterSetting = `${apiUrl}/user/mypage/filter`;

//필터링 설정을 변경하는 Url
export const submitFilteringSetting = `${apiUrl}/user/mypage/filter`;

//필터링 하지 않을 유저 추가 Url
export const addNotFilteredUserUrl = `${apiUrl}/user/unfilter`;

//필터링 하지 않을 유저를 취소하는 Url
export const deleteNotFilteredUserUrl = `${apiUrl}/user/filter`;

//지금 필터링 하지 않을 유저 가져오는 Url
export const getCurrentNotFilteredUserUrl = `${apiUrl}/user/unfilter`;

/**************************유저 관련**********************************/
//내가 팔로우 하고 있는 유저 조회
export const getFolloweeListUrl = `${apiUrl}/user/followee`;

//나를 팔로우 하고 있는 유저 조회
export const getfollowerListUrl = `${apiUrl}/user/follower`;

//나의 id를 조회
export const getMyUserIdUrl = `${apiUrl}/user/id`;

//해당 유저의 글들 조회
export const getUserPageListUrl = `${apiUrl}/page/user/`;

//해당 유저의 닉네임과 이미지 조회
export const getUserNicknameAndImageUrl = `${apiUrl}/user/profile`;

//해당 유저의 게시글 조회
export const getUserPageUrl = `${apiUrl}/page/user/`;

/********************************알림 관련************************************/
//나에게 온 알림 조회
export const getNoticeUrl = `${apiUrl}/user/notification?startId=`;

//알림 읽기 처리
export const readNoticeUrl = `${apiUrl}/user/notification?notificationId=`;

//알림 삭제 처리
export const deleteNoticeUrl = `${apiUrl}/user/notification?notificationId=`;

//읽지 않은 알림 수 조회
export const getNoticeNumber = `${apiUrl}/user/notification/count`;