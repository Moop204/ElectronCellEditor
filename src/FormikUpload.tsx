import { Formik } from 'formik';
import React from 'react';

const FormikUpload = () => {
  return (
    <Formik
      initialValues={{ file: null }}
      onSubmit={(values) => {
        alert(
          JSON.stringify(
            {
              fileName: values.file.name,
              type: values.file.type,
              size: `${values.file.size} bytes`,
            },
            null,
            2
          )
        );
      }}
      validationSchema={yup.object().shape({
        file: yup.mixed().required(),
      })}
      render={({ values, handleSubmit, setFieldValue }) => {
        return (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label for="file">File upload</label>
              <input
                id="file"
                name="file"
                type="file"
                onChange={(event) => {
                  setFieldValue('file', event.currentTarget.files[0]);
                }}
                className="form-control"
              />
              <Thumb file={values.file} />
            </div>
            <button type="submit" className="btn btn-primary">
              submit
            </button>
          </form>
        );
      }}
    />
  );
};
