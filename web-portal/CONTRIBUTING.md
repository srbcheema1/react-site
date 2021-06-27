## Rules for making a new PR
While making a new PR do follow these norms:

- Fetch the latest changes by git fetch upstream.
- Create a new branch from master git checkout -b <branch_name> master.
- Add and commit the changes, commit messages should be short and well explanatory.
- PR message should be well explanatory and should contain reference to the issue this PR is for.
- Once the PR is ready for a review, ask for a review.


## Coding Practice
There are some coding practices that we follow to make code easily readable and modifiable. Few of them that should be kept in mind while coding are:

- Consistent Indentation - We generally prefer 1 tab for indentation.
- Comments & Documentation - Provide comments whenever required, so that it may be easy for other developers to read your code. Also avoid obvious comments.
- Tests - Add tests if new functionality is added to ensure that this functionality does not break in future.
- Consistent Naming Scheme - Follow a consistent naming scheme. We prefer snake_case(underscored) instead of camelCase. Naming of variables should be done in well explanatory way.
- DRY Principle - Every piece of knowledge must have a single, unambiguous, authoritative representation within a system. Aslo called Don't repeat yourself.
- Avoid Deep Nesting - Too many levels of nesting make code harder to read.
- Limit Line Length - It is a good practice to avoid writing horizontally long lines of code. There is no such limit but still having max lenght till 80 is good practice.
- Naming - We prefer PascalCase for file names and React Components and camelCase for instances and props.

```
// bad
import reservationCard from './ReservationCard';

// good
import ReservationCard from './ReservationCard';

// bad
const ReservationItem = <ReservationCard />;

// good
const reservationItem = <ReservationCard />;
```

- Component Naming - Use the filename as the component name. For example, ReservationCard.jsx should have a reference name of ReservationCard. However, for root components of a directory, use index.jsx as the filename and use the directory name as the component name

- Quotes - Always use double quotes (") for JSX attributes, but single quotes (') for all other JS.

```
// bad
<Foo bar='bar' />

// good
<Foo bar="bar" />

// bad
<Foo style={{ left: "20px" }} />

// good
<Foo style={{ left: '20px' }} />
```

- Spacing - Always include a single space in your self-closing tag. Do not pad JSX curly braces with spaces.

```
// bad
<Foo/>

// bad
<Foo
 />

// good
<Foo />
```

```
// bad
<Foo bar={ baz } />

// good
<Foo bar={baz} />
```

- Alignment - Follow these alignment styles for JSX syntax.

```
// bad
<Foo superLongParam="bar"
	anotherSuperLongParam="baz" />

// bad
<Foo 
	superLongParam="bar"
	anotherSuperLongParam="baz" />

// good
<Foo
	superLongParam="bar"
	anotherSuperLongParam="baz"
/>


// if props fit in one line then keep it on the same line
<Foo bar="bar" />

// children get indented normally
<Foo
	superLongParam="bar"
	anotherSuperLongParam="baz"
>
	<Quux />
</Foo>


// bad
{showButton &&
	<Button />
}

// bad
{
	showButton &&
		<Button />
}

// good
{showButton && (
	<Button />
)}

// good
{showButton && <Button />}

// good
{todos.map(todo => (
	<Todo
		{...todo}
		key={todo.id}
	/>
))}

// bad
dispatch(
	showErrorPage(
		{
			'errorType': 'Application Error',
			'errorHeading': 'Assessment Complete',
			'errorMessage': 'This assessment is complete and can no longer be viewed'
		}
	)
)

// good
dispatch(showErrorPage({
	'errorType': 'Application Error',
	'errorHeading': 'Assessment Complete',
	'errorMessage': 'This assessment is complete and can no longer be viewed'
}))

// not bad
axios.get(
	url,
	{
		params: {
			test_id: test_id,
			invite_id: invite_id
		}
	}
)

// good
axios.get(url,{
	params: {
		test_id: test_id,
		invite_id: invite_id
	}
})

// multiple multiline parameters
// bad
const InviteReducer = handleActions({
		VALIDATE_INVITE_SUCCESS: (state, action) => {
			return {
				...state,
				status: action.payload.status,
			};
		},
	},
	{
		status: ""
	}
);

// good
const InviteReducer = handleActions(
	{
		VALIDATE_INVITE_SUCCESS: (state, action) => {
			return {
				...state,
				status: action.payload.status,
			};
		},
	},
	initialState
);

```




### for more please follow the [link](https://github.com/airbnb/javascript/tree/master/react)