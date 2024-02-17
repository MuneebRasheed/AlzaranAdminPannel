/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import { Provider } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import store from '@/store';
import Layout from '@/components/Layout/Layout';
import '../styles/index.css';

import 'bootstrap/dist/css/bootstrap.min.css';

export default function App({ Component, pageProps }) {

  const { layoutProps = {} } = Component;
  return (
    <>
      <Provider store={store}>
        <Layout {...layoutProps}>
          <Component {...pageProps} />
        </Layout>
      </Provider>
      <Toaster />
    </>

  );
}
