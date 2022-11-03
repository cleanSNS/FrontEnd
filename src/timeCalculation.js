import { Temporal } from '@js-temporal/polyfill';

//시간 계산 함수
/** claTime: 업로드된 시간. output: 안에 들어갈 문자열  */
export const calculateTimeFrom = (calTime) => {
    const now = Temporal.Now.plainDateTimeISO();//현재 시간 세팅
    let postedDate = Temporal.PlainDateTime.from(calTime);
    postedDate = postedDate.add({hours: 9});
    const result = now.since(postedDate);
    if(result.minutes === 0){//0분이내인 경우
        return "방금 전";
    }
    else if(result.hours === 0){//1시간보다는 아래인 경우
        return `${result.minutes}분 전`;
    }
    else if(result.days === 0){//1일보다는 아래인 경우
        return `${result.hours}시간 전`;
    }
    else if(result.months === 0){//1달보다는 아래인 경우
        return `${result.days}일 전`;
    }
    else if(result.years === 0){//1년보다는 아래인 경우
        return `${result.months}달 전`;
    }
    else{//1년 이상인 경우
        return `${result.years}년 전`;
    }
};

//시간 계산 함수
/** claTime: 업로드된 시간. output: 안에 들어갈 문자열  */
export const chatCalculateTimeFrom = (calTime) => {
    const now = Temporal.Now.plainDateTimeISO();
    let postedTime = Temporal.PlainDateTime.from(calTime);
    postedTime = postedTime.add({hours: 9});//9시간을 추가한다.
    if(postedTime.year === now.year &&postedTime.month === now.month && postedTime.day === now.day){//연,월,일이 오늘이면, 시간과 분을 쓰고,
        return `${postedTime.hour.toString().padStart(2, "0")}:${postedTime.minute.toString().padStart(2, "0")}`;
    }
    else{//연월일이 오늘이 아니면 월 일을 쓴다.
        return `${postedTime.month}월 ${postedTime.day}일`;
    }
};