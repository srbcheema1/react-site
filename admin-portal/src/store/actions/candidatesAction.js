import { createAction } from "redux-actions";
import axios from "axios";

import { get_service_endpoint } from "../../ServiceEndpoints.js";
import { fetchUsers } from "./authActions";
import { getAxiosCallError } from "./commonActions.js";

export const candidatesSetState = createAction("CANDIDATES_SET_STATE")
export const candidatesResetState = createAction("CANDIDATES_RESET_STATE")

const getFilterProps = (candidates) => {
	let props = {}
	if(candidates.search !== "") {
		props.email = candidates.search
	}
	if(candidates.status !== "ALL") {
		props.status = candidates.status
	}
	return props;
}

export const fetchCandidates = (pager) => {
	return (dispatch,getState) => {
		dispatch(candidatesSetState({
			loading:true,
			pagination:pager,
			selected:[],
		}))
		let {candidates, test} = getState()
		let params = {
			...getFilterProps(candidates),
			limit:candidates.pagination.pageSize,
			offset:(pager.current-1) * candidates.pagination.pageSize,
		}
		dispatch(filterCandidates(test.curr_test.id, params));
		return Promise.resolve()
	}
}

const filterCandidates = (test_id, params) => {
	return dispatch => {
		let ep = get_service_endpoint("assessment");
		let url = `${ep}/api/tests/${test_id}/candidate_filter/`
		axios.get(url,{
			params,
		})
		.then(response => {
			let candidates = response.data.results;
			let user_ids = candidates.map(c => c.invited_by)
			user_ids = [...new Set(user_ids)]
			user_ids = user_ids.filter(x=>x);// remove undefined
			fetchUsers(user_ids).then(res=>{
				let user_id_map = {}
				res.forEach(x=>{
					user_id_map[x.id]=x.full_name
				})
				candidates.forEach(c=>{
					c.invited_by = user_id_map[c.invited_by]
				})
				let pagination = {
					next: response.data.next,
					previous: response.data.previous,
					total: response.data.count,
				}
				dispatch(candidatesSetState({data:candidates,pagination,loading:false}))// set response to state of caller
			}).catch(err => {
				dispatch(getAxiosCallError(err));
			});
		})
	}
}