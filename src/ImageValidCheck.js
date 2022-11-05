//받은 파일리스트가 유효한지 검사하는 함수
export const ImageValid = (data) => {
  let answer = true;

  //받은 input들에 대해서 이미지 여부, 용량 여부(5메가 이하),
  data.map((d) => {
      if(!(d.type === 'image/png' || d.type === 'image/jpg' || d.type === 'image/jpeg')){
          alert(`이미지 파일만 업로드 가능합니다.\n${d.name}`);
          answer = false;
      }
      if(d.size > 1024 * 1024 * 10){
          alert(`10MB 이상의 이미지는 업로드 불가합니다.\n${d.name}`);
          answer = false;
      }
      newPostImages.map((cd) => {
          if(cd.name === d.name){
              alert(`같은 이름의 파일이 이미 업로드 되어있습니다.\n${d.name}`);
              answer = false;
          }
      });
  });
  return answer;
};