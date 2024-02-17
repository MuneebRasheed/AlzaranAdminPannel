/* eslint-disable jsx-a11y/label-has-associated-control */
import React from 'react';
import {
  Formik, Form, Field, ErrorMessage,
} from 'formik';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { useRouter } from 'next/router';
// eslint-disable-next-line import/no-unresolved, import/extensions
import { login } from '@/store/user-actions';

function LoginComponent() {
  const validate = (values) => {
    const errors = {};
    if (!values.username) {
      errors.username = 'Required';
    }
    if (!values.password) {
      errors.password = 'Required';
    }
    return errors;
  };

  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (values, { resetForm }) => {
    // You can handle form submission here
    console.log("values",values)
    try {
      await dispatch(login(values));
      resetForm();
      router.push('/ColorType');
    } catch (error) {
      toast.error('Invalid Credentials');
    }
  };

  return (
    <div className="container-fluid main-container">
      <div className="row">
        <div className="col-xl-10 col-lg-10 col-md-9">
          <h1 className="fw-lighter p-3">Log in</h1>
          <div className="container">
            <div className="row justify-content-center mt-5">
              <div className="col-lg-4 col-md-6 col-sm-6">
                <div className="card shadow">
                  <div className="card-title ps-3 border-bottom">
                    <h3 className="pt-3 fw-light">Use a local account to login</h3>
                  </div>
                  <div className="card-body">
                    <Formik
                      initialValues={{ username: 'admin@gmail.com', password: '123456789', remember: false }}
                      validate={validate}
                      onSubmit={handleSubmit}
                    >
                      {({ isSubmitting }) => (
                        <Form>
                          <div className="mb-4">
                            <label htmlFor="username" className="form-label">
                              Email
                            </label>
                            <Field type="text" name="username" className="form-control" />
                            <ErrorMessage name="username" component="div" className="text-danger" />
                          </div>
                          <div className="mb-4">
                            <label htmlFor="password" className="form-label">
                              Password
                            </label>
                            <Field type="password" name="password" className="form-control" />
                            <ErrorMessage name="password" component="div" className="text-danger" />
                          </div>
                          <div className="mb-4">
                            <Field type="checkbox" name="remember" className="form-check-input me-2" id="remember" />
                            <label htmlFor="remember" className="form-label">
                              Remember Me
                            </label>
                          </div>
                          <div className="d-grid">
                            <button type="submit" className="btn btn-dark" disabled={isSubmitting}>
                              {isSubmitting ? 'Logging in...' : 'Login'}
                            </button>
                          </div>
                        </Form>
                      )}
                    </Formik>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-2 col-lg-2 col-md-3 main-slide" />
      </div>
    </div>
  );
}

export default LoginComponent;
