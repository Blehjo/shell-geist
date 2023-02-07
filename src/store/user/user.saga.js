import { takeLatest, put, all, call } from 'redux-saga/effects';

import { USER_ACTION_TYPES } from './user.types';

import { signInSuccess, signInFailed, signUpSuccess, signUpFailed, signOutSuccess, signOutFailed } from './user.action';

import { userDocument, getUser, login, signUpUser, signOutUser } from '../../utils/userDocument';

export function* userLoginCall(email, password) {
    try {
        const userSnapshot = yield call(
            login, 
            email, 
            password
        );
        yield put(signInSuccess({ id: userSnapshot.id, ...userSnapshot.data }));
    } catch (error) {
        yield put(signInFailed(error));
    }
}

export function* signInWithEmail({ payload: { email, password } }) {
    try {
        const user = yield call(
            userLoginCall,
            email,
            password
        );
        yield call(getUser, user);
    } catch (error) {
        yield put(signInFailed(error));
    }
}

export function* isUserAuthenticated() {
   try {
       const userAuth = yield call(getUser);
       if (!userAuth) return;
       yield call(userDocument, userAuth);
   } catch (error) {
       yield put(signInFailed(error));
   }
}

export function* signUp({ payload: { username, email, password, country, date_of_birth, first_name, last_name } }) {
   try {
        const user = yield call(
           signUpUser,
           username,
           email,
           password,
           country,
           date_of_birth,
           first_name,
           last_name
        );
        yield put(signUpSuccess(user));
    } catch (error) {
        yield put(signUpFailed(error));
    }
}

export function* signInAfterSignUp({ payload: { user } }) {
   yield call(userLoginCall, user );
}

export function* signOut() {
    try {
        yield call(signOutUser);
        yield put(signOutSuccess());
    } catch (error) {
        yield put(signOutFailed(error));
    }
}

export function* onCheckUserSession() {
   yield takeLatest(USER_ACTION_TYPES.CHECK_USER_SESSION, isUserAuthenticated);
}

export function* onEmailSignInStart() {
   yield takeLatest(USER_ACTION_TYPES.EMAIL_SIGN_IN_START, signInWithEmail);
}

export function* onSignUpStart() {
   yield takeLatest(USER_ACTION_TYPES.SIGN_UP_START, signUp);
}

export function* onSignUpSuccess() {
   yield takeLatest(USER_ACTION_TYPES.SIGN_UP_SUCCESS, signInAfterSignUp);
}

export function* onSignOutStart() {
   yield takeLatest(USER_ACTION_TYPES.SIGN_OUT_START, signOut);
}

export function* userSagas() {
   yield all([
       call(onCheckUserSession),
       call(onEmailSignInStart),
       call(onSignUpStart),
       call(onSignUpSuccess),
       call(onSignOutStart),
   ]);
}