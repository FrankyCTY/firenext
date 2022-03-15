import { serverTimestamp, updateDoc } from 'firebase/firestore';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import styles from 'styles/Admin.module.css';
import ImageUploader from 'components/ImageUpload';

const PostForm = ({
  defaultValues,
  postRef,
  preview,
  exitEditMode = () => {},
}) => {
  const { register, handleSubmit, reset, watch, formState } = useForm({
    defaultValues,
    mode: 'onChange',
  });
  const { isValid, isDirty } = formState;

  const updatePost = async ({ content, published }) => {
    await updateDoc(postRef, {
      content,
      published,
      updatedAt: serverTimestamp(),
    });

    reset({ content, published });

    toast.success('Post updated successfully!');
    exitEditMode();
  };

  return (
    <form onSubmit={handleSubmit(updatePost)}>
      {preview && (
        <div className="card">
          <ReactMarkdown>{watch('content')}</ReactMarkdown>
        </div>
      )}

      <div className={preview ? styles.hidden : styles.controls}>
        <ImageUploader />

        <textarea
          {...register('content', {
            required: {
              value: true,
              message: 'Please fill in some content 😁',
            },
            maxLength: { value: 20000, message: 'Your content is too long!' },
            minLength: {
              value: 10,
              message: 'Your content should have at least 10 characters!',
            },
          })}
          name="content"
        ></textarea>

        {formState.errors.content && (
          <p className="text-danger">{formState.errors.content.message}</p>
        )}

        <fieldset>
          <input className={styles.checkbox} name="published" type="checkbox" />
          <label>Published</label>
        </fieldset>

        <button
          type="submit"
          disabled={!isDirty || !isValid}
          className="btn-green"
        >
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default PostForm;
