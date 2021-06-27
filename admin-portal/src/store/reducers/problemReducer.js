import { handleActions } from "redux-actions";
import produce from "immer"

const problem = {
	problem: {},
	problems: [],
	tags: {},
	editor_code: {},
};

const problemReducer = handleActions(
	{
		GET_PROBLEM_DATA_SUCCESS: (state, action) => {
			return {
				...state,
				problem: action.payload.problem
			};
		},
		GET_PROBLEMS_DATA_SUCCESS: (state, action) => {
			return {
				...state,
				problems: action.payload.problems
			};
		},
		GET_TAGS_DATA_SUCCESS: (state, action) => {
			return {
				...state,
				tags: action.payload.tags.reduce( (map, obj) => {
					map[ obj.id ] = obj.name;
					return map;
				},{} )
			};
		},
		SET_PROBLEM_TEST_CASES: (state, action) => {
			return produce(state,draft =>{
				draft.problem.test_cases = action.payload.test_cases
			})
		},
		SET_PROBLEM_TEMPLATES: (state, action) => {
			return produce(state,draft =>{
				draft.problem.template_codes = action.payload.templates
				Object.keys(action.payload.templates).forEach(lang => {
					draft.problem.template_codes[lang].visible = true;
					draft.problem.template_codes[lang].dirty = false;
				})
			})
		},
		UPDATE_TEMPLATE: (state, action) => {
			return produce(state,draft =>{
				draft.problem.template_codes[action.payload.language][action.payload.key] = action.payload.value
				if(action.payload.key==="id") {
					draft.problem.template_codes[action.payload.language].dirty = false;
				} else {
					draft.problem.template_codes[action.payload.language].dirty = true;
					if (action.payload.language in draft.editor_code) delete draft.editor_code[action.payload.language]
				}
			})
		},
		DELETE_TEMPLATE: (state, action) => {
			return produce(state,draft =>{
				draft.problem.template_codes[action.payload.language].visible = false
				draft.problem.template_codes[action.payload.language].id = ""
				draft.problem.template_codes[action.payload.language].dirty = false
			})
		},
		ADD_TEMPLATE: (state, action) => {
			return produce(state,draft =>{
				if(action.payload.language in draft.problem.template_codes) {
					draft.problem.template_codes[action.payload.language].visible = true;
				} else {
					draft.problem.template_codes[action.payload.language] = {
						id:"",
						header:"",tailer:"",body:"",language:action.payload.language,
						visible:true,
					}
				}
				draft.problem.template_codes[action.payload.language].dirty = true;
				if (action.payload.language in draft.editor_code) delete draft.editor_code[action.payload.language]
			})
		},
		SET_EDITOR_CODE: (state,action) => {
			return produce(state,draft =>{
				if(!(action.payload.lang in draft.editor_code)) draft.editor_code[action.payload.lang] = {}
				if(action.payload.code) draft.editor_code[action.payload.lang].code = action.payload.code
				if(action.payload.tc) draft.editor_code[action.payload.lang].tc = action.payload.tc
			})
		},
		DELETE_EDITOR_CODE: (state,action) => {
			return produce(state,draft =>{
				if(action.payload.lang in draft.editor_code) delete draft.editor_code[action.payload.lang]
			})
		},
	},
	problem
);

export default problemReducer;
