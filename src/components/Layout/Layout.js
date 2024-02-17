/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
import React, { Fragment, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useRouter } from 'next/router';
import MainHeader from './MainHeader';
import { getColorTypes } from '../../store/color-type-actions';
import { getManufacturers } from '@/store/manufacture-actions';
import { get } from '@/store/tonner-actions';
import { getColors } from '@/store/colors-actions';
import Sidebar from './SideBar';

function Layout(props) {
  const isInitialize = useSelector((state) => state.colorType.isInitialize);
  const manufacture = useSelector((state) => state.manufacture);
  const tonner = useSelector((state) => state.tonner);
  const colors = useSelector((state) => state.colors);

  const dispatch = useDispatch();
  const {
    user,
  } =
    useSelector((state) => state.user);
  const router = useRouter();

  useEffect(() => {
    if (!isInitialize && user) {
      dispatch(getColorTypes());
    }
    if (!manufacture.isInitialize && user) {
      dispatch(getManufacturers());
    }
    if (!tonner.isInitialize && user) {
      dispatch(get());
    }
    if (!colors.isInitialize && user) {
      dispatch(getColors());
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      if (!user && router.pathname !== '/SignIn') {
        router.push('/SignIn'); // Redirect to the SignIn page
      }
    }

  }, [user, router]);

  return (
    <>
      {user && (<MainHeader />)}
      <div className="root-layouts d-flex">
        {user && (<Sidebar />)}
        <div className="px-4" style={{ flex: '1' }}>
          <main>
            <div>
              {user ? props.children
                : router.pathname === '/SignIn' ? props.children : null}
            </div>
          </main>
        </div>
      </div>
    </>
  );
}

export default Layout;
