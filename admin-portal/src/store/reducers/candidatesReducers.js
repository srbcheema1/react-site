import { handleActions } from "redux-actions";

const candidates = {
	data:[],
	loading: true,
	selected:[],
	search:"",
	status:"CM",
	pagination:{
		pageSize:10,

		total:0,
		current:1,
		next:null,
		previous:null,
	},
}

const candidatesReducer = handleActions(
	{
		CANDIDATES_SET_STATE: (state, action) => {
			let pagination = {
				...state.pagination,
				...action.payload.pagination
			};
			return {
				...state,
				...action.payload,
				pagination
			}
		},
		CANDIDATES_RESET_STATE: (state,action) => {
			return candidates
		}
	},
	candidates
);

export default candidatesReducer;