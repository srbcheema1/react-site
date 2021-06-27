import { handleActions } from "redux-actions";
import produce from "immer"

const test = {
	tests: [],
	curr_test: {
		id: null,
		problems:[],
		title:"",
	}
};

const testReducer = handleActions(
	{
		GET_TESTS_DATA_SUCCESS: (state, action) => {
			return {
				...state,
				tests: action.payload.tests
			};
		},
		SET_TEST_CREATOR: (state, action) =>
			produce(state, draft => {
				draft.tests.forEach(t => {
					if (t.creator_id in action.payload.users) {
						t.creator = action.payload.users[t.creator_id]
					}
				})
			}),
		SET_TEST_SUMMARY:(state, action) =>
			produce(state, draft => {
				draft.tests.forEach(t => {
					if (t.id === action.payload.id) {
						t.summary = action.payload.summary
					}
				})
			}),
		SET_CURR_TEST:(state,action) => {
			return {
				...state,
				curr_test: {
					id: action.payload.test.id,
					problems: action.payload.test.problems,
					title: action.payload.test.title
				}
			}
		},
		RESET_CURR_TEST:(state,action) => {
			return {
				...state,
				curr_test: {...test.curr_test}
			}
		},
		CREATE_TEST_SUCCESS: (state, action) => {
			return {
				...state,
				tests: [...state.tests, action.payload.test]
			};
		},
	},
	test
);

export default testReducer;
