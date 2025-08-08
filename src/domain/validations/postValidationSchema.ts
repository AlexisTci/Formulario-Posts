import * as Yup from 'yup';

export const postValidationSchema = Yup.object().shape({
  title: Yup.string().when(['isEditing', 'isDeleting'], {
    is: (editing: boolean, deleting: boolean) => !editing && !deleting,
    then: (schema) => schema.required('El título es obligatorio'),
    otherwise: (schema) => schema.notRequired(),
  }),
  description: Yup.string().when(['isEditing', 'isDeleting'], {
    is: (editing: boolean, deleting: boolean) => !editing && !deleting,
    then: (schema) => schema.required('La descripción es obligatoria'),
    otherwise: (schema) => schema.notRequired(),
  }),
  id: Yup.number().when(['isEditing', 'isDeleting'], {
    is: (editing: boolean, deleting: boolean) => editing || deleting,
    then: (schema) => schema.required('El ID es obligatorio'),
    otherwise: (schema) => schema.notRequired(),
  }),
});
