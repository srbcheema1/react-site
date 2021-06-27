import { handleActions } from "redux-actions"
import { createSelector } from 'reselect'
import produce from "immer"
import moment from 'moment'

export const selectedTab = {
	problemStatement:'Problem Statement',
	customInput:'Custom Input',
	results:'Results',
	success: "Success"
}

export const verdict = {
	compiler_error: {
		name:"Compilation Failed",
		type:"error"
	},
	runtime_error: {
		name:"Runtime Error",
		type:"error"
	},
	tle: {
		name:"Time Limit Exceeded",
		type:"error"
	},
	success: {
		name:"OK",
		type:"success"
	},
	na:{
		name:"NA",
		type:"info"
	}
}

const editorInitialState = {
	lang: "python3",
	code: {
		python3: "",
		javascript: "",
		c: "",
		cpp: "",
		java: ""
	},
	isDirty: {
		python3: false,
		javascript: false,
		c: false,
		cpp: false,
		java: false
	},
	//stdin, stdout and status is for custom input testing
	stdin:"",
	stdout:"",
	verdict:"",
	//compilation/runtime error message
	stderr:""
};

const initialState = {
	id:"",
	problems:[],
	//not really a credential, it contains invite_id, test_id and status of the invite
	InviteCredential:{},
	startTime: null,
	timerWarnLevel: "green"
};

export const problemsSelector = state => state.problems

export const currProblemSelector = createSelector(problemsSelector, (problems) => {
	let currProblem = problems.filter(p => p.isCurrent)
	if (currProblem.length > 0) {
		return currProblem[0]
	} else {
		return {
			testcases: [],
			editor: JSON.parse(JSON.stringify(editorInitialState))
		}
	}
})

export const activeTemplateSelector = createSelector(currProblemSelector, problem => {
	if (problem.templates) {
		let tpls = problem.templates.filter(tpl => tpl.language === problem.editor.lang)
		if (tpls.length > 0) {
			return tpls[0]
		}
	}
	return {header:"", tailer:""}
})

export const languageListSelector = createSelector(currProblemSelector, problem => {
	if (problem.templates) {
		return problem.templates.map(t => t.language)
	}
	return []
})

export const activeTabSelector = createSelector(currProblemSelector, problem => {
	return problem.activeTab;
})

export const attemptedCountSelector = createSelector(problemsSelector, problems => {
	return problems.filter(p => p.attempted).length
})

export const assessmentEndTimeSelector = createSelector(a => a, a => {
	return moment.utc(a.startTime).add(a.duration, 'minutes')
})

const AssessmentReducer = handleActions(
	{
		START_TEST_SUCCESS: (state, action) => {
			return {
				...state,
				problems: action.payload.problems,
				id: action.payload.id,
				remainingTime: action.payload.remaining_time
			};
		},

		UPDATE_ASSESSMENT: (state, action) =>
			produce(state, draft=> {
				draft.id = action.payload.id
				draft.problems = []
				action.payload.problems.forEach(p => {
					if (p.lcs) {
						p.attempted = true
					}
					else {
						p.attempted = false
					}
					/* TO-DO: remove the dummy values */
					p.type = 'Coding'
					draft.problems.push(p)
				})
				draft.startTime = action.payload.start_time
				draft.duration = action.payload.duration
				draft.test_title = action.payload.test_title
				draft.remainingTime = action.payload.remaining_time
				/* to-do set the timer exp level warning based on data in response*/
			}),

		SET_TIMER_EXP_LEVEL: (state, action) => {
			return {
				...state,
				timerWarnLevel: action.payload.level
			}
		},

		CHOOSE_OPTION: (state, action) =>
			produce(state, draft => {
				draft.problems.forEach(p => {
					if (p.id === action.payload.problem_id) {
						p.activeTab = action.payload.activeTab;
					}
				})
			}),

		MARK_ATTEMPTED: (state, action) =>
			produce(state, draft => {
				draft.problems.forEach(p => {
					if (p.id === action.payload.problem_id) {
						p.attempted = true;
					}
				})
			}),

		ASSIGN_TESTCASES: (state, action) => {
			return {
				...state,
				testcases: action.payload
			};
		},

		ASSIGN_LOGO: (state, action) =>
			produce(state, draft => {
				draft.problems.forEach(p => {
					if(p.id === action.payload.id) {
						p.testcases.forEach(tc => {
							tc.logo = action.payload.logo[tc.id]
						})
						if(action.payload.status !== "") {
							p.status = action.payload.status
						}
					}
				})
			}),

		RESET_TC_RES_STATUS: (state, action) =>
			produce(state, draft => {
				draft.problems.filter(p => p.isCurrent).forEach(p => {
					p.testcases.forEach(tc => tc.logo = action.payload.logo)
				})
			}),

		SET_CUSTOM_INP_RESULTS: (state, action) =>
			produce(state, draft => {
				draft.problems.forEach(p => {
					if (p.isCurrent) {
						p.stdout = action.payload.stdout
						p.stderr = action.payload.stderr
						if(action.payload.compiler_error) {
							p.verdict = verdict.compiler_error
						}
						else if(action.payload.runtime_error) {
							p.verdict = verdict.runtime_error
						}
						else if(action.payload.timelimitexceeded_error) {
							p.verdict = verdict.tle
						} else {
							p.verdict = verdict.success
						}
					}
				})
			}),

		RESET_CUSTOM_INP_RESULTS: (state, action) =>
			produce(state, draft => {
				draft.problems.forEach(p => {
					if (p.isCurrent) {
						p.stdout = ""
						p.stderr = ""
						p.verdict = verdict.na
					}
				})
			}),

		ASSIGN_PROBLEM: (state, action) =>
			produce(state, draft => {
				draft.problems.forEach(p => {
					if (p.id === action.payload.problem_id) {
						p.isCurrent = true
						if (!p.editor) {
							//perform a deep copy of the state
							p.editor = JSON.parse(JSON.stringify(editorInitialState))
						}
						let lcs = {}
						if(p.lcs) {
							p.lcs.forEach(l=>{
								lcs[l.lang] = l.code
							})
						}
						p.templates.forEach(tpl => {
							if (!p.editor.isDirty[tpl.language]) {
								let body = tpl.body
								if (p.lcs) {
									if (tpl.language in lcs) {
										body = lcs[tpl.language]
									}
								}
								p.editor.code[tpl.language] = tpl.header  + body  + tpl.tailer
							}
						})
					}
					else {
						p.isCurrent = false
					}
				})
			}),

		EDITOR_UPDATE_CODE: (state, action) =>
			produce(state, draft => {
				draft.problems.forEach(p => {
					if (p.id === action.payload.problem_id) {
						p.editor.code[p.editor.lang] = action.payload.code
						p.editor.isDirty[p.editor.lang] = true
					}
				})
			}),

		EDITOR_RESET_ALL: (state, action) =>
			produce(state, draft => {
				draft.problems.forEach(p => {
					if (p.id === action.payload.problem_id) {
						p.editor = Object.assign({}, editorInitialState)
					}
				})
			}),

		EDITOR_ASSIGN_TEMPLATE: (state, action) =>
			produce(state, draft => {
				draft.problems.forEach(p => {
					if (p.id === action.payload.problem_id) {
						p.editor.code[action.payload.lang] = action.payload.header+"\n\n"+action.payload.body+"\n\n"+action.payload.tailer
					}
				})
			}),

		EDITOR_SET_INPUT: (state, action) =>
			produce(state, draft => {
				draft.problems.forEach(p => {
					if (p.id === action.payload.problem_id) {
						p.editor.stdin = action.payload.stdin
					}
				})
			}),

		EDITOR_SET_STDOUT: (state, action) =>
			produce(state, draft => {
				draft.problems.forEach(p => {
					if (p.id === action.payload.problem_id) {
						p.editor.stdout = action.payload.stdout
					}
				})
			}),

		EDITOR_UPDATE_LANG: (state,action) =>
			produce(state, draft => {
				draft.problems.forEach(p => {
					if (p.id === action.payload.problem_id) {
						p.editor.lang = action.payload.language
					}
				})
			})
	},
	initialState
);

export default AssessmentReducer;
