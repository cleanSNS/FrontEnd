import Style from './filteringSetting.module.css';
import addBtn from './datafile/add.png';
import addBtnHover from './datafile/add_hover.png';
import deleteBtn from './datafile/delete.png';
import deleteBtnHover from './datafile/delete_hover.png';
import { useState, useEffect } from 'react';
import {
    getCurrentfilterSetting,
    getCurrentNotFilteredUserUrl,
    submitFilteringSetting,
    addNotFilteredUserUrl,
    deleteNotFilteredUserUrl,
    searchUserUrl,
} from '../../../../apiUrl';
import axios from 'axios';

const FilteringSetting = ({refreshAccessToken}) => {
    const [filterAll, setFilterAll] = useState(false);
    const [filterFollower, setFilterFollower] = useState(false);
    const [filterFollowee, setFilterFollowee] = useState(false);
    const [userInput, setUserInput] = useState("");
    const [searchedUserList, setSearchedUserList] = useState([]);//검색된 사람들
    const [AddedUserList, setAddedUserList] = useState([]);//예외로 설정된 사람들

    //처음에 필터링 설정정보와 예외로 설정된 유저들의 리스트를 가져와야한다.
    const filterSettingInitialSetting = () => {
        //필터링 설정 정보 가져오기
        axios.get(getCurrentfilterSetting)
        .then((res) => {
            setFilterAll(res.data.data.filterAll);
            setFilterFollower(res.data.data.filterFollower);
            setFilterFollowee(res.data.data.filterFollowee);
        })
        .catch((res) => {
            console.log(res);
            alert("에러 발생");
        })

        //필터링 하지 않을 유저 정보 가져오기
        axios.get(getCurrentNotFilteredUserUrl)
        .then((res) => {
            const tmp = [...res.data.data];
            setAddedUserList(tmp);
        })
        .catch((res) => {
            console.log(res);
            alert("에러 발생");
        })
    };
    useEffect(filterSettingInitialSetting, []);

    /* 상단 내용 */

    //정보에 따라 스타일 변경해주는 함수
    const filterAllStyleHandler = () => {
        if(filterAll){
            document.querySelector("#filterAllAllow").style.fontWeight = "600";
            document.querySelector("#filterAllDenial").style.fontWeight = "400";
        }
        else{
            document.querySelector("#filterAllAllow").style.fontWeight = "400";
            document.querySelector("#filterAllDenial").style.fontWeight = "600";
        }
    };
    useEffect(filterAllStyleHandler, [filterAll]);

    const filterFollowerStyleHandler = () => {
        if(filterFollower){
            document.querySelector("#filterFollowerAllow").style.fontWeight = "600";
            document.querySelector("#filterFollowerDenial").style.fontWeight = "400";
        }
        else{
            document.querySelector("#filterFollowerAllow").style.fontWeight = "400";
            document.querySelector("#filterFollowerDenial").style.fontWeight = "600";
        }
    };
    useEffect(filterFollowerStyleHandler, [filterFollower]);

    const filterFolloweeStyleHandler = () => {
        if(filterFollowee){
            document.querySelector("#filterFolloweeAllow").style.fontWeight = "600";
            document.querySelector("#filterFolloweeDenial").style.fontWeight = "400";
        }
        else{
            document.querySelector("#filterFolloweeAllow").style.fontWeight = "400";
            document.querySelector("#filterFolloweeDenial").style.fontWeight = "600";
        }
    };
    useEffect(filterFolloweeStyleHandler, [filterFollowee]);

    //input 클릭 handler
    const filterAllClickHandler = (event) => {
        event.preventDefault();
        setFilterAll((cur) => !cur);
    };

    const filterFollowerClickHandler = (event) => {
        event.preventDefault();
        setFilterFollower((cur) => !cur);
    };

    const filterFolloweeClickHandler = (event) => {
        event.preventDefault();
        setFilterFollowee((cur) => !cur);
    };

    //설정 submit handler
    const settingSubmitHandler = (event) => {
        event.preventDefault();
        axios.post(submitFilteringSetting,{
            filterAll: filterAll,
            filterFollower: filterFollower,
            filterFollowee: filterFollowee,
        })
        .then((res) =>{
            alert("설정을 변경했습니다.");
        })
        .catch((res) => {
            console.log(res);
            alert("에러 발생");
        })
    };

    /* 하단 내용 */

    //유저 내용 입력 Handler
    const userInputChangeHandler = (event) => {
        event.preventDefault();
        setUserInput(event.target.value);
    };

    //유저 추가 버튼 클릭 처리 Handler
    const addUserClickhandler = (event) => {
        event.preventDefault();

        //차단하는 api호출 event.target.id이용
        axios.post(addNotFilteredUserUrl, {
            targetUserId: event.target.id,
        })
        .then((res) => {//문제가 없는 상황이므로 추가된 차단 리스트를 불러와서 변경하기
            axios.get(getCurrentNotFilteredUserUrl)
            .then((res) => {
                const tmp = [...res.data.data];
                setAddedUserList(tmp);
            })
            .catch((res) => {
                console.log(res);
                alert("에러 발생 - 리스트를 불러오지 못함");
            })
        })
        .catch((res) => {
            console.log(res);
            alert("에러 발생 - 차단 리스트에 추가하지 못함");
            //window.location.href = '/main';
        })
    };

    //유저 삭제 버튼 클릭 처리 Handler
    const deleteUserClickHandler = (event) => {
        event.preventDefault();

        //차단 취소하는 api호출 event.target.id이용
        axios.post(deleteNotFilteredUserUrl,{
            targetUserId: event.target.id,
        })
        .then((res) => {//문제가 없는 상황이므로 삭제하기.
            console.log(res);
            //AddedList 리스트에서 삭제 event.target.value이용
            const tmp = [...AddedUserList];
            tmp.splice(Number(event.target.value), 1);
            setAddedUserList(tmp);
        })
        .catch((res) => {
            console.lor(res);
            alert("문제 발생");
            //window.location.href="/main";
        })

    };

    //유저 추가 버튼 마우스 올렸을 때 이미지 스타일 변경 Handler
    const addUserMouseOverHandler = (event) => {
        event.preventDefault();
        event.target.src = addBtnHover;
    };

    //유저 추가 버튼 마우스 내렸을 때 이미지 스타일 복구 Handler
    const addUserMouseOuthandler = (event) => {
        event.preventDefault();
        event.target.src = addBtn;
    };

    //유저 삭제 버튼 마우스 올렸을 때 이미지 스타일 변경 Handler
    const deleteUserMouseOverHandler = (event) => {
        event.preventDefault();
        event.target.src = deleteBtnHover;
    };

    //유저 삭제 버튼 마우스 올렸을 때 이미지 스타일 변경 Handler
    const deleteUserMouseOutHandler = (event) => {
        event.preventDefault();
        event.target.src = deleteBtn;
    }

    const searchHandler = (event) => {//제출 시, 차단할 유저를 api에 넘기고, 블록된 사람들을 다시 불러온다.
        event.preventDefault();

        axios.get(searchUserUrl + userInput)
        .then((res) => {
            const tmp = [...res.data.data]
            setSearchedUserList(tmp);
        })
        .catch((res) => {
            console.log(res);
            alert("에러 발생");
            //window.location.href = "/main";
        })
    };


    return(
        <div className={Style.wholeCover}>
            <div className={Style.Cover}>
                <form className={Style.filterSettingArea} onSubmit={settingSubmitHandler}>
                    <div className={Style.Cover}>
                        <div className={Style.settingArea} style={{borderBottom: "1px solid rgb(216, 216, 216)"}}>
                            <div className={Style.Cover}>
                                <p className={Style.settingLabel}>전체 필터링</p>
                            </div>
                            <div className={Style.Cover}>
                                <div className={Style.inputArea}>
                                    <div className={Style.Cover}>
                                        <p className={Style.settingInput} id="filterAllAllow" onClick={filterAllClickHandler}>허용</p>
                                    </div>
                                    <div className={Style.Cover}>
                                        <p className={Style.settingInput} id="filterAllDenial" onClick={filterAllClickHandler}>거부</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.settingArea} style={{borderBottom: "1px solid rgb(216, 216, 216)"}}>
                            <div className={Style.Cover}>
                                <p className={Style.settingLabel}>팔로워 필터링</p>
                            </div>
                            <div className={Style.Cover}>
                                <div className={Style.inputArea}>
                                    <div className={Style.Cover}>
                                        <p className={Style.settingInput} id="filterFollowerAllow" onClick={filterFollowerClickHandler}>허용</p>
                                    </div>
                                    <div className={Style.Cover}>
                                        <p className={Style.settingInput} id="filterFollowerDenial" onClick={filterFollowerClickHandler}>거부</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.settingArea} style={{borderBottom: "1px solid rgb(216, 216, 216)"}}>
                            <div className={Style.Cover}>
                                <p className={Style.settingLabel}>팔로우 필터링</p>
                            </div>
                            <div className={Style.Cover}>
                                <div className={Style.inputArea}>
                                    <div className={Style.Cover}>
                                        <p className={Style.settingInput} id="filterFolloweeAllow" onClick={filterFolloweeClickHandler}>허용</p>
                                    </div>
                                    <div className={Style.Cover}>
                                        <p className={Style.settingInput} id="filterFolloweeDenial" onClick={filterFolloweeClickHandler}>거부</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={Style.Cover}>
                        <button type="submit" className={Style.submitBtn}>제출</button>
                    </div>
                </form>
            </div>
            <div className={Style.Cover}>
                <form className={Style.searchAndAddArea} onSubmit={searchHandler}>
                    <div className={Style.Cover}>
                        <label
                            className={Style.searchLabel}
                            htmlFor="userIdInput">
                            필터링 하지 않을 사용자 추가
                        </label>
                    </div>
                    <div className={Style.Cover}>
                        <input 
                            id="userIdInput"
                            placeholder='닉네임을 입력하세요'
                            className={Style.searchInput}
                            value={userInput}
                            onChange={userInputChangeHandler}
                        />
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.userListArea}>
                            {
                                searchedUserList.map((person, index) => {
                                    <div className={Style.userArea} key={index} style={{backgroundColor: "white"}}>
                                        <div className={Style.userAreaGrid}>
                                            <img src={person.imgUrl} className={Style.userImage} />
                                            <p className={Style.userNickname}>{person.nickname}</p>
                                            <button type="button" className={Style.userButton} onClick={addUserClickhandler} value={index} id={person.userId}>
                                                <img scr={addBtn} className={Style.userButtonImg} onMouseOver={addUserMouseOverHandler} onMouseOut={addUserMouseOuthandler}/>
                                            </button>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                    <div className={Style.Cover}>
                        <div className={Style.userListArea}>
                            {
                                AddedUserList.map((person, index) => {
                                    <div className={Style.userArea} key={index} style={{backgroundColor: "#F4DEDE"}}>
                                        <div className={Style.userAreaGrid}>
                                            <img src={person.imgUrl} className={Style.userImage} />
                                            <p className={Style.userNickname}>{person.nickname}</p>
                                            <button type="button" className={Style.userButton} onClick={deleteUserClickHandler} value={index} id={person.userId}>
                                                <img scr={deleteBtn} className={Style.userButtonImg} onMouseOver={deleteUserMouseOverHandler} onMouseOut={deleteUserMouseOutHandler}/>
                                            </button>
                                        </div>
                                    </div>
                                })
                            }
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default FilteringSetting;