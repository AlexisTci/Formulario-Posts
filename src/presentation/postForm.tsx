import { Formik, Form, Field, ErrorMessage } from 'formik';
import { createPost, editPost, deletePost, getPostById } from '../infrastructure/postService';
import PreviewImages from '../infrastructure/components/PreviewImages';
import { postValidationSchema } from '../domain/validations/postValidationSchema';
import { useRef } from 'react';
import QuillEditor from './components/QuillEditor';

interface ExistingImage {
  id?: string;
  path_img: string;
}

interface FormValues {
  title: string;
  description: string;
  id: string;
  isEditing: boolean;
  isDeleting: boolean;
  imagesExisting: ExistingImage[];
  imagesNew: File[];
}

export default function PostForm() {

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  return (
    <Formik<FormValues>
      initialValues={{
        title: '',
        description: '',
        id: '',
        isEditing: false,
        isDeleting: false,
        imagesExisting: [],
        imagesNew: [],
      }}
      validationSchema={postValidationSchema}
      onSubmit={async (values, { resetForm }) => {
        let success = false;

        if (values.isDeleting) {
          success = await deletePost(parseInt(values.id));
          alert(success ? 'Post eliminado ✅' : 'Error al eliminar ❌');
        } else if (values.isEditing) {
          const formData = new FormData();
          formData.append('id', values.id);
          formData.append('title', values.title);
          formData.append('description', values.description);
          formData.append('date', new Date().toISOString().slice(0, 19).replace('T', ' '));

          values.imagesNew.forEach((file) => {
            formData.append('images[]', file);
          });

          values.imagesExisting.forEach((img) => {
            formData.append('paths_id[]', JSON.stringify(img.id));
          });

          success = await editPost(formData);
          alert(success ? 'Post actualizado ✅' : 'Error al actualizar ❌');
        } else {
          success = await createPost({
            ...values,
            images: values.imagesNew,
          });
          alert(success ? 'Post creado ✅' : 'Error al crear ❌');
        }

        if (success) {
          resetForm();
          if (fileInputRef.current) {
            fileInputRef.current.value = '';
          }  
          
        }
      }}
    >
      {({ setFieldValue, values }) => {
        
        const handleBuscar = async () => {
          if (!values.id) return alert('Por favor ingresa un ID');
          try {
            const result = await getPostById(values.id);
            const post = result?.[0];

            if (post) {
              setFieldValue('title', post.title || '');
              setFieldValue('description', post.description || '');
              setFieldValue('imagesExisting', post.images || []);
              setFieldValue('imagesNew', []);
            } else {
              alert('Post no encontrado');
            }
          } catch (error) {
            console.error(error);
            alert('Error al obtener el post');
          }
        };

        return (
          <Form className="max-w-xl md:min-w-[700px] mx-auto bg-white p-6 rounded shadow space-y-4 text-black">
            <h2 className="text-2xl font-bold ">
              {values.isDeleting
                ? 'Eliminar post'
                : values.isEditing
                ? 'Editar post'
                : 'Crear nuevo post'}
            </h2>

            <div className="flex gap-6 items-center">
              <label className="flex items-center gap-2">
                <Field
                  type="checkbox"
                  name="isEditing"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const checked = e.target.checked;
                    setFieldValue('isEditing', checked);
                    if (checked) setFieldValue('isDeleting', false);
                  }}
                />
                Editar
              </label>

              <label className="flex items-center gap-2">
                <Field
                  type="checkbox"
                  name="isDeleting"
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                    const checked = e.target.checked;
                    setFieldValue('isDeleting', checked);
                    if (checked) {
                      setFieldValue('isEditing', false);
                      setFieldValue('title', '');
                      setFieldValue('description', '');
                      setFieldValue('imagesExisting', []);
                      setFieldValue('imagesNew', []);
                    }
                  }}
                />
                Eliminar
              </label>
            </div>

            {(values.isEditing || values.isDeleting) && (
              <div className="flex gap-2 items-end">
                <div className="w-[90%]">
                  <Field
                    name="id"
                    placeholder="ID del post"
                    className="w-full border p-2 rounded"
                  />
                  <ErrorMessage name="id" component="div" className="text-red-500 text-sm" />
                </div>
                <button
                  type="button"
                  onClick={handleBuscar}
                  className={`w-[10%] mt-2 bg-gray-200 hover:bg-gray-300 text-gray-800 p-2 rounded ${!values.isEditing ? 'hidden' : ''}`}
                >
                  🔍
                </button>
              </div>
            )}

            {!values.isDeleting && (
              <>
                <div>
                  <Field
                    name="title"
                    placeholder="Título"
                    className="w-full border p-2 rounded"
                  />
                  <ErrorMessage name="title" component="div" className="text-red-500 text-sm" />
                </div>

                <div className={`${values.isDeleting ? 'hidden' : ''}`}>
                  <QuillEditor
                    value={values.description}
                    onChange={(html) => setFieldValue('description', html)}
                  />
                </div>

                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.currentTarget.files || []);
                      setFieldValue('imagesNew', [...values.imagesNew, ...files]);
                    }}
                  />
                  <ErrorMessage name="imagesNew" component="div" className="text-red-500 text-sm" />
                </div>

                <PreviewImages
                  existingImages={values.imagesExisting}
                  newImages={values.imagesNew}
                  setExistingImages={(imgs) => setFieldValue('imagesExisting', imgs)}
                  setNewImages={(files) => setFieldValue('imagesNew', files)}
                />
              </>
            )}

            <button
              type="submit"
              className={`w-full text-white p-2 rounded ${
                values.isDeleting
                  ? 'bg-red-600 hover:bg-red-700'
                  : 'bg-blue-600 hover:bg-blue-700'
              } 
              ${values.isEditing && (!values.title || !values.id) ? 'opacity-50 cursor-not-allowed pointer-events-none' : 'opacity-100'}`}
            >
              {values.isDeleting
                ? 'Eliminar'
                : values.isEditing
                ? 'Actualizar'
                : 'Enviar'}
            </button>
          </Form>
        );
      }}
    </Formik>
  );
}
