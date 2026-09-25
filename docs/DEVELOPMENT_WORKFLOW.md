# NairaFlow Development Workflow

Use this workflow whenever you work on the project:

```text
MAIN
↓
Create a feature branch
↓
Build your feature
↓
Test it
↓
Push your branch
↓
Open a Pull Request
↓
Another team member reviews it
↓
Fix anything necessary
↓
Merge into main
```

## Branch names

Start each piece of work from `main`, then create a branch with a clear name.

Frontend examples:

- `frontend/auth`
- `frontend/dashboard`
- `frontend/wallet`
- `frontend/transfers`
- `frontend/transactions`

Backend examples:

- `backend/setup`
- `backend/auth`
- `backend/wallet`
- `backend/transfers`
- `backend/transactions`

## Team rules

- Do not push directly to `main`.
- Work on your own feature branch.
- Test your work before asking for review.
- Be able to explain what you built.
- AI tools such as Codex or ChatGPT can help, but you should understand the code you submit.
- Keep commits related to the feature you are working on.

When your work is ready, push your branch and open a Pull Request. A teammate should review it before it is merged into `main`.
