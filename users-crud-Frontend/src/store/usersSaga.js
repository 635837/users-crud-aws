import { call, put, takeLatest } from "redux-saga/effects";
import {
  fetchUsers,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUser,
  updateUser,
  deleteUser,
} from "./usersSlice";
import * as api from "../api";

function* fetchUsersWorker() {
  try {
    const users = yield call(api.fetchUsers);
    yield put(fetchUsersSuccess(users));
  } catch (err) {
    yield put(fetchUsersFailure(err.message));
  }
}

function* createUserWorker(action) {
  try {
    yield call(api.createUser, action.payload);
    yield put(fetchUsers());
  } catch (err) {
    yield put(fetchUsersFailure(err.message));
  }
}

function* updateUserWorker(action) {
  try {
    yield call(api.updateUser, action.payload.id, action.payload.user);
    yield put(fetchUsers());
  } catch (err) {
    yield put(fetchUsersFailure(err.message));
  }
}

function* deleteUserWorker(action) {
  try {
    yield call(api.deleteUser, action.payload);
    yield put(fetchUsers());
  } catch (err) {
    yield put(fetchUsersFailure(err.message));
  }
}

export default function* usersSaga() {
  yield takeLatest(fetchUsers.type, fetchUsersWorker);
  yield takeLatest(createUser.type, createUserWorker);
  yield takeLatest(updateUser.type, updateUserWorker);
  yield takeLatest(deleteUser.type, deleteUserWorker);
}