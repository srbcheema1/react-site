import { createSelector } from 'reselect';

export const activeQuestionSelector = (state) => {
	if(state.active_question in state.questions) {
		return state.questions[state.active_question]
	}
	return {

	}
}

export const activeSubmissionSelector = createSelector(activeQuestionSelector, (question) => {
	if(question.curr_submission && question.curr_submission in question.submissions) {
		return question.submissions[question.curr_submission];
	}
	return {
	}
})

export const activeTestcasesSelector = createSelector(activeQuestionSelector, (question) => {
	if(question.curr_submission && question.curr_submission in question.submissions) {
		return parseSubmission(question.testcases, question.submissions[question.curr_submission].testcase_executions);
	}
	if(! question.testcases) {
		return [];
	}
	return question.testcases.map(tc=>({
		points: tc.points,
		difficulty: tc.difficulty,
		status: 'UA',
	}))
})

export const bestSubmissionSelector = createSelector(activeQuestionSelector, (question) => {
	if(question.best_submission && question.best_submission in question.submissions) {
		return question.submissions[question.best_submission];
	}
	return {
		score:0,
	}
})

const parseStatus = tc => {
	if(tc.compiler_error) return 'CE';
	else if(tc.runtime_error) return 'RE';
	else if(tc.timelimitexceeded_error) return 'TLE';
	else {
		if(tc.status==='SC') return 'AC';
		else if (tc.status==='EX') return 'LOAD';
		else if (tc.status==='FL') return 'WA';
		else return 'UA';
	}
}

const parseSubmission = (tcs,tc_executions) => {
	let tc_map = {}
	tcs.forEach(tc=>{
		tc_map[tc.id] = tc;
	})
	return tc_executions.map(function(tc) {
		return {
			points: tc_map[tc.testcase_id].points,
			difficulty: tc_map[tc.testcase_id].difficulty,
			status: parseStatus(tc)
		}
	})
}
