import {SET_USER, SET_ERRORS, CLEAR_ERRORS,LOADING_UI} from '../types';
import axios from 'axios';
export const loginUser = (userData, history) => (dispatch) => {
    dispatch({ type: LOADING_UI});
    axios.post('/user/login', userData)
        .then(res => {
            console.log(res.data);
            //when you add token
            const TweetToken = `TID ${res.data.token}`
            localStorage.setItem('TweetToken', TweetToken)
            axios.defaults.headers.common['Authorization'] = TweetToken;
            dispatch(getUserData());
            dispatch({type:CLEAR_ERRORS}); 
            history.push('/');
        })
        .catch(err => {
            dispatch({
                type: SET_ERRORS,
                payload: err.response.data.errResponse
            })
        })
}

export const getUserData = () => (dispatch) => {
   axios.get('/')
   .then(res=> {
       dispatch({
           type: SET_USER,
           payload: res.data
       })
   })
   .catch(err => console.log(err));
}