import useVisualMode from "hooks/useVisualMode";

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const EDIT = "EDIT";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const ERROR_SAVE = "ERROR_SAVE";
const ERROR_DELETE = "ERROR_DELETE";

{mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
{mode === SHOW &&
  <Show student={interview.student}
    interviewer={interview.interviewer}
    onDelete={() => transition(CONFIRM)}
    onEdit={() => transition(EDIT)}
  />
}
{mode === CREATE && (
  <Form interviewers={props.interviewers} onCancel={back} onSave={save} />
)}
{mode === EDIT && (
  <Form
    name={interview.student}
    interviewer={interview.interviewer.id}
    interviewers={props.interviewers}
    onCancel={back}
    onSave={save}
  />
)}
{mode === SAVING && <Status message="Saving" />}
{mode === DELETING && <Status message="Deleting" />}
{mode === CONFIRM && (
  <Confirm
    message="Are you sure you would like to delete?"
    onCancel={back}
    onConfirm={destroy}
  />
)}
{mode === ERROR_SAVE && (
  <Error message="Could not book appointment." onClose={back} />
)}
{mode === ERROR_DELETE && (
  <Error message="Could not cancel appointment." onClose={back} />
)}


//Save or delete an appointment
function save(name, interviewer) {
  const interview = {
    student: name,
    interviewer
  };

  transition(SAVING);

  props
    .bookInterview(props.id, interview)
    .then(() => transition(SHOW))
    .catch(error => transition(ERROR_SAVE, true));
}

function destroy() {
  transition(DELETING, true);
  props
    .cancelInterview(props.id)
    .then(() => transition(EMPTY))
    .catch(error => transition(ERROR_DELETE, true));
}